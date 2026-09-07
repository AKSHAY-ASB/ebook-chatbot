/**
 * NotificationInterestIntegration.gs
 *
 * Additive notification integration for Profile Interest.
 * Does NOT modify existing sendProfileInterest().
 *
 * IMPORTANT:
 * Notification failure must never break the original Interest action.
 */

/**
 * Creates notification after a successful INTEREST_SENT action.
 *
 * Expected data:
 * {
 *   senderMobile,
 *   senderName,
 *   senderType,
 *   senderProfileId,
 *
 *   receiverMobile,
 *   receiverName,
 *   receiverType,
 *   receiverProfileId
 * }
 */
function notifyAfterInterestSent(data) {
  try {
    data = data || {};

    var senderMobile = normalizeNotificationMobile(data.senderMobile);
    var receiverMobile = normalizeNotificationMobile(data.receiverMobile);

    if (!senderMobile || !receiverMobile) {
      return {
        success: false,
        skipped: true,
        reason: "INVALID_MOBILE"
      };
    }

    // Never notify a user about their own action.
    if (senderMobile === receiverMobile) {
      return {
        success: false,
        skipped: true,
        reason: "SELF_NOTIFICATION"
      };
    }

    var senderName = String(data.senderName || "Someone").trim();
    var receiverName = String(data.receiverName || "").trim();

    var senderType = String(data.senderType || "").trim().toUpperCase();
    var senderProfileId = String(data.senderProfileId || "").trim();

    var receiverType = String(data.receiverType || "").trim().toUpperCase();
    var receiverProfileId = String(data.receiverProfileId || "").trim();

    if (!receiverType || !receiverProfileId) {
      return {
        success: false,
        skipped: true,
        reason: "INVALID_RECEIVER_PROFILE"
      };
    }

    /**
     * Unique event key.
     *
     * We include the actual Interest relationship identifiers
     * so duplicate notification protection remains tied to this action.
     */
    var eventKey =
      "INTEREST_SENT_" +
      senderMobile + "_" +
      receiverMobile + "_" +
      receiverType + "_" +
      receiverProfileId + "_" +
      Date.now();

    var result = createNotification({
      recipientMobile: receiverMobile,
      recipientName: receiverName,

      recipientType: receiverType,
      recipientProfileId: receiverProfileId,

      actorMobile: senderMobile,
      actorName: senderName,
      actorType: senderType,
      actorProfileId: senderProfileId,

      targetType: senderType,
      targetProfileId: senderProfileId,

      eventType: NOTIFICATION_CONFIG.EVENT_TYPE.INTEREST_SENT,
      eventKey: eventKey,

      title: "💌 New Interest",
      message: senderName + " यांनी तुम्हाला Interest पाठवले आहे.",

      source: NOTIFICATION_CONFIG.SOURCE.PROFILE_INTEREST
    });

    return {
      success: true,
      notificationCreated: true,
      result: result
    };

  } catch (error) {

    // CRITICAL:
    // Notification failure must NEVER break Interest sending.
    console.error(
      "[NotificationInterestIntegration] INTEREST_SENT failed:",
      error
    );

    return {
      success: false,
      notificationCreated: false,
      error: String(error && error.message ? error.message : error)
    };
  }
}


/**
 * Standalone backend test.
 *
 * Uses test mobile numbers ONLY for testing.
 * This function does NOT affect the real Interest flow.
 */
function testNotificationInterestIntegration() {

  var testData = {
    senderMobile: "9999999999",
    senderName: "Test Sender",
    senderType: "BRIDE",
    senderProfileId: "TEST_SENDER_001",

    receiverMobile: "8888888888",
    receiverName: "Test Receiver",
    receiverType: "GROOM",
    receiverProfileId: "TEST_RECEIVER_001"
  };

  var result = notifyAfterInterestSent(testData);

  console.log(
    "[NotificationInterestIntegration] TEST RESULT:",
    JSON.stringify(result)
  );

  return result;
}