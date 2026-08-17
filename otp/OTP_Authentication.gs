// =====================================================
// DEVANG PUSTIKA
// OTP / AUTHENTICATION MODULE
// =====================================================
//
// Version: V1
// Primary Channel: SMS
// Future Channels: WhatsApp, Email
//
// IMPORTANT:
// This file contains authentication logic only.
// Do not mix chatbot UI/business logic here.
// =====================================================


// =====================================================
// AUTHENTICATION CONFIGURATION
// =====================================================

const AUTH_CONFIG = {

  // OTP
  OTP_LENGTH: 6,
  OTP_EXPIRY_SECONDS: 300,        // 5 minutes
  MAX_OTP_ATTEMPTS: 5,
  RESEND_COOLDOWN_SECONDS: 60,

  // Session
  SESSION_EXPIRY_SECONDS: 3600,  // 1 hour

  // Cache prefixes
  OTP_CACHE_PREFIX: "DP_OTP_",
  SESSION_CACHE_PREFIX: "DP_SESSION_",

  // Authentication log sheet
  AUTH_LOG_SHEET: "AUTH_LOGS",

  // Active OTP channel for V1
  OTP_PROVIDER: "SMS",

  SMS_PROVIDER: "2FACTOR",

  TWO_FACTOR_API_URL:
    "https://2factor.in/API/V1",

  TWO_FACTOR_TIMEOUT_MS:
    10000

};


// =====================================================
// AUTHENTICATION CHANNELS
// =====================================================

const AUTH_CHANNELS = {

  SMS: "SMS",

  // Future
  WHATSAPP: "WHATSAPP",

  // Future
  EMAIL: "EMAIL"

};


// =====================================================
// AUTHENTICATION EVENTS
// =====================================================

const AUTH_EVENTS = {

  OTP_REQUEST: "OTP_REQUEST",

  OTP_VERIFIED: "OTP_VERIFIED",

  OTP_FAILED: "OTP_FAILED",

  SESSION_CREATED: "SESSION_CREATED",

  SESSION_EXPIRED: "SESSION_EXPIRED",

  LOGOUT: "LOGOUT",

  ACCESS_DENIED: "ACCESS_DENIED",
  
  OTP_EXPIRED: "OTP_EXPIRED",

};


// =====================================================
// MOBILE NUMBER NORMALIZATION
// =====================================================

function normalizeAuthMobile(mobile) {

  let value =
    String(mobile || "")
      .replace(/\D/g, "");

  // Convert +91XXXXXXXXXX / 91XXXXXXXXXX
  // to 10-digit Indian mobile number
  if (
    value.length === 12 &&
    value.startsWith("91")
  ) {
    value = value.substring(2);
  }

  // Validate Indian 10-digit mobile number
  if (
    !/^[6-9]\d{9}$/.test(value)
  ) {
    return "";
  }

  return value;
}



// =====================================================
// AUTHENTICATION PROFILE IDENTITY
// =====================================================
//
// Purpose:
// Convert the existing registration verification
// response into a standard authentication user object.
//
// IMPORTANT:
// This function does NOT:
// - Send OTP
// - Verify OTP
// - Create session
// - Grant access
//
// It only identifies the registered profile.
// =====================================================

function getAuthUserFromRegisteredMobile(mobile) {

  // ---------------------------------------------------
  // 1. Normalize mobile
  // ---------------------------------------------------

  const cleanMobile =
    normalizeAuthMobile(mobile);

  if (!cleanMobile) {

    return {
      success: false,
      registered: false,
      code: "INVALID_MOBILE",
      message:
        "कृपया योग्य 10 अंकी मोबाईल नंबर टाका."
    };

  }


  // ---------------------------------------------------
  // 2. Use EXISTING registration verification
  // ---------------------------------------------------
  //
  // This remains our single source of truth.
  //

  const result =
    verifyProfileSearchAccess(
      cleanMobile
    );


  // ---------------------------------------------------
  // 3. Registration not found
  // ---------------------------------------------------

  if (
    !result ||
    result.verified !== true
  ) {

    return {

      success: true,

      registered: false,

      code: "MOBILE_NOT_REGISTERED",

      mobile: cleanMobile,

      message:
        "हा मोबाईल नंबर नोंदणीकृत नाही."

    };

  }


  // ---------------------------------------------------
  // 4. Build standard authentication identity
  // ---------------------------------------------------

  const authUser = {

    profileId:
      String(
        result.profileId || ""
      ).trim(),

    profileType:
      String(
        result.profileType || ""
      ).trim(),

    name:
      String(
        result.name || ""
      ).trim(),

    mobile:
      cleanMobile,

    registeredSheet:
      String(
        result.registeredSheet || ""
      ).trim()

  };


  // ---------------------------------------------------
  // 5. Basic identity validation
  // ---------------------------------------------------

  if (
    !authUser.profileId ||
    !authUser.mobile
  ) {

    return {

      success: false,

      registered: false,

      code:
        "INCOMPLETE_PROFILE_IDENTITY",

      message:
        "नोंदणीकृत प्रोफाइलची माहिती अपूर्ण आहे."

    };

  }


  // ---------------------------------------------------
  // 6. Return standardized identity
  // ---------------------------------------------------

  return {

    success: true,

    registered: true,

    code: "REGISTERED_PROFILE_FOUND",

    user: authUser

  };

}


// =====================================================
// AUTHENTICATION STATES
// =====================================================
//
// These states describe the authentication lifecycle.
//
// IMPORTANT:
// Being REGISTERED does NOT mean AUTHENTICATED.
//
// Authentication is granted only after successful
// OTP verification and session creation.
// =====================================================

const AUTH_STATES = {

  // Initial state
  IDLE:
    "AUTH_IDLE",

  // User has submitted a mobile number
  MOBILE_ENTERED:
    "MOBILE_ENTERED",

  // Mobile exists in our registration data
  REGISTERED_PROFILE_FOUND:
    "REGISTERED_PROFILE_FOUND",

  // OTP has been generated/sent
  OTP_PENDING:
    "OTP_PENDING",

  // OTP verification failed
  OTP_FAILED:
    "OTP_FAILED",

  // OTP successfully verified
  OTP_VERIFIED:
    "OTP_VERIFIED",

  // Secure authenticated session is active
  SESSION_ACTIVE:
    "SESSION_ACTIVE",

  // Session has expired
  SESSION_EXPIRED:
    "SESSION_EXPIRED",

  // User explicitly logged out
  LOGGED_OUT:
    "LOGGED_OUT"
};


// =====================================================
// AUTHENTICATION STATE VALIDATION
// =====================================================

function isValidAuthState(state) {

  return Object
    .keys(AUTH_STATES)
    .some(function(key) {

      return AUTH_STATES[key] === state;

    });

}


// =====================================================
// AUTHENTICATION AUDIT LOGGING
// =====================================================
//
// Purpose:
// Store authentication events for audit and security.
//
// IMPORTANT:
// - Never store the actual OTP.
// - Never store OTP in plain text.
// - This function is reusable by OTP/session modules.
// =====================================================

function writeAuthLog(logData) {

  try {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    const sheet =
      ss.getSheetByName(
        AUTH_CONFIG.AUTH_LOG_SHEET
      );

    if (!sheet) {

      throw new Error(
        "AUTH_LOGS sheet not found."
      );

    }


    // =================================================
    // TIMESTAMP
    // =================================================

    const timestamp =
      new Date();


    // =================================================
    // SAFE VALUES
    // =================================================

    const event =
      String(
        logData.event || ""
      ).trim();

    const status =
      String(
        logData.status || ""
      ).trim();

    const mobile =
      normalizeAuthMobile(
        logData.mobile || ""
      );

    const profileId =
      String(
        logData.profileId || ""
      ).trim();

    const profileType =
      String(
        logData.profileType || ""
      ).trim();

    const userName =
      String(
        logData.userName || ""
      ).trim();

    const requestId =
      String(
        logData.requestId || ""
      ).trim();

    const sessionId =
      String(
        logData.sessionId || ""
      ).trim();

    const reason =
      String(
        logData.reason || ""
      ).trim();

    const channel =
      String(
        logData.channel ||
        AUTH_CONFIG.OTP_PROVIDER ||
        ""
      ).trim();


    // =================================================
    // WRITE LOG
    // =================================================

    sheet.appendRow([

      timestamp,

      event,

      status,

      mobile,

      profileId,

      profileType,

      userName,

      requestId,

      sessionId,

      reason,

      channel

    ]);


    return {

      success: true

    };

  }

  catch (error) {

    console.error(
      "AUTH LOG ERROR:",
      error
    );

    return {

      success: false,

      message:
        "Authentication log लिहिता आला नाही."

    };

  }

}


