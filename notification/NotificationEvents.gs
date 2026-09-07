/**
 * ============================================================
 * NOTIFICATION MODULE
 * File: NotificationEvents.gs
 * Purpose: Notification event builders
 * ============================================================
 */


/**
 * Safely create a LIKE notification.
 *
 * Recipient = target profile owner
 * Actor     = user who liked
 * Target    = actor profile, so clicking notification
 *             can open the related profile.
 */
function createLikeNotification(data) {

  try {

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        skipped: true,
        message: 'Invalid LIKE notification data'
      };
    }

    const actorMobile =
      normalizeNotificationMobile(data.actorMobile);

    const recipientMobile =
      normalizeNotificationMobile(data.recipientMobile);

    if (!actorMobile || !recipientMobile) {
      return {
        success: false,
        skipped: true,
        message: 'Invalid actor or recipient mobile'
      };
    }

    /*
     * One logical LIKE event is tied to:
     * recipient + actor + target + LIKE
     *
     * The caller should invoke this only when the
     * reaction actually changes to LIKE.
     */
    const eventKey =
      'LIKE:' +
      actorMobile + ':' +
      recipientMobile + ':' +
      String(data.targetProfileType || '') + ':' +
      String(data.targetProfileId || '');

    return createNotification({

      recipientMobile: recipientMobile,
      recipientName: data.recipientName,
      recipientType: data.recipientType,
      recipientProfileId: data.recipientProfileId,

      actorMobile: actorMobile,
      actorName: data.actorName,
      actorType: data.actorType,
      actorProfileId: data.actorProfileId,

      eventType:
        NOTIFICATION_CONFIG.EVENT_TYPE.LIKE,

      referenceId:
        data.referenceId || eventKey,

      /*
       * Notification click target.
       * For LIKE, open actor's profile.
       */
      targetType:
        data.actorType,

      targetProfileId:
        data.actorProfileId,

      targetName:
        data.actorName,

      title:
        '❤️ ' +
        (data.actorName || 'Someone') +
        ' liked your profile',

      message:
        (data.actorName || 'Someone') +
        ' liked your profile.',

      source:
        NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION,

      eventKey:
        eventKey
    });

  } catch (error) {

    console.error(
      '[NotificationEvents] createLikeNotification failed:',
      error
    );

    return {
      success: false,
      skipped: true,
      message: 'LIKE notification failed'
    };
  }
}


/**
 * Safely create a DISLIKE notification.
 */
function createDislikeNotification(data) {

  try {

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        skipped: true,
        message: 'Invalid DISLIKE notification data'
      };
    }

    const actorMobile =
      normalizeNotificationMobile(data.actorMobile);

    const recipientMobile =
      normalizeNotificationMobile(data.recipientMobile);

    if (!actorMobile || !recipientMobile) {
      return {
        success: false,
        skipped: true,
        message: 'Invalid actor or recipient mobile'
      };
    }

    const eventKey =
      'DISLIKE:' +
      actorMobile + ':' +
      recipientMobile + ':' +
      String(data.targetProfileType || '') + ':' +
      String(data.targetProfileId || '');

    return createNotification({

      recipientMobile: recipientMobile,
      recipientName: data.recipientName,
      recipientType: data.recipientType,
      recipientProfileId: data.recipientProfileId,

      actorMobile: actorMobile,
      actorName: data.actorName,
      actorType: data.actorType,
      actorProfileId: data.actorProfileId,

      eventType:
        NOTIFICATION_CONFIG.EVENT_TYPE.DISLIKE,

      referenceId:
        data.referenceId || eventKey,

      /*
       * Notification click target.
       * For DISLIKE, open actor's profile.
       */
      targetType:
        data.actorType,

      targetProfileId:
        data.actorProfileId,

      targetName:
        data.actorName,

      title:
        '👎 ' +
        (data.actorName || 'Someone') +
        ' reacted to your profile',

      message:
        (data.actorName || 'Someone') +
        ' disliked your profile.',

      source:
        NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION,

      eventKey:
        eventKey
    });

  } catch (error) {

    console.error(
      '[NotificationEvents] createDislikeNotification failed:',
      error
    );

    return {
      success: false,
      skipped: true,
      message: 'DISLIKE notification failed'
    };
  }
}


/**
 * Create INTEREST_SENT notification.
 *
 * Recipient = receiver
 * Actor     = sender
 * Target    = sender
 */
