/**
 * ==========================================
 * RELATIONSHIP SERVICE
 * ==========================================
 *
 * Central service to determine the
 * relationship between two profiles.
 *
 * Used by:
 *
 * ✔ Search Profiles
 * ✔ Likes Received
 * ✔ Liked Profiles
 * ✔ Received Interests
 * ✔ Sent Interests
 * ✔ Notifications
 * ✔ Mutual Matches
 *
 * ==========================================
 */

const RELATIONSHIP_STATUS = {

  NONE: "NONE",

  INCOMING_LIKE: "INCOMING_LIKE",

  OUTGOING_LIKE: "OUTGOING_LIKE",

  MUTUAL_LIKE: "MUTUAL_LIKE",

  DISLIKED: "DISLIKED"

};


function getRelationshipStatus(

  viewerMobile,

  targetMobile

) {

  viewerMobile =
    normalizeMobile(
      viewerMobile
    );

  targetMobile =
    normalizeMobile(
      targetMobile
    );


  // ==========================================
  // VALIDATION
  // ==========================================

  if (

    !viewerMobile ||

    !targetMobile

  ) {

    return {

      success: false,

      status:
        RELATIONSHIP_STATUS.NONE

    };

  }


  // ==========================================
  // PROFILE REACTIONS SHEET
  // ==========================================

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(
        "Profile Reactions"
      );


  if (!sheet) {

    return {

      success: true,

      status:
        RELATIONSHIP_STATUS.NONE

    };

  }


  // ==========================================
  // GET DATA
  // ==========================================

  const data =
    sheet
      .getDataRange()
      .getDisplayValues();


  if (data.length <= 1) {

    return {

      success: true,

      status:
        RELATIONSHIP_STATUS.NONE

    };

  }


  // ==========================================
  // FIND REQUIRED COLUMNS
  // ==========================================

  const headers =
    data[0].map(function(header) {

      return String(
        header
      ).trim();

    });


  const viewerMobileIndex =
    headers.indexOf(
      "Viewer Mobile"
    );


  const targetMobileIndex =
    headers.indexOf(
      "Target Mobile"
    );


  const reactionIndex =
    headers.indexOf(
      "Reaction"
    );


  // ==========================================
  // REQUIRED COLUMNS VALIDATION
  // ==========================================

  if (

    viewerMobileIndex === -1 ||

    targetMobileIndex === -1 ||

    reactionIndex === -1

  ) {

    return {

      success: false,

      status:
        RELATIONSHIP_STATUS.NONE,

      message:
        "Required columns not found."

    };

  }


  // ==========================================
  // REACTION STATES
  // ==========================================

  let outgoingReaction =
    "";

  let incomingReaction =
    "";


  // ==========================================
  // READ BOTH DIRECTIONS
  // ==========================================

  for (

    let i = 1;

    i < data.length;

    i++

  ) {

    const row =
      data[i];


    const rowViewer =
      normalizeMobile(
        row[
          viewerMobileIndex
        ]
      );


    const rowTarget =
      normalizeMobile(
        row[
          targetMobileIndex
        ]
      );


    const reaction =
      String(
        row[
          reactionIndex
        ] || ""
      )
      .trim()
      .toUpperCase();


    // ----------------------------------------
    // LOGGED-IN USER → TARGET
    // ----------------------------------------

    if (

      rowViewer ===
        viewerMobile &&

      rowTarget ===
        targetMobile

    ) {

      outgoingReaction =
        reaction;

    }


    // ----------------------------------------
    // TARGET → LOGGED-IN USER
    // ----------------------------------------

    if (

      rowViewer ===
        targetMobile &&

      rowTarget ===
        viewerMobile

    ) {

      incomingReaction =
        reaction;

    }

  }


  // ==========================================
  // DETERMINE RELATIONSHIP
  //
  // SINGLE SOURCE OF TRUTH
  //
  // A → LIKE → B
  // B → LIKE → A
  //        ↓
  //   MUTUAL_LIKE
  // ==========================================

  let relationshipStatus =
    RELATIONSHIP_STATUS.NONE;


  // ------------------------------------------
  // 1. BOTH USERS LIKED EACH OTHER
  // ------------------------------------------

  if (

    outgoingReaction === "LIKE" &&

    incomingReaction === "LIKE"

  ) {

    relationshipStatus =
      RELATIONSHIP_STATUS.MUTUAL_LIKE;

  }


  // ------------------------------------------
  // 2. LOGGED-IN USER DISLIKED TARGET
  // ------------------------------------------

  else if (

    outgoingReaction === "DISLIKE"

  ) {

    relationshipStatus =
      RELATIONSHIP_STATUS.DISLIKED;

  }


  // ------------------------------------------
  // 3. LOGGED-IN USER LIKED TARGET
  // ------------------------------------------

  else if (

    outgoingReaction === "LIKE"

  ) {

    relationshipStatus =
      RELATIONSHIP_STATUS.OUTGOING_LIKE;

  }


  // ------------------------------------------
  // 4. TARGET LIKED LOGGED-IN USER
  // ------------------------------------------

  else if (

    incomingReaction === "LIKE"

  ) {

    relationshipStatus =
      RELATIONSHIP_STATUS.INCOMING_LIKE;

  }


  // ------------------------------------------
  // 5. NO ACTIVE RELATIONSHIP
  // ------------------------------------------

  else {

    relationshipStatus =
      RELATIONSHIP_STATUS.NONE;

  }


  // ==========================================
  // RETURN RELATIONSHIP
  // ==========================================

  return {

    success: true,

    status:
      relationshipStatus,


    // ========================================
    // MUTUAL MATCH
    // ========================================

    isMutual:
      relationshipStatus ===
        RELATIONSHIP_STATUS.MUTUAL_LIKE,


    // ========================================
    // CAN LIKE
    //
    // Existing behavior preserved
    // ========================================

    canLike:

      relationshipStatus ===
        RELATIONSHIP_STATUS.NONE ||

      relationshipStatus ===
        RELATIONSHIP_STATUS.INCOMING_LIKE ||

      relationshipStatus ===
        RELATIONSHIP_STATUS.DISLIKED,


    // ========================================
    // CAN DISLIKE
    //
    // Existing behavior preserved
    // ========================================

    canDislike:
      relationshipStatus !==
        RELATIONSHIP_STATUS.DISLIKED,


    // ========================================
    // SEND INTEREST
    //
    // Existing behavior preserved
    // ========================================

    canSendInterest:
      relationshipStatus ===
        RELATIONSHIP_STATUS.MUTUAL_LIKE,


    // ========================================
    // LABELS
    // ========================================

    likeLabel:
      getLikeLabel(
        relationshipStatus
      ),


    dislikeLabel:
      getDislikeLabel(
        relationshipStatus
      )

  };

}


function getLikeLabel(status) {

    switch (status) {

        case RELATIONSHIP_STATUS.OUTGOING_LIKE:
            return "❤️ Liked";

        case RELATIONSHIP_STATUS.MUTUAL_LIKE:
            return "❤️ Matched";

        case RELATIONSHIP_STATUS.DISLIKED:
            return "♡ Like";

        default:
            return "♡ Like";

    }

}

function getDislikeLabel(status){

    switch(status){

        case RELATIONSHIP_STATUS.DISLIKED:
            return "👎 Disliked";

        default:
            return "👎 Dislike";

    }

}

// ==========================================
// GET RELATIONSHIP FOR FRONTEND
// ==========================================

function getProfileRelationship(
    viewerMobile,
    targetMobile
) {

    try {

        return getRelationshipStatus(

            viewerMobile,

            targetMobile

        );

    }

    catch (error) {

        console.error(

            "getProfileRelationship Error:",

            error

        );

        return {

            success: false,

            status: RELATIONSHIP_STATUS.NONE,

            message: error.message

        };

    }

}

function testRelationshipStatus(){

    const result =
        getRelationshipStatus(

            "8975593689",

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