// =====================================================
// SEC-02.1
// OTP REQUEST FOUNDATION
// =====================================================
//
// Purpose:
// Create an authenticated OTP request only for a
// registered profile.
//
// IMPORTANT:
// - No OTP is generated yet.
// - No SMS is sent yet.
// - No session is created.
// - Registration remains the source of truth.
// =====================================================

function createAuthOTPRequest(mobile) {

  // ---------------------------------------------------
  // 1. Identify registered profile
  // ---------------------------------------------------

  const identity =
    getAuthUserFromRegisteredMobile(
      mobile
    );


  // ---------------------------------------------------
  // 2. Reject unregistered mobile
  // ---------------------------------------------------

  if (
    !identity ||
    identity.registered !== true
  ) {

    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_REQUEST,

      status:
        "FAILED",

      mobile:
        mobile,

      reason:
        "MOBILE_NOT_REGISTERED",

      channel:
        AUTH_CHANNELS.SMS

    });

    return {

      success: false,

      registered: false,

      state:
        AUTH_STATES.IDLE,

      code:
        "MOBILE_NOT_REGISTERED",

      message:
        "हा मोबाईल नंबर नोंदणीकृत नाही."

    };

  }


  // ---------------------------------------------------
  // 3. Create unique request ID
  // ---------------------------------------------------

  const requestId =
    Utilities.getUuid();


  // ---------------------------------------------------
  // 4. Build OTP request
  // ---------------------------------------------------

  const request = {

    requestId:
      requestId,

    state:
      AUTH_STATES.OTP_PENDING,

    channel:
      AUTH_CHANNELS.SMS,

    createdAt:
      new Date().toISOString(),

    user: {

      profileId:
        identity.user.profileId,

      profileType:
        identity.user.profileType,

      name:
        identity.user.name,

      mobile:
        identity.user.mobile,

      registeredSheet:
        identity.user.registeredSheet

    }

  };


  // ---------------------------------------------------
  // 5. Store temporary request
  // ---------------------------------------------------
  //
  // OTP is NOT stored here.
  // This is only the request metadata.
  //

  const cache =
    CacheService
      .getScriptCache();

  cache.put(

    AUTH_CONFIG.OTP_CACHE_PREFIX +
      requestId,

    JSON.stringify(request),

    AUTH_CONFIG.OTP_EXPIRY_SECONDS

  );


  // ---------------------------------------------------
  // Start resend cooldown for this mobile
  // ---------------------------------------------------

  const cooldownKey =
    AUTH_CONFIG.OTP_CACHE_PREFIX +
    "COOLDOWN_" +
    identity.user.mobile;

  cache.put(

    cooldownKey,

    String(Date.now()),

    AUTH_CONFIG.RESEND_COOLDOWN_SECONDS

  );


  // ---------------------------------------------------
  // 6. Write audit log
  // ---------------------------------------------------

  writeAuthLog({

    event:
      AUTH_EVENTS.OTP_REQUEST,

    status:
      "SUCCESS",

    mobile:
      identity.user.mobile,

    profileId:
      identity.user.profileId,

    profileType:
      identity.user.profileType,

    userName:
      identity.user.name,

    requestId:
      requestId,

    reason:
      "OTP_REQUEST_CREATED",

    channel:
      AUTH_CHANNELS.SMS

  });


  // ---------------------------------------------------
  // 7. Return request information
  // ---------------------------------------------------

  return {

    success: true,

    registered: true,

    state:
      AUTH_STATES.OTP_PENDING,

    requestId:
      requestId,

    user: {

      profileId:
        identity.user.profileId,

      profileType:
        identity.user.profileType,

      name:
        identity.user.name,

      mobile:
        identity.user.mobile

    }

  };

}


// =====================================================
// SEC-02.2R
// SECURE OTP GENERATION — SINGLE USE REQUEST
// =====================================================
//
// Rules:
// 1. One requestId can generate only ONE OTP.
// 2. Same requestId cannot generate another OTP.
// 3. Mobile number is NOT blocked.
// 4. New OTP requires a NEW requestId.
// 5. OTP is never written to AUTH_LOGS.
// =====================================================

function generateAuthOTP(requestId) {

  // ---------------------------------------------------
  // 1. Validate request ID
  // ---------------------------------------------------

  if (!requestId) {

    return {
      success: false,
      code: "INVALID_REQUEST_ID"
    };

  }


  const cache =
    CacheService.getScriptCache();

  const cacheKey =
    AUTH_CONFIG.OTP_CACHE_PREFIX +
    requestId;


  // ---------------------------------------------------
  // 2. Get OTP request
  // ---------------------------------------------------

  const cachedRequest =
    cache.get(cacheKey);


  if (!cachedRequest) {

    return {

      success: false,

      code:
        "OTP_REQUEST_EXPIRED",

      message:
        "OTP request उपलब्ध नाही किंवा expire झाली आहे."

    };

  }


  let request;

  try {

    request =
      JSON.parse(
        cachedRequest
      );

  }

  catch (error) {

    cache.remove(cacheKey);

    return {

      success: false,

      code:
        "INVALID_OTP_REQUEST"

    };

  }


  // ---------------------------------------------------
  // 3. Check request state
  // ---------------------------------------------------

  if (
    request.state !==
    AUTH_STATES.OTP_PENDING
  ) {

    return {

      success: false,

      code:
        "INVALID_AUTH_STATE"

    };

  }


  // ---------------------------------------------------
  // 4. SINGLE-USE PROTECTION
  // ---------------------------------------------------
  //
  // If OTP already exists for this request,
  // this requestId has already been used.
  //

  if (
    request.otpGenerated === true
  ) {

    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_REQUEST,

      status:
        "FAILED",

      mobile:
        request.user &&
        request.user.mobile
          ? request.user.mobile
          : "",

      profileId:
        request.user &&
        request.user.profileId
          ? request.user.profileId
          : "",

      profileType:
        request.user &&
        request.user.profileType
          ? request.user.profileType
          : "",

      userName:
        request.user &&
        request.user.name
          ? request.user.name
          : "",

      requestId:
        requestId,

      reason:
        "REQUEST_ID_ALREADY_USED",

      channel:
        request.channel ||
        AUTH_CHANNELS.SMS

    });


    return {

      success: false,

      code:
        "REQUEST_ID_ALREADY_USED",

      message:
        "या Request ID साठी OTP आधीच तयार झाला आहे. नवीन OTP साठी नवीन request तयार करा."

    };

  }


  // ---------------------------------------------------
  // 5. Generate 6-digit OTP
  // ---------------------------------------------------

  const min = 100000;
  const max = 999999;

  const otp =
    String(
      Math.floor(
        Math.random() *
        (
          max -
          min +
          1
        )
      ) + min
    );


  // ---------------------------------------------------
  // 6. Mark request as OTP generated
  // ---------------------------------------------------

  request.otp =
    otp;

  request.otpGenerated =
    true;

  request.otpCreatedAt =
    new Date().toISOString();

  request.otpExpiresAt =
    new Date(
      Date.now() +
      (
        AUTH_CONFIG.OTP_EXPIRY_SECONDS *
        1000
      )
    ).toISOString();

  request.otpAttempts =
    0;

  request.otpVerified =
    false;


  // ---------------------------------------------------
  // 7. Update temporary request
  // ---------------------------------------------------

  cache.put(

    cacheKey,

    JSON.stringify(request),

    AUTH_CONFIG.OTP_EXPIRY_SECONDS

  );


  // ---------------------------------------------------
  // 8. Return development result
  // ---------------------------------------------------
  //
  // TEMPORARY:
  // OTP is returned only for testing.
  //
  // Production SMS integration will NOT expose
  // the OTP to the frontend.
  //

  return {

    success: true,

    requestId:
      requestId,

    otp:
      otp,

    expiresIn:
      AUTH_CONFIG.OTP_EXPIRY_SECONDS

  };

}


