// ==========================================
// UPDATE INTEREST STATUS
// ==========================================

function updateInterestStatus(
  userMobile,
  interestId,
  newStatus
) {

  try {

    // ========================================
    // 1. NORMALIZE INPUT
    // ========================================

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    interestId =
      String(interestId || "")
        .trim();


    newStatus =
      String(newStatus || "")
        .trim()
        .toUpperCase();


    // ========================================
    // 2. VALIDATION
    // ========================================

    if (
      !userMobile ||
      !interestId
    ) {

      return {
        success: false,
        code: "INVALID_REQUEST",
        message: "Required information is missing."
      };

    }


    if (
      newStatus !== "ACCEPTED" &&
      newStatus !== "DECLINED"
    ) {

      return {
        success: false,
        code: "INVALID_STATUS",
        message: "Invalid Interest status."
      };

    }


    // ========================================
    // 3. GET PROFILE INTEREST SHEET
    // ========================================

    const sheet =
      getProfileInterestSheet();


    if (!sheet) {

      return {
        success: false,
        code: "SHEET_NOT_FOUND",
        message: "Profile Interests sheet not found."
      };

    }


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    // ========================================
    // 4. FIND INTEREST
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const rowInterestId =
        String(
          data[i][1] || ""
        ).trim();


      if (
        rowInterestId !==
        interestId
      ) {

        continue;

      }


      // ======================================
      // RECEIVER MOBILE
      // Column H = index 7
      // ======================================

      const receiverMobile =
        String(
          data[i][7] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      // ======================================
      // SECURITY CHECK
      // Only receiver can Accept / Decline
      // ======================================

      if (
        receiverMobile !==
        userMobile
      ) {

        return {
          success: false,
          code: "NOT_AUTHORIZED",
          message:
            "You are not authorized to update this Interest."
        };

      }


      const currentStatus =
        String(
          data[i][12] || ""
        )
        .trim()
        .toUpperCase();


      // ======================================
      // ALREADY ACCEPTED / DECLINED
      // ======================================

      if (
        currentStatus === "ACCEPTED" ||
        currentStatus === "DECLINED"
      ) {

        return {

          success: false,

          code: "STATUS_ALREADY_UPDATED",

          status: currentStatus,

          message:
            "This Interest has already been updated."

        };

      }


      // ======================================
      // UPDATE STATUS
      //
      // M = Status = column 13
      // N = Receiver Seen = column 14
      // P = Updated At = column 16
      // ======================================

      const now =
        new Date();


      sheet
        .getRange(
          i + 1,
          13
        )
        .setValue(
          newStatus
        );


      sheet
        .getRange(
          i + 1,
          14
        )
        .setValue(
          "YES"
        );


      sheet
        .getRange(
          i + 1,
          16
        )
        .setValue(
          now
        );


      // ======================================
      // SUCCESS
      // ======================================

      return {

        success: true,

        code:
          newStatus === "ACCEPTED"
            ? "INTEREST_ACCEPTED"
            : "INTEREST_DECLINED",

        interestId:
          interestId,

        status:
          newStatus,

        sender: {

          mobile:
            String(
              data[i][2] || ""
            ).trim(),

          name:
            String(
              data[i][3] || ""
            ).trim(),

          type:
            String(
              data[i][5] || ""
            )
            .trim()
            .toLowerCase(),

          id:
            String(
              data[i][6] || ""
            ).trim()

        },

        message:
          newStatus === "ACCEPTED"
            ? "Interest accepted successfully."
            : "Interest declined successfully."

      };

    }


    // ========================================
    // INTEREST NOT FOUND
    // ========================================

    return {

      success: false,

      code:
        "INTEREST_NOT_FOUND",

      message:
        "Interest Request not found."

    };

  }


  catch (error) {

    console.error(
      "updateInterestStatus Error:",
      error
    );


    return {

      success: false,

      code:
        "SERVER_ERROR",

      message:
        error.message ||
        "Unable to update Interest."

    };

  }

}


function testUpdateInterestStatus() {

  const result =
    updateInterestStatus(

      // Receiver B mobile
      "9307375984",

      // Existing Interest ID
      "INT000008",

      // ACCEPTED or DECLINED
      "DECLINED"

    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}