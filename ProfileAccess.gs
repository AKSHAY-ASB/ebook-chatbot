function diagnoseID001FormResponse() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Form responses 1");

  if (!sheet) {
    console.log("Form responses 1 NOT FOUND");
    return;
  }

  const data =
    sheet
      .getDataRange()
      .getDisplayValues();

  console.log("================================");
  console.log("SHEET:", sheet.getName());
  console.log("ROWS:", data.length);
  console.log("COLUMNS:", data[0].length);
  console.log("================================");

  const headers = data[0];

  // Print important headers
  headers.forEach(function(header, index) {

    if (
      String(header)
        .toLowerCase()
        .includes("id") ||
      String(header)
        .toLowerCase()
        .includes("name") ||
      String(header)
        .includes("नाव")
    ) {

      console.log(
        "COLUMN",
        index,
        ":",
        header
      );

    }

  });


  // Find ID001
  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row = data[i];

    const rowText =
      row.join(" | ");

    if (
      rowText.includes("ID001")
    ) {

      console.log(
        "================================"
      );

      console.log(
        "ID001 FOUND"
      );

      console.log(
        "ROW:",
        i + 1
      );

      console.log(
        JSON.stringify(
          row,
          null,
          2
        )
      );

      console.log(
        "================================"
      );

      return;
    }
  }

  console.log(
    "ID001 NOT FOUND IN FORM RESPONSES 1"
  );
}



function diagnoseFormResponseSheet() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  console.log("=================================");
  console.log(
    "SPREADSHEET:",
    ss.getName()
  );

  console.log(
    "SPREADSHEET ID:",
    ss.getId()
  );

  console.log("=================================");

  const sheets =
    ss.getSheets();

  sheets.forEach(function(sheet) {

    console.log(
      "SHEET:",
      sheet.getName(),
      "| ROWS:",
      sheet.getLastRow(),
      "| COLUMNS:",
      sheet.getLastColumn()
    );

  });

  console.log("=================================");

  const sheet =
    ss.getSheetByName("Form responses 1");

  if (!sheet) {

    console.log(
      "❌ Form responses 1 NOT FOUND"
    );

    return;
  }

  const data =
    sheet
      .getDataRange()
      .getDisplayValues();

  console.log(
    "FORM RESPONSE SHEET:",
    sheet.getName()
  );

  console.log(
    "ROWS:",
    data.length
  );

  console.log(
    "COLUMNS:",
    data[0].length
  );

  console.log("=================================");

  const headers =
    data[0];

  headers.forEach(function(header, index) {

    console.log(
      "COLUMN",
      index + 1,
      ":",
      header
    );

  });

  console.log("=================================");

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row =
      data[i];

    const rowText =
      row.join(" | ");

    if (
      rowText.includes("ID001") ||
      rowText.includes("8975593689") ||
      rowText.includes("अक्षय माधवी सुभाष बुचडे")
    ) {

      console.log(
        "================================="
      );

      console.log(
        "✅ MATCHING ROW FOUND"
      );

      console.log(
        "ROW NUMBER:",
        i + 1
      );

      console.log(
        "================================="
      );

      row.forEach(function(value, index) {

        console.log(
          "COLUMN",
          index + 1,
          "| HEADER:",
          headers[index],
          "| VALUE:",
          value
        );

      });

      console.log(
        "================================="
      );

      return;
    }

  }

  console.log(
    "❌ ID001 / MOBILE / NAME NOT FOUND"
  );
}





function checkID001AfterEdit() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("Form responses 1");

  const data =
    sheet.getDataRange().getDisplayValues();

  const headers =
    data[0];

  for (let i = 1; i < data.length; i++) {

    if (
      String(data[i][0]).trim() === "ID001"
    ) {

      console.log("================================");
      console.log("ID001 ROW:", i + 1);
      console.log("================================");

      console.log(
        "ID:",
        data[i][0]
      );

      console.log(
        "Timestamp:",
        data[i][1]
      );

      console.log(
        "Profile Type:",
        data[i][3]
      );

      console.log(
        "Name:",
        data[i][8]
      );

      console.log(
        "Education:",
        data[i][10]
      );

      console.log(
        "Occupation:",
        data[i][21]
      );

      console.log(
        "Mobile:",
        data[i][6]
      );

      console.log(
        "Response Edit URL:",
        data[i][57]
      );

      console.log(
        "Response ID:",
        data[i][58]
      );

      console.log("================================");

      return;
    }
  }

  console.log("ID001 NOT FOUND");
}