// =====================================================
// SEC-02.3
// OTP EXPIRY VALIDATION
// =====================================================
//
// Purpose:
// Validate whether an OTP request is still active.
//
// Rules:
// - Valid OTP request → allowed to continue
// - Expired OTP → rejected
// - Expired request → removed
// - Same mobile can create a NEW request
// - Existing Request ID cannot be reused
//
// IMPORTANT:
// This function does NOT verify the OTP value.
// =====================================================

function validateAuthOTPRequest(requestId) {

  // ---------------------------------------------------
  // 1. Validate Request ID
  // ---------------------------------------------------

  if (!requestId) {

    return {

      success: false,

      valid: false,

      code:
        "INVALID_REQUEST_ID"

    };

  }


  // ---------------------------------------------------
  // 2. Get request
  // ---------------------------------------------------

  const cache =
    CacheService
      .getScriptCache();

  const cacheKey =
    AUTH_CONFIG.OTP_CACHE_PREFIX +
    requestId;

  const cachedRequest =
    cache.get(
      cacheKey
    );


  // ---------------------------------------------------
  // 3. Request not available
  // ---------------------------------------------------

  if (!cachedRequest) {

    return {

      success: false,

      valid: false,

      code:
        "OTP_REQUEST_EXPIRED",

      message:
        "OTP request उपलब्ध नाही किंवा expire झाली आहे."

    };

  }


  // ---------------------------------------------------
  // 4. Parse request
  // ---------------------------------------------------

  let request;

  try {

    request =
      JSON.parse(
        cachedRequest
      );

  }

  catch (error) {

    cache.remove(
      cacheKey
    );

    return {

      success: false,

      valid: false,

      code:
        "INVALID_OTP_REQUEST"

    };

  }


  // ---------------------------------------------------
  // 5. Make sure OTP was generated
  // ---------------------------------------------------

  if (
    request.otpGenerated !== true ||
    !request.otp
  ) {

    return {

      success: false,

      valid: false,

      code:
        "OTP_NOT_GENERATED"

    };

  }


  // ---------------------------------------------------
  // 6. Validate expiry timestamp
  // ---------------------------------------------------

  const expiresAt =
    new Date(
      request.otpExpiresAt
    ).getTime();


  if (
    !expiresAt ||
    Date.now() >= expiresAt
  ) {

    // -----------------------------------------------
    // Mark request as expired
    // -----------------------------------------------

    request.state =
        AUTH_STATES.OTP_FAILED;

    request.otpExpired =
      true;


    // -----------------------------------------------
    // Remove expired request
    // -----------------------------------------------

    cache.remove(
      cacheKey
    );


    // -----------------------------------------------
    // Write audit log
    // -----------------------------------------------

    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_EXPIRED,

      status:
        "FAILED",

      mobile:
        request.user &&
        request.user.mobile
          ? request.user.mobile
          : "",

      profileId:
        request.user &&
        request.user.profileId
          ? request.user.profileId
          : "",

      profileType:
        request.user &&
        request.user.profileType
          ? request.user.profileType
          : "",

      userName:
        request.user &&
        request.user.name
          ? request.user.name
          : "",

      requestId:
        requestId,

      reason:
        "OTP_EXPIRY_TIME_REACHED",

      channel:
        request.channel ||
        AUTH_CHANNELS.SMS

    });


    return {

      success: false,

      valid: false,

      code:
        "OTP_EXPIRED",

      message:
        "OTP ची वैधता संपली आहे. कृपया नवीन OTP घ्या."

    };

  }


  // ---------------------------------------------------
  // 7. OTP is still valid
  // ---------------------------------------------------

  return {

    success: true,

    valid: true,

    code:
      "OTP_VALID",

    requestId:
      requestId,

    expiresAt:
      request.otpExpiresAt,

    expiresIn:
      Math.max(

        0,

        Math.ceil(

          (
            expiresAt -
            Date.now()
          ) / 1000

        )

      )

  };

}


// =====================================================
// SEC-02.4
// OTP ATTEMPT LIMIT
// =====================================================
//
// Rules:
// - Maximum 5 failed OTP attempts per Request ID.
// - Attempt limit applies only to the current request.
// - Mobile number is NOT blocked.
// - New Request ID can be created for the same mobile.
// - OTP itself is never written to AUTH_LOGS.
// =====================================================

function registerAuthOTPFailedAttempt(requestId) {

  // ---------------------------------------------------
  // 1. Validate Request ID
  // ---------------------------------------------------

  if (!requestId) {

    return {

      success: false,

      blocked: false,

      code:
        "INVALID_REQUEST_ID"

    };

  }


  // ---------------------------------------------------
  // 2. Get OTP request
  // ---------------------------------------------------

  const cache =
    CacheService.getScriptCache();

  const cacheKey =
    AUTH_CONFIG.OTP_CACHE_PREFIX +
    requestId;

  const cachedRequest =
    cache.get(cacheKey);


  if (!cachedRequest) {

    return {

      success: false,

      blocked: false,

      code:
        "OTP_REQUEST_EXPIRED"

    };

  }


  // ---------------------------------------------------
  // 3. Parse request
  // ---------------------------------------------------

  let request;

  try {

    request =
      JSON.parse(
        cachedRequest
      );

  }

  catch (error) {

    cache.remove(
      cacheKey
    );

    return {

      success: false,

      blocked: false,

      code:
        "INVALID_OTP_REQUEST"

    };

  }


  // ---------------------------------------------------
  // 4. Check OTP generation
  // ---------------------------------------------------

  if (
    request.otpGenerated !== true
  ) {

    return {

      success: false,

      blocked: false,

      code:
        "OTP_NOT_GENERATED"

    };

  }


  // ---------------------------------------------------
  // 5. Check current attempt limit
  // ---------------------------------------------------

  const currentAttempts =
    Number(
      request.otpAttempts || 0
    );


  if (
    currentAttempts >=
    AUTH_CONFIG.MAX_OTP_ATTEMPTS
  ) {

    request.state =
      AUTH_STATES.OTP_FAILED;

    request.otpBlocked =
      true;

    request.otpBlockedAt =
      new Date().toISOString();


    cache.remove(
      cacheKey
    );


    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_FAILED,

      status:
        "FAILED",

      mobile:
        request.user &&
        request.user.mobile
          ? request.user.mobile
          : "",

      profileId:
        request.user &&
        request.user.profileId
          ? request.user.profileId
          : "",

      profileType:
        request.user &&
        request.user.profileType
          ? request.user.profileType
          : "",

      userName:
        request.user &&
        request.user.name
          ? request.user.name
          : "",

      requestId:
        requestId,

      reason:
        "MAX_OTP_ATTEMPTS_REACHED",

      channel:
        request.channel ||
        AUTH_CHANNELS.SMS

    });


    return {

      success: false,

      blocked: true,

      code:
        "MAX_OTP_ATTEMPTS_REACHED",

      attempts:
        currentAttempts,

      message:
        "OTP attempts ची कमाल मर्यादा पूर्ण झाली आहे. कृपया नवीन OTP घ्या."

    };

  }


  // ---------------------------------------------------
  // 6. Increment failed attempt
  // ---------------------------------------------------

  request.otpAttempts =
    currentAttempts + 1;


  // ---------------------------------------------------
  // 7. Check whether this attempt reached the limit
  // ---------------------------------------------------

  const attemptsRemaining =
    Math.max(

      0,

      AUTH_CONFIG.MAX_OTP_ATTEMPTS -
      request.otpAttempts

    );


  if (
    request.otpAttempts >=
    AUTH_CONFIG.MAX_OTP_ATTEMPTS
  ) {

    request.state =
      AUTH_STATES.OTP_FAILED;

    request.otpBlocked =
      true;

    request.otpBlockedAt =
      new Date().toISOString();


    // -----------------------------------------------
    // Request is permanently closed
    // -----------------------------------------------

    cache.remove(
      cacheKey
    );


    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_FAILED,

      status:
        "FAILED",

      mobile:
        request.user &&
        request.user.mobile
          ? request.user.mobile
          : "",

      profileId:
        request.user &&
        request.user.profileId
          ? request.user.profileId
          : "",

      profileType:
        request.user &&
        request.user.profileType
          ? request.user.profileType
          : "",

      userName:
        request.user &&
        request.user.name
          ? request.user.name
          : "",

      requestId:
        requestId,

      reason:
        "MAX_OTP_ATTEMPTS_REACHED",

      channel:
        request.channel ||
        AUTH_CHANNELS.SMS

    });


    return {

      success: false,

      blocked: true,

      code:
        "MAX_OTP_ATTEMPTS_REACHED",

      attempts:
        request.otpAttempts,

      attemptsRemaining:
        0,

      message:
        "OTP attempts ची कमाल मर्यादा पूर्ण झाली आहे. कृपया नवीन OTP घ्या."

    };

  }


  // ---------------------------------------------------
  // 8. Save updated attempt count
  // ---------------------------------------------------

  cache.put(

    cacheKey,

    JSON.stringify(
      request
    ),

    AUTH_CONFIG.OTP_EXPIRY_SECONDS

  );


  // ---------------------------------------------------
  // 9. Log failed attempt
  // ---------------------------------------------------

  writeAuthLog({

    event:
      AUTH_EVENTS.OTP_FAILED,

    status:
      "FAILED",

    mobile:
      request.user &&
      request.user.mobile
        ? request.user.mobile
        : "",

    profileId:
      request.user &&
      request.user.profileId
        ? request.user.profileId
        : "",

    profileType:
      request.user &&
      request.user.profileType
        ? request.user.profileType
        : "",

    userName:
      request.user &&
      request.user.name
        ? request.user.name
        : "",

    requestId:
      requestId,

    reason:
      "INVALID_OTP_ATTEMPT_" +
      request.otpAttempts,

    channel:
      request.channel ||
      AUTH_CHANNELS.SMS

  });


  // ---------------------------------------------------
  // 10. Return attempt information
  // ---------------------------------------------------

  return {

    success: true,

    blocked: false,

    code:
      "OTP_ATTEMPT_RECORDED",

    attempts:
      request.otpAttempts,

    attemptsRemaining:
      attemptsRemaining,

    message:
      "OTP चुकीचा आहे."

  };

}





