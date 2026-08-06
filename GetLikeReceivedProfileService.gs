/**
 * ==========================================
 * LIKE SERVICE
 * ==========================================
 *
 * Purpose
 * -------
 * Read Like information
 * Count Likes
 * Return Like Summary
 * Return Liked Profiles
 *
 * NOTE
 * ----
 * This file NEVER writes reactions.
 * ReactionService.gs is responsible
 * for writing Like / Dislike.
 *
 * ==========================================
 */


// ==========================================
// LIKE CONFIGURATION
// ==========================================

const LIKE_CONFIG = {

  CACHE_KEY:
    "PROFILE_LIKE_COUNT_",

  CACHE_TIME:
    300, // 5 Minutes

  REACTION:
    "LIKE"

};

// ==========================================
// LIKE CACHE KEY
// ==========================================

function getLikeCacheKey(
  profileType,
  profileId
) {

  profileType =
    String(profileType || "")
      .toLowerCase()
      .trim();

  profileId =
    String(profileId || "")
      .trim();

  return (

    LIKE_CONFIG.CACHE_KEY +

    profileType +

    "_" +

    profileId

  );

}

// ==========================================
// CLEAR LIKE CACHE
// ==========================================

function clearLikeCache(
  profileType,
  profileId
) {

  removeCache(

    getLikeCacheKey(

      profileType,

      profileId

    )

  );

}

// ==========================================
// GET TOTAL LIKES
// ==========================================

function getTotalLikes(ownerMobile) {

  try {

    ownerMobile = String(ownerMobile || "")
      .replace(/\D/g, "")
      .slice(-10);

    if (!ownerMobile) {
      return 0;
    }

    const cacheKey =
      LIKE_CONFIG.CACHE_KEY +
      ownerMobile;

    const cachedCount =
      getCache(cacheKey);

    if (cachedCount !== null) {

      console.log(
        "LIKE COUNT CACHE HIT:",
        ownerMobile
      );

      return Number(cachedCount);

    }

    // ==========================================
    // GET PROFILE REACTIONS
    // ==========================================

    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(
          "Profile Reactions"
        );

    if (!sheet) {
      return 0;
    }

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();

    if (data.length <= 1) {
      return 0;
    }

    // ==========================================
    // HEADERS
    // ==========================================

    const headers =
      data[0].map(function(header){

        return String(header).trim();

      });

    const targetMobileIndex =
      headers.indexOf(
        "Target Mobile"
      );

    const reactionIndex =
      headers.indexOf(
        "Reaction"
      );

    if (

      targetMobileIndex === -1 ||

      reactionIndex === -1

    ){

      console.error(
        "Required columns not found."
      );

      console.log(headers);

      return 0;

    }

    // ==========================================
    // COUNT LIKES
    // ==========================================

    let totalLikes = 0;

    for (

      let i = 1;

      i < data.length;

      i++

    ){

      const row = data[i];

      const rowTargetMobile =
        String(
          row[targetMobileIndex] || ""
        )
        .replace(/\D/g,"")
        .slice(-10);

      const rowReaction =
        String(
          row[reactionIndex] || ""
        )
        .trim()
        .toUpperCase();

      if (

        rowTargetMobile === ownerMobile &&

        rowReaction === LIKE_CONFIG.REACTION

      ){

        totalLikes++;

      }

    }

    setCache(

      cacheKey,

      totalLikes,

      LIKE_CONFIG.CACHE_TIME

    );

    return totalLikes;

  }

  catch(error){

    console.error(
      "getTotalLikes Error:",
      error
    );

    return 0;

  }

}


// ==========================================
// GET MY LIKE SUMMARY
// ==========================================

function getMyLikeSummary(userMobile) {

  try {

    userMobile = String(userMobile || "")
      .replace(/\D/g, "")
      .slice(-10);

    if (!userMobile) {

      return {
        success: false,
        totalLikes: 0,
        message: "Invalid mobile."
      };

    }

    // ==========================================
    // FIND USER PROFILE
    // ==========================================

    const user = findInterestUserProfile(userMobile);

    if (!user || !user.found) {

      return {
        success: false,
        totalLikes: 0,
        message: "User profile not found."
      };

    }

    // ==========================================
    // GET TOTAL LIKES
    // ==========================================

    const totalLikes = getTotalLikes(user.mobile);

    // ==========================================
    // RETURN RESULT
    // ==========================================

    return {

      success: true,

      totalLikes: totalLikes,

      profileType: user.type,

      profileId: user.id,

      profileName: user.name,

      mobile: user.mobile,

      message:
        totalLikes > 0
          ? `तुमच्या प्रोफाइलला ${totalLikes} Likes मिळाल्या आहेत.`
          : "अद्याप तुमच्या प्रोफाइलला कोणतीही Like मिळालेली नाही."

    };

  }

  catch (error) {

    console.error(
      "getMyLikeSummary Error:",
      error
    );

    return {

      success: false,

      totalLikes: 0,

      message: error.message || "Unable to get like summary."

    };

  }

}

