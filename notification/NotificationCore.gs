/**
 * ============================================================
 * NOTIFICATION MODULE
 * File: NotificationCore.gs
 * Purpose: Core notification creation & storage engine
 * ============================================================
 */

/**
 * Get or create Notifications sheet.
 */
function getNotificationSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(NOTIFICATION_CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(NOTIFICATION_CONFIG.SHEET_NAME);

      const headers = [
        'Created At',
        'Notification ID',
        'Recipient Mobile',
        'Recipient Name',
        'Recipient Type',
        'Recipient Profile ID',
        'Actor Mobile',
        'Actor Name',
        'Actor Type',
        'Actor Profile ID',
        'Event Type',
        'Reference ID',
        'Target Type',
        'Target Profile ID',
        'Target Name',
        'Title',
        'Message',
        'Is Read',
        'Read At',
        'Source',
        'Event Key',
        'Status'
      ];

      sheet
        .getRange(1, 1, 1, headers.length)
        .setValues([headers]);

      sheet.setFrozenRows(1);
    }

    return sheet;

  } catch (error) {
    console.error(
      '[NotificationCore] getNotificationSheet failed:',
      error
    );

    return null;
  }
}


/**
 * Normalize Indian mobile number for notification module.
 */
function normalizeNotificationMobile(mobile) {
  try {
    if (mobile === null || mobile === undefined) {
      return '';
    }

    let value = String(mobile).trim();

    // Remove spaces, hyphens and brackets.
    value = value.replace(/[\s\-()]/g, '');

    // Remove leading +91 / 91.
    if (value.startsWith('+91')) {
      value = value.substring(3);
    } else if (value.startsWith('91') && value.length === 12) {
      value = value.substring(2);
    }

    // Keep only digits.
    value = value.replace(/\D/g, '');

    // Indian 10 digit mobile validation.
    if (!/^[6-9]\d{9}$/.test(value)) {
      return '';
    }

    return value;

  } catch (error) {
    return '';
  }
}


/**
 * Normalize profile type.
 */
function normalizeNotificationType(type) {
  if (type === null || type === undefined) {
    return '';
  }

  return String(type).trim().toLowerCase();
}


/**
 * Generate unique physical notification ID.
 */
function generateNotificationId() {
  const timestamp = Date.now();
  const randomPart = Math.floor(
    100000 + Math.random() * 900000
  );

  return 'NTF_' + timestamp + '_' + randomPart;
}


/**
 * Check whether a notification with the same
 * recipient + event key already exists.
 *
 * This is the main duplicate-protection layer.
 */
function notificationExists(recipientMobile, eventKey) {
  try {
    const sheet = getNotificationSheet();

    if (!sheet) {
      return false;
    }

    const mobile = normalizeNotificationMobile(recipientMobile);
    const key = String(eventKey || '').trim();

    if (!mobile || !key) {
      return false;
    }

    const lastRow = sheet.getLastRow();

    if (lastRow <= NOTIFICATION_CONFIG.HEADER_ROW) {
      return false;
    }

    const columns = NOTIFICATION_CONFIG.COLUMNS;

    const data = sheet
      .getRange(
        NOTIFICATION_CONFIG.HEADER_ROW + 1,
        1,
        lastRow - NOTIFICATION_CONFIG.HEADER_ROW,
        columns.STATUS
      )
      .getValues();

    for (let i = 0; i < data.length; i++) {

      const rowMobile = normalizeNotificationMobile(
        data[i][columns.RECIPIENT_MOBILE - 1]
      );

      const rowEventKey = String(
        data[i][columns.EVENT_KEY - 1] || ''
      ).trim();

      const rowStatus = String(
        data[i][columns.STATUS - 1] || ''
      ).trim();

      if (
        rowMobile === mobile &&
        rowEventKey === key &&
        rowStatus !== NOTIFICATION_CONFIG.STATUS.DELETED
      ) {
        return true;
      }
    }

    return false;

  } catch (error) {
    console.error(
      '[NotificationCore] notificationExists failed:',
      error
    );

    // Fail-open deliberately.
    // Notification failure must never break original action.
    return false;
  }
}


/**
 * Create and save a notification.
 *
 * IMPORTANT:
 * Any notification error is isolated and returned as a
 * non-throwing failure response.
 */