// ==========================================
// GET AUTHENTICATED USER'S PROFILE EDIT URL
// Response Edit URL = BF COLUMN
// ==========================================

// ==========================================
// GET AUTHENTICATED USER'S PROFILE EDIT URL
// Response Edit URL = BF COLUMN
// ==========================================

// ==========================================
// GET AUTHENTICATED USER'S PROFILE EDIT URL
// BF = RESPONSE EDIT URL
// ==========================================


function getMyProfileEditUrl(sessionId) {

  try {

    // ==========================================
    // 1. VALIDATE AUTH SESSION
    // ==========================================

    const auth =
      validateAuthSession(sessionId);

    if (
      !auth ||
      auth.success !== true ||
      auth.authenticated !== true ||
      !auth.user
    ) {

      return {
        success: false,
        authenticated: false,
        code: "UNAUTHORIZED",
        message: "कृपया पुन्हा login करा."
      };
    }


    // ==========================================
    // 2. AUTHENTICATED USER IDENTITY
    // ==========================================

    const profileId =
      String(
        auth.user.profileId || ""
      ).trim();

    const profileType =
      String(
        auth.user.profileType || ""
      )
      .trim()
      .toLowerCase();

    const mobile =
      String(
        auth.user.mobile || ""
      ).trim();


    console.log(
      "========== MY PROFILE EDIT =========="
    );

    console.log(
      "Profile ID:",
      profileId
    );

    console.log(
      "Profile Type:",
      profileType
    );

    console.log(
      "Mobile:",
      mobile
    );


    if (!profileId) {

      return {
        success: false,
        authenticated: true,
        code: "INVALID_PROFILE_IDENTITY",
        message:
          "तुमची profile identity उपलब्ध नाही."
      };
    }


    // ==========================================
    // 3. OPEN FORM RESPONSE SHEET
    // ==========================================

    const ss =
      SpreadsheetApp
        .getActiveSpreadsheet();

    const sheet =
      ss.getSheetByName(
        "Form responses 1"
      );


    if (!sheet) {

      return {
        success: false,
        authenticated: true,
        code:
          "FORM_RESPONSE_SHEET_NOT_FOUND",
        message:
          "Form responses 1 sheet सापडली नाही."
      };
    }


    // ==========================================
    // 4. GET SHEET DATA
    // ==========================================

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    if (
      !data ||
      data.length < 2
    ) {

      return {
        success: false,
        authenticated: true,
        code:
          "NO_PROFILE_DATA",
        message:
          "Profile data उपलब्ध नाही."
      };
    }


    const headers =
      data[0];


    console.log(
      "Total Columns:",
      headers.length
    );


    // ==========================================
    // 5. FIND ID COLUMN
    // ==========================================

    const idIndex =
      findProfileHeader(
        headers,
        "ID"
      );


    console.log(
      "ID Index:",
      idIndex
    );


    if (
      idIndex === -1
    ) {

      return {
        success: false,
        authenticated: true,
        code:
          "ID_COLUMN_NOT_FOUND",
        message:
          "Form responses मध्ये ID column सापडला नाही."
      };
    }


    // ==========================================
    // 6. BF = RESPONSE EDIT URL
    //
    // Google Sheet:
    // BF = Column 58
    //
    // JavaScript:
    // Column 58 => index 57
    // ==========================================

    const editUrlIndex = 57;


    console.log(
      "Response Edit URL Index:",
      editUrlIndex
    );

    console.log(
      "Response Edit URL Column:",
      "BF"
    );

    console.log(
      "Response Edit URL Header:",
      headers[editUrlIndex]
    );


    // ==========================================
    // 7. VALIDATE BF HEADER
    // ==========================================

    const editUrlHeader =
      String(
        headers[editUrlIndex] || ""
      )
      .trim();


    if (
      editUrlHeader !== "Response Edit URL"
    ) {

      return {
        success: false,
        authenticated: true,
        code:
          "RESPONSE_EDIT_URL_COLUMN_INVALID",
        message:
          "BF column मध्ये 'Response Edit URL' header सापडला नाही."
      };
    }


    // ==========================================
    // 8. SEARCH AUTHENTICATED PROFILE
    // ==========================================

    const searchId =
      profileId
        .toString()
        .trim()
        .toLowerCase();


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      const rowId =
        String(
          row[idIndex] || ""
        )
        .trim()
        .toLowerCase();


      if (
        rowId !== searchId
      ) {
        continue;
      }


      // ==========================================
      // 9. PROFILE FOUND
      // ==========================================

      console.log(
        "================================="
      );

      console.log(
        "PROFILE FOUND"
      );

      console.log(
        "Sheet:",
        sheet.getName()
      );

      console.log(
        "Row:",
        i + 1
      );

      console.log(
        "Profile ID:",
        row[idIndex]
      );

      console.log(
        "Response Edit URL Header:",
        headers[editUrlIndex]
      );

      console.log(
        "Response Edit URL Value:",
        row[editUrlIndex]
      );

      console.log(
        "================================="
      );


      // ==========================================
      // 10. GET RESPONSE EDIT URL FROM BF
      // ==========================================

      const editUrl =
        String(
          row[editUrlIndex] || ""
        ).trim();


      if (!editUrl) {

        return {
          success: false,
          authenticated: true,
          code:
            "RESPONSE_EDIT_URL_NOT_FOUND",
          message:
            "तुमच्या profile साठी Response Edit URL उपलब्ध नाही."
        };
      }


      // ==========================================
      // 11. BASIC URL VALIDATION
      // ==========================================

      if (
        !editUrl.startsWith(
          "https://docs.google.com/forms/"
        )
      ) {

        console.warn(
          "Invalid Google Forms Response Edit URL:",
          editUrl
        );

        return {
          success: false,
          authenticated: true,
          code:
            "INVALID_RESPONSE_EDIT_URL",
          message:
            "तुमच्या profile साठी मिळालेली Response Edit URL वैध Google Forms URL नाही."
        };
      }


      // ==========================================
      // 12. SUCCESS
      // ==========================================

      return {

        success: true,

        authenticated: true,

        profileId:
          profileId,

        profileType:
          profileType,

        editUrl:
          editUrl,

        message:
          "Response Edit URL मिळाली."
      };
    }


    // ==========================================
    // 13. PROFILE NOT FOUND
    // ==========================================

    return {

      success: false,

      authenticated: true,

      code:
        "PROFILE_NOT_FOUND",

      message:
        "तुमची profile Form responses मध्ये सापडली नाही."
    };


  }
  catch (error) {

    console.error(
      "getMyProfileEditUrl Error:",
      error
    );

    return {

      success: false,

      authenticated: false,

      code:
        "MY_PROFILE_EDIT_URL_EXCEPTION",

      message:
        "Profile edit link मिळवताना समस्या आली."
    };
  }
}



