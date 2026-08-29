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





          return {

              success: true,

              verified: true,

              mobile: mobile,

              name:
                getProfileCell(
                  row,
                  nameIndex
                ),

              registeredSheet:
                sheetName,

              // ==========================================
              // NEW
              // ==========================================

              profileType:
                sheetName === "वधू"
                  ? "bride"
                  : sheetName === "वर"
                  ? "groom"
                  : "other",

              profileId:
                getProfileCell(
                  row,
                  idIndex
                ),

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

