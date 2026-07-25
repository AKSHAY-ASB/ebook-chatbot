// ==========================================
// GET PROFILE INTEREST SHEET
// ==========================================

function getProfileInterestSheet() {

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      INTEREST_CONFIG.SHEET_NAME
    );


  if (!sheet) {

    throw new Error(
      'Sheet "' +
      INTEREST_CONFIG.SHEET_NAME +
      '" not found.'
    );

  }


  return sheet;

}


// ==========================================
// NORMALIZE INTEREST PROFILE TYPE
// ==========================================

function normalizeInterestProfileType(
  type
) {

  type =
    String(type || "")
      .trim()
      .toLowerCase();


  if (
    type === "bride" ||
    type === "वधू"
  ) {

    return "bride";

  }


  if (
    type === "groom" ||
    type === "वर"
  ) {

    return "groom";

  }


  if (
    type === "other" ||
    type === "इतर"
  ) {

    return "other";

  }


  return "";

}


// ==========================================
// GENERATE INTEREST ID
// ==========================================

function generateInterestId() {

  const sheet =
    getProfileInterestSheet();


  const lastRow =
    sheet.getLastRow();


  const nextNumber =
    Math.max(
      1,
      lastRow
    );


  return (
    "INT" +
    Utilities.formatString(
      "%06d",
      nextNumber
    )
  );

}


// ==========================================
// FIND REGISTERED PROFILE BY MOBILE
// ==========================================

function findInterestUserProfile(
  userMobile
) {

  userMobile =
    String(userMobile || "")
      .replace(/\D/g, "")
      .slice(-10);


  if (!userMobile) {

    return null;

  }


  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const profileSheets = [

    {
      type: "bride",
      sheetName: "वधू"
    },

    {
      type: "groom",
      sheetName: "वर"
    },

    {
      type: "other",
      sheetName: "इतर"
    }

  ];


  for (
    let s = 0;
    s < profileSheets.length;
    s++
  ) {

    const config =
      profileSheets[s];


    const sheet =
      ss.getSheetByName(
        config.sheetName
      );


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
      data[0].map(
        function(header) {

          return normalizeHeader(
            header
          );

        }
      );


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


    // ======================================
    // FIND MOBILE COLUMN
    // ======================================

    let mobileIndex = -1;


    const possibleMobileHeaders = [

      "मोबाईल नंबर :",

      "मोबाईल नंबर",

      "Mobile Number",

      "Mobile",

      "संपर्क क्रमांक",

      "संपर्क क्रमांक :"

    ];


    for (
      let h = 0;
      h < possibleMobileHeaders.length;
      h++
    ) {

      mobileIndex =
        findProfileHeader(
          headers,
          possibleMobileHeaders[h]
        );


      if (
        mobileIndex !== -1
      ) {

        break;

      }

    }


    if (
      idIndex === -1 ||
      mobileIndex === -1
    ) {

      continue;

    }


    // ======================================
    // SEARCH USER
    // ======================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      const rowMobile =
        String(
          getProfileCell(
            row,
            mobileIndex
          ) || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      if (
        rowMobile !== userMobile
      ) {

        continue;

      }


      return {

        found:
          true,

        type:
          config.type,

        sheetName:
          config.sheetName,

        id:
          String(
            getProfileCell(
              row,
              idIndex
            ) || ""
          ).trim(),

        name:
          String(
            getProfileCell(
              row,
              nameIndex
            ) || ""
          ).trim(),

        mobile:
          userMobile

      };

    }

  }


  return null;

}

// ==========================================
// FIND REGISTERED PROFILE BY MOBILE
// ==========================================

