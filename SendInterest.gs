// ==========================================
// SEND PROFILE INTEREST
// ==========================================

function sendProfileInterest(
  senderMobile,
  receiverProfileType,
  receiverProfileId
) {

  try {

    // ========================================
    // 1. NORMALIZE INPUT
    // ========================================

    senderMobile =
      String(senderMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    receiverProfileType =
      normalizeInterestProfileType(
        receiverProfileType
      );


    receiverProfileId =
      String(
        receiverProfileId || ""
      ).trim();


    // ========================================
    // 2. VALIDATION
    // ========================================

    if (!senderMobile) {

      return {

        success: false,

        code:
          "INVALID_SENDER",

        message:
          "Sender mobile number is required."

      };

    }


    if (
      !receiverProfileType ||
      !receiverProfileId
    ) {

      return {

        success: false,

        code:
          "INVALID_RECEIVER",

        message:
          "Receiver profile information is missing."

      };

    }


    // ========================================
    // 3. FIND SENDER PROFILE
    // ========================================

    const sender =
      findInterestUserProfile(
        senderMobile
      );


    if (
      !sender ||
      !sender.found
    ) {

      return {

        success: false,

        code:
          "SENDER_NOT_FOUND",

        message:
          "Sender registered profile not found."

      };

    }


    // ========================================
    // 4. FIND RECEIVER PROFILE
    // ========================================

    const receiver =
      findInterestTargetProfile(
        receiverProfileType,
        receiverProfileId
      );


    if (
      !receiver ||
      !receiver.found
    ) {

      return {

        success: false,

        code:
          "RECEIVER_NOT_FOUND",

        message:
          "Receiver profile not found."

      };

    }


    // ========================================
    // 5. RECEIVER MOBILE CHECK
    // ========================================

    if (!receiver.mobile) {

      return {

        success: false,

        code:
          "RECEIVER_MOBILE_MISSING",

        message:
          "Receiver registered mobile number not found."

      };

    }


    // ========================================
    // 6. PREVENT SELF INTEREST
    // ========================================

    if (
      sender.type === receiver.type &&
      sender.id === receiver.id
    ) {

      return {

        success: false,

        code:
          "SELF_INTEREST",

        message:
          "You cannot send interest to your own profile."

      };

    }


    // ========================================
    // 7. GET INTEREST SHEET
    // ========================================

    const sheet =
      getProfileInterestSheet();


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    // ========================================
    // 8. DUPLICATE CHECK
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const existingSenderType =
        String(
          data[i][5] || ""
        )
        .trim()
        .toLowerCase();


      const existingSenderId =
        String(
          data[i][6] || ""
        ).trim();


      const existingReceiverType =
        String(
          data[i][10] || ""
        )
        .trim()
        .toLowerCase();


      const existingReceiverId =
        String(
          data[i][11] || ""
        ).trim();


      const existingStatus =
        String(
          data[i][12] || ""
        )
        .trim()
        .toUpperCase();


      if (
        existingSenderType ===
          sender.type &&

        existingSenderId ===
          sender.id &&

        existingReceiverType ===
          receiver.type &&

        existingReceiverId ===
          receiver.id
      ) {

        return {

          success: false,

          duplicate: true,

          code:
            "INTEREST_ALREADY_EXISTS",

          interestId:
            String(
              data[i][1] || ""
            ).trim(),

          status:
            existingStatus,

          message:
            "Interest already sent to this profile."

        };

      }

    }


    // ========================================
    // 9. GENERATE INTEREST ID
    // ========================================

    const interestId =
      generateInterestId();


    const now =
      new Date();


    // ========================================
    // 10. SAVE INTEREST
    // ========================================

    sheet.appendRow([

      // A
      now,

      // B
      interestId,

      // C
      sender.mobile,

      // D
      sender.name,

      // E
      sender.sheetName,

      // F
      sender.type,

      // G
      sender.id,

      // H
      receiver.mobile,

      // I
      receiver.name,

      // J
      receiver.sheetName,

      // K
      receiver.type,

      // L
      receiver.id,

      // M
      INTEREST_CONFIG
        .STATUS
        .PENDING,

      // N
      "NO",

      // O
      "YES",

      // P
      now

    ]);


    // ========================================
    // 11. SUCCESS
    // ========================================

    return {

      success: true,

      duplicate: false,

      code:
        "INTEREST_SENT",

      interestId:
        interestId,

      status:
        INTEREST_CONFIG
          .STATUS
          .PENDING,

      sender: {

        type:
          sender.type,

        id:
          sender.id,

        name:
          sender.name

      },

      receiver: {

        type:
          receiver.type,

        id:
          receiver.id,

        name:
          receiver.name

      },

      message:
        "Interest sent successfully."

    };

  }


  catch (error) {

    console.error(
      "sendProfileInterest Error:",
      error
    );


    return {

      success: false,

      code:
        "SERVER_ERROR",

      message:
        error.message ||
        "Unable to send interest."

    };

  }

}


function testSendProfileInterest() {

  const result =
    sendProfileInterest(

      // Sender registered mobile
      "8975593689",

      // Receiver profile type
      "bride",

      // Receiver profile ID
      "ID801"

    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}