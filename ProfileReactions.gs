// ==========================================
// SAVE / UPDATE PROFILE REACTION
// ==========================================

function saveProfileReaction(
  userMobile,
  userName,
  registeredSheet,
  profileType,
  profileId,
  profileName,
  reaction
) {

  try {

    // ==========================================
    // 1. NORMALIZE VALUES
    // ==========================================

    userMobile =
      String(
        userMobile || ""
      ).trim();


    userName =
      String(
        userName || ""
      ).trim();


    registeredSheet =
      String(
        registeredSheet || ""
      ).trim();


    profileType =
      String(
        profileType || ""
      )
      .trim()
      .toLowerCase();


    profileId =
      String(
        profileId || ""
      ).trim();


    profileName =
      String(
        profileName || ""
      ).trim();


    reaction =
      String(
        reaction || ""
      )
      .trim()
      .toUpperCase();


    // ==========================================
    // 2. VALIDATION
    // ==========================================

    if (!userMobile) {

      return {
        success: false,
        message:
          "User mobile number missing."
      };

    }


    if (
      !profileType ||
      !profileId
    ) {

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
        String(
          data[i][1] || ""
        ).trim();


      const rowType =
        String(
          data[i][4] || ""
        )
        .trim()
        .toLowerCase();


      const rowProfileId =
        String(
          data[i][5] || ""
        ).trim();


      if (
        rowMobile === userMobile &&
        rowType === profileType &&
        rowProfileId === profileId
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

      sheet
        .getRange(
          existingRow,
          3
        )
        .setValue(
          userName
        );


      sheet
        .getRange(
          existingRow,
          4
        )
        .setValue(
          registeredSheet
        );


      sheet
        .getRange(
          existingRow,
          7
        )
        .setValue(
          profileName
        );


      sheet
        .getRange(
          existingRow,
          8
        )
        .setValue(
          reaction
        );


      sheet
        .getRange(
          existingRow,
          9
        )
        .setValue(
          now
        );


      return {

        success: true,

        updated: true,

        reaction:
          reaction,

        profileType:
          profileType,

        profileId:
          profileId

      };

    }


    // ==========================================
    // 7. NEW PROFILE
    // CREATE NEW ROW
    // ==========================================

    sheet.appendRow([

      now,                 // A Timestamp

      userMobile,          // B User Mobile

      userName,            // C User Name

      registeredSheet,     // D Registered Sheet

      profileType,         // E Profile Type

      profileId,           // F Profile ID

      profileName,         // G Profile Name

      reaction,            // H Reaction

      now                  // I Updated At

    ]);


    return {

      success: true,

      updated: false,

      reaction:
        reaction,

      profileType:
        profileType,

      profileId:
        profileId

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

      "9999999999",

      "Test User",

      "वधू",

      "bride",

      "TEST001",

      "Test Profile",

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

      "LIKE"

    );


  Logger.log(
    JSON.stringify(result)
  );

}