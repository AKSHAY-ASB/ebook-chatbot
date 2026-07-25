// ==========================================
// GET RECEIVED INTERESTS
// ==========================================

function getReceivedInterests(userMobile) {

  try {

    // ========================================
    // 1. NORMALIZE MOBILE
    // ========================================

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    if (!userMobile) {

      return {

        success: false,

        totalCount: 0,

        interests: [],

        message:
          "Registered mobile number is required."

      };

    }


    // ========================================
    // 2. GET INTEREST SHEET
    // ========================================

    const sheet =
      getProfileInterestSheet();


    if (!sheet) {

      return {

        success: false,

        totalCount: 0,

        interests: [],

        message:
          "Profile Interests sheet not found."

      };

    }


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    if (
      !data ||
      data.length < 2
    ) {

      return {

        success: true,

        totalCount: 0,

        interests: []

      };

    }


    const receivedInterests = [];


    // ========================================
    // 3. LOOP INTEREST RECORDS
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      // H = Receiver Mobile
      const receiverMobile =
        String(
          data[i][7] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      if (
        receiverMobile !==
        userMobile
      ) {

        continue;

      }


      // ======================================
      // INTEREST DATA
      // ======================================

      const interestId =
        String(
          data[i][1] || ""
        ).trim();


      const senderMobile =
        String(
          data[i][2] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      const senderName =
        String(
          data[i][3] || ""
        ).trim();


      const senderSheet =
        String(
          data[i][4] || ""
        ).trim();


      const senderType =
        String(
          data[i][5] || ""
        )
        .trim()
        .toLowerCase();


      const senderId =
        String(
          data[i][6] || ""
        ).trim();


      const status =
        String(
          data[i][12] || "PENDING"
        )
        .trim()
        .toUpperCase();


      const receiverSeen =
        String(
          data[i][13] || "NO"
        )
        .trim()
        .toUpperCase();


      // ======================================
      // ADD RESULT
      // ======================================

      receivedInterests.push({

        interestId:
          interestId,

        senderMobile:
          senderMobile,

        senderName:
          senderName,

        senderSheet:
          senderSheet,

        senderType:
          senderType,

        senderId:
          senderId,

        status:
          status,

        seen:
          receiverSeen,

        createdAt:
          String(
            data[i][0] || ""
          )

      });

    }


    // ========================================
    // 4. NEWEST FIRST
    // ========================================

    receivedInterests.reverse();


    // ========================================
    // 5. RETURN
    // ========================================

    return {

      success: true,

      totalCount:
        receivedInterests.length,

      interests:
        receivedInterests

    };

  }


  catch (error) {

    console.error(
      "getReceivedInterests Error:",
      error
    );


    return {

      success: false,

      totalCount: 0,

      interests: [],

      message:
        error.message ||
        "Unable to load received interests."

    };

  }

}



function testGetReceivedInterests() {

  const result =
    getReceivedInterests(
      "8856898667"
    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}