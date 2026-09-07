/**
 * ==========================================================
 * NOTIFICATION DISLIKE INTEGRATION
 * File: NotificationDislikeIntegration.gs
 *
 * Purpose:
 * Create DISLIKE notification after a profile reaction.
 *
 * IMPORTANT:
 * - Existing reaction logic is NOT modified here.
 * - Notification failure MUST NEVER throw.
 * - Notification is sent to the profile owner.
 * - Actor is the user who performed DISLIKE.
 * ==========================================================
 */


/**
 * ==========================================================
 * CREATE DISLIKE NOTIFICATION
 * ==========================================================
 *
 * data = {
 *   actorMobile,
 *   actorName,
 *   actorType,
 *   actorProfileId,
 *
 *   recipientMobile,
 *   recipientName,
 *   recipientType,
 *   recipientProfileId
 * }
 *
 * Returns:
 * {
 *   success: true/false,
 *   duplicate: true/false,
 *   notificationId: "...",
 *   error: "..."
 * }
 */
function notifyAfterProfileDislike(data) {

  try {

    // ==========================================
    // 1. SAFE INPUT
    // ==========================================

    data = data || {};


    // ==========================================
    // 2. NORMALIZE MOBILE NUMBERS
    // ==========================================

    const actorMobile =
      typeof normalizeNotificationMobile === "function"
        ? normalizeNotificationMobile(
            data.actorMobile
          )
        : String(
            data.actorMobile || ""
          ).trim();


    const recipientMobile =
      typeof normalizeNotificationMobile === "function"
        ? normalizeNotificationMobile(
            data.recipientMobile
          )
        : String(
            data.recipientMobile || ""
          ).trim();


    // ==========================================
    // 3. VALIDATION
    // ==========================================

    if (!actorMobile) {

      return {
        success: false,
        code: "INVALID_ACTOR_MOBILE"
      };

    }


    if (!recipientMobile) {

      return {
        success: false,
        code: "INVALID_RECIPIENT_MOBILE"
      };

    }


    // ==========================================
    // 4. SELF NOTIFICATION PROTECTION
    // ==========================================

    if (
      actorMobile === recipientMobile
    ) {

      console.warn(
        "[Notification] DISLIKE self-notification skipped."
      );

      return {
        success: true,
        skipped: true,
        code: "SELF_NOTIFICATION_SKIPPED"
      };

    }


    // ==========================================
    // 5. EVENT TYPE
    // ==========================================

    const eventType =
      NOTIFICATION_CONFIG &&
      NOTIFICATION_CONFIG.EVENT_TYPE &&
      NOTIFICATION_CONFIG.EVENT_TYPE.DISLIKE
        ? NOTIFICATION_CONFIG.EVENT_TYPE.DISLIKE
        : "DISLIKE";


    // ==========================================
    // 6. TARGET PROFILE
    //
    // When recipient opens notification,
    // they should see the actor's profile.
    // ==========================================

    const targetType =
      String(
        data.actorType || ""
      ).trim();


    const targetProfileId =
      String(
        data.actorProfileId || ""
      ).trim();


    // ==========================================
    // 7. EVENT KEY
    // ==========================================

    const eventKey =
      "DISLIKE_" +
      actorMobile +
      "_" +
      recipientMobile +
      "_" +
      Date.now();


    // ==========================================
    // 8. NOTIFICATION TITLE
    // ==========================================

    const title =
      "👎 Profile Disliked";


    // ==========================================
    // 9. NOTIFICATION MESSAGE
    // ==========================================

    const actorName =
      String(
        data.actorName || "एका व्यक्तीने"
      ).trim();


    const message =
      actorName +
      " यांनी तुमचे Profile Dislike केले आहे.";


    // ==========================================
    // 10. SOURCE
    // ==========================================

    const source =
      NOTIFICATION_CONFIG &&
      NOTIFICATION_CONFIG.SOURCE &&
      NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION
        ? NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION
        : "PROFILE_REACTION";


    // ==========================================
    // 11. CREATE NOTIFICATION
    // ==========================================

    if (
      typeof createNotification !==
      "function"
    ) {

      console.warn(
        "[Notification] createNotification() not found."
      );

      return {
        success: false,
        code: "CREATE_NOTIFICATION_FUNCTION_NOT_FOUND"
      };

    }


    const result =
      createNotification({

        recipientMobile:
          recipientMobile,

        recipientName:
          String(
            data.recipientName || ""
          ).trim(),

        actorMobile:
          actorMobile,

        actorName:
          actorName,

        actorType:
          String(
            data.actorType || ""
          ).trim(),

        actorProfileId:
          String(
            data.actorProfileId || ""
          ).trim(),

        eventType:
          eventType,

        eventKey:
          eventKey,

        title:
          title,

        message:
          message,

        targetType:
          targetType,

        targetProfileId:
          targetProfileId,

        source:
          source

      });


    console.log(
      "[Notification] DISLIKE notification result:",
      result
    );


    // ==========================================
    // 12. SAFE RETURN
    // ==========================================

    return (
      result || {
        success: false,
        code: "EMPTY_NOTIFICATION_RESULT"
      }
    );

  }
  catch (error) {

    // ==========================================
    // CRITICAL:
    // NEVER BREAK ORIGINAL DISLIKE ACTION
    // ==========================================

    console.error(
      "[Notification] DISLIKE notification failed:",
      error
    );


    return {
      success: false,
      code: "DISLIKE_NOTIFICATION_FAILED",
      error: String(
        error && error.message
          ? error.message
          : error
      )
    };

  }

}


/**
 * ==========================================================
 * TEST — DISLIKE NOTIFICATION
 * ==========================================================
 *
 * Run this function from Apps Script editor.
 *
 * IMPORTANT:
 * This is ONLY a notification integration test.
 * It does NOT modify saveProfileReaction().
 * ==========================================================
 */
function testNotificationDislikeIntegration() {

  const result =
    notifyAfterProfileDislike({

      // --------------------------------------
      // ACTOR
      // User who clicked DISLIKE
      // --------------------------------------

      actorMobile:
        "9307375984",

      actorName:
        "Test Actor",

      actorType:
        "GROOM",

      actorProfileId:
        "GROOM_TEST_ACTOR_ID",


      // --------------------------------------
      // RECIPIENT
      // Owner of the disliked profile
      // --------------------------------------

      recipientMobile:
        "9876543210",

      recipientName:
        "Test Recipient",

      recipientType:
        "BRIDE",

      recipientProfileId:
        "BRIDE_TEST_RECIPIENT_ID"

    });


  console.log(
    "[TEST] DISLIKE notification:",
    result
  );


  return result;
}