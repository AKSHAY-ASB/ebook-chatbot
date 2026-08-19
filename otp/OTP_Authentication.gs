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

  // ==========================================
  // TRUSTED AUTHENTICATION
  // ==========================================

  TRUSTED_AUTH_EXPIRY_SECONDS:
    30 * 24 * 60 * 60, // 30 days

  TRUSTED_AUTH_CACHE_PREFIX:
    "DP_TRUSTED_AUTH_",

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


function createAuthOTPRequest(user) {

  try {

    // =================================================
    // 1. Validate user identity
    // =================================================

    if (
      !user ||
      !user.mobile ||
      !user.profileId
    ) {

      return {

        success: false,

        code:
          "INVALID_AUTH_IDENTITY",

        message:
          "नोंदणीकृत प्रोफाईलची ओळख उपलब्ध नाही."

      };

    }


    // =================================================
    // 2. Normalize mobile
    // =================================================

    const cleanMobile =
      normalizeAuthMobile(
        user.mobile
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


    // =================================================
    // 3. Normalize identity
    // =================================================

    const profileId =
      String(
        user.profileId || ""
      ).trim();

    const profileType =
      String(
        user.profileType || ""
      ).trim();

    const name =
      String(
        user.name || ""
      ).trim();

    const registeredSheet =
      String(
        user.registeredSheet || ""
      ).trim();


    // =================================================
    // 4. Final identity validation
    // =================================================

    if (
      !profileId ||
      !cleanMobile
    ) {

      return {

        success: false,

        code:
          "INCOMPLETE_AUTH_IDENTITY",

        message:
          "नोंदणीकृत प्रोफाईलची माहिती अपूर्ण आहे."

      };

    }


    // =================================================
    // 5. Create request ID
    // =================================================

    const requestId =
      Utilities.getUuid();


    // =================================================
    // 6. Create timestamps
    // =================================================

    const createdAt =
      new Date();

    const expiresAt =
      new Date(
        createdAt.getTime() +
        (
          AUTH_CONFIG
            .OTP_EXPIRY_SECONDS *
          1000
        )
      );


    // =================================================
    // 7. Build server-side OTP request
    // =================================================

    const request = {

      requestId:
        requestId,

      state:
        AUTH_STATES.OTP_PENDING,

      channel:
        AUTH_CHANNELS.SMS,

      createdAt:
        createdAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      otpRequired:
        true,

      authenticated:
        false,

      trusted:
        false,

      user: {

        profileId:
          profileId,

        profileType:
          profileType,

        name:
          name,

        mobile:
          cleanMobile,

        registeredSheet:
          registeredSheet

      }

    };


    // =================================================
    // 8. Store request server-side
    // =================================================
    //
    // IMPORTANT:
    //
    // Use the SAME cache prefix that
    // verifyAuthOTP() / createAuthSession()
    // use to retrieve the request.
    // =================================================

    const cache =
      CacheService
        .getScriptCache();


    const requestCacheKey =
      AUTH_CONFIG
        .OTP_CACHE_PREFIX +
      requestId;


    cache.put(

      requestCacheKey,

      JSON.stringify(
        request
      ),

      AUTH_CONFIG
        .OTP_EXPIRY_SECONDS

    );


    // =================================================
    // 9. Start resend cooldown
    // =================================================

    const cooldownKey =
      AUTH_CONFIG
        .OTP_CACHE_PREFIX +
      "COOLDOWN_" +
      cleanMobile;


    cache.put(

      cooldownKey,

      String(
        Date.now()
      ),

      AUTH_CONFIG
        .RESEND_COOLDOWN_SECONDS

    );


    // =================================================
    // 10. Audit log
    // =================================================

    writeAuthLog({

      event:
        AUTH_EVENTS.OTP_REQUEST,

      status:
        "SUCCESS",

      mobile:
        cleanMobile,

      profileId:
        profileId,

      profileType:
        profileType,

      userName:
        name,

      requestId:
        requestId,

      reason:
        "OTP_REQUEST_CREATED",

      channel:
        AUTH_CHANNELS.SMS

    });


    // =================================================
    // 11. Safe response
    // =================================================

    return {

      success: true,

      registered: true,

      authenticated: false,

      trusted: false,

      otpRequired: true,

      state:
        AUTH_STATES.OTP_PENDING,

      code:
        "OTP_REQUEST_CREATED",

      requestId:
        requestId,

      retryAfter:
        AUTH_CONFIG
          .RESEND_COOLDOWN_SECONDS,

      expiresIn:
        AUTH_CONFIG
          .OTP_EXPIRY_SECONDS,

      user: {

        profileId:
          profileId,

        profileType:
          profileType,

        name:
          name,

        mobile:
          cleanMobile

      }

    };

  }

  catch (error) {

    console.error(
      "createAuthOTPRequest Error:",
      error
    );


    return {

      success: false,

      registered: false,

      authenticated: false,

      trusted: false,

      otpRequired: false,

      code:
        "OTP_REQUEST_CREATION_EXCEPTION",

      message:
        "OTP request तयार करता आली नाही."

    };

  }

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
        identity.user
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

    console.log(
      "🔥 createAuthSession CALLED:",
      requestId
    );


    // =================================================
    // 1. Validate request ID
    // =================================================

    if (!requestId) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_REQUEST_ID",

        message:
          "Authentication request ID उपलब्ध नाही."

      };

    }


    // =================================================
    // 2. Get OTP request
    // =================================================

    const cache =
      CacheService
        .getScriptCache();


    // IMPORTANT:
    // Same prefix used by createAuthOTPRequest()
    //

    const otpCacheKey =
      AUTH_CONFIG.OTP_CACHE_PREFIX +
      requestId;


    console.log(
      "OTP CACHE KEY:",
      otpCacheKey
    );


    const cachedRequest =
      cache.get(
        otpCacheKey
      );


    console.log(
      "CACHED REQUEST EXISTS:",
      !!cachedRequest
    );


    if (!cachedRequest) {

      console.error(
        "❌ OTP REQUEST NOT FOUND:",
        requestId
      );


      return {

        success: false,

        authenticated: false,

        code:
          "OTP_REQUEST_EXPIRED",

        message:
          "Authentication request उपलब्ध नाही किंवा expire झाले आहे."

      };

    }


    // =================================================
    // 3. Parse request
    // =================================================

    let request;


    try {

      request =
        JSON.parse(
          cachedRequest
        );

    }

    catch (parseError) {

      console.error(
        "❌ OTP REQUEST PARSE ERROR:",
        parseError
      );


      cache.remove(
        otpCacheKey
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_AUTH_REQUEST",

        message:
          "Authentication request invalid आहे."

      };

    }


    console.log(
      "OTP REQUEST DATA:",
      JSON.stringify(
        request
      )
    );


    // =================================================
    // 4. Validate OTP verified state
    // =================================================

    console.log(
      "REQUEST STATE:",
      request.state
    );


    if (
      request.state !==
      AUTH_STATES.OTP_VERIFIED
    ) {

      console.error(
        "❌ OTP NOT VERIFIED. STATE:",
        request.state
      );


      return {

        success: false,

        authenticated: false,

        code:
          "OTP_NOT_VERIFIED",

        message:
          "OTP verification पूर्ण झालेली नाही."

      };

    }


    // =================================================
    // 5. Validate user identity
    // =================================================

    console.log(
      "REQUEST USER:",
      JSON.stringify(
        request.user
      )
    );


    if (
      !request.user ||
      !request.user.profileId ||
      !request.user.mobile
    ) {

      console.error(
        "❌ INVALID USER IDENTITY:",
        JSON.stringify(
          request.user
        )
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INCOMPLETE_USER_IDENTITY",

        message:
          "Verified user identity उपलब्ध नाही."

      };

    }


    // =================================================
    // 6. Normalize identity
    // =================================================

    const cleanMobile =
      normalizeAuthMobile(
        request.user.mobile
      );


    const profileId =
      String(
        request.user.profileId || ""
      ).trim();


    const profileType =
      String(
        request.user.profileType || ""
      ).trim();


    const name =
      String(
        request.user.name || ""
      ).trim();


    const registeredSheet =
      String(
        request.user.registeredSheet || ""
      ).trim();


    if (
      !cleanMobile ||
      !profileId
    ) {

      console.error(
        "❌ NORMALIZED IDENTITY INVALID:",
        JSON.stringify({

          mobile:
            cleanMobile,

          profileId:
            profileId,

          profileType:
            profileType,

          name:
            name

        })
      );


      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_IDENTITY",

        message:
          "Verified user identity अपूर्ण आहे."

      };

    }


    // =================================================
    // 7. Prevent duplicate session
    // =================================================

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


    // =================================================
    // 8. Create session ID
    // =================================================

    const sessionId =
      Utilities.getUuid();


    // =================================================
    // 9. Session timestamps
    // =================================================

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


    // =================================================
    // 10. Build session
    // =================================================

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
          profileId,

        profileType:
          profileType,

        name:
          name,

        mobile:
          cleanMobile,

        registeredSheet:
          registeredSheet

      }

    };


    // =================================================
    // 11. Validate session
    // =================================================

    if (
      !session.user.profileId ||
      !session.user.mobile
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_IDENTITY",

        message:
          "Session user identity तयार करता आली नाही."

      };

    }


    // =================================================
    // 12. Store session
    // =================================================

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


    console.log(
      "✅ SESSION STORED:",
      sessionCacheKey
    );


    // =================================================
    // 13. Mark request as session created
    // =================================================

    request.sessionCreated =
      true;

    request.sessionId =
      sessionId;

    request.state =
      AUTH_STATES.SESSION_ACTIVE;

    request.sessionCreatedAt =
      createdAt.toISOString();


    // =================================================
    // 14. Remove OTP request
    // =================================================

    cache.remove(
      otpCacheKey
    );


    // =================================================
    // 15. Audit log
    // =================================================

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


    // =================================================
    // 16. SUCCESS
    // =================================================

    console.log(
      "✅ AUTH SESSION CREATED:",
      JSON.stringify(
        session.user
      )
    );


    return {

      success: true,

      authenticated: true,

      state:
        AUTH_STATES.SESSION_ACTIVE,

      sessionId:
        sessionId,

      expiresAt:
        session.expiresAt,

      expiresIn:
        AUTH_CONFIG
          .SESSION_EXPIRY_SECONDS,

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
          session.user.registeredSheet

      },

      message:
        "Secure session created successfully."

    };

  }

  catch (error) {

    console.error(
      "❌ createAuthSession ERROR:",
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
// SEC-04.x.9
// LOGIN OTP REQUEST
// =====================================================
//
// Flow:
//
// Mobile
//   ↓
// Registered Profile
//   ↓
// Trusted Auth?
//   ├── YES → Trusted Session → NO OTP
//   │                         → NO 2Factor
//   │
//   └── NO  → Existing OTP Flow
//             ↓
//           Generate OTP
//             ↓
//           2Factor SMS
//
// =====================================================


// =====================================================
// SEC-04.x
// TRUSTED AUTHENTICATION CREATION
// =====================================================
//
// Purpose:
// - Create trusted authentication after successful OTP
// - Store trusted record server-side
// - Trusted authentication expires after configured period
// - Never trust mobile number alone
// - Never store OTP
//
// IMPORTANT:
// This function does NOT create the normal session.
// Session creation remains handled by createAuthSession().
// =====================================================

function createTrustedAuth(user) {

  try {

    // ---------------------------------------------------
    // 1. Validate user object
    // ---------------------------------------------------

    if (
      !user ||
      !user.mobile ||
      !user.profileId
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "INVALID_TRUSTED_USER"

      };

    }


    // ---------------------------------------------------
    // 2. Normalize mobile
    // ---------------------------------------------------

    const cleanMobile =
      normalizeAuthMobile(
        user.mobile
      );


    if (
      !cleanMobile ||
      cleanMobile.length !== 10
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "INVALID_TRUSTED_MOBILE"

      };

    }


    // ---------------------------------------------------
    // 3. Validate profile identity
    // ---------------------------------------------------

    const profileId =
      String(
        user.profileId || ""
      ).trim();


    const profileType =
      String(
        user.profileType || ""
      ).trim();


    const name =
      String(
        user.name || ""
      ).trim();


    if (!profileId) {

      return {

        success: false,

        trusted: false,

        code:
          "INVALID_PROFILE_ID"

      };

    }


    // ---------------------------------------------------
    // 4. Generate random trusted token
    // ---------------------------------------------------

    const trustedToken =
      Utilities.getUuid();


    // ---------------------------------------------------
    // 5. Create timestamps
    // ---------------------------------------------------

    const createdAt =
      new Date();


    const expiresAt =
      new Date(
        createdAt.getTime() +
        (
          AUTH_CONFIG
            .TRUSTED_AUTH_EXPIRY_SECONDS
          *
          1000
        )
      );


    // ---------------------------------------------------
    // 6. Build trusted record
    // ---------------------------------------------------

    const trustedRecord = {

      trustedToken:
        trustedToken,

      mobile:
        cleanMobile,

      profileId:
        profileId,

      profileType:
        profileType,

      name:
        name,

      createdAt:
        createdAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      state:
        "TRUSTED_ACTIVE"

    };


    // ---------------------------------------------------
    // 7. Server-side cache key
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const cacheKey =
      AUTH_CONFIG
        .TRUSTED_AUTH_CACHE_PREFIX +
      cleanMobile;


    // ---------------------------------------------------
    // 8. Store server-side
    // ---------------------------------------------------

    cache.put(

      cacheKey,

      JSON.stringify(
        trustedRecord
      ),

      AUTH_CONFIG
        .TRUSTED_AUTH_EXPIRY_SECONDS

    );


    // ---------------------------------------------------
    // 9. Safe response
    // ---------------------------------------------------

     return {

        success: true,

        trusted: true,

        trustedToken:
          trustedRecord.trustedToken,

        expiresAt:
          trustedRecord.expiresAt,

        user: {

          profileId:
            profileId,

          profileType:
            profileType,

          name:
            name,

          mobile:
            cleanMobile

        }

      };

  }
  catch (error) {

    console.error(
      "Trusted Auth Creation Error:",
      error
    );


    return {

      success: false,

      trusted: false,

      code:
        "TRUSTED_AUTH_CREATION_EXCEPTION"

    };

  }

}