// =====================================================
// SEC-02.6.2R-2
// SECURE OTP RESEND + SMS DELIVERY
// =====================================================
//
// Rules:
// - Mobile must be registered.
// - Resend cooldown must pass.
// - NEW Request ID is created.
// - NEW OTP is generated.
// - OTP is sent through 2Factor.
// - OTP is NEVER returned to frontend.
// - Old Request ID remains unusable.
// =====================================================

function requestAuthOTPResend(mobile) {

  try {

    // ---------------------------------------------------
    // 1. Normalize mobile
    // ---------------------------------------------------

    const cleanMobile =
      normalizeAuthMobile(mobile);


    if (!cleanMobile) {

      return {

        success: false,

        code:
          "INVALID_MOBILE"

      };

    }


    // ---------------------------------------------------
    // 2. Check registered profile
    // ---------------------------------------------------

    const identity =
      getAuthUserFromRegisteredMobile(
        cleanMobile
      );


    if (
      !identity ||
      identity.registered !== true
    ) {

      writeAuthLog({

        event:
          AUTH_EVENTS.OTP_REQUEST,

        status:
          "FAILED",

        mobile:
          cleanMobile,

        reason:
          "MOBILE_NOT_REGISTERED",

        channel:
          AUTH_CHANNELS.SMS

      });


      return {

        success: false,

        registered: false,

        code:
          "MOBILE_NOT_REGISTERED"

      };

    }


    // ---------------------------------------------------
    // 3. Check resend cooldown
    // ---------------------------------------------------

    const cache =
      CacheService.getScriptCache();


    const cooldownKey =
      AUTH_CONFIG.OTP_CACHE_PREFIX +
      "COOLDOWN_" +
      cleanMobile;


    const cooldownData =
      cache.get(
        cooldownKey
      );


    if (cooldownData) {

      const cooldownTime =
        Number(
          cooldownData
        );


      const elapsed =
        Date.now() -
        cooldownTime;


      const remaining =
        Math.ceil(

          (
            (
              AUTH_CONFIG
                .RESEND_COOLDOWN_SECONDS *
              1000
            ) -
            elapsed

          ) / 1000

        );


      if (remaining > 0) {

        writeAuthLog({

          event:
            AUTH_EVENTS.OTP_REQUEST,

          status:
            "FAILED",

          mobile:
            cleanMobile,

          profileId:
            identity.user.profileId,

          profileType:
            identity.user.profileType,

          userName:
            identity.user.name,

          reason:
            "RESEND_COOLDOWN",

          channel:
            AUTH_CHANNELS.SMS

        });


        return {

          success: false,

          code:
            "RESEND_COOLDOWN",

          retryAfter:
            remaining,

          message:
            "कृपया " +
            remaining +
            " सेकंदांनी पुन्हा OTP मागवा."

        };

      }

    }


    // ---------------------------------------------------
    // 4. Create NEW OTP request
    // ---------------------------------------------------

    const request =
      createAuthOTPRequest(
        cleanMobile
      );


    if (
      !request ||
      request.success !== true
    ) {

      return request;

    }


    // ---------------------------------------------------
    // 5. Generate NEW OTP
    // ---------------------------------------------------

    const otp =
      generateAuthOTP(
        request.requestId
      );


    if (
      !otp ||
      otp.success !== true
    ) {

      writeAuthLog({

        event:
          AUTH_EVENTS.OTP_FAILED,

        status:
          "FAILED",

        mobile:
          cleanMobile,

        profileId:
          identity.user.profileId,

        profileType:
          identity.user.profileType,

        userName:
          identity.user.name,

        requestId:
          request.requestId,

        reason:
          "OTP_GENERATION_FAILED",

        channel:
          AUTH_CHANNELS.SMS

      });


      return {

        success: false,

        code:
          "OTP_GENERATION_FAILED"

      };

    }


    // ---------------------------------------------------
    // 6. Send NEW OTP through 2Factor
    // ---------------------------------------------------

    const smsResult =
      sendOTPVia2Factor(

        cleanMobile,

        otp.otp

      );


    // ---------------------------------------------------
    // 7. Check SMS delivery request
    // ---------------------------------------------------

    if (
      !smsResult ||
      smsResult.success !== true
    ) {

      writeAuthLog({

        event:
          AUTH_EVENTS.OTP_FAILED,

        status:
          "FAILED",

        mobile:
          cleanMobile,

        profileId:
          identity.user.profileId,

        profileType:
          identity.user.profileType,

        userName:
          identity.user.name,

        requestId:
          request.requestId,

        reason:
          "SMS_PROVIDER_FAILED",

        channel:
          AUTH_CHANNELS.SMS

      });


      return {

        success: false,

        code:
          "SMS_PROVIDER_FAILED",

        requestId:
          request.requestId

      };

    }


    // ---------------------------------------------------
    // 8. SMS request successful
    // ---------------------------------------------------

    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_REQUEST,

      status:
        "SUCCESS",

      mobile:
        cleanMobile,

      profileId:
        identity.user.profileId,

      profileType:
        identity.user.profileType,

      userName:
        identity.user.name,

      requestId:
        request.requestId,

      reason:
        "OTP_RESENT_SMS_SENT",

      channel:
        AUTH_CHANNELS.SMS

    });


    // ---------------------------------------------------
    // 9. Return SAFE response
    // ---------------------------------------------------
    //
    // IMPORTANT:
    // OTP is deliberately NOT returned.
    //

    return {

      success: true,

      code:
        "OTP_RESENT",

      requestId:
        request.requestId,

      expiresIn:
        AUTH_CONFIG.OTP_EXPIRY_SECONDS,

      retryAfter:
        AUTH_CONFIG.RESEND_COOLDOWN_SECONDS

    };

  }

  catch (error) {

    console.error(
      "OTP Resend Error:",
      error
    );


    return {

      success: false,

      code:
        "OTP_RESEND_EXCEPTION"

    };

  }

}




// =====================================================
// SEC-02.6.1
// 2FACTOR API KEY
// =====================================================

function getTwoFactorApiKey() {

  const apiKey =
    PropertiesService
      .getScriptProperties()
      .getProperty(
        "2FACTOR_API_KEY"
      );

  if (!apiKey) {

    throw new Error(
      "2FACTOR_API_KEY is not configured."
    );

  }

  return apiKey.trim();

}


// =====================================================
// SEC-02.6.2
// 2FACTOR V1 SMS OTP ADAPTER

// Purpose:
// Send an already-generated OTP through 2Factor.

// IMPORTANT:
// - API key comes from Script Properties.
// - OTP is never logged.
// - OTP is never returned to the frontend.
// - This function only handles SMS delivery.
// =====================================================

