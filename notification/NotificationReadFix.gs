/**
 * ============================================================
 * NOTIFICATION READ FIX
 * File: NotificationReadFix.gs
 *
 * Purpose:
 * - Fix Mark as Read Sheet update
 * - Fix Mark All as Read Sheet update
 * - Preserve existing NotificationRead.gs
 * - Never return Date objects through google.script.run
 * - Force Spreadsheet write with SpreadsheetApp.flush()
 * ============================================================
 */


/**
 * ============================================================
 * MARK ONE NOTIFICATION AS READ — FIXED VERSION
 * ============================================================
 *
 * IMPORTANT:
 * Existing markNotificationAsRead() is NOT modified.
 *
 * New frontend function should call:
 * markNotificationAsReadFixed()
 */
function markNotificationAsReadFixed(
  userMobile,
  notificationId
) {

  try {

    // ==========================================
    // 1. NORMALIZE MOBILE
    // ==========================================

    const mobile =
      normalizeNotificationMobile(userMobile);


    if (!mobile) {

      return {
        success: false,
        code: "INVALID_MOBILE",
        message: "Invalid user mobile"
      };

    }


    // ==========================================
    // 2. NORMALIZE NOTIFICATION ID
    // ==========================================

    const id =
      String(notificationId || "").trim();


    if (!id) {

      return {
        success: false,
        code: "INVALID_NOTIFICATION_ID",
        message: "Notification ID is required"
      };

    }


    // ==========================================
    // 3. GET NOTIFICATION SHEET
    // ==========================================

    const sheet =
      getNotificationSheet();


    if (!sheet) {

      return {
        success: false,
        code: "SHEET_UNAVAILABLE",
        message: "Notifications sheet unavailable"
      };

    }


    // ==========================================
    // 4. GET DATA
    // ==========================================

    const lastRow =
      sheet.getLastRow();


    if (
      lastRow <=
      NOTIFICATION_CONFIG.HEADER_ROW
    ) {

      return {
        success: false,
        code: "NOT_FOUND",
        message: "Notification not found"
      };

    }


    const columns =
      NOTIFICATION_CONFIG.COLUMNS;


    const data =
      sheet
        .getRange(
          NOTIFICATION_CONFIG.HEADER_ROW + 1,
          1,
          lastRow - NOTIFICATION_CONFIG.HEADER_ROW,
          columns.STATUS
        )
        .getValues();


    // ==========================================
    // 5. FIND NOTIFICATION
    // ==========================================

    for (
      let i = 0;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      const rowNotificationId =
        String(
          row[
            columns.NOTIFICATION_ID - 1
          ] || ""
        ).trim();


      if (
        rowNotificationId !== id
      ) {

        continue;

      }


      // ========================================
      // 6. VERIFY OWNER
      // ========================================

      const rowMobile =
        normalizeNotificationMobile(
          row[
            columns.RECIPIENT_MOBILE - 1
          ]
        );


      if (
        rowMobile !== mobile
      ) {

        return {
          success: false,
          code: "ACCESS_DENIED",
          message:
            "Notification does not belong to this user"
        };

      }


      // ========================================
      // 7. VERIFY ACTIVE STATUS
      // ========================================

      const rowStatus =
        String(
          row[
            columns.STATUS - 1
          ] || ""
        ).trim();


      if (
        rowStatus !==
        NOTIFICATION_CONFIG.STATUS.ACTIVE
      ) {

        return {
          success: false,
          code: "NOT_ACTIVE",
          message:
            "Notification is not active"
        };

      }


      // ========================================
      // 8. CALCULATE REAL SHEET ROW
      // ========================================

      const sheetRow =
        i +
        NOTIFICATION_CONFIG.HEADER_ROW +
        1;


      // ========================================
      // 9. CHECK CURRENT READ STATUS
      // ========================================

      const currentRead =
        String(
          row[
            columns.IS_READ - 1
          ] || ""
        ).trim();


      if (
        currentRead ===
        NOTIFICATION_CONFIG.READ_STATUS.READ
      ) {

        return {
          success: true,
          code: "ALREADY_READ",
          notificationId: id,
          sheetRow: sheetRow
        };

      }


      // ========================================
      // 10. WRITE READ STATUS
      // ========================================

      const now =
        new Date();


      sheet
        .getRange(
          sheetRow,
          columns.IS_READ
        )
        .setValue(
          NOTIFICATION_CONFIG.READ_STATUS.READ
        );


      // ========================================
      // 11. WRITE READ TIMESTAMP
      // ========================================

      sheet
        .getRange(
          sheetRow,
          columns.READ_AT
        )
        .setValue(now);


      // ========================================
      // 12. FORCE GOOGLE SHEET WRITE
      // ========================================

      SpreadsheetApp.flush();


      // ========================================
      // 13. RETURN SAFE SERIALIZABLE RESPONSE
      // ========================================

      return {
        success: true,
        code: "MARKED_READ",
        notificationId: id,
        sheetRow: sheetRow,
        userMobile: mobile,
        isRead:
          NOTIFICATION_CONFIG.READ_STATUS.READ,
        readAt:
          now.toISOString()
      };

    }


    // ==========================================
    // 14. NOT FOUND
    // ==========================================

    return {
      success: false,
      code: "NOT_FOUND",
      message: "Notification not found"
    };


  } catch (error) {

    console.error(
      "[NotificationReadFix] markNotificationAsReadFixed failed:",
      error
    );


    return {
      success: false,
      code: "MARK_READ_FIXED_FAILED",
      message:
        error &&
        error.message
          ? error.message
          : "Unable to mark notification as read"
    };

  }

}



