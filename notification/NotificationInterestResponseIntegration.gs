/**
 * NotificationInterestResponseIntegration.gs
 *
 * Interest ACCEPTED / DECLINED notification integration.
 *
 * IMPORTANT:
 * Notification failure must NEVER break the original
 * Interest Accept / Decline operation.
 */


/**
 * Creates notification for the user who originally
 * SENT the interest.
 *
 * ACCEPTED:
 *   Receiver accepted Sender's interest
 *
 * DECLINED:
 *   Receiver declined Sender's interest
 *
 * @param {Object} data
 * @return {Object}
 */
function notifyAfterInterestResponse(data) {

  try {

    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!data || typeof data !== 'object') {

      return {
        success: false,
        code: 'INVALID_DATA',
        message: 'Interest response notification data is required.'
      };

    }


    // ==========================================
    // NORMALIZE STATUS
    // ==========================================

    const responseStatus =
      String(
        data.responseStatus ||
        data.newStatus ||
        data.status ||
        ''
      )
      .trim()
      .toUpperCase();


    // ==========================================
    // ONLY ACCEPTED / DECLINED
    // ==========================================

    if (
      responseStatus !== 'ACCEPTED' &&
      responseStatus !== 'DECLINED'
    ) {

      return {
        success: true,
        code: 'INTEREST_RESPONSE_NOT_SUPPORTED',
        responseStatus: responseStatus
      };

    }


    // ==========================================
    // SENDER = PERSON WHO SENT INTEREST
    //
    // THIS USER RECEIVES THE NOTIFICATION
    // ==========================================

    const senderMobile =
      normalizeNotificationMobile(
        data.senderMobile
      );

    const receiverMobile =
      normalizeNotificationMobile(
        data.receiverMobile
      );


    if (
      !senderMobile ||
      !receiverMobile
    ) {

      return {
        success: false,
        code: 'INVALID_MOBILE'
      };

    }


    // ==========================================
    // PREVENT SELF NOTIFICATION
    // ==========================================

    if (
      senderMobile === receiverMobile
    ) {

      return {
        success: true,
        code: 'SELF_NOTIFICATION_SKIPPED'
      };

    }


    // ==========================================
    // SENDER PROFILE
    //
    // Sender is the RECIPIENT of notification
    // ==========================================

    const senderName =
      String(
        data.senderName || ''
      ).trim();

    const senderType =
      String(
        data.senderType || ''
      ).trim();

    const senderProfileId =
      String(
        data.senderProfileId || ''
      ).trim();


    // ==========================================
    // RECEIVER PROFILE
    //
    // Receiver is the ACTOR who responded
    // ==========================================

    const receiverName =
      String(
        data.receiverName || ''
      ).trim();

    const receiverType =
      String(
        data.receiverType || ''
      ).trim();

    const receiverProfileId =
      String(
        data.receiverProfileId || ''
      ).trim();


    if (
      !senderType ||
      !senderProfileId
    ) {

      return {
        success: false,
        code: 'INVALID_SENDER_PROFILE'
      };

    }


    if (
      !receiverType ||
      !receiverProfileId
    ) {

      return {
        success: false,
        code: 'INVALID_RECEIVER_PROFILE'
      };

    }


    // ==========================================
    // EVENT CONFIG
    // ==========================================

    let eventType;
    let title;
    let message;


    if (
      responseStatus === 'ACCEPTED'
    ) {

      eventType =
        NOTIFICATION_CONFIG.EVENT_TYPE.INTEREST_ACCEPTED;

      title =
        '✅ Interest Accepted';

      message =
        (
          receiverName ||
          'User'
        ) +
        ' यांनी तुमचा Profile Interest Accept केला आहे.';

    }
    else {

      eventType =
        NOTIFICATION_CONFIG.EVENT_TYPE.INTEREST_DECLINED;

      title =
        '❌ Interest Declined';

      message =
        (
          receiverName ||
          'User'
        ) +
        ' यांनी तुमचा Profile Interest Decline केला आहे.';

    }


    // ==========================================
    // CREATE UNIQUE EVENT KEY
    // ==========================================

    const eventKey =
      'INTEREST_' +
      responseStatus +
      '_' +
      receiverMobile +
      '_' +
      senderMobile +
      '_' +
      receiverType +
      '_' +
      receiverProfileId +
      '_' +
      Date.now();


    // ==========================================
    // NOTIFICATION DATA
    // ==========================================

    const notificationData = {

      // ----------------------------------------
      // USER WHO RECEIVES NOTIFICATION
      // ----------------------------------------

      recipientMobile:
        senderMobile,

      recipientName:
        senderName,

      recipientType:
        senderType,

      recipientProfileId:
        senderProfileId,


      // ----------------------------------------
      // USER WHO RESPONDED
      // ----------------------------------------

      actorMobile:
        receiverMobile,

      actorName:
        receiverName,

      actorType:
        receiverType,

      actorProfileId:
        receiverProfileId,


      // ----------------------------------------
      // CLICK TARGET
      //
      // Open the responder's profile
      // ----------------------------------------

      targetType:
        receiverType,

      targetProfileId:
        receiverProfileId,


      // ----------------------------------------
      // EVENT
      // ----------------------------------------

      eventType:
        eventType,

      eventKey:
        eventKey,


      // ----------------------------------------
      // DISPLAY
      // ----------------------------------------

      title:
        title,

      message:
        message,


      // ----------------------------------------
      // SOURCE
      // ----------------------------------------

      source:
        NOTIFICATION_CONFIG.SOURCE.PROFILE_INTEREST

    };


    // ==========================================
    // CREATE NOTIFICATION
    // ==========================================

    const result =
      createNotification(
        notificationData
      );


    console.log(
      '[Notification] Interest response notification created:',
      result
    );


    return result;


  } catch (error) {

    // ==========================================
    // CRITICAL SAFETY RULE
    //
    // NEVER THROW NOTIFICATION ERROR
    // INTO ORIGINAL INTEREST FLOW
    // ==========================================

    console.error(
      '[Notification] Interest response integration failed:',
      error
    );


    return {

      success:
        false,

      code:
        'NOTIFICATION_ERROR',

      message:
        error &&
        error.message
          ? error.message
          : String(error)

    };

  }

}