// =====================================================
// SEC-04.x.2
// TRUSTED AUTHENTICATION VALIDATION
// =====================================================
//
// Rules:
// - Mobile is mandatory
// - Trusted token is mandatory
// - Trusted record must exist server-side
// - Token must match
// - Mobile must match
// - Profile ID must match
// - State must be TRUSTED_ACTIVE
// - Expiry must be valid
// - Client cannot override server-side identity
// =====================================================

function validateTrustedAuth(
  mobile,
  trustedToken,
  profileId
) {

  try {

    // ---------------------------------------------------
    // 1. Validate input
    // ---------------------------------------------------

    if (
      !mobile ||
      !trustedToken
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "INVALID_TRUSTED_AUTH_INPUT"

      };

    }


    // ---------------------------------------------------
    // 2. Normalize mobile
    // ---------------------------------------------------

    const cleanMobile =
      normalizeAuthMobile(
        mobile
      );


    if (
      !cleanMobile ||
      cleanMobile.length !== 10
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "INVALID_TRUSTED_MOBILE"

      };

    }


    // ---------------------------------------------------
    // 3. Clean token
    // ---------------------------------------------------

    const cleanToken =
      String(
        trustedToken
      ).trim();


    if (!cleanToken) {

      return {

        success: false,

        trusted: false,

        code:
          "INVALID_TRUSTED_TOKEN"

      };

    }


    // ---------------------------------------------------
    // 4. Get server-side cache
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const cacheKey =
      AUTH_CONFIG
        .TRUSTED_AUTH_CACHE_PREFIX +
      cleanMobile;


    const cachedRecord =
      cache.get(
        cacheKey
      );


    // ---------------------------------------------------
    // 5. Trusted record must exist
    // ---------------------------------------------------

    if (!cachedRecord) {

      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_AUTH_NOT_FOUND",

        message:
          "Trusted authentication उपलब्ध नाही."

      };

    }


    // ---------------------------------------------------
    // 6. Parse server-side record
    // ---------------------------------------------------

    let trustedRecord;


    try {

      trustedRecord =
        JSON.parse(
          cachedRecord
        );

    }
    catch (parseError) {

      cache.remove(
        cacheKey
      );


      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_AUTH_CORRUPTED"

      };

    }


    // ---------------------------------------------------
    // 7. Check state
    // ---------------------------------------------------

    if (
      trustedRecord.state !==
      "TRUSTED_ACTIVE"
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_AUTH_INACTIVE"

      };

    }


    // ---------------------------------------------------
    // 8. Check token
    // ---------------------------------------------------

    if (
      trustedRecord.trustedToken !==
      cleanToken
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_TOKEN_INVALID",

        message:
          "Trusted authentication token invalid आहे."

      };

    }


    // ---------------------------------------------------
    // 9. Check mobile binding
    // ---------------------------------------------------

    if (
      trustedRecord.mobile !==
      cleanMobile
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_MOBILE_MISMATCH"

      };

    }


    // ---------------------------------------------------
    // 10. Check profile binding
    // ---------------------------------------------------

    if (
      profileId &&
      String(
        trustedRecord.profileId
      ).trim() !==
      String(
        profileId
      ).trim()
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_PROFILE_MISMATCH"

      };

    }


    // ---------------------------------------------------
    // 11. Check expiry
    // ---------------------------------------------------

    if (
      !trustedRecord.expiresAt
    ) {

      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_EXPIRY_MISSING"

      };

    }


    const expiryTime =
      new Date(
        trustedRecord.expiresAt
      ).getTime();


    if (
      !Number.isFinite(
        expiryTime
      )
    ) {

      cache.remove(
        cacheKey
      );


      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_EXPIRY_INVALID"

      };

    }


    if (
      Date.now() >=
      expiryTime
    ) {

      // -----------------------------------------------
      // Expired trusted authentication is removed
      // -----------------------------------------------

      cache.remove(
        cacheKey
      );


      return {

        success: false,

        trusted: false,

        code:
          "TRUSTED_AUTH_EXPIRED",

        message:
          "Trusted authentication expire झाले आहे."

      };

    }


    // ---------------------------------------------------
    // 12. SUCCESS
    // ---------------------------------------------------

    return {

      success: true,

      trusted: true,

      code:
        "TRUSTED_AUTH_VALID",

      expiresAt:
        trustedRecord.expiresAt,

      user: {

        profileId:
          trustedRecord.profileId,

        profileType:
          trustedRecord.profileType,

        name:
          trustedRecord.name,

        mobile:
          trustedRecord.mobile

      }

    };

  }
  catch (error) {

    console.error(
      "Trusted Auth Validation Error:",
      error
    );


    return {

      success: false,

      trusted: false,

      code:
        "TRUSTED_AUTH_VALIDATION_EXCEPTION"

    };

  }

}