/**
 * ============================================
 * PROFILE SEARCH ACCESS VERIFICATION
 * ============================================
 *
 * Checks registration in:
 * वधू
 * वर
 * इतर
 *
 * Mobile columns:
 * संपर्क क्रमांक १ :
 * संपर्क क्रमांक २ :
 *
 * Name column:
 * नाव :
 * ============================================
 */

function verifyProfileSearchAccess(mobile) {


    console.log(
      "VERIFY PROFILE SEARCH ACCESS CALLED:",
      mobile
    );

  try {

    mobile = normalizeMobile(mobile);

    if (!mobile || mobile.length !== 10) {

      return {
        success: false,
        verified: false,
        message: "कृपया योग्य 10 अंकी मोबाईल नंबर टाका."
      };

    }


    const ss =
      SpreadsheetApp.getActiveSpreadsheet();


    const sheetsToCheck = [
      "वधू",
      "वर",
      "इतर"
    ];


    for (
      let s = 0;
      s < sheetsToCheck.length;
      s++
    ) {

      const sheetName =
        sheetsToCheck[s];


      const sheet =
        ss.getSheetByName(sheetName);


      if (!sheet) {
        continue;
      }


      const data =
        sheet
          .getDataRange()
          .getDisplayValues();


      if (data.length < 2) {
        continue;
      }


      const headers =
        data[0].map(function(header) {

          return normalizeHeader(header);

        });

      // ==========================================
      // PROFILE TYPE & PROFILE ID
      // ==========================================

      const idIndex =
        findProfileHeader(
          headers,
          "ID"
        );  


      const nameIndex =
        findProfileHeader(
          headers,
          "नाव :"
        );


      const mobile1Index =
        findProfileHeader(
          headers,
          "संपर्क क्रमांक १ :"
        );


      const mobile2Index =
        findProfileHeader(
          headers,
          "संपर्क क्रमांक २ :"
        );


      for (
        let i = 1;
        i < data.length;
        i++
      ) {

        const row =
          data[i];


        const mobile1 =
          normalizeMobile(
            getProfileCell(
              row,
              mobile1Index
            )
          );


        const mobile2 =
          normalizeMobile(
            getProfileCell(
              row,
              mobile2Index
            )
          );


          console.log(
            "CHECKING PROFILE MOBILE:",
            {
              sheetName: sheetName,
              row: i,
              mobile: mobile,
              mobile1: mobile1,
              mobile2: mobile2
            }
          );


        if (
          mobile === mobile1 ||
          mobile === mobile2
        ) {


           console.log(
            "PROFILE SEARCH ACCESS MATCH FOUND:",
            {
              sheetName: sheetName,

              idIndex: idIndex,

              profileId:
                getProfileCell(
                  row,
                  idIndex
                ),

              profileType:
                sheetName === "वधू"
                  ? "bride"
                  : sheetName === "वर"
                  ? "groom"
                  : "other",

              name:
                getProfileCell(
                  row,
                  nameIndex
                ),

              mobile:
                mobile
            }
          ); 





          // ==========================================
          // CREATE VERIFIED SESSION
          // ==========================================

          const profileId =
            getProfileCell(
              row,
              idIndex
            );

          const name =
            getProfileCell(
              row,
              nameIndex
            );

          const profileType =
            sheetName === "वधू"
              ? "bride"
              : sheetName === "वर"
              ? "groom"
              : "other";


          // ==========================================
          // CREATE SECURE SESSION TOKEN
          // ==========================================

          const sessionToken =
            createProfileSession(
              mobile,
              sheetName,
              i + 1,
              profileId
            );


          // ==========================================
          // RETURN VERIFIED USER
          // ==========================================

          return {

            success: true,

            verified: true,

            sessionToken: sessionToken,

            mobile: mobile,

            name: name,

            registeredSheet: sheetName,

            profileType: profileType,

            profileId: profileId,

            message:
              "Registration verified successfully."

          };

        }

      }

    }


    return {

      success: true,

      verified: false,

      mobile: mobile,

      name: "",

      registeredSheet: "",

      message:
        "हा मोबाईल नंबर नोंदणीकृत नाही."

    };

  }

  catch (error) {

    console.error(
      "Profile Verification Error:",
      error
    );


    return {

      success: false,

      verified: false,

      message:
        "Verification करताना समस्या आली."

    };

  }

}