/**
 * ==========================================================
 * STANDALONE BACKEND TEST
 * ==========================================================
 *
 * IMPORTANT:
 * Replace the test values with REAL profile data
 * before production integration.
 */


/**
 * Test ACCEPTED notification
 */
function testInterestAcceptedNotification() {

  const testData = {

    // USER WHO ORIGINALLY SENT INTEREST
    senderMobile:
      '9307375984',

    senderName:
      'Test Sender',

    senderType:
      'BRIDE',

    senderProfileId:
      'TEST_SENDER_ID',


    // USER WHO ACCEPTED
    receiverMobile:
      '9876543210',

    receiverName:
      'Test Receiver',

    receiverType:
      'GROOM',

    receiverProfileId:
      'TEST_RECEIVER_ID',


    responseStatus:
      'ACCEPTED'

  };


  const result =
    notifyAfterInterestResponse(
      testData
    );


  console.log(
    '[TEST] INTEREST_ACCEPTED:',
    result
  );


  return result;

}


/**
 * Test DECLINED notification
 */
function testInterestDeclinedNotification() {

  const testData = {

    // USER WHO ORIGINALLY SENT INTEREST
    senderMobile:
      '9307375984',

    senderName:
      'Test Sender',

    senderType:
      'BRIDE',

    senderProfileId:
      'TEST_SENDER_ID',


    // USER WHO DECLINED
    receiverMobile:
      '9876543210',

    receiverName:
      'Test Receiver',

    receiverType:
      'GROOM',

    receiverProfileId:
      'TEST_RECEIVER_ID',


    responseStatus:
      'DECLINED'

  };


  const result =
    notifyAfterInterestResponse(
      testData
    );


  console.log(
    '[TEST] INTEREST_DECLINED:',
    result
  );


  return result;

}