function sendOTPVia2Factor(mobile, otp) {

  try {

    // -------------------------------------------------
    // 1. Normalize mobile
    // -------------------------------------------------

    const cleanMobile =
      normalizeAuthMobile(mobile);

    if (
      !cleanMobile ||
      cleanMobile.length !== 10
    ) {

      return {
        success: false,
        code: "INVALID_MOBILE"
      };

    }


    // -------------------------------------------------
    // 2. Validate OTP
    // -------------------------------------------------

    const cleanOTP =
      String(otp || "").trim();

    if (
      !/^\d{6}$/.test(cleanOTP)
    ) {

      return {
        success: false,
        code: "INVALID_OTP"
      };

    }


    // -------------------------------------------------
    // 3. Get API key
    // -------------------------------------------------

    const apiKey =
      getTwoFactorApiKey();


    // -------------------------------------------------
    // 4. Build V1 endpoint
    // -------------------------------------------------

    const url =
      "https://2factor.in/API/V1/" +
      encodeURIComponent(apiKey) +
      "/SMS/" +
      encodeURIComponent(cleanMobile) +
      "/" +
      encodeURIComponent(cleanOTP);


    // -------------------------------------------------
    // 5. Send POST request
    // -------------------------------------------------

    const response =
      UrlFetchApp.fetch(

        url,

        {
          method: "post",

          muteHttpExceptions: true,

          followRedirects: true,

          timeout:
            AUTH_CONFIG.TWO_FACTOR_TIMEOUT_MS
        }

      );


    // -------------------------------------------------
    // 6. Read response
    // -------------------------------------------------

    const responseCode =
      response.getResponseCode();

    const responseText =
      response.getContentText();


    let responseData;

    try {

      responseData =
        JSON.parse(
          responseText
        );

        // ---------------------------------------------------
        // Validate 2Factor application-level response
        // ---------------------------------------------------

        if (
          !responseData ||
          responseData.Status !== "Success"
        ) {

          console.error(
            "2Factor Provider Failure:",
            responseData
          );


          return {

            success: false,

            code:
              "SMS_PROVIDER_REJECTED",

            provider:
              "2FACTOR"

          };

        }

        return {

          success: true,

          provider:
            "2FACTOR",

          providerResponse:
            responseData

        };

    }

    catch (error) {

      responseData = {
        raw: responseText
      };

    }


    // -------------------------------------------------
    // 7. HTTP error
    // -------------------------------------------------

    if (
      responseCode < 200 ||
      responseCode >= 300
    ) {

      console.error(
        "2Factor HTTP Error:",
        responseCode
      );

      return {

        success: false,

        code:
          "SMS_PROVIDER_ERROR",

        provider:
          "2FACTOR",

        httpCode:
          responseCode

      };

    }


    // -------------------------------------------------
    // 8. Provider response
    // -------------------------------------------------

    return {

      success: true,

      provider:
        "2FACTOR",

      providerResponse:
        responseData

    };

  }

  catch (error) {

    console.error(
      "2Factor SMS Error:",
      error
    );

    return {

      success: false,

      code:
        "SMS_PROVIDER_EXCEPTION",

      provider:
        "2FACTOR"

    };

  }

}



// =====================================================
// SEC-02.6.3.1
// OTP VERIFICATION FOUNDATION
// =====================================================
//
// Rules:
// - Request ID is mandatory.
// - OTP must belong to the same Request ID.
// - Registered mobile is already associated with request.
// - Expired request is rejected.
// - Maximum failed attempts = AUTH_CONFIG.MAX_OTP_ATTEMPTS.
// - Correct OTP → OTP_VERIFIED.
// - Session is NOT created here.
// =====================================================

function verifyAuthOTP(requestId, enteredOTP) {

  try {

    // ---------------------------------------------------
    // 1. Validate Request ID
    // ---------------------------------------------------

    if (!requestId) {

      return {

        success: false,

        verified: false,

        code:
          "INVALID_REQUEST_ID"

      };

    }


    // ---------------------------------------------------
    // 2. Validate entered OTP format
    // ---------------------------------------------------

    const cleanOTP =
      String(
        enteredOTP || ""
      ).trim();


    if (
      !/^\d{6}$/.test(cleanOTP)
    ) {

      return {

        success: false,

        verified: false,

        code:
          "INVALID_OTP_FORMAT",

        message:
          "कृपया 6 अंकी OTP टाका."

      };

    }


    // ---------------------------------------------------
    // 3. Get OTP request
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const cacheKey =
      AUTH_CONFIG.OTP_CACHE_PREFIX +
      requestId;


    const cachedRequest =
      cache.get(
        cacheKey
      );


    if (!cachedRequest) {

      return {

        success: false,

        verified: false,

        code:
          "OTP_REQUEST_EXPIRED",

        message:
          "OTP request उपलब्ध नाही किंवा expire झाली आहे."

      };

    }


    // ---------------------------------------------------
    // 4. Parse request
    // ---------------------------------------------------

    let request;

    try {

      request =
        JSON.parse(
          cachedRequest
        );

    }

    catch (error) {

      cache.remove(
        cacheKey
      );


      return {

        success: false,

        verified: false,

        code:
          "INVALID_OTP_REQUEST"

      };

    }


    // ---------------------------------------------------
    // 5. Validate request state
    // ---------------------------------------------------

    if (
      request.state !==
      AUTH_STATES.OTP_PENDING
    ) {

      return {

        success: false,

        verified: false,

        code:
          "INVALID_AUTH_STATE"

      };

    }


    // ---------------------------------------------------
    // 6. Make sure OTP exists
    // ---------------------------------------------------

    if (
      request.otpGenerated !== true ||
      !request.otp
    ) {

      return {

        success: false,

        verified: false,

        code:
          "OTP_NOT_GENERATED"

      };

    }


    // ---------------------------------------------------
    // 7. Check expiry
    // ---------------------------------------------------

    const expiresAt =
      new Date(
        request.otpExpiresAt
      ).getTime();


    if (
      !expiresAt ||
      Date.now() >= expiresAt
    ) {

      request.state =
        AUTH_STATES.OTP_FAILED;

      request.otpExpired =
        true;


      cache.remove(
        cacheKey
      );


      writeAuthLog({

        event:
          AUTH_EVENTS.OTP_EXPIRED,

        status:
          "FAILED",

        mobile:
          request.user &&
          request.user.mobile
            ? request.user.mobile
            : "",

        profileId:
          request.user &&
          request.user.profileId
            ? request.user.profileId
            : "",

        profileType:
          request.user &&
          request.user.profileType
            ? request.user.profileType
            : "",

        userName:
          request.user &&
          request.user.name
            ? request.user.name
            : "",

        requestId:
          requestId,

        reason:
          "OTP_EXPIRY_TIME_REACHED",

        channel:
          request.channel ||
          AUTH_CHANNELS.SMS

      });


      return {

        success: false,

        verified: false,

        code:
          "OTP_EXPIRED",

        message:
          "OTP ची वैधता संपली आहे. कृपया नवीन OTP घ्या."

      };

    }


    // ---------------------------------------------------
    // 8. Check attempt limit BEFORE verification
    // ---------------------------------------------------

    const currentAttempts =
      Number(
        request.otpAttempts || 0
      );


    if (
      currentAttempts >=
      AUTH_CONFIG.MAX_OTP_ATTEMPTS
    ) {

      cache.remove(
        cacheKey
      );


      return {

        success: false,

        verified: false,

        blocked: true,

        code:
          "MAX_OTP_ATTEMPTS_REACHED",

        message:
          "OTP attempts ची कमाल मर्यादा पूर्ण झाली आहे. कृपया नवीन OTP घ्या."

      };

    }


    // ---------------------------------------------------
    // 9. Compare OTP
    // ---------------------------------------------------

    if (
      cleanOTP !==
      String(
        request.otp
      )
    ) {

      // -----------------------------------------------
      // Wrong OTP
      // -----------------------------------------------

      const failedAttempt =
        registerAuthOTPFailedAttempt(
          requestId
        );


      return {

        success: false,

        verified: false,

        blocked:
          failedAttempt.blocked === true,

        code:
          failedAttempt.blocked === true
            ? "MAX_OTP_ATTEMPTS_REACHED"
            : "INVALID_OTP",

        attempts:
          failedAttempt.attempts,

        attemptsRemaining:
          failedAttempt.attemptsRemaining,

        message:
          failedAttempt.blocked === true
            ? "OTP attempts ची कमाल मर्यादा पूर्ण झाली आहे. कृपया नवीन OTP घ्या."
            : "OTP चुकीचा आहे."

      };

    }


    // ---------------------------------------------------
    // 10. OTP CORRECT
    // ---------------------------------------------------

    request.otpVerified =
      true;

    request.state =
      AUTH_STATES.OTP_VERIFIED;

    request.otpVerifiedAt =
      new Date().toISOString();


    // ---------------------------------------------------
    // 11. Save verified request
    // ---------------------------------------------------

    cache.put(

      cacheKey,

      JSON.stringify(
        request
      ),

      AUTH_CONFIG.OTP_EXPIRY_SECONDS

    );


    // ---------------------------------------------------
    // 12. Write authentication log
    // ---------------------------------------------------

    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_VERIFIED,

      status:
        "SUCCESS",

      mobile:
        request.user &&
        request.user.mobile
          ? request.user.mobile
          : "",

      profileId:
        request.user &&
        request.user.profileId
          ? request.user.profileId
          : "",

      profileType:
        request.user &&
        request.user.profileType
          ? request.user.profileType
          : "",

      userName:
        request.user &&
        request.user.name
          ? request.user.name
          : "",

      requestId:
        requestId,

      reason:
        "OTP_VERIFICATION_SUCCESS",

      channel:
        request.channel ||
        AUTH_CHANNELS.SMS

    });


    // ---------------------------------------------------
    // 13. Return safe verification result
    // ---------------------------------------------------
    //
    // IMPORTANT:
    // No OTP returned.
    // No session created here.
    //

    return {

      success: true,

      verified: true,

      state:
        AUTH_STATES.OTP_VERIFIED,

      requestId:
        requestId,

      user: {

        profileId:
          request.user.profileId,

        profileType:
          request.user.profileType,

        name:
          request.user.name,

        mobile:
          request.user.mobile

      },

      message:
        "OTP verified successfully."

    };

  }

  catch (error) {

    console.error(
      "OTP Verification Error:",
      error
    );


    return {

      success: false,

      verified: false,

      code:
        "OTP_VERIFICATION_EXCEPTION",

      message:
        "OTP verification करताना समस्या आली."

    };

  }

}



