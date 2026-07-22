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

const DISTRICTS_36 = [

  "मुंबई",
  "मुंबई उपनगर",
  "ठाणे",
  "पालघर",

  "रायगड",
  "रत्नागिरी",
  "सिंधुदुर्ग",

  "नाशिक",
  "धुळे",
  "नंदुरबार",
  "जळगाव",
  "अहमदनगर",

  "पुणे",
  "सातारा",
  "सांगली",
  "सोलापूर",
  "कोल्हापूर",

  "औरंगाबाद",
  "जालना",
  "परभणी",
  "हिंगोली",
  "नांदेड",
  "लातूर",
  "उस्मानाबाद",
  "बीड",

  "अमरावती",
  "अकोला",
  "यवतमाळ",
  "बुलढाणा",
  "वाशिम",

  "नागपूर",
  "भंडारा",
  "गोंदिया",
  "चंद्रपूर",
  "गडचिरोली"

];

function normalizeDistrict(value) {

  if (!value) {
    return "";
  }


  let v = value
    .toString()
    .toLowerCase()
    .trim();


  const map = {

    "mumbai suburban": "मुंबई उपनगर",
    "mumbai suburb": "मुंबई उपनगर",
    "suburban": "मुंबई उपनगर",

    "mumbai": "मुंबई",

    "thane": "ठाणे",
    "palghar": "पालघर",
    "raigad": "रायगड",
    "ratnagiri": "रत्नागिरी",
    "sindhudurg": "सिंधुदुर्ग",

    "nashik": "नाशिक",
    "dhule": "धुळे",
    "nandurbar": "नंदुरबार",
    "jalgaon": "जळगाव",

    "ahmednagar": "अहमदनगर",
    "ahilyanagar": "अहमदनगर",

    "pune": "पुणे",
    "satara": "सातारा",
    "sangli": "सांगली",
    "solapur": "सोलापूर",
    "kolhapur": "कोल्हापूर",

    "chhatrapati sambhajinagar":
      "औरंगाबाद",

    "sambhajinagar":
      "औरंगाबाद",

    "aurangabad":
      "औरंगाबाद",

    "jalna": "जालना",
    "parbhani": "परभणी",
    "hingoli": "हिंगोली",
    "nanded": "नांदेड",
    "latur": "लातूर",

    "dharashiv":
      "उस्मानाबाद",

    "osmanabad":
      "उस्मानाबाद",

    "beed": "बीड",

    "amravati": "अमरावती",
    "akola": "अकोला",
    "yavatmal": "यवतमाळ",
    "buldhana": "बुलढाणा",
    "washim": "वाशिम",

    "nagpur": "नागपूर",
    "bhandara": "भंडारा",
    "gondia": "गोंदिया",
    "chandrapur": "चंद्रपूर",
    "gadchiroli": "गडचिरोली"

  };


  // Marathi district already present

  for (
    let i = 0;
    i < DISTRICTS_36.length;
    i++
  ) {

    const district =
      DISTRICTS_36[i];

    if (
      v.includes(
        district.toLowerCase()
      )
    ) {

      return district;

    }

  }


  // English → Marathi

  for (let eng in map) {

    if (v.includes(eng)) {

      return map[eng];

    }

  }


  return v;

}

