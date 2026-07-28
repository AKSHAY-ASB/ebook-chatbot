function logInterestActivity(
  userMobile,
  action,
  targetType,
  targetProfileId,
  interestId,
  oldStatus,
  newStatus,
  source,
  details
) {

  try {

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();


    let sheet =
      ss.getSheetByName(
        "Interest Activity Log"
      );


    // ========================================
    // CREATE SHEET AUTOMATICALLY
    // ========================================

    if (!sheet) {

      sheet =
        ss.insertSheet(
          "Interest Activity Log"
        );


      sheet.appendRow([

        "Timestamp",

        "User Mobile",

        "User Type",

        "User Profile ID",

        "Action",

        "Target Type",

        "Target Profile ID",

        "Interest ID",

        "Old Status",

        "New Status",

        "Source",

        "Details"

      ]);

    }


    // ========================================
    // NORMALIZE USER
    // ========================================

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    let userType = "";

    let userProfileId = "";


    if (userMobile) {

      const user =
        findInterestUserProfile(
          userMobile
        );


      if (
        user &&
        user.found
      ) {

        userType =
          String(
            user.type || ""
          );


        userProfileId =
          String(
            user.id || ""
          );

      }

    }


    // ========================================
    // SAVE LOG
    // ========================================

    sheet.appendRow([

      new Date(),

      userMobile,

      userType,

      userProfileId,

      String(
        action || ""
      ),

      String(
        targetType || ""
      ),

      String(
        targetProfileId || ""
      ),

      String(
        interestId || ""
      ),

      String(
        oldStatus || ""
      ),

      String(
        newStatus || ""
      ),

      String(
        source || ""
      ),

      String(
        details || ""
      )

    ]);


    return {

      success: true

    };

  }


  catch (error) {

    console.error(
      "logInterestActivity Error:",
      error
    );


    // IMPORTANT:
    // Logging must never break
    // Send/Accept/Decline.

    return {

      success: false,

      message:
        error.message

    };

  }

}