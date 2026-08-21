// ============================================================
// FILE : MatchingRepository.gs
// MODULE : Matching
// PURPOSE : Read raw profile data for Matching Engine
//
// RESPONSIBILITY
//  - Read profiles from वधू / वर / इतर sheets
//  - Normalize profile type only
//  - Return raw profile records
//  - Keep Google Sheet access isolated
//
// DOES NOT
//  - Parse expectations
//  - Normalize education / height / income
//  - Calculate matching score
//  - Apply matching rules
//  - Apply LIKE / DISLIKE logic
//  - Apply Interest logic
//  - Rank profiles
//
// DEPENDENCIES
//  - SpreadsheetApp
//  - Existing normalizeHeader()
//  - Existing findProfileHeader()
//  - Existing getProfileCell()
//
// IMPORTANT
//  - Existing sheets are NOT modified.
//  - Existing profile/search functions are NOT modified.
// ============================================================


// ============================================================
// MATCHING PROFILE SHEET CONFIGURATION
// ============================================================

const MATCHING_PROFILE_SHEETS = {

  bride: "वधू",

  groom: "वर",

  other: "इतर"

};


// ============================================================
// GET PROFILE SHEET NAME
// ============================================================

function getMatchingProfileSheetName(
  profileType
) {

  profileType =
    String(
      profileType || ""
    )
    .trim()
    .toLowerCase();


  return (
    MATCHING_PROFILE_SHEETS[
      profileType
    ] || ""
  );

}


// ============================================================
// GET RAW PROFILE SHEET DATA
//
// Returns:
// {
//   success: true,
//   profileType: "bride",
//   sheetName: "वधू",
//   headers: [...],
//   rows: [...]
// }
// ============================================================

function getMatchingRawProfileData(
  profileType
) {

  try {

    // --------------------------------------------------------
    // 1. NORMALIZE PROFILE TYPE
    // --------------------------------------------------------

    profileType =
      String(
        profileType || ""
      )
      .trim()
      .toLowerCase();


    // --------------------------------------------------------
    // 2. RESOLVE SHEET
    // --------------------------------------------------------

    const sheetName =
      getMatchingProfileSheetName(
        profileType
      );


    if (!sheetName) {

      return {

        success: false,

        code:
          "INVALID_PROFILE_TYPE",

        message:
          "Invalid matching profile type.",

        profileType:
          profileType

      };

    }


    // --------------------------------------------------------
    // 3. GET SPREADSHEET
    // --------------------------------------------------------

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();


    // --------------------------------------------------------
    // 4. GET SHEET
    // --------------------------------------------------------

    const sheet =
      ss.getSheetByName(
        sheetName
      );


    if (!sheet) {

      return {

        success: false,

        code:
          "PROFILE_SHEET_NOT_FOUND",

        message:
          "Profile sheet not found.",

        profileType:
          profileType,

        sheetName:
          sheetName

      };

    }


    // --------------------------------------------------------
    // 5. READ DATA
    // --------------------------------------------------------

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    if (
      !data ||
      data.length === 0
    ) {

      return {

        success: true,

        profileType:
          profileType,

        sheetName:
          sheetName,

        headers: [],

        rows: []

      };

    }


    // --------------------------------------------------------
    // 6. HEADERS
    // --------------------------------------------------------

    const headers =
      data[0].map(
        function(header) {

          return String(
            header || ""
          ).trim();

        }
      );


    // --------------------------------------------------------
    // 7. RAW ROWS
    // --------------------------------------------------------

    const rows =
      data
        .slice(1);


    // --------------------------------------------------------
    // 8. RETURN RAW DATA
    // --------------------------------------------------------

    return {

      success: true,

      profileType:
        profileType,

      sheetName:
        sheetName,

      headers:
        headers,

      rows:
        rows

    };

  }


  catch (error) {

    console.error(
      "getMatchingRawProfileData Error:",
      error
    );


    return {

      success: false,

      code:
        "MATCHING_REPOSITORY_ERROR",

      message:
        "Unable to load matching profile data.",

      profileType:
        profileType || "",

      error:
        error.message || ""

    };

  }

}


// ============================================================
// GET ALL RAW CANDIDATE PROFILE DATA
//
// IMPORTANT
// This function only retrieves data.
// It DOES NOT decide whether a profile matches.
//
// Example:
// getAllMatchingCandidateData(["bride"])
//
// Returns:
// [
//   {
//     profileType: "bride",
//     sheetName: "वधू",
//     headers: [...],
//     rows: [...]
//   }
// ]
// ============================================================

function getAllMatchingCandidateData(
  profileTypes
) {

  try {

    // --------------------------------------------------------
    // DEFAULT TYPES
    // --------------------------------------------------------

    if (
      !Array.isArray(
        profileTypes
      ) ||
      profileTypes.length === 0
    ) {

      profileTypes = [

        "bride",

        "groom",

        "other"

      ];

    }


    const results = [];


    // --------------------------------------------------------
    // LOAD EACH SHEET
    // --------------------------------------------------------

    profileTypes.forEach(
      function(profileType) {

        const result =
          getMatchingRawProfileData(
            profileType
          );


        if (
          result &&
          result.success
        ) {

          results.push(
            result
          );

        }

      }
    );


    return {

      success: true,

      profiles:
        results

    };

  }


  catch (error) {

    console.error(
      "getAllMatchingCandidateData Error:",
      error
    );


    return {

      success: false,

      code:
        "MATCHING_CANDIDATE_LOAD_ERROR",

      message:
        "Unable to load candidate profile data.",

      profiles: []

    };

  }

}


function testMatchingRepository() {

  const result =
    getMatchingRawProfileData(
      "groom"
    );


  console.log(
    JSON.stringify(
      {
        success:
          result.success,

        profileType:
          result.profileType,

        sheetName:
          result.sheetName,

        headerCount:
          result.headers
            ? result.headers.length
            : 0,

        profileCount:
          result.rows
            ? result.rows.length
            : 0,

        firstProfile:
          result.rows &&
          result.rows.length > 0
            ? result.rows[0]
            : null

      },
      null,
      2
    )
  );

}