function smartNormalizeEducation(value) {

  if (!value) {
    return "";
  }


  let v = value
    .toString()
    .toLowerCase()
    .trim();


  v = v
    .replace(/[(),.\-\/]/g, " ")
    .replace(/\s+/g, " ");


  // ==========================================
  // MEDICAL & HEALTHCARE
  // ==========================================

  if (
    /\b(mbbs|bhms|bams|bds|bpt|mpt|bpharm|mpharm|pharmacy|nursing|physio|physiotherapy|medical|doctor|veterinary)\b/.test(v)
  ) {

    return "Medical & Healthcare";

  }


  // ==========================================
  // ENGINEERING & TECHNOLOGY
  // ==========================================

  if (
    /\b(be|b e|btech|b tech|me|m e|mtech|m tech|engineering|engineer|mechanical|civil|electrical|chemical|automobile|entc|electronics|instrumentation|production|textile|cdac)\b/.test(v) ||
    /इंजिनिअर|बी टेक|बी ई/.test(v)
  ) {

    return "Engineering & Technology";

  }


  // ==========================================
  // COMMERCE & MANAGEMENT
  // ==========================================

  if (
    /\b(bcom|b com|mcom|m com|commerce|mba|bba|pgdm|management|marketing|finance|banking|accountant|cma)\b/.test(v) ||
    /\bca\b/.test(v) ||
    /\bcs\b/.test(v)
  ) {

    return "Commerce & Management";

  }


  // ==========================================
  // ARTS & HUMANITIES
  // ==========================================

  if (
    /\b(ba|b a|ma|m a|arts|history|geography|marathi|sanskrit|msw|humanities)\b/.test(v)
  ) {

    return "Arts & Humanities";

  }


  // ==========================================
  // SCIENCE & AGRICULTURE
  // ==========================================

  if (
    /\b(bsc|b sc|msc|m sc|science|chemistry|physics|botany|zoology|agriculture|agri|biotech|microbiology|research|phd)\b/.test(v) ||
    /कृषी/.test(v)
  ) {

    return "Science & Agriculture";

  }


  // ==========================================
  // DIPLOMA / ITI / TECHNICAL
  // ==========================================

  if (
    /\b(diploma|iti|mechanic|electrician|draftsman|polytechnic|technical|industrial)\b/.test(v)
  ) {

    return "Diploma / ITI / Technical";

  }


  // ==========================================
  // LAW / ARCHITECTURE / DESIGN
  // ==========================================

  if (
    /\b(llb|llm|law|interior|design|architecture|architect|b arch|m arch|tourism|hospitality)\b/.test(v)
  ) {

    return "Law / Architecture / Design";

  }


  // ==========================================
  // GENERAL EDUCATION
  // ==========================================

  if (
    /\b(10th|10|ssc|12th|12|hsc|school|mscit|typing)\b/.test(v) ||
    /दहावी|बारावी/.test(v)
  ) {

    return "General Education (10th / 12th / Others)";

  }


  return value
    .toString()
    .trim();

}


function getEducationCategoryName(value) {

  const key =
    normalizeProfileText(
      value
    );


  const map = {

    "engineering":
      "Engineering & Technology",

    "medical":
      "Medical & Healthcare",

    "commerce":
      "Commerce & Management",

    "arts":
      "Arts & Humanities",

    "science":
      "Science & Agriculture",

    "diploma":
      "Diploma / ITI / Technical",

    "law":
      "Law / Architecture / Design",

    "general":
      "General Education (10th / 12th / Others)"

  };


  return map[key] || value;

}

function normalizeIncome(value) {

  if (!value) {
    return "";
  }


  return value
    .toString()
    .toLowerCase()
    .trim()

    .replace(/मासिक उत्पन्न/g, "")

    .replace(/रु\./g, "")
    .replace(/रु/g, "")

    .replace(/₹/g, "")

    .replace(/\s+/g, " ")

    .trim();

}