/**
 * ============================================================
 * MARK ALL NOTIFICATIONS AS READ — FIXED VERSION
 * ============================================================
 *
 * Existing markAllNotificationsAsRead()
 * remains untouched.
 */
function markAllNotificationsAsReadFixed(
  userMobile
) {

  try {

    // ==========================================
    // 1. NORMALIZE MOBILE
    // ==========================================

    const mobile =
      normalizeNotificationMobile(userMobile);


    if (!mobile) {

      return {
        success: false,
        code: "INVALID_MOBILE",
        message: "Invalid user mobile",
        updatedCount: 0
      };

    }


    // ==========================================
    // 2. GET SHEET
    // ==========================================

    const sheet =
      getNotificationSheet();


    if (!sheet) {

      return {
        success: false,
        code: "SHEET_UNAVAILABLE",
        message:
          "Notifications sheet unavailable",
        updatedCount: 0
      };

    }


    // ==========================================
    // 3. GET DATA
    // ==========================================

    const lastRow =
      sheet.getLastRow();


    if (
      lastRow <=
      NOTIFICATION_CONFIG.HEADER_ROW
    ) {

      return {
        success: true,
        code: "NOTHING_TO_MARK",
        updatedCount: 0
      };

    }


    const columns =
      NOTIFICATION_CONFIG.COLUMNS;


    const firstDataRow =
      NOTIFICATION_CONFIG.HEADER_ROW + 1;


    const numberOfRows =
      lastRow -
      NOTIFICATION_CONFIG.HEADER_ROW;


    const data =
      sheet
        .getRange(
          firstDataRow,
          1,
          numberOfRows,
          columns.STATUS
        )
        .getValues();


    // ==========================================
    // 4. CURRENT TIME
    // ==========================================

    const now =
      new Date();


    let updatedCount =
      0;


    // ==========================================
    // 5. UPDATE EACH MATCHING ROW
    // ==========================================

    for (
      let i = 0;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      // ----------------------------------------
      // Recipient mobile
      // ----------------------------------------

      const rowMobile =
        normalizeNotificationMobile(
          row[
            columns.RECIPIENT_MOBILE - 1
          ]
        );


      if (
        rowMobile !== mobile
      ) {

        continue;

      }


      // ----------------------------------------
      // Status
      // ----------------------------------------

      const rowStatus =
        String(
          row[
            columns.STATUS - 1
          ] || ""
        ).trim();


      if (
        rowStatus !==
        NOTIFICATION_CONFIG.STATUS.ACTIVE
      ) {

        continue;

      }


      // ----------------------------------------
      // Current read status
      // ----------------------------------------

      const currentRead =
        String(
          row[
            columns.IS_READ - 1
          ] || ""
        ).trim();


      if (
        currentRead ===
        NOTIFICATION_CONFIG.READ_STATUS.READ
      ) {

        continue;

      }


      // ----------------------------------------
      // REAL SHEET ROW
      // ----------------------------------------

      const sheetRow =
        firstDataRow + i;


      // ----------------------------------------
      // UPDATE IS_READ
      // ----------------------------------------

      sheet
        .getRange(
          sheetRow,
          columns.IS_READ
        )
        .setValue(
          NOTIFICATION_CONFIG.READ_STATUS.READ
        );


      // ----------------------------------------
      // UPDATE READ_AT
      // ----------------------------------------

      sheet
        .getRange(
          sheetRow,
          columns.READ_AT
        )
        .setValue(now);


      updatedCount++;

    }


    // ==========================================
    // 6. FORCE WRITE
    // ==========================================

    SpreadsheetApp.flush();


    // ==========================================
    // 7. SAFE SERIALIZABLE RESPONSE
    // ==========================================

    return {
      success: true,

      code:
        updatedCount > 0
          ? "ALL_MARKED_READ"
          : "NOTHING_TO_MARK",

      updatedCount:
        updatedCount,

      userMobile:
        mobile,

      isRead:
        NOTIFICATION_CONFIG.READ_STATUS.READ,

      readAt:
        now.toISOString()
    };


  } catch (error) {

    console.error(
      "[NotificationReadFix] markAllNotificationsAsReadFixed failed:",
      error
    );


    return {
      success: false,
      code: "MARK_ALL_READ_FIXED_FAILED",
      message:
        error &&
        error.message
          ? error.message
          : "Unable to mark notifications as read",
      updatedCount: 0
    };

  }

}


function testNotificationReadFix() {
  const testMobile = '9307375984';

  const result = markNotificationAsReadFixed(
    testMobile,
    'NTF_1788761635826_718357'
  );

  console.log('[TEST] markNotificationAsReadFixed:', result);

  const allResult = markAllNotificationsAsReadFixed(testMobile);

  console.log('[TEST] markAllNotificationsAsReadFixed:', allResult);

  return {
    single: result,
    all: allResult
  };
}