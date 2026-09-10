/**
 * ============================================================
 * NOTIFICATION MODULE
 * File: NotificationRead.gs
 * Purpose: Read, unread-count and mark-as-read APIs
 * ============================================================
 */


/**
 * Get notifications for a user.
 *
 * Returns latest ACTIVE notifications for the
 * specified recipient mobile.
 *
 * NOTE:
 * At this stage this function receives mobile directly
 * because we are testing the notification module independently.
 * Authentication integration will be done later without
 * changing the core notification storage structure.
 */
function getUserNotifications(userMobile, limit) {

  try {

    const mobile = normalizeNotificationMobile(userMobile);

    if (!mobile) {
      return {
        success: false,
        code: 'INVALID_MOBILE',
        message: 'Invalid user mobile',
        notifications: [],
        unreadCount: 0
      };
    }

    let requestedLimit =
      Number(limit || NOTIFICATION_CONFIG.DEFAULT_LIMIT);

    if (!Number.isFinite(requestedLimit) || requestedLimit <= 0) {
      requestedLimit =
        NOTIFICATION_CONFIG.DEFAULT_LIMIT;
    }

    requestedLimit = Math.min(
      requestedLimit,
      NOTIFICATION_CONFIG.MAX_LIMIT
    );

    const sheet = getNotificationSheet();

    if (!sheet) {
      return {
        success: false,
        code: 'SHEET_UNAVAILABLE',
        message: 'Notifications sheet unavailable',
        notifications: [],
        unreadCount: 0
      };
    }

    const lastRow = sheet.getLastRow();

    if (lastRow <= NOTIFICATION_CONFIG.HEADER_ROW) {
      return {
        success: true,
        code: 'NO_NOTIFICATIONS',
        message: 'No notifications found',
        notifications: [],
        unreadCount: 0,
        totalCount: 0
      };
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

    const notifications = [];
    let unreadCount = 0;

    for (let i = 0; i < data.length; i++) {

      const row = data[i];

      const rowStatus =
        String(
          row[columns.STATUS - 1] || ''
        ).trim();

      if (
        rowStatus !==
        NOTIFICATION_CONFIG.STATUS.ACTIVE
      ) {
        continue;
      }

      const rowMobile =
        normalizeNotificationMobile(
          row[columns.RECIPIENT_MOBILE - 1]
        );

      if (rowMobile !== mobile) {
        continue;
      }

      const isRead =
        String(
          row[columns.IS_READ - 1] || ''
        ).trim() ===
        NOTIFICATION_CONFIG.READ_STATUS.READ;

      if (!isRead) {
        unreadCount++;
      }

      notifications.push({
        rowNumber:
          i +
          NOTIFICATION_CONFIG.HEADER_ROW +
          1,

        createdAt:
          serializeNotificationDate(
            row[columns.CREATED_AT - 1]
          ),

        notificationId:
          String(
            row[columns.NOTIFICATION_ID - 1] || ''
          ),

        recipientMobile:
          rowMobile,

        recipientName:
          String(
            row[columns.RECIPIENT_NAME - 1] || ''
          ),

        recipientType:
          String(
            row[columns.RECIPIENT_TYPE - 1] || ''
          ),

        recipientProfileId:
          String(
            row[columns.RECIPIENT_PROFILE_ID - 1] || ''
          ),

        actorMobile:
          normalizeNotificationMobile(
            row[columns.ACTOR_MOBILE - 1]
          ),

        actorName:
          String(
            row[columns.ACTOR_NAME - 1] || ''
          ),

        actorType:
          String(
            row[columns.ACTOR_TYPE - 1] || ''
          ),

        actorProfileId:
          String(
            row[columns.ACTOR_PROFILE_ID - 1] || ''
          ),

        eventType:
          String(
            row[columns.EVENT_TYPE - 1] || ''
          ),

        referenceId:
          String(
            row[columns.REFERENCE_ID - 1] || ''
          ),

        targetType:
          String(
            row[columns.TARGET_TYPE - 1] || ''
          ),

        targetProfileId:
          String(
            row[columns.TARGET_PROFILE_ID - 1] || ''
          ),

        targetName:
          String(
            row[columns.TARGET_NAME - 1] || ''
          ),

        title:
          String(
            row[columns.TITLE - 1] || ''
          ),

        message:
          String(
            row[columns.MESSAGE - 1] || ''
          ),

        isRead:
          isRead,

        readAt:
          serializeNotificationDate(
            row[columns.READ_AT - 1]
          ),

        source:
          String(
            row[columns.SOURCE - 1] || ''
          ),

        eventKey:
          String(
            row[columns.EVENT_KEY - 1] || ''
          ),

        status:
          rowStatus
      });
    }

    // Latest first.
    notifications.sort(function(a, b) {

      const dateA =
        a.createdAt instanceof Date
          ? a.createdAt.getTime()
          : new Date(a.createdAt || 0).getTime();

      const dateB =
        b.createdAt instanceof Date
          ? b.createdAt.getTime()
          : new Date(b.createdAt || 0).getTime();

      return dateB - dateA;
    });

    const totalCount = notifications.length;

    const limitedNotifications =
      notifications.slice(0, requestedLimit);

    return {
      success: true,
      code: 'NOTIFICATIONS_LOADED',
      notifications: limitedNotifications,
      unreadCount: unreadCount,
      totalCount: totalCount,
      returnedCount: limitedNotifications.length
    };

  } catch (error) {

    console.error(
      '[NotificationRead] getUserNotifications failed:',
      error
    );

    return {
      success: false,
      code: 'READ_FAILED',
      message: 'Unable to load notifications',
      notifications: [],
      unreadCount: 0
    };
  }
}


// ============================================================
// SERIALIZE DATE FOR GOOGLE.SCRIPT.RUN
// ============================================================

function serializeNotificationDate(value) {

  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const parsed =
    new Date(value);

  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return String(value);
}


/**
 * Mark ONE notification as read.
 *
 * Security at this stage:
 * - notification must exist
 * - notification must belong to supplied user mobile
 * - notification must be ACTIVE
 *
 * Authentication/session integration will be added later.
 */
function markNotificationAsRead(
  userMobile,
  notificationId
) {

  try {

    const mobile =
      normalizeNotificationMobile(userMobile);

    const id =
      String(notificationId || '').trim();

    if (!mobile) {
      return {
        success: false,
        code: 'INVALID_MOBILE',
        message: 'Invalid user mobile'
      };
    }

    if (!id) {
      return {
        success: false,
        code: 'INVALID_NOTIFICATION_ID',
        message: 'Notification ID is required'
      };
    }

    const sheet = getNotificationSheet();

    if (!sheet) {
      return {
        success: false,
        code: 'SHEET_UNAVAILABLE',
        message: 'Notifications sheet unavailable'
      };
    }

    const lastRow = sheet.getLastRow();

    if (lastRow <= NOTIFICATION_CONFIG.HEADER_ROW) {
      return {
        success: false,
        code: 'NOT_FOUND',
        message: 'Notification not found'
      };
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

      const row = data[i];

      const rowNotificationId =
        String(
          row[columns.NOTIFICATION_ID - 1] || ''
        ).trim();

      if (rowNotificationId !== id) {
        continue;
      }

      const rowMobile =
        normalizeNotificationMobile(
          row[columns.RECIPIENT_MOBILE - 1]
        );

      if (rowMobile !== mobile) {
        return {
          success: false,
          code: 'ACCESS_DENIED',
          message: 'Notification does not belong to this user'
        };
      }

      const rowStatus =
        String(
          row[columns.STATUS - 1] || ''
        ).trim();

      if (
        rowStatus !==
        NOTIFICATION_CONFIG.STATUS.ACTIVE
      ) {
        return {
          success: false,
          code: 'NOT_ACTIVE',
          message: 'Notification is not active'
        };
      }

      const sheetRow =
        i +
        NOTIFICATION_CONFIG.HEADER_ROW +
        1;

      const currentRead =
        String(
          row[columns.IS_READ - 1] || ''
        ).trim();

      if (
        currentRead ===
        NOTIFICATION_CONFIG.READ_STATUS.READ
      ) {
        return {
          success: true,
          code: 'ALREADY_READ',
          notificationId: id
        };
      }

      const now = new Date();

      sheet
        .getRange(
          sheetRow,
          columns.IS_READ
        )
        .setValue(
          NOTIFICATION_CONFIG.READ_STATUS.READ
        );

      sheet
        .getRange(
          sheetRow,
          columns.READ_AT
        )
        .setValue(now);

      return {
        success: true,
        code: 'MARKED_READ',
        notificationId: id,
        readAt:
          serializeNotificationDate(now)
      };
    }

    return {
      success: false,
      code: 'NOT_FOUND',
      message: 'Notification not found'
    };

  } catch (error) {

    console.error(
      '[NotificationRead] markNotificationAsRead failed:',
      error
    );

    return {
      success: false,
      code: 'MARK_READ_FAILED',
      message: 'Unable to mark notification as read'
    };
  }
}


/**
 * Mark ALL active notifications of a user as read.
 */
function markAllNotificationsAsRead(userMobile) {

  try {

    const mobile =
      normalizeNotificationMobile(userMobile);

    if (!mobile) {
      return {
        success: false,
        code: 'INVALID_MOBILE',
        message: 'Invalid user mobile'
      };
    }

    const sheet = getNotificationSheet();

    if (!sheet) {
      return {
        success: false,
        code: 'SHEET_UNAVAILABLE',
        message: 'Notifications sheet unavailable'
      };
    }

    const lastRow = sheet.getLastRow();

    if (lastRow <= NOTIFICATION_CONFIG.HEADER_ROW) {
      return {
        success: true,
        code: 'NOTHING_TO_MARK',
        updatedCount: 0
      };
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

    const now = new Date();
    let updatedCount = 0;

    for (let i = 0; i < data.length; i++) {

      const row = data[i];

      const rowMobile =
        normalizeNotificationMobile(
          row[columns.RECIPIENT_MOBILE - 1]
        );

      if (rowMobile !== mobile) {
        continue;
      }

      const rowStatus =
        String(
          row[columns.STATUS - 1] || ''
        ).trim();

      if (
        rowStatus !==
        NOTIFICATION_CONFIG.STATUS.ACTIVE
      ) {
        continue;
      }

      const currentRead =
        String(
          row[columns.IS_READ - 1] || ''
        ).trim();

      if (
        currentRead ===
        NOTIFICATION_CONFIG.READ_STATUS.READ
      ) {
        continue;
      }

      const sheetRow =
        i +
        NOTIFICATION_CONFIG.HEADER_ROW +
        1;

      sheet
        .getRange(
          sheetRow,
          columns.IS_READ
        )
        .setValue(
          NOTIFICATION_CONFIG.READ_STATUS.READ
        );

      sheet
        .getRange(
          sheetRow,
          columns.READ_AT
        )
        .setValue(now);

      updatedCount++;
    }

    return {
      success: true,
      code:
        updatedCount > 0
          ? 'ALL_MARKED_READ'
          : 'NOTHING_TO_MARK',
      updatedCount: updatedCount
    };

  } catch (error) {

    console.error(
      '[NotificationRead] markAllNotificationsAsRead failed:',
      error
    );

    return {
      success: false,
      code: 'MARK_ALL_READ_FAILED',
      message: 'Unable to mark notifications as read',
      updatedCount: 0
    };
  }
}


/**
 * ============================================================
 * STEP 3 TEST
 * ============================================================
 *
 * Uses the controlled test notification created by
 * testNotificationCore().
 *
 * Test mobile:
 * 9999999999
 */
function testNotificationReadAPI() {

  const testMobile = '9999999999';

  console.log(
    '========== STEP 3 TEST START =========='
  );

  // 1. Load notifications
  const before =
    getUserNotifications(testMobile, 50);

  console.log(
    '1) getUserNotifications:',
    JSON.stringify(before)
  );

  if (
    !before.success ||
    !before.notifications ||
    before.notifications.length === 0
  ) {
    return {
      success: false,
      step: 'LOAD',
      message:
        'Test notification not found. Run testNotificationCore() first.'
    };
  }

  const testNotification =
    before.notifications.find(function(notification) {

      return (
        notification.eventKey ===
        'TEST_NOTIFICATION_CORE_001'
      );

    });

  if (!testNotification) {
    return {
      success: false,
      step: 'FIND_TEST_NOTIFICATION',
      message:
        'Controlled test notification was not found.'
    };
  }

  console.log(
    '2) Test notification found:',
    testNotification.notificationId
  );

  // 2. Mark one notification as read
  const markOne =
    markNotificationAsRead(
      testMobile,
      testNotification.notificationId
    );

  console.log(
    '3) markNotificationAsRead:',
    JSON.stringify(markOne)
  );

  // 3. Read again
  const after =
    getUserNotifications(testMobile, 50);

  console.log(
    '4) getUserNotifications after READ:',
    JSON.stringify(after)
  );

  const updated =
    after.notifications.find(function(notification) {

      return (
        notification.notificationId ===
        testNotification.notificationId
      );

    });

  const singleReadPass =
    !!updated &&
    updated.isRead === true;

  console.log(
    '5) Single READ check:',
    singleReadPass
  );

  // 4. Test mark-all
  const markAll =
    markAllNotificationsAsRead(testMobile);

  console.log(
    '6) markAllNotificationsAsRead:',
    JSON.stringify(markAll)
  );

  // 5. Final unread count
  const finalResult =
    getUserNotifications(testMobile, 50);

  console.log(
    '7) Final result:',
    JSON.stringify(finalResult)
  );

  const allReadPass =
    finalResult.success &&
    finalResult.unreadCount === 0;

  const finalPass =
    singleReadPass &&
    allReadPass;

  console.log(
    '========== STEP 3 TEST RESULT ==========',
    finalPass ? 'PASS' : 'FAIL'
  );

  return {
    success: finalPass,
    step: 'STEP_3_NOTIFICATION_READ',
    singleReadPass: singleReadPass,
    allReadPass: allReadPass,
    finalUnreadCount:
      finalResult.unreadCount,
    markAllUpdatedCount:
      markAll.updatedCount
  };
}