function searchProfiles(type, district, education, income, page) {

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
      data[0].map(function (header) {

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
      district === "all"
        ? "all"
        : normalizeDistrict(
          district
        );


    const searchEducation =
      education === "all"
        ? "all"
        : getEducationCategoryName(
          education
        );


    const searchIncome =
      income === "all"
        ? "all"
        : normalizeIncome(
          income
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

      // ========================================
      // SMART DISTRICT FILTER
      // ========================================

      if (
        searchDistrict &&
        searchDistrict !== "all" &&
        searchDistrict !== "सर्व"
      ) {

        const rowDistrict =
          normalizeDistrict(
            getProfileCell(
              row,
              districtIndex
            )
          );


        if (
          rowDistrict !==
          searchDistrict
        ) {

          continue;

        }

      }



      // ========================================
      // SMART EDUCATION FILTER
      // ========================================

      if (
        searchEducation &&
        searchEducation !== "all" &&
        searchEducation !== "सर्व"
      ) {

        const rowEducation =
          smartNormalizeEducation(
            getProfileCell(
              row,
              educationIndex
            )
          );


        if (
          rowEducation !==
          searchEducation
        ) {

          continue;

        }

      }


      // ========================================
      // SMART MONTHLY INCOME FILTER
      // ========================================

      if (
        searchIncome &&
        searchIncome !== "all" &&
        searchIncome !== "सर्व"
      ) {

        const rowIncome =
          normalizeIncome(
            getProfileCell(
              row,
              incomeIndex
            )
          );


        if (
          rowIncome !==
          searchIncome
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


function matchesEducationCategory(
  educationText,
  category
) {

  educationText =
    normalizeProfileText(
      educationText
    );


  category =
    normalizeProfileText(
      category
    );


  // No education filter
  if (
    !category ||
    category === "all" ||
    category === "सर्व"
  ) {

    return true;

  }


  // ==========================================
  // ENGINEERING & TECHNOLOGY
  // ==========================================

  if (category === "engineering") {

    const keywords = [

      "b.e",
      "be ",
      "b.e.",
      "btech",
      "b.tech",
      "m.e",
      "m.e.",
      "mtech",
      "m.tech",
      "engineering",
      "engineer",
      "computer engineering",
      "civil engineering",
      "mechanical engineering",
      "electrical engineering",
      "electronics",
      "information technology"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  // ==========================================
  // MEDICAL & HEALTHCARE
  // ==========================================

  if (category === "medical") {

    const keywords = [

      "mbbs",
      "bams",
      "bhms",
      "bds",
      "md ",
      "m.d",
      "medical",
      "pharmacy",
      "b.pharm",
      "bpharm",
      "m.pharm",
      "mpharm",
      "nursing",
      "physiotherapy",
      "bpt",
      "mpt"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  // ==========================================
  // COMMERCE & MANAGEMENT
  // ==========================================

  if (category === "commerce") {

    const keywords = [

      "b.com",
      "bcom",
      "m.com",
      "mcom",
      "mba",
      "bba",
      "commerce",
      "management",
      "ca ",
      "chartered accountant",
      "cs ",
      "cma"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  // ==========================================
  // ARTS & HUMANITIES
  // ==========================================

  if (category === "arts") {

    const keywords = [

      "b.a",
      "ba ",
      "m.a",
      "ma ",
      "arts",
      "humanities",
      "social science"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  // ==========================================
  // SCIENCE & AGRICULTURE
  // ==========================================

  if (category === "science") {

    const keywords = [

      "b.sc",
      "bsc",
      "m.sc",
      "msc",
      "science",
      "agriculture",
      "b.sc agri",
      "bsc agri",
      "m.sc agri",
      "msc agri"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  // ==========================================
  // DIPLOMA / ITI / TECHNICAL
  // ==========================================

  if (category === "diploma") {

    const keywords = [

      "diploma",
      "iti",
      "polytechnic",
      "technical"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  // ==========================================
  // LAW / ARCHITECTURE / DESIGN
  // ==========================================

  if (category === "law") {

    const keywords = [

      "llb",
      "ll.m",
      "llm",
      "law",
      "architecture",
      "b.arch",
      "m.arch",
      "design",
      "b.des",
      "m.des"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  function containsEducationKeyword(
    educationText,
    keywords
  ) {

    for (
      let i = 0;
      i < keywords.length;
      i++
    ) {

      if (
        educationText.includes(
          keywords[i]
        )
      ) {

        return true;

      }

    }


    return false;

  }

  // ==========================================
  // GENERAL EDUCATION
  // ==========================================

  if (category === "general") {

    const keywords = [

      "10th",
      "10 th",
      "ssc",
      "12th",
      "12 th",
      "hsc",
      "graduate",
      "graduation"

    ];

    return containsEducationKeyword(
      educationText,
      keywords
    );

  }


  return false;

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

function normalizeIncome(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return value
    .toString()
    .toLowerCase()
    .replace(/मासिक उत्पन्न/g, "")
    .replace(/रु\./g, "")
    .replace(/रु/g, "")
    .replace(/₹/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


function testSmartFilter() {

  const result =
    searchProfiles(

      "bride",

      "Mumbai",

      "Engineering",

      "मासिक उत्पन्न  रु. ५०,००० ते ७०,०००",

      1

    );


  Logger.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

}

testSmartFilter();