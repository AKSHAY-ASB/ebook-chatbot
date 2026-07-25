// ==========================================
// GET SENT INTERESTS
// ==========================================

function getSentInterests(userMobile) {

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


    const sentInterests = [];


    // ========================================
    // 3. FIND INTERESTS SENT BY THIS USER
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      // Column C = Sender Mobile
      const senderMobile =
        String(
          data[i][2] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      if (
        senderMobile !==
        userMobile
      ) {

        continue;

      }


      // ======================================
      // GET SAVED DATA
      // ======================================

      const interestId =
        String(
          data[i][1] || ""
        ).trim();


      // H = Receiver Mobile
      const receiverMobile =
        String(
          data[i][7] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      // I = Receiver Name
      const receiverName =
        String(
          data[i][8] || ""
        ).trim();


      // J = Receiver Sheet
      const receiverSheet =
        String(
          data[i][9] || ""
        ).trim();


      // K = Receiver Type
      const receiverType =
        String(
          data[i][10] || ""
        )
        .trim()
        .toLowerCase();


      // L = Receiver Profile ID
      const receiverId =
        String(
          data[i][11] || ""
        ).trim();


      // M = Status
      const status =
        String(
          data[i][12] || "PENDING"
        )
        .trim()
        .toUpperCase();


      // O = Sender Seen
      const senderSeen =
        String(
          data[i][14] || "YES"
        )
        .trim()
        .toUpperCase();


      sentInterests.push({

        interestId:
          interestId,

        receiverMobile:
          receiverMobile,

        receiverName:
          receiverName,

        receiverSheet:
          receiverSheet,

        receiverType:
          receiverType,

        receiverId:
          receiverId,

        status:
          status,

        senderSeen:
          senderSeen,

        createdAt:
          String(
            data[i][0] || ""
          ),

        updatedAt:
          String(
            data[i][15] || ""
          )

      });

    }


    // ========================================
    // 4. NEWEST FIRST
    // ========================================

    sentInterests.reverse();


    // ========================================
    // 5. RETURN
    // ========================================

    return {

      success: true,

      totalCount:
        sentInterests.length,

      interests:
        sentInterests

    };

  }


  catch (error) {

    console.error(
      "getSentInterests Error:",
      error
    );


    return {

      success: false,

      totalCount: 0,

      interests: [],

      message:
        error.message ||
        "Unable to load Sent Interests."

    };

  }

}


function testGetSentInterests() {

  const result =
    getSentInterests(
      "8975593689"
    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}