/**
 * ============================================
 * NORMALIZE MOBILE
 * ============================================
 */

function normalizeMobile(value) {

  if (!value) {
    return "";
  }


  let mobile =
    value
      .toString()
      .replace(/\D/g, "");


  // +91 / 91XXXXXXXXXX

  if (
    mobile.length === 12 &&
    mobile.startsWith("91")
  ) {

    mobile =
      mobile.substring(2);

  }


  return mobile;

}


/**
 * ============================================
 * PROFILE SEARCH LOG
 * ============================================
 */

function logProfileSearch(details) {

  try {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();


    let sheet =
      ss.getSheetByName(
        "Profile Search Logs"
      );


    // ========================================
    // CREATE SHEET IF NOT EXISTS
    // ========================================

    if (!sheet) {

      sheet =
        ss.insertSheet(
          "Profile Search Logs"
        );


      sheet.appendRow([

        "Timestamp",
        "Mobile",
        "Name",
        "Registered Sheet",
        "Search Type",
        "District",
        "Education",
        "Monthly Income",
        "Results Found",
        "Total Pages"

      ]);

    }


    // ========================================
    // SAVE SEARCH LOG
    // ========================================

    sheet.appendRow([

      new Date(),

      details.mobile || "",

      details.name || "",

      details.registeredSheet || "",

      details.type || "",

      details.district || "",

      details.education || "",

      details.income || "",

      Number(
        details.totalCount || 0
      ),

      Number(
        details.totalPages || 1
      )

    ]);


    console.log(
      "PROFILE SEARCH LOG SAVED:",
      {
        totalCount:
          details.totalCount,

        totalPages:
          details.totalPages
      }
    );


    return true;

  }


  catch (error) {

    console.error(
      "Profile Search Log Error:",
      error
    );


    return false;

  }

}


