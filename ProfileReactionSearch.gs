// ==========================================
// GET USER PROFILE REACTIONS
// OPTIMIZED FOR PROFILE SEARCH
//
// Reads "Profile Reactions" sheet ONLY ONCE
// and returns both LIKE + DISLIKE data.
// ==========================================

function getUserProfileReactions(
  userMobile
) {

  try {

    // ========================================
    // NORMALIZE MOBILE
    // ========================================

    userMobile =
      String(
        userMobile || ""
      ).trim();


    if (!userMobile) {

      return {
        liked: [],
        disliked: []
      };

    }


    // ========================================
    // GET PROFILE REACTIONS SHEET
    // ========================================

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();


    const sheet =
      ss.getSheetByName(
        "Profile Reactions"
      );


    if (!sheet) {

      return {
        liked: [],
        disliked: []
      };

    }


    // ========================================
    // READ SHEET ONLY ONCE
    // ========================================

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    const liked = [];

    const disliked = [];


    const likedSeen =
      new Set();


    const dislikedSeen =
      new Set();


    const validTypes = [
      "bride",
      "groom",
      "other"
    ];


    // ========================================
    // SCAN DATA ONLY ONCE
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const rowMobile =
        String(
          data[i][1] || ""
        ).trim();


      // Different user
      if (
        rowMobile !== userMobile
      ) {

        continue;

      }


      const profileType =
        String(
          data[i][4] || ""
        )
        .trim()
        .toLowerCase();


      const profileId =
        String(
          data[i][5] || ""
        ).trim();


      const reaction =
        String(
          data[i][7] || ""
        )
        .trim()
        .toUpperCase();


      // ======================================
      // VALIDATE PROFILE
      // ======================================

      if (
        !validTypes.includes(
          profileType
        ) ||
        !profileId
      ) {

        continue;

      }


      const key =
        profileType +
        "_" +
        profileId;


      // ======================================
      // LIKE
      // ======================================

      if (
        reaction === "LIKE"
      ) {

        if (
          !likedSeen.has(key)
        ) {

          likedSeen.add(key);


          liked.push({

            type:
              profileType,

            id:
              profileId

          });

        }


        continue;

      }


      // ======================================
      // DISLIKE
      // ======================================

      if (
        reaction === "DISLIKE"
      ) {

        if (
          !dislikedSeen.has(key)
        ) {

          dislikedSeen.add(key);


          disliked.push({

            type:
              profileType,

            id:
              profileId

          });

        }

      }

    }


    console.log(
      "PROFILE REACTIONS BULK:",
      {
        mobile:
          userMobile,

        liked:
          liked.length,

        disliked:
          disliked.length
      }
    );


    return {

      liked:
        liked,

      disliked:
        disliked

    };

  }


  catch (error) {

    console.error(
      "getUserProfileReactions Error:",
      error
    );


    return {
      liked: [],
      disliked: []
    };

  }

}

// ==========================================
// FILTER DISLIKED USING PRELOADED DATA
// NO SHEET READ
// ==========================================

function excludeDislikedProfilesFromData(
  profiles,
  disliked,
  profileType
) {

  if (
    !Array.isArray(profiles) ||
    profiles.length === 0
  ) {

    return [];

  }


  if (
    !Array.isArray(disliked) ||
    disliked.length === 0
  ) {

    return profiles;

  }


  profileType =
    String(
      profileType || ""
    )
    .trim()
    .toLowerCase();


  const dislikedSet =
    new Set();


  disliked.forEach(
    function(item) {

      const type =
        String(
          item.type || ""
        )
        .trim()
        .toLowerCase();


      const id =
        String(
          item.id || ""
        ).trim();


      if (
        type &&
        id
      ) {

        dislikedSet.add(
          type + "_" + id
        );

      }

    }
  );


  return profiles.filter(
    function(profile) {

      const id =
        String(
          profile.id || ""
        ).trim();


      const type =
        String(
          profile.type ||
          profileType ||
          ""
        )
        .trim()
        .toLowerCase();


      return !dislikedSet.has(
        type + "_" + id
      );

    }
  );

}


// ==========================================
// ADD LIKE STATUS USING PRELOADED DATA
// NO SHEET READ
// ==========================================

function addProfileReactionsFromData(
  profiles,
  liked,
  profileType
) {

  if (
    !Array.isArray(profiles) ||
    profiles.length === 0
  ) {

    return [];

  }


  profileType =
    String(
      profileType || ""
    )
    .trim()
    .toLowerCase();


  const likedSet =
    new Set();


  if (
    Array.isArray(liked)
  ) {

    liked.forEach(
      function(item) {

        const type =
          String(
            item.type || ""
          )
          .trim()
          .toLowerCase();


        const id =
          String(
            item.id || ""
          ).trim();


        if (
          type &&
          id
        ) {

          likedSet.add(
            type + "_" + id
          );

        }

      }
    );

  }


  profiles.forEach(
    function(profile) {

      const id =
        String(
          profile.id || ""
        ).trim();


      const type =
        String(
          profile.type ||
          profileType ||
          ""
        )
        .trim()
        .toLowerCase();


      const key =
        type + "_" + id;


      profile.reaction =
        likedSet.has(key)
          ? "LIKE"
          : "";

    }
  );


  return profiles;

}