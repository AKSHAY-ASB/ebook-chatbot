/**
 * ============================================================
 * NotificationMutualMatchIntegration.gs
 * ============================================================
 *
 * Purpose:
 * Create MUTUAL_MATCH notifications for both users
 *
 * Architecture:
 * - Does NOT modify getRelationshipStatus()
 * - Does NOT modify existing reaction logic
 * - Notification failure NEVER throws to caller
 * - Both users receive a notification
 * ============================================================
 */


/**
 * ============================================================
 * CREATE MUTUAL MATCH NOTIFICATIONS
 * ============================================================
 *
 * User A liked User B
 * User B liked User A
 *
 * Therefore:
 * - User A receives notification about User B
 * - User B receives notification about User A
 */
function notifyAfterMutualMatch(data) {

  try {

    // ==========================================
    // 1. VALIDATE INPUT OBJECT
    // ==========================================

    data = data || {};


    // ==========================================
    // 2. USER A / ACTOR DATA
    // ==========================================

    const userAMobile =
      normalizeNotificationMobile(
        data.userAMobile ||
        data.actorMobile
      );

    const userAName =
      String(
        data.userAName ||
        data.actorName ||
        ""
      ).trim();

    const userAType =
      String(
        data.userAType ||
        data.actorType ||
        ""
      ).trim().toLowerCase();

    const userAProfileId =
      String(
        data.userAProfileId ||
        data.actorProfileId ||
        ""
      ).trim();


    // ==========================================
    // 3. USER B DATA
    // ==========================================

    const userBMobile =
      normalizeNotificationMobile(
        data.userBMobile ||
        data.recipientMobile
      );

    const userBName =
      String(
        data.userBName ||
        data.recipientName ||
        ""
      ).trim();

    const userBType =
      String(
        data.userBType ||
        data.recipientType ||
        ""
      ).trim().toLowerCase();

    const userBProfileId =
      String(
        data.userBProfileId ||
        data.recipientProfileId ||
        ""
      ).trim();


    // ==========================================
    // 4. VALIDATION
    // ==========================================

    if (
      !userAMobile ||
      !userBMobile
    ) {

      console.warn(
        "[Notification] Mutual Match: mobile missing."
      );

      return {
        success: false,
        code: "MUTUAL_MATCH_MOBILE_MISSING"
      };

    }


    if (
      userAMobile ===
      userBMobile
    ) {

      console.warn(
        "[Notification] Mutual Match: self match skipped."
      );

      return {
        success: true,
        skipped: true,
        reason: "SELF_MATCH"
      };

    }


    if (
      !userAProfileId ||
      !userBProfileId
    ) {

      console.warn(
        "[Notification] Mutual Match: profile ID missing."
      );

      return {
        success: false,
        code: "MUTUAL_MATCH_PROFILE_ID_MISSING"
      };

    }


    // ==========================================
    // 5. CONFIG
    // ==========================================

    const eventType =
      (
        NOTIFICATION_CONFIG &&
        NOTIFICATION_CONFIG.EVENT_TYPE &&
        NOTIFICATION_CONFIG.EVENT_TYPE.MUTUAL_MATCH
      )
      ||
      "MUTUAL_MATCH";


    const source =
      (
        NOTIFICATION_CONFIG &&
        NOTIFICATION_CONFIG.SOURCE &&
        NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION
      )
      ||
      "PROFILE_REACTION";


    // ==========================================
    // 6. CREATE NOTIFICATION FOR USER A
    //
    // Recipient = User A
    // Target = User B
    // ==========================================

    let userANotificationResult;

    try {

      userANotificationResult =
        createNotification({

          recipientMobile:
            userAMobile,

          recipientName:
            userAName,

          recipientType:
            userAType,

          recipientProfileId:
            userAProfileId,

          actorMobile:
            userBMobile,

          actorName:
            userBName,

          actorType:
            userBType,

          actorProfileId:
            userBProfileId,

          eventType:
            eventType,

          title:
            "🤝 Mutual Match",

          message:
            userBName +
            " यांनी तुमच्यासोबत Mutual Match केला आहे.",

          targetType:
            userBType,

          targetProfileId:
            userBProfileId,

          source:
            source,

          eventKey:
            "MUTUAL_MATCH_" +
            userAMobile +
            "_" +
            userBMobile +
            "_" +
            Date.now()

        });

    }
    catch (userAError) {

      console.error(
        "[Notification] Mutual Match User A notification failed:",
        userAError
      );

      userANotificationResult = {
        success: false,
        error:
          userAError.message
      };

    }


    // ==========================================
    // 7. CREATE NOTIFICATION FOR USER B
    //
    // Recipient = User B
    // Target = User A
    // ==========================================

    let userBNotificationResult;

    try {

      userBNotificationResult =
        createNotification({

          recipientMobile:
            userBMobile,

          recipientName:
            userBName,

          recipientType:
            userBType,

          recipientProfileId:
            userBProfileId,

          actorMobile:
            userAMobile,

          actorName:
            userAName,

          actorType:
            userAType,

          actorProfileId:
            userAProfileId,

          eventType:
            eventType,

          title:
            "🤝 Mutual Match",

          message:
            userAName +
            " यांनी तुमच्यासोबत Mutual Match केला आहे.",

          targetType:
            userAType,

          targetProfileId:
            userAProfileId,

          source:
            source,

          eventKey:
            "MUTUAL_MATCH_" +
            userBMobile +
            "_" +
            userAMobile +
            "_" +
            Date.now()

        });

    }
    catch (userBError) {

      console.error(
        "[Notification] Mutual Match User B notification failed:",
        userBError
      );

      userBNotificationResult = {
        success: false,
        error:
          userBError.message
      };

    }


    // ==========================================
    // 8. FINAL RESULT
    // ==========================================

    return {

      success:
        !!(
          userANotificationResult &&
          userANotificationResult.success
        ) ||
        !!(
          userBNotificationResult &&
          userBNotificationResult.success
        ),

      userA:
        userANotificationResult,

      userB:
        userBNotificationResult

    };

  }
  catch (error) {

    // ==========================================
    // CRITICAL ARCHITECTURE RULE:
    //
    // NEVER THROW NOTIFICATION ERROR
    // ==========================================

    console.error(
      "[Notification] Mutual Match integration error:",
      error
    );

    return {

      success: false,

      code:
        "MUTUAL_MATCH_NOTIFICATION_ERROR",

      error:
        error.message

    };

  }

}


/**
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 *
 * Test users:
 *
 * User A:
 * 9307375984
 *
 * User B:
 * 9876543210
 */
function testNotificationMutualMatchIntegration() {

  const result =
    notifyAfterMutualMatch({

      userAMobile:
        "9307375984",

      userAName:
        "Test User A",

      userAType:
        "GROOM",

      userAProfileId:
        "GROOM_MUTUAL_TEST_A",

      userBMobile:
        "9876543210",

      userBName:
        "Test User B",

      userBType:
        "BRIDE",

      userBProfileId:
        "BRIDE_MUTUAL_TEST_B"

    });


  console.log(
    "[TEST] MUTUAL_MATCH notification:",
    result
  );


  return result;

}