function createInterestSentNotification(data) {

  try {

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        skipped: true,
        message: 'Invalid INTEREST_SENT data'
      };
    }

    const senderMobile =
      normalizeNotificationMobile(data.senderMobile);

    const receiverMobile =
      normalizeNotificationMobile(data.receiverMobile);

    const interestId =
      String(data.interestId || '').trim();

    if (
      !senderMobile ||
      !receiverMobile ||
      !interestId
    ) {
      return {
        success: false,
        skipped: true,
        message:
          'Invalid sender, receiver or interest ID'
      };
    }

    const eventKey =
      'INTEREST_SENT:' + interestId;

    return createNotification({

      recipientMobile: receiverMobile,
      recipientName: data.receiverName,
      recipientType: data.receiverType,
      recipientProfileId: data.receiverProfileId,

      actorMobile: senderMobile,
      actorName: data.senderName,
      actorType: data.senderType,
      actorProfileId: data.senderProfileId,

      eventType:
        NOTIFICATION_CONFIG.EVENT_TYPE.INTEREST_SENT,

      referenceId:
        interestId,

      targetType:
        data.senderType,

      targetProfileId:
        data.senderProfileId,

      targetName:
        data.senderName,

      title:
        '💌 New Interest',

      message:
        (data.senderName || 'Someone') +
        ' sent you an interest.',

      source:
        NOTIFICATION_CONFIG.SOURCE.PROFILE_INTEREST,

      eventKey:
        eventKey
    });

  } catch (error) {

    console.error(
      '[NotificationEvents] createInterestSentNotification failed:',
      error
    );

    return {
      success: false,
      skipped: true,
      message:
        'INTEREST_SENT notification failed'
    };
  }
}


/**
 * Create INTEREST_ACCEPTED / INTEREST_DECLINED notification.
 *
 * Recipient = original sender
 * Actor     = receiver who accepted/declined
 * Target    = receiver
 */
function createInterestResponseNotification(data) {

  try {

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        skipped: true,
        message:
          'Invalid interest response data'
      };
    }

    const senderMobile =
      normalizeNotificationMobile(data.senderMobile);

    const receiverMobile =
      normalizeNotificationMobile(data.receiverMobile);

    const interestId =
      String(data.interestId || '').trim();

    const status =
      String(data.status || '').trim().toUpperCase();

    if (
      !senderMobile ||
      !receiverMobile ||
      !interestId
    ) {
      return {
        success: false,
        skipped: true,
        message:
          'Invalid sender, receiver or interest ID'
      };
    }

    if (
      status !== 'ACCEPTED' &&
      status !== 'DECLINED'
    ) {
      return {
        success: false,
        skipped: true,
        message:
          'Invalid interest response status'
      };
    }

    const eventType =
      status === 'ACCEPTED'
        ? NOTIFICATION_CONFIG.EVENT_TYPE.INTEREST_ACCEPTED
        : NOTIFICATION_CONFIG.EVENT_TYPE.INTEREST_DECLINED;

    const eventKey =
      'INTEREST_' +
      status +
      ':' +
      interestId;

    const title =
      status === 'ACCEPTED'
        ? '✅ Interest Accepted'
        : '❌ Interest Declined';

    const message =
      status === 'ACCEPTED'
        ? (data.receiverName || 'Someone') +
          ' accepted your interest.'
        : (data.receiverName || 'Someone') +
          ' declined your interest.';

    return createNotification({

      recipientMobile: senderMobile,
      recipientName: data.senderName,
      recipientType: data.senderType,
      recipientProfileId: data.senderProfileId,

      actorMobile: receiverMobile,
      actorName: data.receiverName,
      actorType: data.receiverType,
      actorProfileId: data.receiverProfileId,

      eventType: eventType,

      referenceId:
        interestId,

      /*
       * Clicking ACCEPTED / DECLINED notification
       * opens the receiver's profile.
       */
      targetType:
        data.receiverType,

      targetProfileId:
        data.receiverProfileId,

      targetName:
        data.receiverName,

      title: title,
      message: message,

      source:
        NOTIFICATION_CONFIG.SOURCE.INTEREST_RESPONSE,

      eventKey:
        eventKey
    });

  } catch (error) {

    console.error(
      '[NotificationEvents] createInterestResponseNotification failed:',
      error
    );

    return {
      success: false,
      skipped: true,
      message:
        'Interest response notification failed'
    };
  }
}


