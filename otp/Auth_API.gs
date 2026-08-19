// =====================================================
// DEVANG PUSTIKA
// AUTHENTICATION API LAYER
// =====================================================
//
// Purpose:
// Frontend-facing authentication API.
//
// Frontend should call ONLY these functions:
//   1. requestLoginOTP()
//   2. verifyLoginOTP()
//   3. logoutLoginSession()
//
// Internal authentication functions remain inside:
// OTP_Authentication.gs
// =====================================================



// =====================================================
// SEC-04.2.1
// REQUEST LOGIN OTP
// =====================================================

function requestLoginOTP(
  mobile,
  trustedToken
) {

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

        registered: false,

        authenticated: false,

        trusted: false,

        otpRequired: false,

        code:
          "INVALID_MOBILE",

        message:
          "कृपया योग्य 10 अंकी मोबाईल नंबर टाका."

      };

    }


    // =================================================
    // 2. Get registered profile
    // =================================================

    const userResult =
      getAuthUserFromRegisteredMobile(
        cleanMobile
      );


    // =================================================
    // 3. Validate registered profile
    // =================================================

    if (
      !userResult ||
      userResult.success !== true ||
      userResult.registered !== true ||
      !userResult.user
    ) {

      return {

        success: false,

        registered: false,

        authenticated: false,

        trusted: false,

        otpRequired: false,

        code:
          userResult &&
          userResult.code
            ? userResult.code
            : "MOBILE_NOT_REGISTERED",

        message:
          userResult &&
          userResult.message
            ? userResult.message
            : "हा मोबाईल नंबर नोंदणीकृत नाही."

      };

    }


    // =================================================
    // 4. Extract actual registered identity
    // =================================================

    const user =
      userResult.user;


    // =================================================
    // 5. Validate complete identity
    // =================================================

    if (
      !user.profileId ||
      !user.mobile
    ) {

      console.error(
        "Incomplete registered user identity:",
        JSON.stringify({
          profileId:
            !!user.profileId,

          profileType:
            !!user.profileType,

          name:
            !!user.name,

          mobile:
            !!user.mobile
        })
      );


      return {

        success: false,

        registered: true,

        authenticated: false,

        trusted: false,

        otpRequired: false,

        code:
          "INCOMPLETE_PROFILE_IDENTITY",

        message:
          "नोंदणीकृत प्रोफाईलची माहिती अपूर्ण आहे."

      };

    }


    // =================================================
    // 6. TRUSTED AUTH FLOW
    // =================================================
    //
    // If valid trusted token exists:
    //
    // ❌ Do NOT create OTP
    // ❌ Do NOT generate OTP
    // ❌ Do NOT call 2Factor
    //
    // Create session directly.
    // =================================================

    if (
      trustedToken &&
      String(
        trustedToken
      ).trim()
    ) {

      const cleanTrustedToken =
        String(
          trustedToken
        ).trim();


      const trustedResult =
        validateTrustedAuth(

          cleanMobile,

          cleanTrustedToken,

          user.profileId

        );


      console.log(
        "Trusted Auth validation:",
        JSON.stringify({
          success:
            trustedResult &&
            trustedResult.success === true,

          trusted:
            trustedResult &&
            trustedResult.trusted === true,

          code:
            trustedResult &&
            trustedResult.code
        })
      );


      // =================================================
      // Valid trusted authentication
      // =================================================

      if (
        trustedResult &&
        trustedResult.success === true &&
        trustedResult.trusted === true
      ) {

        console.log(
          "✅ TRUSTED AUTH VALID - OTP SKIPPED"
        );


        const sessionResult =
          createTrustedAuthSession(

            cleanMobile,

            cleanTrustedToken

          );


        if (
          !sessionResult ||
          sessionResult.success !== true ||
          !sessionResult.sessionId
        ) {

          return {

            success: false,

            registered: true,

            authenticated: false,

            trusted: false,

            otpRequired: false,

            code:
              "TRUSTED_SESSION_CREATION_FAILED",

            message:
              "Authentication session तयार करता आली नाही."

          };

        }


        // =================================================
        // Trusted login success
        // =================================================

        return {

          success: true,

          registered: true,

          authenticated: true,

          trusted: true,

          otpRequired: false,

          state:
            "SESSION_ACTIVE",

          code:
            "TRUSTED_AUTH_LOGIN",

          authenticationMethod:
            "TRUSTED_AUTH",

          sessionId:
            sessionResult.sessionId,

          expiresAt:
            sessionResult.expiresAt,

          expiresIn:
            sessionResult.expiresIn,

          user:
            sessionResult.user

        };

      }

    }


    // =================================================
    // 7. NORMAL OTP FLOW
    // =================================================
    //
    // IMPORTANT:
    //
    // Pass the already verified USER object.
    //
    // Do NOT call:
    //
    // createAuthOTPRequest(cleanMobile)
    //
    // because we already have the verified identity.
    // =================================================

    const request =
      createAuthOTPRequest(
        user
      );


    if (
      !request ||
      request.success !== true ||
      !request.requestId
    ) {

      return {

        success: false,

        registered: true,

        authenticated: false,

        trusted: false,

        otpRequired: false,

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
    // 8. Generate OTP
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

        authenticated: false,

        trusted: false,

        otpRequired: false,

        code:
          "OTP_GENERATION_FAILED",

        requestId:
          request.requestId,

        message:
          "OTP तयार करता आला नाही."

      };

    }


    // =================================================
    // 9. Send OTP through 2Factor
    // =================================================
    //
    // Production flow.
    //
    // OTP itself is NEVER returned to frontend.
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

        authenticated: false,

        trusted: false,

        otpRequired: false,

        code:
          "OTP_DELIVERY_FAILED",

        requestId:
          request.requestId,

        message:
          "OTP पाठवता आला नाही. कृपया पुन्हा प्रयत्न करा."

      };

    }


    // =================================================
    // 10. OTP PENDING response
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
        "OTP_REQUIRED",

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

      registered: false,

      authenticated: false,

      trusted: false,

      otpRequired: false,

      code:
        "LOGIN_OTP_EXCEPTION",

      message:
        "OTP request करताना समस्या आली."

    };

  }

}


