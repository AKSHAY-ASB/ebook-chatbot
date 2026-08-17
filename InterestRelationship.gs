

function createDefaultInterestRelationship(error = false) {
  return {
    exists: false,
    interestId: "",
    status: "NONE",
    direction: "",
    canSendInterest: true,
    canViewContact: false,
    hideFromSearch: false,
    isMatched: false,
    isClosed: false,
    ...(error ? { error: true } : {})
  };
}


// ==========================================
// GET INTEREST DATA
// ==========================================
function getInterestData() {

    const sheet =
    getProfileInterestSheet();

  if (!sheet) {
    return null;
  }

  data = sheet.getDataRange().getDisplayValues();

  console.log(
      "INTEREST DATA LOADED"
    );


  return data;
}

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

   const defaultRelationship =
    createDefaultInterestRelationship();


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
      // LOAD INTEREST DATA FROM CACHE
      // ========================================

        const data = getInterestData();

        if (!data) {

            profiles.forEach(function(profile) {
                profile.interestRelationship =
                    createDefaultInterestRelationship();
            });

            return profiles;
        }


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


// ==========================================
// BULK INTEREST RELATIONSHIPS
// Optimized for multiple profiles
// Reads user + Interest sheet only ONCE
// ==========================================

function addInterestRelationshipsToProfiles(
  profiles,
  userMobile,
  profileType
) {

  try {

    // ========================================
    // VALIDATE PROFILES
    // ========================================

    if (
      !Array.isArray(profiles) ||
      profiles.length === 0
    ) {

      return [];

    }


    // ========================================
    // DEFAULT RELATIONSHIP
    // ========================================

      


    // ========================================
    // NORMALIZE MOBILE
    // ========================================

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    // ========================================
    // NORMALIZE PROFILE TYPE
    // ========================================

    profileType =
      normalizeInterestProfileType(
        profileType
      );


    // ========================================
    // INVALID USER / TYPE
    // ========================================

    if (
      !userMobile ||
      !profileType
    ) {

      profiles.forEach(
        function(profile) {

          profile.interestRelationship =
            createDefaultInterestRelationship();

        }
      );


      return profiles;

    }


    // ========================================
    // FIND CURRENT USER
    // ONLY ONCE
    // ========================================

    const currentUser =
      findInterestUserProfile(
        userMobile
      );


    if (
      !currentUser ||
      !currentUser.found
    ) {

      profiles.forEach(
        function(profile) {

          profile.interestRelationship =
            createDefaultInterestRelationship();

        }
      );


      return profiles;

    }


      // ========================================
      // LOAD INTEREST DATA FROM CACHE
      // ========================================

      let data =
        getCache(
          CACHE_KEYS.PROFILE_INTEREST
        );


      // ========================================
      // CACHE MISS
      // ========================================

      if (!data) {

        const sheet =
          getProfileInterestSheet();

        if (!sheet) {

          profiles.forEach(function(profile) {

            profile.interestRelationship =
              createDefaultInterestRelationship();

          });

          return profiles;

        }

        data =
          sheet
            .getDataRange()
            .getDisplayValues();

          console.log(
              "INTEREST DATA LOADED"
            );

        console.log(
          "INTEREST CACHE MISS"
        );

      }
      else {

        console.log(
          "INTEREST CACHE HIT"
        );

}


    // ========================================
    // CREATE TARGET PROFILE ID SET
    // ========================================

    const targetProfileIds = {};


    profiles.forEach(
      function(profile) {

        const profileId =
          String(
            profile.id || ""
          ).trim();


        if (profileId) {

          targetProfileIds[
            profileId
          ] = true;

        }

      }
    );


    // ========================================
    // RELATIONSHIP MAP
    // ========================================

    const relationshipMap = {};


    // ========================================
    // SCAN INTEREST DATA ONCE
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      const interestId =
        String(
          row[1] || ""
        ).trim();


      const senderType =
        String(
          row[5] || ""
        )
        .trim()
        .toLowerCase();


      const senderId =
        String(
          row[6] || ""
        ).trim();


      const receiverType =
        String(
          row[10] || ""
        )
        .trim()
        .toLowerCase();


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


      let targetProfileId = "";

      let direction = "";


      // ======================================
      // CURRENT USER SENT INTEREST
      // ======================================

      if (
        senderType ===
          currentUser.type &&

        senderId ===
          currentUser.id &&

        receiverType ===
          profileType &&

        targetProfileIds[
          receiverId
        ]
      ) {

        targetProfileId =
          receiverId;

        direction =
          "SENT";

      }


      // ======================================
      // CURRENT USER RECEIVED INTEREST
      // ======================================

      else if (
        receiverType ===
          currentUser.type &&

        receiverId ===
          currentUser.id &&

        senderType ===
          profileType &&

        targetProfileIds[
          senderId
        ]
      ) {

        targetProfileId =
          senderId;

        direction =
          "RECEIVED";

      }


      // ======================================
      // NOT ONE OF CURRENT PAGE PROFILES
      // ======================================

      if (!targetProfileId) {

        continue;

      }


      // ======================================
      // KEEP FIRST MATCH
      // Same behaviour as old function
      // ======================================

      if (
        relationshipMap[
          targetProfileId
        ]
      ) {

        continue;

      }


      // ======================================
      // PENDING
      // ======================================

      if (
        status === "PENDING"
      ) {

        relationshipMap[
          targetProfileId
        ] = {

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


        continue;

      }


      // ======================================
      // ACCEPTED
      // ======================================

      if (
        status === "ACCEPTED"
      ) {

        relationshipMap[
          targetProfileId
        ] = {

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


        continue;

      }


      // ======================================
      // DECLINED
      // ======================================

      if (
        status === "DECLINED"
      ) {

        relationshipMap[
          targetProfileId
        ] = {

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


    // ========================================
    // ATTACH RESULT TO PROFILES
    // ========================================

    profiles.forEach(
      function(profile) {

        const profileId =
          String(
            profile.id || ""
          ).trim();


        profile.interestRelationship =

          relationshipMap[
            profileId
          ] ||

          createDefaultInterestRelationship();

      }
    );


    console.log(
      "BULK INTEREST LOOKUP:",
      {
        profiles:
          profiles.length,

        relationships:
          Object.keys(
            relationshipMap
          ).length
      }
    );


    return profiles;

  }


  catch (error) {

    console.error(
      "addInterestRelationshipsToProfiles Error:",
      error
    );


    // ========================================
    // SAFE FALLBACK
    // ========================================

    profiles.forEach(
      function(profile) {

      profile.interestRelationship =
        createDefaultInterestRelationship(true);

      }
    );


    return profiles;

  }

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