function testGetTotalLikes() {

  const totalLikes =
    getTotalLikes(
      "9307375984"
    );

  Logger.log(
    totalLikes
  );

}

function testGetMyLikeSummary() {

  const result =
    getMyLikeSummary(
      "9307375984"
    );

  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}

// ==========================================
// GET LIKED PROFILES
// ==========================================

function getLikedReceivedProfiles(
  ownerMobile
) {

  currentProfileScreen = "LIKES_RECEIVED";

  try {

    ownerMobile =
      String(ownerMobile || "")
        .replace(/\D/g, "")
        .slice(-10);

    if (!ownerMobile) {

      return {

        success: false,

        totalLikes: 0,

        profiles: []

      };

    }

    // ==========================================
    // LOAD PROFILE REACTIONS SHEET
    // ==========================================

    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(
          "Profile Reactions"
        );

    if (!sheet) {

      return [];

    }

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();

    if (data.length <= 1) {

      return [];

    }

    // ==========================================
    // FIND REQUIRED COLUMNS
    // ==========================================

    const headers =
      data[0].map(function(header) {

        return String(header)
          .trim();

      });


      const ownerMobileIndex =
        headers.indexOf("Target Mobile");

      const userMobileIndex =
        headers.indexOf("Viewer Mobile");

      const userNameIndex =
        headers.indexOf("Viewer Name");

      const registeredSheetIndex =
        headers.indexOf("Viewer Registered Sheet");

      const profileTypeIndex =
        headers.indexOf("Viewer Profile Type");

      const profileIdIndex =
        headers.indexOf("Viewer Profile ID");

      const reactionIndex =
      headers.indexOf("Reaction");

      const updatedAtIndex =
          headers.indexOf("Updated At");

    // ==========================================
    // VALIDATE REQUIRED COLUMNS
    // ==========================================

    if (

      ownerMobileIndex === -1 ||

      userMobileIndex === -1 ||

      userNameIndex === -1 ||

      registeredSheetIndex === -1 ||

      reactionIndex === -1 ||

      updatedAtIndex === -1 ||

      profileTypeIndex === -1 ||

      profileIdIndex === -1

    ) {

      console.error(
        "Required columns not found."
      );

      return [];

    }

    // ==========================================
    // BUILD LIKED PROFILES LIST
    // ==========================================

    const likedProfiles = [];

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row = data[i];

      const rowOwnerMobile =
        String(
          row[ownerMobileIndex] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);

      const rowReaction =
        String(
          row[reactionIndex] || ""
        )
        .trim()
        .toUpperCase();

      // Only LIKE records of current owner

      if (

        rowOwnerMobile !== ownerMobile ||

        rowReaction !== LIKE_CONFIG.REACTION

      ) {

        continue;

      }

      const viewerMobile =
          normalizeMobile(
              row[userMobileIndex]
          );

      const relationship =
          getRelationshipStatus(

              ownerMobile,

              viewerMobile

          );

      likedProfiles.push({

          viewerMobile:
              viewerMobile,

          viewerName:
              String(row[userNameIndex] || ""),

          viewerRegisteredSheet:
              String(row[registeredSheetIndex] || ""),

          likedAt:
              row[updatedAtIndex],

          viewerProfileType:
              String(row[profileTypeIndex] || ""),

          viewerProfileId:
              String(row[profileIdIndex] || ""),

          relationship:
              relationship,

      });

      console.log(

          "LIKE RELATIONSHIP",

          relationship

      );

    }
    // ==========================================
    // SORT LATEST FIRST
    // ==========================================

    likedProfiles.sort(function(a, b) {

      return new Date(b.likedAt) - new Date(a.likedAt);

    });

    // ==========================================
    // RETURN RESULT
    // ==========================================

    return {

      success: true,

      totalLikes: likedProfiles.length,

      profiles: likedProfiles

    };

  }
  

  catch (error) {

      console.error(
          "getLikedProfiles Error:",
          error
      );

      return {

          success: false,

          message: error.message,

          totalCount: 0,

          profiles: []

      };

  }

}

function testVerifyProfileSearchAccess() {

  const result =
    verifyProfileSearchAccess(
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
