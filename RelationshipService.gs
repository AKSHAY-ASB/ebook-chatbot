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

        const headers =
        data[0].map(function(header){

            return String(header).trim();

        });

          const viewerMobileIndex =
              headers.indexOf("Viewer Mobile");

          const targetMobileIndex =
              headers.indexOf("Target Mobile");

          const reactionIndex =
              headers.indexOf("Reaction");


              if (

                  viewerMobileIndex === -1 ||

                  targetMobileIndex === -1 ||

                  reactionIndex === -1

              ){

                  return {

                      success:false,

                      status:
                          RELATIONSHIP_STATUS.NONE,

                      message:
                          "Required columns not found."

                  };

              }

              let outgoingReaction = "";

              let incomingReaction = "";


                              for (

                    let i = 1;

                    i < data.length;

                    i++

                ){

                    const row = data[i];

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

                    // Logged-in user → Target

                    if (

                        rowViewer === viewerMobile &&

                        rowTarget === targetMobile

                    ){

                        outgoingReaction =
                            reaction;

                    }

                    // Target → Logged-in user

                    if (

                        rowViewer === targetMobile &&

                        rowTarget === viewerMobile

                    ){

                        incomingReaction =
                            reaction;

                    }

                }

                // ==========================================
                // DETERMINE RELATIONSHIP
                // ==========================================

                let relationshipStatus =
                    RELATIONSHIP_STATUS.NONE;


                // ------------------------------------------
                // BOTH LIKED EACH OTHER
                // ------------------------------------------

                if (

                    outgoingReaction === "LIKE" &&

                    incomingReaction === "LIKE"

                ){

                    relationshipStatus =
                        RELATIONSHIP_STATUS.MUTUAL_LIKE;

                }


                // ------------------------------------------
                // LOGGED-IN USER ALREADY LIKED
                // ------------------------------------------

                else if (

                    outgoingReaction === "LIKE"

                ){

                    relationshipStatus =
                        RELATIONSHIP_STATUS.OUTGOING_LIKE;

                }


                // ------------------------------------------
                // OTHER USER LIKED ME
                // ------------------------------------------

               // 1
                if (

                    outgoingReaction === "LIKE" &&

                    incomingReaction === "LIKE"

                ){

                    relationshipStatus =
                        RELATIONSHIP_STATUS.MUTUAL_LIKE;

                }

                // 2
                else if (

                    outgoingReaction === "DISLIKE"

                ){

                    relationshipStatus =
                        RELATIONSHIP_STATUS.DISLIKED;

                }

                // 3
                else if (

                    outgoingReaction === "LIKE"

                ){

                    relationshipStatus =
                        RELATIONSHIP_STATUS.OUTGOING_LIKE;

                }

                // 4
                else if (

                    incomingReaction === "LIKE"

                ){

                    relationshipStatus =
                        RELATIONSHIP_STATUS.INCOMING_LIKE;

                }

                // 5
                else{

                    relationshipStatus =
                        RELATIONSHIP_STATUS.NONE;

                }

                return {

                  success: true,

                  status: relationshipStatus,

                  isMutual:
                      relationshipStatus === RELATIONSHIP_STATUS.MUTUAL_LIKE,

                  canLike:
                      
                      relationshipStatus === RELATIONSHIP_STATUS.NONE ||

                      relationshipStatus === RELATIONSHIP_STATUS.INCOMING_LIKE ||

                      relationshipStatus === RELATIONSHIP_STATUS.DISLIKED,

                  canDislike:
                      relationshipStatus !== RELATIONSHIP_STATUS.DISLIKED,

                  canSendInterest:
                      relationshipStatus === RELATIONSHIP_STATUS.MUTUAL_LIKE,

                  likeLabel:
                      getLikeLabel(relationshipStatus),

                  dislikeLabel:
                      getDislikeLabel(relationshipStatus)

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