/**
 * Create MUTUAL_MATCH notifications.
 *
 * Two notifications are created:
 *
 * User A → User B
 * User B → User A
 *
 * A deterministic logical match key is used so the same
 * mutual match does not generate duplicate notifications.
 */
function createMutualMatchNotifications(data) {

  try {

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        skipped: true,
        message:
          'Invalid mutual match data'
      };
    }

    const userAMobile =
      normalizeNotificationMobile(data.userAMobile);

    const userBMobile =
      normalizeNotificationMobile(data.userBMobile);

    if (
      !userAMobile ||
      !userBMobile ||
      userAMobile === userBMobile
    ) {
      return {
        success: false,
        skipped: true,
        message:
          'Invalid mutual match users'
      };
    }

    /*
     * Sort mobiles so A:B and B:A produce the same
     * logical match identity.
     */
    const sortedMobiles = [
      userAMobile,
      userBMobile
    ].sort();

    const logicalMatchKey =
      'MUTUAL_MATCH:' +
      sortedMobiles[0] +
      ':' +
      sortedMobiles[1];

    /*
     * Notification 1:
     * User A receives User B's match notification.
     */
    const notificationA =
      createNotification({

        recipientMobile:
          userAMobile,

        recipientName:
          data.userAName,

        recipientType:
          data.userAType,

        recipientProfileId:
          data.userAProfileId,

        actorMobile:
          userBMobile,

        actorName:
          data.userBName,

        actorType:
          data.userBType,

        actorProfileId:
          data.userBProfileId,

        eventType:
          NOTIFICATION_CONFIG.EVENT_TYPE.MUTUAL_MATCH,

        referenceId:
          logicalMatchKey,

        targetType:
          data.userBType,

        targetProfileId:
          data.userBProfileId,

        targetName:
          data.userBName,

        title:
          '🤝 New Mutual Match',

        message:
          'You and ' +
          (data.userBName || 'this user') +
          ' liked each other.',

        source:
          NOTIFICATION_CONFIG.SOURCE.MATCHING,

        eventKey:
          logicalMatchKey +
          ':RECIPIENT:' +
          userAMobile
      });


    /*
     * Notification 2:
     * User B receives User A's match notification.
     */
    const notificationB =
      createNotification({

        recipientMobile:
          userBMobile,

        recipientName:
          data.userBName,

        recipientType:
          data.userBType,

        recipientProfileId:
          data.userBProfileId,

        actorMobile:
          userAMobile,

        actorName:
          data.userAName,

        actorType:
          data.userAType,

        actorProfileId:
          data.userAProfileId,

        eventType:
          NOTIFICATION_CONFIG.EVENT_TYPE.MUTUAL_MATCH,

        referenceId:
          logicalMatchKey,

        targetType:
          data.userAType,

        targetProfileId:
          data.userAProfileId,

        targetName:
          data.userAName,

        title:
          '🤝 New Mutual Match',

        message:
          'You and ' +
          (data.userAName || 'this user') +
          ' liked each other.',

        source:
          NOTIFICATION_CONFIG.SOURCE.MATCHING,

        eventKey:
          logicalMatchKey +
          ':RECIPIENT:' +
          userBMobile
      });


    return {
      success:
        notificationA.success &&
        notificationB.success,

      notificationA:
        notificationA,

      notificationB:
        notificationB,

      logicalMatchKey:
        logicalMatchKey
    };

  } catch (error) {

    console.error(
      '[NotificationEvents] createMutualMatchNotifications failed:',
      error
    );

    return {
      success: false,
      skipped: true,
      message:
        'Mutual match notification failed'
    };
  }
}


/**
 * ============================================================
 * STEP 4 CONTROLLED TEST
 * ============================================================
 *
 * This test does NOT touch:
 * - Profile Reactions
 * - Profile Interests
 * - Matching
 * - User profiles
 *
 * It creates controlled notification events only.
 */