function createNotification(notification) {
  try {

    if (!notification || typeof notification !== 'object') {
      return {
        success: false,
        skipped: true,
        message: 'Invalid notification data'
      };
    }

    const recipientMobile =
      normalizeNotificationMobile(
        notification.recipientMobile
      );

    const actorMobile =
      normalizeNotificationMobile(
        notification.actorMobile
      );

    const recipientType =
      normalizeNotificationType(
        notification.recipientType
      );

    const actorType =
      normalizeNotificationType(
        notification.actorType
      );

    const targetType =
      normalizeNotificationType(
        notification.targetType
      );

    const eventType =
      String(notification.eventType || '').trim();

    const referenceId =
      String(notification.referenceId || '').trim();

    const eventKey =
      String(notification.eventKey || '').trim();

    if (!recipientMobile) {
      return {
        success: false,
        skipped: true,
        message: 'Invalid recipient mobile'
      };
    }

    if (!eventType) {
      return {
        success: false,
        skipped: true,
        message: 'Missing event type'
      };
    }

    if (!eventKey) {
      return {
        success: false,
        skipped: true,
        message: 'Missing event key'
      };
    }

    // Lock prevents two simultaneous requests from
    // passing duplicate check at the same time.
    const lock = LockService.getScriptLock();

    try {
      lock.waitLock(5000);
    } catch (lockError) {
      console.warn(
        '[NotificationCore] Could not acquire lock:',
        lockError
      );

      return {
        success: false,
        skipped: true,
        message: 'Notification lock unavailable'
      };
    }

    try {

      // Final duplicate check inside lock.
      if (
        notificationExists(
          recipientMobile,
          eventKey
        )
      ) {
        return {
          success: true,
          duplicate: true,
          notificationId: null,
          eventKey: eventKey
        };
      }

      const sheet = getNotificationSheet();

      if (!sheet) {
        return {
          success: false,
          skipped: true,
          message: 'Notifications sheet unavailable'
        };
      }

      const notificationId =
        generateNotificationId();

      const now = new Date();

      const columns = NOTIFICATION_CONFIG.COLUMNS;

      const row = new Array(columns.STATUS).fill('');

      row[columns.CREATED_AT - 1] = now;
      row[columns.NOTIFICATION_ID - 1] = notificationId;

      row[columns.RECIPIENT_MOBILE - 1] =
        recipientMobile;

      row[columns.RECIPIENT_NAME - 1] =
        String(notification.recipientName || '').trim();

      row[columns.RECIPIENT_TYPE - 1] =
        recipientType;

      row[columns.RECIPIENT_PROFILE_ID - 1] =
        String(
          notification.recipientProfileId || ''
        ).trim();

      row[columns.ACTOR_MOBILE - 1] =
        actorMobile;

      row[columns.ACTOR_NAME - 1] =
        String(notification.actorName || '').trim();

      row[columns.ACTOR_TYPE - 1] =
        actorType;

      row[columns.ACTOR_PROFILE_ID - 1] =
        String(
          notification.actorProfileId || ''
        ).trim();

      row[columns.EVENT_TYPE - 1] =
        eventType;

      row[columns.REFERENCE_ID - 1] =
        referenceId;

      row[columns.TARGET_TYPE - 1] =
        targetType;

      row[columns.TARGET_PROFILE_ID - 1] =
        String(
          notification.targetProfileId || ''
        ).trim();

      row[columns.TARGET_NAME - 1] =
        String(notification.targetName || '').trim();

      row[columns.TITLE - 1] =
        String(notification.title || '').trim();

      row[columns.MESSAGE - 1] =
        String(notification.message || '').trim();

      row[columns.IS_READ - 1] =
        NOTIFICATION_CONFIG.READ_STATUS.UNREAD;

      row[columns.READ_AT - 1] = '';

      row[columns.SOURCE - 1] =
        String(notification.source || '').trim();

      row[columns.EVENT_KEY - 1] =
        eventKey;

      row[columns.STATUS - 1] =
        NOTIFICATION_CONFIG.STATUS.ACTIVE;

      sheet.appendRow(row);

      return {
        success: true,
        duplicate: false,
        notificationId: notificationId,
        eventKey: eventKey
      };

    } finally {
      lock.releaseLock();
    }

  } catch (error) {

    console.error(
      '[NotificationCore] createNotification failed:',
      error
    );

    // CRITICAL:
    // Never throw notification errors to the original action.
    return {
      success: false,
      skipped: true,
      message: 'Notification creation failed'
    };
  }
}


/**
 * ============================================================
 * STEP 2 TEST FUNCTION
 * ============================================================
 *
 * This creates ONE controlled test notification.
 *
 * It does NOT modify:
 * - Profile Reactions
 * - Profile Interests
 * - Matching
 * - Existing user profiles
 */
function testNotificationCore() {

  const testMobile = '8975593689';

  const result = createNotification({

    recipientMobile: testMobile,
    recipientName: 'Test User',
    recipientType: 'test',
    recipientProfileId: 'TEST_PROFILE',

    actorMobile: '8888888888',
    actorName: 'Test Actor',
    actorType: 'groom',
    actorProfileId: 'ID001',

    eventType:
      NOTIFICATION_CONFIG.EVENT_TYPE.LIKE,

    referenceId:
      'TEST_REFERENCE_001',

    targetType: 'groom',

    targetProfileId:
      'ID001',

    targetName:
      'Test Actor',

    title:
      '❤️ Test Notification',

    message:
      'This is a test notification from the Notification Module.',

    source:
      NOTIFICATION_CONFIG.SOURCE.PROFILE_REACTION,

    eventKey:
      'TEST_NOTIFICATION_CORE_001'
  });

  console.log(
    '[NotificationCore] Test Result:',
    JSON.stringify(result)
  );

  return result;
}