// =====================================================
// SEC-03.1
// SECURE SESSION CREATION
// =====================================================
//
// Rules:
// - Session can be created ONLY from OTP_VERIFIED request.
// - requestId and sessionId are different.
// - Session is stored server-side in Script Cache.
// - Session expires automatically.
// - User identity comes from the verified request.
// - OTP is never returned.
// - OTP request is consumed after session creation.
// =====================================================

function createAuthSession(requestId) {

  try {

    // ---------------------------------------------------
    // 1. Validate request ID
    // ---------------------------------------------------

    if (!requestId) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_REQUEST_ID"

      };

    }


    // ---------------------------------------------------
    // 2. Get verified OTP request
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const otpCacheKey =
      AUTH_CONFIG.OTP_CACHE_PREFIX +
      requestId;


    const cachedRequest =
      cache.get(
        otpCacheKey
      );


    if (!cachedRequest) {

      return {

        success: false,

        authenticated: false,

        code:
          "OTP_REQUEST_EXPIRED",

        message:
          "Authentication request उपलब्ध नाही."

      };

    }


    // ---------------------------------------------------
    // 3. Parse request
    // ---------------------------------------------------

    let request;

    try {

      request =
        JSON.parse(
          cachedRequest
        );

    }

    catch (error) {

      cache.remove(
        otpCacheKey
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_AUTH_REQUEST"

      };

    }


    // ---------------------------------------------------
    // 4. ONLY OTP_VERIFIED can create a session
    // ---------------------------------------------------

    if (
      request.state !==
      AUTH_STATES.OTP_VERIFIED
    ) {

      writeAuthLog({

        event:
          AUTH_EVENTS.ACCESS_DENIED,

        status:
          "FAILED",

        mobile:
          request.user &&
          request.user.mobile
            ? request.user.mobile
            : "",

        profileId:
          request.user &&
          request.user.profileId
            ? request.user.profileId
            : "",

        profileType:
          request.user &&
          request.user.profileType
            ? request.user.profileType
            : "",

        userName:
          request.user &&
          request.user.name
            ? request.user.name
            : "",

        requestId:
          requestId,

        reason:
          "SESSION_CREATION_REQUIRES_OTP_VERIFIED",

        channel:
          request.channel ||
          AUTH_CHANNELS.SMS

      });


      return {

        success: false,

        authenticated: false,

        code:
          "OTP_NOT_VERIFIED",

        message:
          "Session तयार करण्यापूर्वी OTP verification आवश्यक आहे."

      };

    }


    // ---------------------------------------------------
    // 5. Validate verified user identity
    // ---------------------------------------------------

    if (
      !request.user ||
      !request.user.profileId ||
      !request.user.mobile
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          "INCOMPLETE_USER_IDENTITY"

      };

    }


    // ---------------------------------------------------
    // 6. Prevent duplicate session creation
    // ---------------------------------------------------

    if (
      request.sessionCreated === true
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          "SESSION_ALREADY_CREATED",

        message:
          "या authentication request साठी session आधीच तयार झाले आहे."

      };

    }


    // ---------------------------------------------------
    // 7. Create NEW session ID
    // ---------------------------------------------------
    //
    // Do NOT reuse requestId.
    //

    const sessionId =
      Utilities.getUuid();


    // ---------------------------------------------------
    // 8. Session timestamps
    // ---------------------------------------------------

    const createdAt =
      new Date();


    const expiresAt =
      new Date(

        createdAt.getTime() +

        (
          AUTH_CONFIG
            .SESSION_EXPIRY_SECONDS *
          1000
        )

      );


    // ---------------------------------------------------
    // 9. Build session object
    // ---------------------------------------------------

    const session = {

      sessionId:
        sessionId,

      requestId:
        requestId,

      state:
        AUTH_STATES.SESSION_ACTIVE,

      createdAt:
        createdAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      user: {

        profileId:
          String(
            request.user.profileId
          ).trim(),

        profileType:
          String(
            request.user.profileType || ""
          ).trim(),

        name:
          String(
            request.user.name || ""
          ).trim(),

        mobile:
          normalizeAuthMobile(
            request.user.mobile
          ),

        registeredSheet:
          String(
            request.user.registeredSheet || ""
          ).trim()

      }

    };


    // ---------------------------------------------------
    // 10. Validate session identity
    // ---------------------------------------------------

    if (
      !session.user.profileId ||
      !session.user.mobile
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_IDENTITY"

      };

    }


    // ---------------------------------------------------
    // 11. Store session server-side
    // ---------------------------------------------------

    const sessionCacheKey =
      AUTH_CONFIG.SESSION_CACHE_PREFIX +
      sessionId;


    cache.put(

      sessionCacheKey,

      JSON.stringify(
        session
      ),

      AUTH_CONFIG
        .SESSION_EXPIRY_SECONDS

    );


    // ---------------------------------------------------
    // 12. Mark OTP request as consumed
    // ---------------------------------------------------
    //
    // The OTP verification transaction is complete.
    // The requestId cannot create another session.
    //

    request.sessionCreated =
      true;

    request.sessionId =
      sessionId;

    request.state =
      AUTH_STATES.SESSION_ACTIVE;

    request.sessionCreatedAt =
      createdAt.toISOString();


    cache.remove(
      otpCacheKey
    );


    // ---------------------------------------------------
    // 13. Authentication audit log
    // ---------------------------------------------------

    writeAuthLog({

      event:
        AUTH_EVENTS.SESSION_CREATED,

      status:
        "SUCCESS",

      mobile:
        session.user.mobile,

      profileId:
        session.user.profileId,

      profileType:
        session.user.profileType,

      userName:
        session.user.name,

      requestId:
        requestId,

      sessionId:
        sessionId,

      reason:
        "AUTHENTICATED_SESSION_CREATED",

      channel:
        request.channel ||
        AUTH_CHANNELS.SMS

    });


    // ---------------------------------------------------
    // 14. Safe response
    // ---------------------------------------------------
    //
    // Session ID is returned.
    // OTP is NOT returned.
    //

    return {

      success: true,

      authenticated: true,

      state:
        AUTH_STATES.SESSION_ACTIVE,

      sessionId:
        sessionId,

      expiresIn:
        AUTH_CONFIG
          .SESSION_EXPIRY_SECONDS,

      user: {

        profileId:
          session.user.profileId,

        profileType:
          session.user.profileType,

        name:
          session.user.name

      },

      message:
        "Secure session created successfully."

    };

  }

  catch (error) {

    console.error(
      "Session Creation Error:",
      error
    );


    return {

      success: false,

      authenticated: false,

      code:
        "SESSION_CREATION_EXCEPTION",

      message:
        "Secure session तयार करताना समस्या आली."

    };

  }

}




