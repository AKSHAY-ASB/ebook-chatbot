/**
 * ============================================
 * DEVANG PUSTIKA - PROFILE SEARCH
 * ============================================
 *
 * type:
 * bride  -> वधू sheet
 * groom  -> वर sheet
 * other  -> इतर sheet
 *
 * district:
 * पुणे / नाशिक / नागपूर / etc.
 * blank or "all" = all districts
 *
 * education:
 * Engineering / B.E / MBA etc.
 * blank or "all" = any education
 *
 */


function searchProfiles(type, district, education, page) {

  try {

    page = parseInt(page) || 1;

    const pageSize = 10;

    const startIndex =
      (page - 1) * pageSize;

    const endIndex =
      startIndex + pageSize;

    const ss = SpreadsheetApp.getActiveSpreadsheet();


    // ==========================================
    // 1. SELECT SHEET
    // ==========================================

    let sheetName = "";


    type = normalizeProfileText(type);


    if (
      type === "bride" ||
      type === "वधू"
    ) {

      sheetName = "वधू";

    }


    else if (
      type === "groom" ||
      type === "वर"
    ) {

      sheetName = "वर";

    }


    else if (
      type === "other" ||
      type === "इतर"
    ) {

      sheetName = "इतर";

    }


    else {

      return {

        success: false,

        count: 0,

        profiles: [],

        message:
          "Invalid profile type."

      };

    }



    // ==========================================
    // 2. GET SHEET
    // ==========================================

    const sheet =
      ss.getSheetByName(sheetName);


    if (!sheet) {

      return {

        success: false,

        count: 0,

        profiles: [],

        message:
          'Sheet "' +
          sheetName +
          '" not found.'

      };

    }



    // ==========================================
    // 3. GET DATA
    // ==========================================

    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    if (data.length < 2) {

      return {

        success: true,

        count: 0,

        profiles: [],

        message:
          "No profiles found."

      };

    }



    // ==========================================
    // 4. GET HEADERS
    // ==========================================

    const headers =
      data[0].map(function(header) {

        return normalizeHeader(
          header
        );

      });



    // ==========================================
    // 5. FIND COLUMN INDEXES
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


    const districtIndex =
      findProfileHeader(
        headers,
        "जिल्हा निवडा"
      );


    const educationIndex =
      findProfileHeader(
        headers,
        "शिक्षण :"
      );


    const birthDateIndex =
      findProfileHeader(
        headers,
        "जन्मतारीख :"
      );


    const ageIndex =
      findProfileHeader(
        headers,
        "वय :"
      );


    const heightIndex =
      findProfileHeader(
        headers,
        "ऊंची :"
      );


    const casteIndex =
      findProfileHeader(
        headers,
        "पोट जात :"
      );


    const jobIndex =
      findProfileHeader(
        headers,
        "नोकरी / व्यवसाय व ठिकाण"
      );


    const incomeIndex =
      findProfileHeader(
        headers,
        "मासिक उत्पन्न :"
      );


    const addressIndex =
      findProfileHeader(
        headers,
        "कायमचा पत्ता :"
      );


    const photoIndex =
      findProfileHeader(
        headers,
        "फोटो : (फोटो हा पासपोर्ट स्वरूपाचा असावा)"
      );



    // ==========================================
    // 6. REQUIRED COLUMN CHECK
    // ==========================================

    if (nameIndex === -1) {

      return {

        success: false,

        count: 0,

        profiles: [],

        message:
          'Column "नाव :" not found in ' +
          sheetName +
          " sheet."

      };

    }



    // ==========================================
    // 7. NORMALIZE FILTERS
    // ==========================================

    const searchDistrict =
      normalizeProfileText(
        district
      );


    const searchEducation =
      normalizeProfileText(
        education
      );



    // ==========================================
    // 8. SEARCH
    // ==========================================

const allProfiles = [];


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const row = data[i];


      const rowDistrict =
        normalizeProfileText(
          getProfileCell(
            row,
            districtIndex
          )
        );


      const rowEducation =
        normalizeProfileText(
          getProfileCell(
            row,
            educationIndex
          )
        );



      // ========================================
      // DISTRICT FILTER
      // ========================================

      if (
        searchDistrict &&
        searchDistrict !== "all" &&
        searchDistrict !== "सर्व"
      ) {

        if (
          !rowDistrict.includes(
            searchDistrict
          )
        ) {

          continue;

        }

      }



      // ========================================
      // EDUCATION FILTER
      // ========================================

      if (
        searchEducation &&
        searchEducation !== "all" &&
        searchEducation !== "सर्व"
      ) {

        if (
          !rowEducation.includes(
            searchEducation
          )
        ) {

          continue;

        }

      }



      // ========================================
      // ADD PROFILE
      // ========================================

allProfiles.push({

  id:
    getProfileCell(
      row,
      idIndex
    ),

  name:
    getProfileCell(
      row,
      nameIndex
    ),

  district:
    getProfileCell(
      row,
      districtIndex
    ),

  education:
    getProfileCell(
      row,
      educationIndex
    ),

  birthDate:
    getProfileCell(
      row,
      birthDateIndex
    ),

  age:
    getProfileCell(
      row,
      ageIndex
    ),

  height:
    getProfileCell(
      row,
      heightIndex
    ),

  caste:
    getProfileCell(
      row,
      casteIndex
    ),

  job:
    getProfileCell(
      row,
      jobIndex
    ),

  income:
    getProfileCell(
      row,
      incomeIndex
    ),

  address:
    getProfileCell(
      row,
      addressIndex
    ),

  photo:
    convertProfilePhotoUrl(
      getProfileCell(
        row,
        photoIndex
      )
    )

});

    }


        // ==========================================
        // PAGINATION
        // ==========================================

        const totalProfiles =
          allProfiles.length;


        const totalPages =
          Math.ceil(
            totalProfiles / pageSize
          );


        const profiles =
          allProfiles.slice(
            startIndex,
            endIndex
          );


        const hasNext =
          page < totalPages;


        const hasPrevious =
          page > 1;

      // ==========================================
      // 9. RETURN RESULTS
      // ==========================================

        return {

        success: true,

        type: type,

        sheetName: sheetName,

        // Current page
        page: page,

        // 10 profiles maximum
        pageSize: pageSize,

        // Total matching profiles
        totalCount: totalProfiles,

        // Total number of pages
        totalPages: totalPages,

        // Profiles on current page
        count: profiles.length,

        profiles: profiles,

        // Navigation
        hasNext: hasNext,

        hasPrevious: hasPrevious,

        message:
          totalProfiles > 0

            ? totalProfiles +
              " matching profiles found."

            : "No matching profiles found."

      };


  }

  catch (error) {

    console.error(
      "Profile Search Error:",
      error
    );


    return {

      success: false,

      count: 0,

      profiles: [],

      message:
        "Something went wrong while searching profiles."

    };

  }

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
 * FIND HEADER
 * ============================================
 */