// ==========================================
// PROFILE VIEW LOG
// ==========================================

function logProfileView(details) {

  try {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();


    let sheet =
      ss.getSheetByName(
        "Profile View Logs"
      );


    // ========================================
    // CREATE SHEET IF NOT FOUND
    // ========================================

    if (!sheet) {

      sheet =
        ss.insertSheet(
          "Profile View Logs"
        );


      sheet.appendRow([

        "Timestamp",
        "Viewer Mobile",
        "Viewer Name",
        "Viewer Registered Sheet",
        "Profile Type",
        "Profile ID",
        "Profile Name",
        "Action"

      ]);

    }


    // ========================================
    // ADD LOG
    // ========================================

    sheet.appendRow([

      new Date(),

      details.viewerMobile || "",

      details.viewerName || "",

      details.viewerRegisteredSheet || "",

      details.profileType || "",

      details.profileId || "",

      details.profileName || "",

      details.action || ""

    ]);


    return {
      success: true
    };

  }

  catch (error) {

    console.error(
      "Profile View Log Error:",
      error
    );


    return {
      success: false
    };

  }

}



// ==========================================
// PROFILE VIEW LOGS
// ==========================================

function logProfileViewServer(
  viewerMobile,
  viewerName,
  viewerRegisteredSheet,
  profileType,
  profileId,
  profileName,
  action
) {

  try {

    const ss =
      SpreadsheetApp.getActiveSpreadsheet();

    const sheet =
      ss.getSheetByName(
        "Profile View Logs"
      );


    if (!sheet) {

      console.error(
        "Profile View Logs sheet not found."
      );

      return {
        success: false,
        message:
          "Profile View Logs sheet not found."
      };

    }


    sheet.appendRow([

      new Date(),

      viewerMobile || "",

      viewerName || "",

      viewerRegisteredSheet || "",

      profileType || "",

      profileId || "",

      profileName || "",

      action || ""

    ]);


    return {
      success: true
    };

  }

  catch (error) {

    console.error(
      "logProfileViewServer Error:",
      error
    );


    return {

      success: false,

      message:
        error.message

    };

  }

}



function testResponseEditURLColumn() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName("वधू");

  if (!sheet) {
    Logger.log("वधू sheet not found");
    return;
  }

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getDisplayValues()[0];

  Logger.log("Total Columns: " + headers.length);

  Logger.log("BF Header: " + headers[57]);

  Logger.log("BF Column Value Row 2: " + headers[57]);

}



function testGroomEditUrl() {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName("वर");

  const data =
    sheet
      .getDataRange()
      .getDisplayValues();

  const headers = data[0];

  console.log("BF HEADER:", headers[57]);

  for (let i = 1; i < data.length; i++) {

    if (
      String(data[i][0])
        .trim()
        .toLowerCase() === "id001"
    ) {

      console.log("FOUND ROW:", i + 1);
      console.log("ID:", data[i][0]);
      console.log("BF:", data[i][57]);
      console.log(
        "BF RAW:",
        JSON.stringify(data[i][57])
      );

      return;
    }
  }

  console.log("ID001 NOT FOUND");
}