// =====================================================
// SEC-04.x.7
// TRUSTED AUTH -> SESSION CREATION
// =====================================================
//
// Rules:
// - Trusted authentication must be valid.
// - Trusted identity comes ONLY from server-side record.
// - Client cannot provide/override profile identity.
// - New session ID is always generated.
// - Existing createAuthSession() is NOT modified.
// - No OTP is generated.
// - No 2Factor API is called.
// - Session still expires using SESSION_EXPIRY_SECONDS.
// =====================================================

function createTrustedAuthSession(
  mobile,
  trustedToken
) {

  try {

    // ---------------------------------------------------
    // 1. Validate trusted authentication
    // ---------------------------------------------------

    const trustedResult =
      validateTrustedAuth(
        mobile,
        trustedToken
      );


    if (
      !trustedResult ||
      trustedResult.success !== true ||
      trustedResult.trusted !== true
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          trustedResult &&
          trustedResult.code
            ? trustedResult.code
            : "TRUSTED_AUTH_INVALID"

      };

    }


    // ---------------------------------------------------
    // 2. Get SERVER-VALIDATED identity
    // ---------------------------------------------------

    const user =
      trustedResult.user;


    if (
      !user ||
      !user.profileId ||
      !user.mobile
    ) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_TRUSTED_IDENTITY"

      };

    }


    // ---------------------------------------------------
    // 3. Generate NEW session ID
    // ---------------------------------------------------

    const sessionId =
      Utilities.getUuid();


    // ---------------------------------------------------
    // 4. Session timestamps
    // ---------------------------------------------------

    const createdAt =
      new Date();


    const expiresAt =
      new Date(
        createdAt.getTime() +
        (
          AUTH_CONFIG
            .SESSION_EXPIRY_SECONDS
          *
          1000
        )
      );


    // ---------------------------------------------------
    // 5. Build session
    // ---------------------------------------------------

    const session = {

      sessionId:
        sessionId,

      requestId:
        "",

      authenticationMethod:
        "TRUSTED_AUTH",

      state:
        AUTH_STATES.SESSION_ACTIVE,

      createdAt:
        createdAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      user: {

        profileId:
          String(
            user.profileId
          ).trim(),

        profileType:
          String(
            user.profileType || ""
          ).trim(),

        name:
          String(
            user.name || ""
          ).trim(),

        mobile:
          normalizeAuthMobile(
            user.mobile
          ),

        registeredSheet:
          String(
            user.registeredSheet || ""
          ).trim()

      }

    };


    // ---------------------------------------------------
    // 6. Final identity validation
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
    // 7. Store server-side
    // ---------------------------------------------------

    const cache =
      CacheService
        .getScriptCache();


    const sessionCacheKey =
      AUTH_CONFIG
        .SESSION_CACHE_PREFIX +
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
    // 8. Audit log
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
        "",

      sessionId:
        sessionId,

      reason:
        "TRUSTED_AUTH_SESSION_CREATED",

      channel:
        "TRUSTED_AUTH"

    });


    // ---------------------------------------------------
    // 9. Safe response
    // ---------------------------------------------------

    return {

      success: true,

      authenticated: true,

      state:
        AUTH_STATES.SESSION_ACTIVE,

      sessionId:
        sessionId,

      expiresAt:
        session.expiresAt,

      expiresIn:
        AUTH_CONFIG
          .SESSION_EXPIRY_SECONDS,

      authenticationMethod:
        "TRUSTED_AUTH",

      user: {

        profileId:
          session.user.profileId,

        profileType:
          session.user.profileType,

        name:
          session.user.name

      }

    };

  }
  catch (error) {

    console.error(
      "Trusted Auth Session Creation Error:",
      error
    );


    return {

      success: false,

      authenticated: false,

      code:
        "TRUSTED_SESSION_CREATION_EXCEPTION"

    };

  }

}


