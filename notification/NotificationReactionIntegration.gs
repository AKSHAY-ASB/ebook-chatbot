/**
 * NotificationReactionIntegration.gs
 *
 * Additive notification integration for Profile Reactions.
 * Notification failure MUST NEVER break the original reaction action.
 */

/**
 * Creates a notification after a successful profile reaction.
 *
 * Supported at this checkpoint:
 *   ❤️ LIKE
 *
 * @param {Object} data
 * @return {Object}
 */
function notifyAfterProfileReaction(data) {
  try {
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        code: 'INVALID_DATA',
        message: 'Reaction notification data is required.'
      };
    }

    const reaction = String(data.reaction || '').trim().toUpperCase();

    // Current checkpoint: LIKE only.
    if (reaction !== 'LIKE') {
      return {
        success: true,
        code: 'REACTION_NOT_SUPPORTED_YET',
        reaction: reaction
      };
    }

    const actorMobile = normalizeNotificationMobile(data.actorMobile);
    const recipientMobile = normalizeNotificationMobile(data.recipientMobile);

    if (!actorMobile || !recipientMobile) {
      return {
        success: false,
        code: 'INVALID_MOBILE'
      };
    }

    // Do not notify when a user reacts to their own profile.
    if (actorMobile === recipientMobile) {
      return {
        success: true,
        code: 'SELF_NOTIFICATION_SKIPPED'
      };
    }

    const actorName = String(data.actorName || '').trim();
    const actorType = String(data.actorType || '').trim();
    const actorProfileId = String(data.actorProfileId || '').trim();

    const recipientName = String(data.recipientName || '').trim();
    const recipientType = String(data.recipientType || '').trim();
    const recipientProfileId = String(data.recipientProfileId || '').trim();

    if (!recipientType || !recipientProfileId) {
      return {
        success: false,
        code: 'INVALID_RECIPIENT_PROFILE'
      };
    }

    if (!actorType || !actorProfileId) {
      return {
        success: false,
        code: 'INVALID_ACTOR_PROFILE'
      };
    }

    const notificationData = {
      recipientMobile: recipientMobile,
      recipientName: recipientName,
      recipientType: recipientType,
      recipientProfileId: recipientProfileId,

      actorMobile: actorMobile,
      actorName: actorName,
      actorType: actorType,
      actorProfileId: actorProfileId,

      targetType: actorType,
      targetProfileId: actorProfileId,

      eventType: NOTIFICATION_CONFIG.EVENT_TYPE.LIKE,

      eventKey:
        'LIKE_' +
        actorMobile + '_' +
        recipientType + '_' +
        recipientProfileId + '_' +
        Date.now(),

      title: '❤️ New Like',

      message:
        (actorName || 'Someone') +
        ' यांनी तुमचे Profile Like केले आहे.',

      source: NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION
    };

    const result = createNotification(notificationData);

    console.log(
      '[Notification] LIKE notification created:',
      result
    );

    return result;

  } catch (error) {

    // CRITICAL:
    // Notification failure must NEVER break the original reaction.
    console.error(
      '[Notification] LIKE integration failed:',
      error
    );

    return {
      success: false,
      code: 'NOTIFICATION_ERROR',
      message: error && error.message
        ? error.message
        : String(error)
    };
  }
}


/**
 * Standalone backend test.
 *
 * IMPORTANT:
 * Replace the test values with REAL profile data
 * before running the test.
 */
function testNotificationReactionIntegration() {

  const testData = {
    actorMobile: '9307375984',
    actorName: 'Test Actor',
    actorType: 'BRIDE',
    actorProfileId: 'TEST_ACTOR_ID',

    recipientMobile: '9876543210',
    recipientName: 'Test Recipient',
    recipientType: 'GROOM',
    recipientProfileId: 'TEST_RECIPIENT_ID',

    reaction: 'LIKE'
  };

  const result = notifyAfterProfileReaction(testData);

  console.log(
    '[TEST] notifyAfterProfileReaction:',
    result
  );

  return result;
}