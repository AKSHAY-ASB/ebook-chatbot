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

      // ========================================
// CHECK EXISTING RELATIONSHIP
// BOTH DIRECTIONS
// ========================================

const relationship =
  getInterestRelationship(
    sender.mobile,
    receiver.type,
    receiver.id
  );


if (
  relationship &&
  relationship.exists === true
) {

  let message =
    "Interest relationship already exists.";


  if (
    relationship.status ===
    "PENDING_SENT"
  ) {

    message =
      "Interest Request already sent.";

  }


  else if (
    relationship.status ===
    "PENDING_RECEIVED"
  ) {

    message =
      "This profile has already sent you an Interest Request.";

  }


  else if (
    relationship.status ===
    "ACCEPTED"
  ) {

    message =
      "You are already matched with this profile.";

  }


  else if (
    relationship.status ===
    "DECLINED"
  ) {

    message =
      "This Interest relationship is closed.";

  }


  return {

    success: false,

    duplicate: true,

    code:
      "INTEREST_RELATIONSHIP_EXISTS",

    interestId:
      relationship.interestId,

    status:
      relationship.status,

    direction:
      relationship.direction,

    message:
      message

  };

}


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
        // CLEAR INTEREST CACHE
        // ========================================

        removeCache(
          CACHE_KEYS.PROFILE_INTEREST
        );

          try {

        logInterestActivity(

          sender.mobile,

          "INTEREST_SENT",

          receiver.type,

          receiver.id,

          interestId,

          "NONE",

          "PENDING",

          "SendInterest",

          "Interest Request sent successfully."

        );

      }

      catch (logError) {

        console.error(
          "Send Interest Log Error:",
          logError
        );

      }
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


// ==========================================
// GET INTEREST RELATIONSHIP MAP
// FAST VERSION FOR PROFILE SEARCH
// ==========================================

function getInterestRelationshipMap(
  userMobile
) {


  const relationshipMap =
  getInterestRelationshipMap(
    userMobile
  );


  try {

    // ========================================
    // 1. NORMALIZE USER MOBILE
    // ========================================

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    if (!userMobile) {

      return relationshipMap;

    }


    // ========================================
    // 2. GET PROFILE INTEREST SHEET
    // ========================================

    const sheet =
      getProfileInterestSheet();


    if (!sheet) {

      return relationshipMap;

    }


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    if (
      !data ||
      data.length < 2
    ) {

      return relationshipMap;

    }


    // ========================================
    // 3. READ ALL INTERESTS ONCE
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      // ======================================
      // PROFILE INTEREST SHEET COLUMNS
      //
      // C = Sender Mobile       index 2
      // F = Sender Type         index 5
      // G = Sender ID           index 6
      //
      // H = Receiver Mobile     index 7
      // K = Receiver Type       index 10
      // L = Receiver ID         index 11
      //
      // M = Status              index 12
      // ======================================


      const senderMobile =
        String(row[2] || "")
          .replace(/\D/g, "")
          .slice(-10);


      const senderType =
        normalizeInterestProfileType(
          row[5]
        );


      const senderId =
        String(
          row[6] || ""
        ).trim();


      const receiverMobile =
        String(row[7] || "")
          .replace(/\D/g, "")
          .slice(-10);


      const receiverType =
        normalizeInterestProfileType(
          row[10]
        );


      const receiverId =
        String(
          row[11] || ""
        ).trim();


      const status =
        String(
          row[12] || "PENDING"
        )
        .trim()
        .toUpperCase();


      // ======================================
      // CASE 1:
      // CURRENT USER IS SENDER
      // ======================================

      if (
        senderMobile === userMobile &&
        receiverType &&
        receiverId
      ) {

        const key =
          receiverType +
          "_" +
          receiverId;


        relationshipMap[key] =
          buildSearchInterestRelationship(
            status,
            "SENT"
          );

      }


      // ======================================
      // CASE 2:
      // CURRENT USER IS RECEIVER
      // ======================================

      else if (
        receiverMobile === userMobile &&
        senderType &&
        senderId
      ) {

        const key =
          senderType +
          "_" +
          senderId;


        relationshipMap[key] =
          buildSearchInterestRelationship(
            status,
            "RECEIVED"
          );

      }

    }


    return relationshipMap;

  }


  catch (error) {

    console.error(
      "getInterestRelationshipMap Error:",
      error
    );


    return relationshipMap;

  }

}



// ==========================================
// BUILD SEARCH INTEREST RELATIONSHIP
// ==========================================

function buildSearchInterestRelationship(
  status,
  direction
) {

  status =
    String(status || "")
      .trim()
      .toUpperCase();


  direction =
    String(direction || "")
      .trim()
      .toUpperCase();


  // ========================================
  // ACCEPTED
  // ========================================

  if (
    status === "ACCEPTED"
  ) {

    return {

      exists: true,

      status: "ACCEPTED",

      direction:
        direction,

      canSendInterest:
        false,

      canViewContact:
        true

    };

  }


  // ========================================
  // DECLINED
  // ========================================

  if (
    status === "DECLINED"
  ) {

    return {

      exists: true,

      status: "DECLINED",

      direction:
        direction,

      canSendInterest:
        false,

      canViewContact:
        false

    };

  }


  // ========================================
  // PENDING - SENT BY CURRENT USER
  // ========================================

  if (
    status === "PENDING" &&
    direction === "SENT"
  ) {

    return {

      exists: true,

      status:
        "PENDING_SENT",

      direction:
        "SENT",

      canSendInterest:
        false,

      canViewContact:
        false

    };

  }


  // ========================================
  // PENDING - RECEIVED BY CURRENT USER
  // ========================================

  if (
    status === "PENDING" &&
    direction === "RECEIVED"
  ) {

    return {

      exists: true,

      status:
        "PENDING_RECEIVED",

      direction:
        "RECEIVED",

      canSendInterest:
        false,

      canViewContact:
        false

    };

  }


  // ========================================
  // DEFAULT
  // ========================================

  return {

    exists: false,

    status: "NONE",

    direction: "NONE",

    canSendInterest: true,

    canViewContact: false

  };

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