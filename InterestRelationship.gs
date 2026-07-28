// ==========================================
// INTEREST RELATIONSHIP ENGINE
// ==========================================

function getInterestRelationship(
  userMobile,
  targetProfileType,
  targetProfileId
) {

  try {

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    targetProfileType =
      normalizeInterestProfileType(
        targetProfileType
      );


    targetProfileId =
      String(
        targetProfileId || ""
      ).trim();


    // ========================================
    // DEFAULT RELATIONSHIP
    // ========================================

    const defaultRelationship = {

      exists: false,

      interestId: "",

      status: "NONE",

      direction: "",

      canSendInterest: true,

      canViewContact: false,

      hideFromSearch: false,

      isMatched: false,

      isClosed: false

    };


    if (
      !userMobile ||
      !targetProfileType ||
      !targetProfileId
    ) {

      return defaultRelationship;

    }


    // ========================================
    // FIND CURRENT USER PROFILE
    // ========================================

    const currentUser =
      findInterestUserProfile(
        userMobile
      );


    if (
      !currentUser ||
      !currentUser.found
    ) {

      return defaultRelationship;

    }


    // ========================================
    // GET INTEREST SHEET
    // ========================================

    const sheet =
      getProfileInterestSheet();


    if (!sheet) {

      return defaultRelationship;

    }


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    // ========================================
    // SEARCH RELATIONSHIP
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const interestId =
        String(
          data[i][1] || ""
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


      const receiverType =
        String(
          data[i][10] || ""
        )
        .trim()
        .toLowerCase();


      const receiverId =
        String(
          data[i][11] || ""
        ).trim();


      const status =
        String(
          data[i][12] || "PENDING"
        )
        .trim()
        .toUpperCase();


      // ======================================
      // CURRENT USER → TARGET
      // ======================================

      const sentByCurrentUser =

        senderType === currentUser.type &&

        senderId === currentUser.id &&

        receiverType === targetProfileType &&

        receiverId === targetProfileId;


      // ======================================
      // TARGET → CURRENT USER
      // Reverse relationship
      // ======================================

      const receivedByCurrentUser =

        receiverType === currentUser.type &&

        receiverId === currentUser.id &&

        senderType === targetProfileType &&

        senderId === targetProfileId;


      if (
        !sentByCurrentUser &&
        !receivedByCurrentUser
      ) {

        continue;

      }


      const direction =
        sentByCurrentUser
          ? "SENT"
          : "RECEIVED";


      // ======================================
      // PENDING
      // ======================================

      if (
        status === "PENDING"
      ) {

        return {

          exists: true,

          interestId:
            interestId,

          status:
            direction === "SENT"
              ? "PENDING_SENT"
              : "PENDING_RECEIVED",

          rawStatus:
            "PENDING",

          direction:
            direction,

          canSendInterest:
            false,

          canViewContact:
            false,

          hideFromSearch:
            false,

          isMatched:
            false,

          isClosed:
            false

        };

      }


      // ======================================
      // ACCEPTED
      // ======================================

      if (
        status === "ACCEPTED"
      ) {

        return {

          exists: true,

          interestId:
            interestId,

          status:
            "ACCEPTED",

          rawStatus:
            "ACCEPTED",

          direction:
            direction,

          canSendInterest:
            false,

          canViewContact:
            true,

          hideFromSearch:
            true,

          isMatched:
            true,

          isClosed:
            false

        };

      }


      // ======================================
      // DECLINED
      // ======================================

      if (
        status === "DECLINED"
      ) {

        return {

          exists: true,

          interestId:
            interestId,

          status:
            "DECLINED",

          rawStatus:
            "DECLINED",

          direction:
            direction,

          canSendInterest:
            false,

          canViewContact:
            false,

          hideFromSearch:
            true,

          isMatched:
            false,

          isClosed:
            true

        };

      }

    }


    return defaultRelationship;

  }


  catch (error) {

    console.error(
      "getInterestRelationship Error:",
      error
    );


    return {

      exists: false,

      interestId: "",

      status: "NONE",

      direction: "",

      canSendInterest: false,

      canViewContact: false,

      hideFromSearch: false,

      isMatched: false,

      isClosed: false,

      error: true

    };

  }

}


function addInterestRelationshipsToProfiles(
  profiles,
  userMobile,
  profileType
) {

  if (
    !Array.isArray(profiles)
  ) {

    return [];

  }


  return profiles.map(
    function(profile) {

      const relationship =
        getInterestRelationship(

          userMobile,

          profileType,

          profile.id

        );


      profile.interestRelationship =
        relationship;


      return profile;

    }
  );

}


function testInterestRelationship() {

  const result =
    getInterestRelationship(

      // Logged-in user's mobile
      "8975593689",

      // Target
      "bride",

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