// =====================================================
// SEC-03.2
// SESSION VALIDATION
// =====================================================
//
// Rules:
// - sessionId is mandatory.
// - Session must exist server-side.
// - Session must be SESSION_ACTIVE.
// - Session expiry is checked.
// - Expired/invalid session is denied.
// - User identity comes from server-side session.
// - Client cannot supply/override user identity.
// =====================================================

function validateAuthSession(sessionId) {

  try {

    // ---------------------------------------------------
    // 1. Validate session ID
    // ---------------------------------------------------

    if (!sessionId) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_ID"

      };

    }


    const cleanSessionId =
      String(
        sessionId
      ).trim();


    // ---------------------------------------------------
    // 2. Get session from server cache
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const sessionCacheKey =
      AUTH_CONFIG.SESSION_CACHE_PREFIX +
      cleanSessionId;


    const cachedSession =
      cache.get(
        sessionCacheKey
      );


    if (!cachedSession) {

      return {

        success: false,

        authenticated: false,

        code:
          "SESSION_NOT_FOUND",

        message:
          "Session उपलब्ध नाही किंवा expire झाली आहे."

      };

    }


    // ---------------------------------------------------
    // 3. Parse session
    // ---------------------------------------------------

    let session;

    try {

      session =
        JSON.parse(
          cachedSession
        );

    }

    catch (error) {

      cache.remove(
        sessionCacheKey
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION"

      };

    }


    // ---------------------------------------------------
    // 4. Validate session state
    // ---------------------------------------------------

    if (
      session.state !==
      AUTH_STATES.SESSION_ACTIVE
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          "SESSION_NOT_ACTIVE"

      };

    }


    // ---------------------------------------------------
    // 5. Validate expiry
    // ---------------------------------------------------

    const expiresAt =
      new Date(
        session.expiresAt
      ).getTime();


    if (
      !expiresAt ||
      Date.now() >= expiresAt
    ) {

      session.state =
        AUTH_STATES.SESSION_EXPIRED;


      cache.remove(
        sessionCacheKey
      );


      writeAuthLog({

        event:
          AUTH_EVENTS.SESSION_EXPIRED,

        status:
          "FAILED",

        mobile:
          session.user &&
          session.user.mobile
            ? session.user.mobile
            : "",

        profileId:
          session.user &&
          session.user.profileId
            ? session.user.profileId
            : "",

        profileType:
          session.user &&
          session.user.profileType
            ? session.user.profileType
            : "",

        userName:
          session.user &&
          session.user.name
            ? session.user.name
            : "",

        requestId:
          session.requestId || "",

        sessionId:
          cleanSessionId,

        reason:
          "SESSION_EXPIRY_REACHED",

        channel:
          AUTH_CHANNELS.SMS

      });


      return {

        success: false,

        authenticated: false,

        code:
          "SESSION_EXPIRED",

        message:
          "Session ची वैधता संपली आहे. कृपया पुन्हा verification करा."

      };

    }


    // ---------------------------------------------------
    // 6. Validate session identity
    // ---------------------------------------------------

    if (
      !session.user ||
      !session.user.profileId ||
      !session.user.mobile
    ) {

      cache.remove(
        sessionCacheKey
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_IDENTITY"

      };

    }


    // ---------------------------------------------------
    // 7. SUCCESS
    // ---------------------------------------------------

    return {

      success: true,

      authenticated: true,

      state:
        AUTH_STATES.SESSION_ACTIVE,

      sessionId:
        cleanSessionId,

      expiresAt:
        session.expiresAt,

      user: {

        profileId:
          session.user.profileId,

        profileType:
          session.user.profileType,

        name:
          session.user.name,

        mobile:
          session.user.mobile,

        registeredSheet:
          session.user.registeredSheet || ""

      }

    };

  }

  catch (error) {

    console.error(
      "Session Validation Error:",
      error
    );


    return {

      success: false,

      authenticated: false,

      code:
        "SESSION_VALIDATION_EXCEPTION"

    };

  }

}


// =====================================================
// SEC-03.4
// LOGOUT / SESSION REVOCATION
// =====================================================
//
// Rules:
// - sessionId is mandatory.
// - Session must exist server-side.
// - Logout removes the server-side session.
// - Same sessionId cannot be reused.
// - LOGOUT event is written to AUTH_LOGS.
// - No OTP is involved.
// =====================================================

function logoutAuthSession(sessionId) {

  try {

    // ---------------------------------------------------
    // 1. Validate session ID
    // ---------------------------------------------------

    if (!sessionId) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_ID"

      };

    }


    const cleanSessionId =
      String(
        sessionId
      ).trim();


    // ---------------------------------------------------
    // 2. Get server-side session
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const sessionCacheKey =
      AUTH_CONFIG.SESSION_CACHE_PREFIX +
      cleanSessionId;


    const cachedSession =
      cache.get(
        sessionCacheKey
      );


    // ---------------------------------------------------
    // 3. Session already gone
    // ---------------------------------------------------

    if (!cachedSession) {

      return {

        success: false,

        authenticated: false,

        code:
          "SESSION_NOT_FOUND",

        message:
          "Session उपलब्ध नाही."

      };

    }


    // ---------------------------------------------------
    // 4. Parse session
    // ---------------------------------------------------

    let session;

    try {

      session =
        JSON.parse(
          cachedSession
        );

    }

    catch (error) {

      cache.remove(
        sessionCacheKey
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION"

      };

    }


    // ---------------------------------------------------
    // 5. Validate active state
    // ---------------------------------------------------

    if (
      session.state !==
      AUTH_STATES.SESSION_ACTIVE
    ) {

      cache.remove(
        sessionCacheKey
      );


      return {

        success: false,

        authenticated: false,

        code:
          "SESSION_NOT_ACTIVE"

      };

    }


    // ---------------------------------------------------
    // 6. Remove session FIRST
    // ---------------------------------------------------
    //
    // Important:
    // Revoke before returning success.
    //

    cache.remove(
      sessionCacheKey
    );


    // ---------------------------------------------------
    // 7. Write logout audit log
    // ---------------------------------------------------

    writeAuthLog({

      event:
        AUTH_EVENTS.LOGOUT,

      status:
        "SUCCESS",

      mobile:
        session.user &&
        session.user.mobile
          ? session.user.mobile
          : "",

      profileId:
        session.user &&
        session.user.profileId
          ? session.user.profileId
          : "",

      profileType:
        session.user &&
        session.user.profileType
          ? session.user.profileType
          : "",

      userName:
        session.user &&
        session.user.name
          ? session.user.name
          : "",

      requestId:
        session.requestId || "",

      sessionId:
        cleanSessionId,

      reason:
        "USER_LOGOUT",

      channel:
        AUTH_CHANNELS.SMS

    });


    // ---------------------------------------------------
    // 8. Return safe response
    // ---------------------------------------------------

    return {

      success: true,

      authenticated: false,

      state:
        AUTH_STATES.LOGGED_OUT,

      code:
        "SESSION_LOGGED_OUT",

      sessionId:
        cleanSessionId,

      message:
        "Session successfully logged out."

    };

  }

  catch (error) {

    console.error(
      "Logout Error:",
      error
    );


    return {

      success: false,

      authenticated: false,

      code:
        "LOGOUT_EXCEPTION"

    };

  }

}




// =====================================================
// SEC-03.5
// PROTECTED ACCESS CONTROL
// =====================================================
//
// Rules:
// - Every protected resource must use this function.
// - Session is validated server-side.
// - Client cannot provide profile identity directly.
// - Only SESSION_ACTIVE can access protected resources.
// =====================================================