// =====================================================
// SEC-04.2.2
// VERIFY LOGIN OTP
// =====================================================

function verifyLoginOTP(
  requestId,
  otp
) {

   console.log(
    "🔥 verifyLoginOTP CALLED",
    requestId
  );

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
    // 2. Validate OTP format
    // ---------------------------------------------------

    const cleanOTP =
      String(
        otp || ""
      ).trim();


    if (
      !/^\d{6}$/.test(
        cleanOTP
      )
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
    // 3. Verify OTP
    // ---------------------------------------------------

    const verification =
      verifyAuthOTP(
        requestId,
        cleanOTP
      );


    if (
      !verification ||
      verification.success !== true ||
      verification.verified !== true
    ) {

      return {

        success: false,

        verified: false,

        code:
          verification &&
          verification.code
            ? verification.code
            : "OTP_VERIFICATION_FAILED",

        message:
          verification &&
          verification.message
            ? verification.message
            : "OTP verification failed."

      };

    }


    // ---------------------------------------------------
    // 4. Create authenticated session
    // ---------------------------------------------------

    const session =
      createAuthSession(
        requestId
      );


      console.log(
        "CREATE AUTH SESSION RESULT:",
        JSON.stringify(
          session
        )
      );


      console.log(
        "SESSION RESULT:",
        JSON.stringify(
          session
        )
      );


    if (
      !session ||
      session.success !== true ||
      !session.sessionId
    ) {

      return {

        success: false,

        verified: true,

        code:
          "SESSION_CREATION_FAILED",

        message:
          "Session तयार करता आली नाही."

      };

    }

      console.log(
        "SESSION USER IDENTITY CHECK:",
        JSON.stringify({
          userExists:
            !!(
              session &&
              session.user
            ),

          mobile:
            !!(
              session &&
              session.user &&
              session.user.mobile
            ),

          profileId:
            !!(
              session &&
              session.user &&
              session.user.profileId
            ),

          profileType:
            !!(
              session &&
              session.user &&
              session.user.profileType
            ),

          name:
            !!(
              session &&
              session.user &&
              session.user.name
            )
        })
      );


    // ---------------------------------------------------
    // 5. Validate session user
    // ---------------------------------------------------

    if (
      !session.user ||
      !session.user.mobile ||
      !session.user.profileId
    ) {

      console.error(
        "INVALID SESSION USER:",
        JSON.stringify(
          session.user
        )
      );

      return {

        success: false,

        verified: true,

        code:
          "INVALID_SESSION_USER",

        message:
          "Verified user identity उपलब्ध नाही."

      };

    }


    // ---------------------------------------------------
    // 6. Create Trusted Authentication
    // ---------------------------------------------------

    const trustedResult =
      createTrustedAuth(
        session.user
      );


    console.log(
      "TRUSTED AUTH RESULT:",
      JSON.stringify(
        trustedResult
      )
    );


    if (
      !trustedResult ||
      trustedResult.success !== true ||
      trustedResult.trusted !== true ||
      !trustedResult.trustedToken
    ) {

      return {

        success: false,

        verified: true,

        code:
          trustedResult &&
          trustedResult.code
            ? trustedResult.code
            : "TRUSTED_AUTH_CREATION_FAILED",

        message:
          "Trusted authentication तयार करता आली नाही."

      };

    }


    // ---------------------------------------------------
    // 7. SUCCESS
    // ---------------------------------------------------

    return {

      success: true,

      verified: true,

      authenticated: true,

      trusted: true,

      state:
        "SESSION_ACTIVE",

      sessionId:
        session.sessionId,

      expiresIn:
        session.expiresIn,

      trustedToken:
        trustedResult.trustedToken,

      trustedExpiresAt:
        trustedResult.expiresAt,

      user:
        session.user

    };

  }

  catch (error) {

    console.error(
      "verifyLoginOTP Error:",
      error
    );


    return {

      success: false,

      verified: false,

      code:
        "LOGIN_VERIFICATION_EXCEPTION",

      message:
        "OTP verification करताना समस्या आली."

    };

  }

}