function testNotificationEvents() {

  const userA = {
    mobile: '9999999999',
    name: 'Test User A',
    type: 'test',
    profileId: 'TEST_A'
  };

  const userB = {
    mobile: '8888888888',
    name: 'Test User B',
    type: 'test',
    profileId: 'TEST_B'
  };

  console.log(
    '========== STEP 4 TEST START =========='
  );


  // ----------------------------------------------------------
  // 1. LIKE
  // ----------------------------------------------------------

  const likeResult =
    createLikeNotification({

      recipientMobile:
        userB.mobile,

      recipientName:
        userB.name,

      recipientType:
        userB.type,

      recipientProfileId:
        userB.profileId,

      actorMobile:
        userA.mobile,

      actorName:
        userA.name,

      actorType:
        userA.type,

      actorProfileId:
        userA.profileId,

      targetProfileType:
        userB.type,

      targetProfileId:
        userB.profileId,

      referenceId:
        'TEST_LIKE_001'
    });

  console.log(
    '1) LIKE:',
    JSON.stringify(likeResult)
  );


  // ----------------------------------------------------------
  // 2. DISLIKE
  // ----------------------------------------------------------

  const dislikeResult =
    createDislikeNotification({

      recipientMobile:
        userB.mobile,

      recipientName:
        userB.name,

      recipientType:
        userB.type,

      recipientProfileId:
        userB.profileId,

      actorMobile:
        userA.mobile,

      actorName:
        userA.name,

      actorType:
        userA.type,

      actorProfileId:
        userA.profileId,

      targetProfileType:
        userB.type,

      targetProfileId:
        userB.profileId,

      referenceId:
        'TEST_DISLIKE_001'
    });

  console.log(
    '2) DISLIKE:',
    JSON.stringify(dislikeResult)
  );


  // ----------------------------------------------------------
  // 3. INTEREST SENT
  // ----------------------------------------------------------

  const interestSentResult =
    createInterestSentNotification({

      senderMobile:
        userA.mobile,

      senderName:
        userA.name,

      senderType:
        userA.type,

      senderProfileId:
        userA.profileId,

      receiverMobile:
        userB.mobile,

      receiverName:
        userB.name,

      receiverType:
        userB.type,

      receiverProfileId:
        userB.profileId,

      interestId:
        'TEST_INTEREST_001'
    });

  console.log(
    '3) INTEREST_SENT:',
    JSON.stringify(interestSentResult)
  );


  // ----------------------------------------------------------
  // 4. INTEREST ACCEPTED
  // ----------------------------------------------------------

  const acceptedResult =
    createInterestResponseNotification({

      senderMobile:
        userA.mobile,

      senderName:
        userA.name,

      senderType:
        userA.type,

      senderProfileId:
        userA.profileId,

      receiverMobile:
        userB.mobile,

      receiverName:
        userB.name,

      receiverType:
        userB.type,

      receiverProfileId:
        userB.profileId,

      interestId:
        'TEST_INTEREST_ACCEPT_001',

      status:
        'ACCEPTED'
    });

  console.log(
    '4) INTEREST_ACCEPTED:',
    JSON.stringify(acceptedResult)
  );


  // ----------------------------------------------------------
  // 5. INTEREST DECLINED
  // ----------------------------------------------------------

  const declinedResult =
    createInterestResponseNotification({

      senderMobile:
        userA.mobile,

      senderName:
        userA.name,

      senderType:
        userA.type,

      senderProfileId:
        userA.profileId,

      receiverMobile:
        userB.mobile,

      receiverName:
        userB.name,

      receiverType:
        userB.type,

      receiverProfileId:
        userB.profileId,

      interestId:
        'TEST_INTEREST_DECLINE_001',

      status:
        'DECLINED'
    });

  console.log(
    '5) INTEREST_DECLINED:',
    JSON.stringify(declinedResult)
  );


  // ----------------------------------------------------------
  // 6. MUTUAL MATCH
  // ----------------------------------------------------------

  const mutualResult =
    createMutualMatchNotifications({

      userAMobile:
        userA.mobile,

      userAName:
        userA.name,

      userAType:
        userA.type,

      userAProfileId:
        userA.profileId,

      userBMobile:
        userB.mobile,

      userBName:
        userB.name,

      userBType:
        userB.type,

      userBProfileId:
        userB.profileId
    });

  console.log(
    '6) MUTUAL_MATCH:',
    JSON.stringify(mutualResult)
  );


  /*
   * Basic PASS check.
   */
  const pass =
    likeResult.success &&
    dislikeResult.success &&
    interestSentResult.success &&
    acceptedResult.success &&
    declinedResult.success &&
    mutualResult.success;


  console.log(
    '========== STEP 4 TEST RESULT ==========',
    pass ? 'PASS' : 'FAIL'
  );


  return {

    success: pass,

    step:
      'STEP_4_NOTIFICATION_EVENTS',

    like:
      likeResult,

    dislike:
      dislikeResult,

    interestSent:
      interestSentResult,

    interestAccepted:
      acceptedResult,

    interestDeclined:
      declinedResult,

    mutualMatch:
      mutualResult
  };
}