function findProfileHeader(
  headers,
  searchHeader
) {

  const normalizedSearch =
    normalizeHeader(
      searchHeader
    );


  for (
    let i = 0;
    i < headers.length;
    i++
  ) {

    if (
      headers[i] ===
      normalizedSearch
    ) {

      return i;

    }

  }


  return -1;

}



/**
 * ============================================
 * GET CELL SAFELY
 * ============================================
 */

function getProfileCell(
  row,
  index
) {

  if (
    index === -1 ||
    index === undefined ||
    index === null
  ) {

    return "";

  }


  if (
    row[index] === null ||
    row[index] === undefined
  ) {

    return "";

  }


  return row[index]
    .toString()
    .trim();

}



/**
 * ============================================
 * NORMALIZE SEARCH TEXT
 * ============================================
 */

function normalizeProfileText(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

}


function testBrideSearch() {

  const result =
    searchProfiles(
      "bride",
      "",
      ""
    );


  Logger.log(
    JSON.stringify(result)
  );

}

function testGroomSearch() {

  const result =
    searchProfiles(
      "groom",
      "",
      ""
    );


  Logger.log(
    JSON.stringify(result)
  );

}

function testOtherSearch() {

  const result =
    searchProfiles(
      "other",
      "",
      ""
    );


  Logger.log(
    JSON.stringify(result)
  );

}


function convertProfilePhotoUrl(url) {

  if (!url) {
    return "";
  }

  url = url.toString().trim();

  // Google Drive file ID patterns
  let fileId = "";

  // Example:
  // https://drive.google.com/file/d/FILE_ID/view
  const fileMatch =
    url.match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (fileMatch && fileMatch[1]) {

    fileId = fileMatch[1];

  }


  // Example:
  // https://drive.google.com/open?id=FILE_ID
  // https://drive.google.com/uc?id=FILE_ID
  if (!fileId) {

    const idMatch =
      url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (idMatch && idMatch[1]) {

      fileId = idMatch[1];

    }

  }


  if (fileId) {

    return "https://drive.google.com/thumbnail?id=" +
      fileId +
      "&sz=w400";

  }


  // If already normal image URL
  return url;

}