// =====================================================
// SEC-04.2.3
// LOGOUT LOGIN SESSION
// =====================================================

function logoutLoginSession(
  sessionId
) {

  try {

    if (!sessionId) {

      return {

        success: false,

        authenticated: false,

        code:
          "INVALID_SESSION_ID"

      };

    }


    return logoutAuthSession(
      sessionId
    );

  }

  catch (error) {

    console.error(
      "logoutLoginSession Error:",
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


function testAuthAPILayer() {

  const mobile =
    "8975593689";


  Logger.log(
    "========== SEC-04.2 =========="
  );


  // ---------------------------------------------------
  // PART A — REQUEST OTP
  // ---------------------------------------------------

  const request =
    requestLoginOTP(
      mobile
    );


  Logger.log(
    "========== REQUEST OTP =========="
  );

  Logger.log(
    JSON.stringify(
      request,
      null,
      2
    )
  );


  if (
    !request ||
    request.success !== true ||
    !request.requestId ||
    request.otp
  ) {

    Logger.log(
      "❌ REQUEST LOGIN OTP FAILED"
    );

    return;

  }


  Logger.log(
    "✅ REQUEST LOGIN OTP PASS"
  );


  // ---------------------------------------------------
  // IMPORTANT
  //
  // For this test, retrieve the OTP ONLY from
  // server-side cache.
  //
  // Do NOT expose it through requestLoginOTP().
  // ---------------------------------------------------

  const cache =
    CacheService
      .getScriptCache();


  const otpCacheKey =
    AUTH_CONFIG.OTP_CACHE_PREFIX +
    request.requestId;


  const cached =
    cache.get(
      otpCacheKey
    );


  if (!cached) {

    Logger.log(
      "❌ SERVER OTP REQUEST NOT FOUND"
    );

    return;

  }


  const stored =
    JSON.parse(
      cached
    );


  const testOTP =
    stored.otp;


  // ---------------------------------------------------
  // PART B — VERIFY OTP
  // ---------------------------------------------------

  const verification =
    verifyLoginOTP(

      request.requestId,

      testOTP

    );


  Logger.log(
    "========== VERIFY OTP =========="
  );

  Logger.log(
    JSON.stringify(
      verification,
      null,
      2
    )
  );


  if (
    !verification ||
    verification.success !== true ||
    verification.verified !== true ||
    verification.state !==
      "SESSION_ACTIVE" ||
    !verification.sessionId
  ) {

    Logger.log(
      "❌ VERIFY LOGIN OTP FAILED"
    );

    return;

  }


  Logger.log(
    "✅ VERIFY LOGIN OTP PASS"
  );


  // ---------------------------------------------------
  // PART C — LOGOUT
  // ---------------------------------------------------

  const logout =
    logoutLoginSession(
      verification.sessionId
    );


  Logger.log(
    "========== LOGOUT =========="
  );

  Logger.log(
    JSON.stringify(
      logout,
      null,
      2
    )
  );


  if (
    !logout ||
    logout.success !== true
  ) {

    Logger.log(
      "❌ LOGOUT LOGIN SESSION FAILED"
    );

    return;

  }


  Logger.log(
    "✅ LOGOUT LOGIN SESSION PASS"
  );


  // ---------------------------------------------------
  // FINAL
  // ---------------------------------------------------

  Logger.log(
    "======================================"
  );

  Logger.log(
    "✅ SEC-04.2 PASS"
  );

  Logger.log(
    "======================================"

  );

}
