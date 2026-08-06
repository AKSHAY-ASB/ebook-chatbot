// ==========================================
// SAVE / UPDATE PROFILE REACTION
// ==========================================

function saveProfileReaction(
  viewerMobile,
  viewerName,
  viewerRegisteredSheet,

  viewerProfileType,
  viewerProfileId,

  targetProfileType,
  targetProfileId,
  targetProfileName,

  targetMobile,

  reaction
) {

  try {

    // ==========================================
    // 1. NORMALIZE VALUES
    // ==========================================

          viewerMobile =
        String(viewerMobile || "")
          .replace(/\D/g,"")
          .slice(-10);

      viewerName =
        String(viewerName || "").trim();

      viewerRegisteredSheet =
        String(viewerRegisteredSheet || "").trim();

      viewerProfileType =
        String(viewerProfileType || "")
          .trim()
          .toLowerCase();

      viewerProfileId =
        String(viewerProfileId || "").trim();

      targetProfileType =
        String(targetProfileType || "")
          .trim()
          .toLowerCase();

      targetProfileId =
        String(targetProfileId || "").trim();

      targetProfileName =
        String(targetProfileName || "").trim();

      targetMobile =
        String(targetMobile || "")
          .replace(/\D/g,"")
          .slice(-10);

      reaction =
        String(reaction || "")
          .trim()
          .toUpperCase();


    // ==========================================
    // 2. VALIDATION
    // ==========================================

    if (!viewerMobile) {

      return {
        success: false,
        message:
          "User mobile number missing."
      };

    }

    if (!targetProfileType || !targetProfileId)
    {

      return {
        success: false,
        message:
          "Profile information missing."
      };

    }


    if (
      reaction !== "LIKE" &&
      reaction !== "DISLIKE"
    ) {

      return {
        success: false,
        message:
          "Invalid reaction."
      };

    }


    // ==========================================
    // 3. GET SHEET
    // ==========================================

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();


    const sheet =
      ss.getSheetByName(
        "Profile Reactions"
      );


    if (!sheet) {

      return {
        success: false,
        message:
          'Sheet "Profile Reactions" not found.'
      };

    }


    // ==========================================
    // 4. GET EXISTING DATA
    // ==========================================

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    let existingRow = -1;


    // ==========================================
    // 5. FIND SAME USER + SAME PROFILE
    // ==========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

 

      const rowMobile =
        String(data[i][1] || "")
        .replace(/\D/g,"")
        .slice(-10);


      const rowType =
        String(data[i][6] || "")
        .trim()
        .toLowerCase();


      const rowProfileId =
        String(data[i][7] || "")
        .trim();


      if (
        rowMobile === viewerMobile &&
        rowType === targetProfileType &&
        rowProfileId === targetProfileId
      ) {

        existingRow =
          i + 1;

        break;

      }

    }


    const now =
      new Date();


    // ==========================================
    // 6. EXISTING PROFILE
    // UPDATE SAME ROW
    // ==========================================

    if (
      existingRow !== -1
    ) {

      // C Viewer Name
      sheet
        .getRange(existingRow, 3)
        .setValue(viewerName);

      // D Viewer Registered Sheet
      sheet
        .getRange(existingRow, 4)
        .setValue(viewerRegisteredSheet);

      // E Viewer Profile Type
      sheet
        .getRange(existingRow, 5)
        .setValue(viewerProfileType);

      // F Viewer Profile ID
      sheet
        .getRange(existingRow, 6)
        .setValue(viewerProfileId);

      // I Target Profile Name
      sheet
        .getRange(existingRow, 9)
        .setValue(targetProfileName);

      // J Reaction
      sheet
        .getRange(existingRow, 10)
        .setValue(reaction);

      // K Updated At
      sheet
        .getRange(existingRow, 11)
        .setValue(now);

      // L Target Mobile
      sheet
        .getRange(existingRow, 12)
        .setValue(targetMobile);



      const relationship = getRelationshipStatus(

          viewerMobile,

          targetMobile

      );

      return {

            success: true,

            updated: true,

            reaction: reaction,

            relationship: relationship,

            targetProfileType: targetProfileType,

            targetProfileId: targetProfileId

        };
    }


    // ==========================================
    // 7. NEW PROFILE
    // CREATE NEW ROW
    // ==========================================

    console.log({

      viewerMobile,

      viewerProfileType,

      viewerProfileId,

      targetProfileType,

      targetProfileId,

      targetMobile,

      reaction

    });

   sheet.appendRow([

      now,                    // A Timestamp

      viewerMobile,           // B Viewer Mobile

      viewerName,             // C Viewer Name

      viewerRegisteredSheet,  // D Viewer Registered Sheet

      viewerProfileType,      // E Viewer Profile Type

      viewerProfileId,        // F Viewer Profile ID

      targetProfileType,      // G Target Profile Type

      targetProfileId,        // H Target Profile ID

      targetProfileName,      // I Target Profile Name

      reaction,               // J Reaction

      now,                    // K Updated At

      targetMobile            // L Target Mobile

    ]);


    const relationship = getRelationshipStatus(

        viewerMobile,

        targetMobile

    );


    return {

        success: true,

        updated: true,

        reaction: reaction,

        relationship: relationship,

        targetProfileType: targetProfileType,

        targetProfileId: targetProfileId

    };

  }

  catch (error) {

    console.error(
      "saveProfileReaction Error:",
      error
    );


    return {

      success: false,

      message:
        error.message

    };

  }

}


function testSaveProfileReaction() {

  const result =
    saveProfileReaction(

      "8975593689",

      "Test User",

      "वधू",

      "bride",

      "TEST001",

      "Test Profile",

      "9307375984",

      "DISLIKE"

    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}


function testProfileReaction() {

  const result =
    saveProfileReaction(

      "9999999999",

      "TEST USER",

      "वर",

      "bride",

      "TEST-001",

      "TEST PROFILE",

      "9307375984",

      "LIKE"

    );


  Logger.log(
    JSON.stringify(result)
  );

}