function findInterestUserProfile(
  userMobile
) {

  // ========================================
  // NORMALIZE MOBILE
  // ========================================

  userMobile =
    String(userMobile || "")
      .replace(/\D/g, "")
      .slice(-10);


  if (!userMobile) {

    return null;

  }


  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  // ========================================
  // PROFILE SHEETS
  // ========================================

  const profileSheets = [

    {
      type: "bride",
      sheetName: "वधू"
    },

    {
      type: "groom",
      sheetName: "वर"
    },

    {
      type: "other",
      sheetName: "इतर"
    }

  ];


  // ========================================
  // LOOP SHEETS
  // ========================================

  for (
    let s = 0;
    s < profileSheets.length;
    s++
  ) {

    const config =
      profileSheets[s];


    const sheet =
      ss.getSheetByName(
        config.sheetName
      );


    if (!sheet) {

      continue;

    }


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    if (
      !data ||
      data.length < 2
    ) {

      continue;

    }


    // ======================================
    // HEADERS
    // ======================================

    const headers =
      data[0].map(
        function(header) {

          return normalizeHeader(
            header
          );

        }
      );


    // ======================================
    // PROFILE ID
    // ======================================

    const idIndex =
      findProfileHeader(
        headers,
        "ID"
      );


    // ======================================
    // PROFILE NAME
    // ======================================

    const nameIndex =
      findProfileHeader(
        headers,
        "नाव :"
      );


    // ======================================
    // CONTACT NUMBER 1
    // ======================================

    const mobile1Index =
      findProfileHeader(
        headers,
        "संपर्क क्रमांक १ :"
      );


    // ======================================
    // CONTACT NUMBER 2
    // ======================================

    const mobile2Index =
      findProfileHeader(
        headers,
        "संपर्क क्रमांक २ :"
      );


    console.log(
      "INTEREST PROFILE COLUMNS:",
      {
        sheet:
          config.sheetName,

        idIndex:
          idIndex,

        nameIndex:
          nameIndex,

        mobile1Index:
          mobile1Index,

        mobile2Index:
          mobile2Index
      }
    );


    // ======================================
    // REQUIRED COLUMN CHECK
    // ======================================

    if (
      idIndex === -1 ||
      (
        mobile1Index === -1 &&
        mobile2Index === -1
      )
    ) {

      continue;

    }


    // ======================================
    // SEARCH ROWS
    // ======================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row =
        data[i];


      // ====================================
      // MOBILE NUMBER 1
      // ====================================

      const mobile1 =
        mobile1Index !== -1

          ? String(
              getProfileCell(
                row,
                mobile1Index
              ) || ""
            )
            .replace(/\D/g, "")
            .slice(-10)

          : "";


      // ====================================
      // MOBILE NUMBER 2
      // ====================================

      const mobile2 =
        mobile2Index !== -1

          ? String(
              getProfileCell(
                row,
                mobile2Index
              ) || ""
            )
            .replace(/\D/g, "")
            .slice(-10)

          : "";


      // ====================================
      // CHECK BOTH MOBILE NUMBERS
      // ====================================

      if (
        mobile1 !== userMobile &&
        mobile2 !== userMobile
      ) {

        continue;

      }


      // ====================================
      // PROFILE FOUND
      // ====================================

      return {

        found:
          true,

        type:
          config.type,

        sheetName:
          config.sheetName,

        id:
          String(
            getProfileCell(
              row,
              idIndex
            ) || ""
          ).trim(),

        name:
          String(
            getProfileCell(
              row,
              nameIndex
            ) || ""
          ).trim(),

        mobile:
          userMobile,

        matchedContact:
          mobile1 === userMobile
            ? "संपर्क क्रमांक १"
            : "संपर्क क्रमांक २"

      };

    }

  }


  // ========================================
  // PROFILE NOT FOUND
  // ========================================

  return null;

}

// ==========================================
// FIND INTEREST TARGET PROFILE
// BY PROFILE TYPE + PROFILE ID
// ==========================================

function findInterestTargetProfile(
  profileType,
  profileId
) {

  profileType =
    normalizeInterestProfileType(
      profileType
    );


  profileId =
    String(profileId || "")
      .trim();


  if (
    !profileType ||
    !profileId
  ) {

    return null;

  }


  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheetName =
    INTEREST_CONFIG
      .PROFILE_SHEETS[
        profileType
      ];


  if (!sheetName) {

    return null;

  }


  const sheet =
    ss.getSheetByName(
      sheetName
    );


  if (!sheet) {

    return null;

  }


  const data =
    sheet
      .getDataRange()
      .getDisplayValues();


  if (
    !data ||
    data.length < 2
  ) {

    return null;

  }


  // ========================================
  // HEADERS
  // ========================================

  const headers =
    data[0].map(
      function(header) {

        return normalizeHeader(
          header
        );

      }
    );


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


  if (
    idIndex === -1
  ) {

    return null;

  }


  // ========================================
  // FIND PROFILE
  // ========================================

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row =
      data[i];


    const rowId =
      String(
        getProfileCell(
          row,
          idIndex
        ) || ""
      ).trim();


    if (
      rowId !== profileId
    ) {

      continue;

    }


    // ======================================
    // CONTACT NUMBERS
    // ======================================

    const mobile1 =
      mobile1Index !== -1

        ? String(
            getProfileCell(
              row,
              mobile1Index
            ) || ""
          )
          .replace(/\D/g, "")
          .slice(-10)

        : "";


    const mobile2 =
      mobile2Index !== -1

        ? String(
            getProfileCell(
              row,
              mobile2Index
            ) || ""
          )
          .replace(/\D/g, "")
          .slice(-10)

        : "";


    // Prefer Contact Number 1
    const receiverMobile =
      mobile1 || mobile2;


    return {

      found:
        true,

      type:
        profileType,

      sheetName:
        sheetName,

      id:
        rowId,

      name:
        String(
          getProfileCell(
            row,
            nameIndex
          ) || ""
        ).trim(),

      mobile:
        receiverMobile

    };

  }


  return null;

}



