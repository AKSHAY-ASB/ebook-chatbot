/**
 * ============================================
 * GET MY PROFILE
 * ============================================
 *
 * IMPORTANT:
 * Do NOT accept mobile/profileId from frontend.
 *
 * We use the server-side session instead.
 * ============================================
 */

function getMyProfile(sessionToken) {

  try {

    // ==========================================
    // 1. VERIFY SESSION
    // ==========================================

    const sessionResult =
      getVerifiedProfileSession(
        sessionToken
      );


    if (
      !sessionResult.success ||
      !sessionResult.authorized
    ) {

      return {

        success: false,

        authorized: false,

        message:
          sessionResult.message ||
          "Unauthorized access."

      };

    }


    const user =
      sessionResult.session;


    // ==========================================
    // 2. GET SHEET
    // ==========================================

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();


    const sheet =
      ss.getSheetByName(
        user.sheetName
      );


    if (!sheet) {

      return {

        success: false,

        authorized: false,

        message:
          "Profile sheet not found."

      };

    }


    // ==========================================
    // 3. GET USER'S EXACT ROW
    // ==========================================

    const rowNumber =
      Number(
        user.rowNumber
      );


    if (
      !rowNumber ||
      rowNumber < 2
    ) {

      return {

        success: false,

        authorized: false,

        message:
          "Invalid profile record."

      };

    }


    const lastColumn =
      sheet.getLastColumn();


    const row =
      sheet
        .getRange(
          rowNumber,
          1,
          1,
          lastColumn
        )
        .getDisplayValues()[0];


    // ==========================================
    // 4. VERIFY PROFILE ID
    // ==========================================

    const headers =
      sheet
        .getRange(
          1,
          1,
          1,
          lastColumn
        )
        .getDisplayValues()[0]
        .map(function(header) {

          return normalizeHeader(
            header
          );

        });


    const idIndex =
      findProfileHeader(
        headers,
        "ID"
      );


    const currentProfileId =
      getProfileCell(
        row,
        idIndex
      );


    // ==========================================
    // SECURITY CHECK
    // ==========================================

    if (
      currentProfileId !==
      user.profileId
    ) {

      console.error(
        "PROFILE OWNERSHIP MISMATCH",
        {
          sessionProfileId:
            user.profileId,

          currentProfileId:
            currentProfileId,

          sheet:
            user.sheetName,

          row:
            rowNumber
        }
      );


      return {

        success: false,

        authorized: false,

        message:
          "या प्रोफाइलला access करण्याची परवानगी नाही."

      };

    }


    // ==========================================
    // 5. GET BB EDIT LINK
    // ==========================================

    const editLinkIndex = 53;

    const editLink =
      row[editLinkIndex]
        ? row[editLinkIndex]
            .toString()
            .trim()
        : "";


    // ==========================================
    // 6. RETURN PROFILE
    // ==========================================

    return {

      success: true,

      authorized: true,

      profileFound: true,

      profileId:
        currentProfileId,

      name:
        getProfileCell(
          row,
          findProfileHeader(
            headers,
            "नाव :"
          )
        ),

      mobile:
        user.mobile,

      registeredSheet:
        user.sheetName,

      profileType:
        user.sheetName === "वधू"
          ? "bride"
          : user.sheetName === "वर"
          ? "groom"
          : "other",

      rowNumber:
        rowNumber,

      editLinkAvailable:
        !!editLink,

      message:
        "तुमचे प्रोफाइल लोड झाले आहे."

    };


  }

  catch (error) {

    console.error(
      "getMyProfile Error:",
      error
    );


    return {

      success: false,

      authorized: false,

      message:
        "प्रोफाइल लोड करताना समस्या आली."

    };

  }

}


/**
 * ============================================
 * GET PROFILE CELL
 * ============================================
 */
function getProfileCell(row, index) {

  if (
    index === -1 ||
    index === undefined ||
    index === null
  ) {

    return "";

  }


  return row[index] !== undefined
    ? row[index].toString().trim()
    : "";

}


/**
 * ============================================
 * NORMALIZE HEADER
 * ============================================
 */
function normalizeHeader(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return value
    .toString()
    .trim()
    .replace(/\s+/g, " ");

}


/**
 * ============================================
 * FIND PROFILE HEADER
 * ============================================
 */
function findProfileHeader(
  headers,
  target
) {

  const normalizedTarget =
    normalizeHeader(target);


  return headers.indexOf(
    normalizedTarget
  );

}




/**
 * ============================================
 * CREATE PROFILE SESSION
 * ============================================
 *
 * Creates a server-side session for the
 * verified user.
 *
 * IMPORTANT:
 * The frontend should NOT decide ownership.
 * Ownership is stored server-side.
 * ============================================
 */

function createProfileSession(
  mobile,
  sheetName,
  rowNumber,
  profileId
) {

  const token =
    Utilities.getUuid();


  const cache =
    CacheService.getScriptCache();


  const sessionData = {

    mobile: mobile,

    sheetName: sheetName,

    rowNumber: rowNumber,

    profileId: profileId,

    createdAt: Date.now()

  };


  cache.put(
    "PROFILE_SESSION_" + token,
    JSON.stringify(sessionData),
    21600
  );
  // 21600 seconds = 6 hours


  return token;

}



/**
 * ============================================
 * GET VERIFIED PROFILE SESSION
 * ============================================
 */

function getVerifiedProfileSession(
  sessionToken
) {

  try {

    if (!sessionToken) {

      return {
        success: false,
        authorized: false,
        message: "Session not found."
      };

    }


    const cache =
      CacheService.getScriptCache();


    const session =
      cache.get(
        "PROFILE_SESSION_" + sessionToken
      );


    if (!session) {

      return {
        success: false,
        authorized: false,
        sessionExpired: true,
        message:
          "तुमचे session expire झाले आहे. कृपया पुन्हा login करा."
      };

    }


    return {

      success: true,

      authorized: true,

      session:
        JSON.parse(session)

    };

  }

  catch (error) {

    console.error(
      "Session Verification Error:",
      error
    );


    return {

      success: false,

      authorized: false,

      message:
        "Session verify करताना समस्या आली."

    };

  }

}





function testGetMyProfile() {

  const result =
    getMyProfile(
      "7385378725"
    );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}