function requireAuthSession(sessionId) {

  try {

    // ---------------------------------------------------
    // 1. Validate session
    // ---------------------------------------------------

    const validation =
      validateAuthSession(
        sessionId
      );


    // ---------------------------------------------------
    // 2. Deny if session is invalid
    // ---------------------------------------------------

    if (
      !validation ||
      validation.success !== true ||
      validation.authenticated !== true ||
      validation.state !==
        AUTH_STATES.SESSION_ACTIVE
    ) {

      return {

        success: false,

        authorized: false,

        code:
          validation &&
          validation.code
            ? validation.code
            : "ACCESS_DENIED",

        message:
          "कृपया प्रथम authentication पूर्ण करा."

      };

    }


    // ---------------------------------------------------
    // 3. Return ONLY server-validated identity
    // ---------------------------------------------------

    return {

      success: true,

      authorized: true,

      state:
        AUTH_STATES.SESSION_ACTIVE,

      sessionId:
        validation.sessionId,

      user: {

        profileId:
          validation.user.profileId,

        profileType:
          validation.user.profileType,

        name:
          validation.user.name,

        mobile:
          validation.user.mobile,

        registeredSheet:
          validation.user.registeredSheet || ""

      }

    };

  }

  catch (error) {

    console.error(
      "Protected Access Error:",
      error
    );


    return {

      success: false,

      authorized: false,

      code:
        "ACCESS_CONTROL_EXCEPTION",

      message:
        "Access validation करताना समस्या आली."

    };

  }

}





// =====================================================
// SEC-03.6
// PROTECTED CHATBOT API
// =====================================================
//
// Rules:
// - sessionId is mandatory.
// - Session must be ACTIVE.
// - User identity comes ONLY from server session.
// - Client profileId/mobile/profileType is NOT trusted.
// - Existing chatbot logic runs only after authorization.
// =====================================================

function requestProtectedChatbot(sessionId, message) {

  try {

    // ---------------------------------------------------
    // 1. Validate input
    // ---------------------------------------------------

    if (!sessionId) {

      return {

        success: false,

        authorized: false,

        code:
          "INVALID_SESSION_ID",

        message:
          "Authentication required."

      };

    }


    if (
      !message ||
      String(message).trim() === ""
    ) {

      return {

        success: false,

        authorized: true,

        code:
          "EMPTY_MESSAGE",

        message:
          "कृपया तुमचा प्रश्न टाका."

      };

    }


    // ---------------------------------------------------
    // 2. Protected access check
    // ---------------------------------------------------

    const access =
      requireAuthSession(
        sessionId
      );


    if (
      !access ||
      access.authorized !== true
    ) {

      return {

        success: false,

        authorized: false,

        code:
          access &&
          access.code
            ? access.code
            : "ACCESS_DENIED",

        message:
          access &&
          access.message
            ? access.message
            : "Authentication required."

      };

    }


    // ---------------------------------------------------
    // 3. SERVER-SIDE IDENTITY
    // ---------------------------------------------------

    const user =
      access.user;


    // ---------------------------------------------------
    // 4. IMPORTANT
    //
    // Do NOT accept these from frontend:
    //
    // profileId
    // mobile
    // profileType
    //
    // The authenticated identity comes from:
    //
    // access.user
    // ---------------------------------------------------


    // ---------------------------------------------------
    // 5. Prepare protected chatbot context
    // ---------------------------------------------------

    const chatbotContext = {

      sessionId:
        access.sessionId,

      profileId:
        user.profileId,

      profileType:
        user.profileType,

      name:
        user.name,

      mobile:
        user.mobile

    };


    // ---------------------------------------------------
    // 6. Call existing chatbot logic
    // ---------------------------------------------------
    //
    // IMPORTANT:
    // Replace processChatbotMessage() below with
    // your existing chatbot processing function.
    //
    // Do NOT create a second OpenAI integration here.
    // ---------------------------------------------------

    const chatbotResult =
      processChatbotMessage(

        String(
          message
        ).trim(),

        chatbotContext

      );


    // ---------------------------------------------------
    // 7. Return chatbot response
    // ---------------------------------------------------

    return {

      success: true,

      authorized: true,

      sessionId:
        access.sessionId,

      response:
        chatbotResult

    };

  }

  catch (error) {

    console.error(
      "Protected Chatbot Error:",
      error
    );


    return {

      success: false,

      authorized: false,

      code:
        "CHATBOT_REQUEST_EXCEPTION",

      message:
        "Chatbot request process करताना समस्या आली."

    };

  }

}


// =====================================================
// SEC-04.1
// FRONTEND LOGIN API
// REQUEST OTP
// =====================================================

function requestLoginOTP(mobile) {

  try {

    // ---------------------------------------------------
    // 1. Normalize mobile
    // ---------------------------------------------------

    const cleanMobile =
      normalizeAuthMobile(
        mobile
      );


    if (!cleanMobile) {

      return {

        success: false,

        code:
          "INVALID_MOBILE",

        message:
          "कृपया योग्य 10 अंकी मोबाईल नंबर टाका."

      };

    }


    // ---------------------------------------------------
    // 2. Check registered profile
    // ---------------------------------------------------

    const user =
      getAuthUserFromRegisteredMobile(
        cleanMobile
      );


    if (
      !user ||
      user.registered !== true
    ) {

      return {

        success: false,

        registered: false,

        code:
          user &&
          user.code
            ? user.code
            : "MOBILE_NOT_REGISTERED",

        message:
          user &&
          user.message
            ? user.message
            : "हा मोबाईल नंबर नोंदणीकृत नाही."

      };

    }


    // ---------------------------------------------------
    // 3. Create OTP request
    // ---------------------------------------------------

    const request =
      createAuthOTPRequest(
        cleanMobile
      );


    if (
      !request ||
      request.success !== true
    ) {

      return {

        success: false,

        registered: true,

        code:
          request &&
          request.code
            ? request.code
            : "OTP_REQUEST_FAILED",

        retryAfter:
          request &&
          request.retryAfter
            ? request.retryAfter
            : 0,

        message:
          request &&
          request.message
            ? request.message
            : "OTP request करता आली नाही."

      };

    }


    // ---------------------------------------------------
    // 4. Generate OTP
    // ---------------------------------------------------

    const generated =
      generateAuthOTP(
        request.requestId
      );


    if (
      !generated ||
      generated.success !== true
    ) {

      return {

        success: false,

        registered: true,

        code:
          "OTP_GENERATION_FAILED",

        requestId:
          request.requestId

      };

    }


    // ---------------------------------------------------
    // 5. Send OTP through 2Factor
    // ---------------------------------------------------
    //
    // IMPORTANT:
    // OTP is NOT returned to frontend.
    // ---------------------------------------------------

    const sms =
      sendOTPVia2Factor(

        cleanMobile,

        generated.otp

      );


    if (
      !sms ||
      sms.success !== true
    ) {

      return {

        success: false,

        registered: true,

        code:
          "OTP_DELIVERY_FAILED",

        requestId:
          request.requestId,

        message:
          "OTP पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा."

      };

    }


    // ---------------------------------------------------
    // 6. Production-safe response
    // ---------------------------------------------------

    return {

      success: true,

      registered: true,

      state:
        "OTP_PENDING",

      requestId:
        request.requestId,

      retryAfter:
        AUTH_CONFIG
          .RESEND_COOLDOWN_SECONDS,

      expiresIn:
        AUTH_CONFIG
          .OTP_EXPIRY_SECONDS,

      user: {

        profileId:
          user.profileId,

        profileType:
          user.profileType,

        name:
          user.name,

        mobile:
          user.mobile

      }

    };

  }

  catch (error) {

    console.error(
      "requestLoginOTP Error:",
      error
    );


    return {

      success: false,

      code:
        "LOGIN_OTP_EXCEPTION",

      message:
        "OTP request करताना समस्या आली."

    };

  }

}


function testRequestLoginOTP() {

  const mobile =
    "8975593689";


  Logger.log(
    "========== SEC-04.1 =========="
  );


  const result =
    requestLoginOTP(
      mobile
    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  if (
    result.success === true &&
    result.registered === true &&
    result.state === "OTP_PENDING" &&
    result.requestId &&
    !result.otp
  ) {

    Logger.log(
      "✅ OTP REQUEST API PASS"
    );

  }

  else {

    Logger.log(
      "❌ OTP REQUEST API FAILED"
    );

    return;

  }


  Logger.log(
    "================================"
  );

  Logger.log(
    "SEC-04.1 PASS"
  );

  Logger.log(
    "================================"
  );

}