function resendLoginOTP(mobile) {

  try {

    // =================================================
    // 1. Normalize mobile
    // =================================================

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


    // =================================================
    // 2. Check resend cooldown
    // =================================================

    const cache =
      CacheService
        .getScriptCache();


    const cooldownKey =
      AUTH_CONFIG.OTP_CACHE_PREFIX +
      "COOLDOWN_" +
      cleanMobile;


    const cooldownValue =
      cache.get(
        cooldownKey
      );


    if (cooldownValue) {

      return {

        success: false,

        registered: true,

        code:
          "OTP_RESEND_COOLDOWN",

        retryAfter:
          AUTH_CONFIG
            .RESEND_COOLDOWN_SECONDS,

        message:
          "कृपया काही सेकंदांनी पुन्हा OTP मागा."

      };

    }


    // =================================================
    // 3. Get registered user
    // =================================================

    const userResult =
      getAuthUserFromRegisteredMobile(
        cleanMobile
      );


    if (
      !userResult ||
      userResult.registered !== true ||
      !userResult.user
    ) {

      return {

        success: false,

        registered: false,

        code:
          "MOBILE_NOT_REGISTERED",

        message:
          "हा मोबाईल नंबर नोंदणीकृत नाही."

      };

    }


    const user =
      userResult.user;


    // =================================================
    // 4. Validate identity
    // =================================================

    if (
      !user.profileId ||
      !user.mobile
    ) {

      return {

        success: false,

        registered: true,

        code:
          "INCOMPLETE_PROFILE_IDENTITY",

        message:
          "नोंदणीकृत प्रोफाईलची माहिती अपूर्ण आहे."

      };

    }


    // =================================================
    // 5. Create NEW OTP request
    // =================================================

    const request =
      createAuthOTPRequest(
        user
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


    // =================================================
    // 6. Generate OTP
    // =================================================

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
          request.requestId,

        message:
          "OTP तयार करता आला नाही."

      };

    }


    // =================================================
    // 7. Send OTP
    // =================================================

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


    // =================================================
    // 8. Success
    // =================================================

    return {

      success: true,

      registered: true,

      authenticated: false,

      trusted: false,

      otpRequired: true,

      state:
        "OTP_PENDING",

      code:
        "OTP_RESENT",

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
      "resendLoginOTP Error:",
      error
    );


    return {

      success: false,

      code:
        "RESEND_OTP_EXCEPTION",

      message:
        "OTP पुन्हा पाठवताना समस्या आली."

    };

  }

}