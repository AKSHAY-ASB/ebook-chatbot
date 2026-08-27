// ============================================================
// FILE : MatchingProfileNormalizer.gs
// MODULE : Matching
// PURPOSE : Normalize basic profile data
//
// STEP : 5A
//
// RESPONSIBILITY
//  - Convert raw sheet row into standard profile structure
//  - Normalize profile ID
//  - Normalize profile type
//  - Normalize name
//  - Normalize district
//  - Normalize age
//  - Normalize height
//  - Normalize caste
//  - Normalize rashi
//  - Normalize photo
//
// DOES NOT
//  - Parse education
//  - Parse profession
//  - Parse income
//  - Parse expectations
//  - Apply matching rules
//  - Calculate score
//  - Apply LIKE / DISLIKE
//  - Apply Interest logic
//
// DEPENDS ON
//  - MatchingRepository.gs
// ============================================================


// ============================================================
// BASIC PROFILE FIELD DEFINITIONS
// ============================================================

const MATCHING_BASIC_PROFILE_FIELDS = {

  id: "ID",

  name: "नाव :", 

  district: "जिल्हा निवडा",

  age: "वय :",

  height: "ऊंची  :",

  caste: "पोट जात :",

  rashi: "रास  :",

  photo:
    "फोटो : (फोटो हा पासपोर्ट स्वरूपाचा असावा)"

};


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeMatchingText(
  value
) {

  return String(
    value || ""
  )
  .replace(/\s+/g, " ")
  .trim();

}


// ============================================================
// NORMALIZE PROFILE TYPE
// ============================================================

function normalizeMatchingProfileType(
  profileType
) {

  profileType =
    normalizeMatchingText(
      profileType
    )
    .toLowerCase();


  if (
    profileType === "bride" ||
    profileType === "वधू"
  ) {

    return "bride";

  }


  if (
    profileType === "groom" ||
    profileType === "वर"
  ) {

    return "groom";

  }


  if (
    profileType === "other" ||
    profileType === "इतर"
  ) {

    return "other";

  }


  return "";

}


// ============================================================
// NORMALIZE AGE
//
// Examples:
//
// "32 years, 4 months, 6 days" → 32
// "28"                         → 28
// "28 years"                   → 28
// ============================================================

function normalizeMatchingAge(
  value
) {

  const raw =
    normalizeMatchingText(
      value
    );


  if (!raw) {

    return {

      value: null,

      raw: ""

    };

  }


  // ----------------------------------------------------------
  // Extract first numeric value
  // ----------------------------------------------------------

  const match =
    raw.match(
      /\d+(?:\.\d+)?/
    );


  if (!match) {

    return {

      value: null,

      raw: raw

    };

  }


  const age =
    Number(
      match[0]
    );


  if (
    !Number.isFinite(age)
  ) {

    return {

      value: null,

      raw: raw

    };

  }


  return {

    value: age,

    raw: raw

  };

}


// ============================================================
// NORMALIZE HEIGHT
//
// Marathi examples:
//
// "५ फूट ७ इंच"
// "५ फूट ३ इंच"
// "5 feet 7 inches"
// "5'7"
//
// IMPORTANT:
// This function currently converts only obvious
// feet/inch formats.
//
// It does NOT infer missing height.
// ============================================================

function normalizeMatchingHeight(
  value
) {

  const raw =
    normalizeMatchingText(
      value
    );


  if (!raw) {

    return {

      feet: null,

      inches: null,

      totalInches: null,

      raw: ""

    };

  }


  // ----------------------------------------------------------
  // Convert Marathi digits to English digits
  // ----------------------------------------------------------

  const normalizedDigits =
    convertMarathiDigitsToEnglish(
      raw
    );


  // ----------------------------------------------------------
  // Feet + Inches
  // ----------------------------------------------------------

  let match =
    normalizedDigits.match(
      /(\d+)\s*(?:फूट|feet|foot|ft|')\s*(\d+)?\s*(?:इंच|inches|inch|in|")?/i
    );


  if (match) {

    const feet =
      Number(
        match[1]
      );


    const inches =
      match[2]
        ? Number(match[2])
        : 0;


    return {

      feet:
        feet,

      inches:
        inches,

      totalInches:
        (feet * 12) +
        inches,

      raw:
        raw

    };

  }


  // ----------------------------------------------------------
  // Simple 5'7 format
  // ----------------------------------------------------------

  match =
    normalizedDigits.match(
      /^(\d+)\s*['′]\s*(\d+)?/
    );


  if (match) {

    const feet =
      Number(
        match[1]
      );


    const inches =
      match[2]
        ? Number(match[2])
        : 0;


    return {

      feet:
        feet,

      inches:
        inches,

      totalInches:
        (feet * 12) +
        inches,

      raw:
        raw

    };

  }


  // ----------------------------------------------------------
  // Unable to parse
  // ----------------------------------------------------------

  return {

    feet:
      null,

    inches:
      null,

    totalInches:
      null,

    raw:
      raw

  };

}


// ============================================================
// CONVERT MARATHI DIGITS → ENGLISH DIGITS
// ============================================================

function convertMarathiDigitsToEnglish(
  value
) {

  const marathiDigits = [
    "०",
    "१",
    "२",
    "३",
    "४",
    "५",
    "६",
    "७",
    "८",
    "९"
  ];


  const englishDigits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
  ];


  let result =
    String(
      value || ""
    );


  for (
    let i = 0;
    i < marathiDigits.length;
    i++
  ) {

    result =
      result.replace(
        new RegExp(
          marathiDigits[i],
          "g"
        ),
        englishDigits[i]
      );

  }


  return result;

}


// ============================================================
// NORMALIZE BASIC PROFILE
//
// INPUT
//  raw row + headers + profile type
//
// OUTPUT
//  standardized basic profile
// ============================================================

function normalizeMatchingBasicProfile(
  row,
  headers,
  profileType
) {

  row =
    Array.isArray(row)
      ? row
      : [];


  headers =
    Array.isArray(headers)
      ? headers
      : [];


  profileType =
    normalizeMatchingProfileType(
      profileType
    );


  // ----------------------------------------------------------
  // HEADER INDEX HELPER
  // ----------------------------------------------------------

  function getIndex(
    headerName
  ) {

    const normalizedTarget =
      normalizeMatchingText(
        headerName
      );


    return headers.findIndex(
      function(header) {

        return (
          normalizeMatchingText(
            header
          ) ===
          normalizedTarget
        );

      }
    );

  }


  // ----------------------------------------------------------
  // CELL HELPER
  // ----------------------------------------------------------

  function getValue(
    headerName
  ) {

    const index =
      getIndex(
        headerName
      );


    if (
      index === -1 ||
      index >= row.length
    ) {

      return "";

    }


    return normalizeMatchingText(
      row[index]
    );

  }


  // ----------------------------------------------------------
  // RAW VALUES
  // ----------------------------------------------------------

  const id =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.id
    );


  const name =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.name
    );


  const district =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.district
    );


  const ageRaw =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.age
    );


  const heightRaw =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.height
    );


  const caste =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.caste
    );


  const rashi =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.rashi
    );


  const photoRaw =
    getValue(
      MATCHING_BASIC_PROFILE_FIELDS.photo
    );


  // ----------------------------------------------------------
  // NORMALIZE AGE
  // ----------------------------------------------------------

  const age =
    normalizeMatchingAge(
      ageRaw
    );


  // ----------------------------------------------------------
  // NORMALIZE HEIGHT
  // ----------------------------------------------------------

  const height =
    normalizeMatchingHeight(
      heightRaw
    );


  // ----------------------------------------------------------
  // PHOTO
  // ----------------------------------------------------------

  let photo =
    photoRaw;


  if (photo) {

    try {

      photo =
        convertProfilePhotoUrl(
          photoRaw
        );

    }

    catch (error) {

      console.warn(
        "Matching photo conversion failed:",
        error
      );

    }

  }


  // ----------------------------------------------------------
  // STANDARDIZED PROFILE
  // ----------------------------------------------------------

  return {

    id:
      id,

    type:
      profileType,

    name:
      name,

    district:
      district,

    age:
      age.value,

    ageRaw:
      age.raw,

    height:
      height,

    caste:
      caste,

    rashi:
      rashi,

    photo:
      photo

  };

}


// ============================================================
// NORMALIZE ALL RAW PROFILES FROM ONE SHEET
// ============================================================

function normalizeMatchingProfileCollection(
  repositoryResult
) {

  if (
    !repositoryResult ||
    repositoryResult.success !== true
  ) {

    return {

      success: false,

      profiles: [],

      message:
        "Invalid repository result."

    };

  }


  const headers =
    repositoryResult.headers || [];


  const rows =
    repositoryResult.rows || [];


  const profileType =
    repositoryResult.profileType || "";


  const profiles = [];


  rows.forEach(
    function(row) {

      const profile =
        normalizeMatchingBasicProfile(
          row,
          headers,
          profileType
        );


      // ------------------------------------------------------
      // Require valid profile ID
      // ------------------------------------------------------

      if (
        !profile.id
      ) {

        return;

      }


      profiles.push(
        profile
      );

    }
  );


  return {

    success: true,

    profileType:
      profileType,

    sheetName:
      repositoryResult.sheetName || "",

    profiles:
      profiles

  };

}


function testMatchingBasicNormalizer() {

  const repositoryResult =
    getMatchingRawProfileData(
      "groom"
    );


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:",
      repositoryResult
    );

    return;

  }


  const normalizedResult =
    normalizeMatchingProfileCollection(
      repositoryResult
    );


  console.log(
    JSON.stringify(
      {

        success:
          normalizedResult.success,

        profileType:
          normalizedResult.profileType,

        sheetName:
          normalizedResult.sheetName,

        profileCount:
          normalizedResult.profiles.length,

        firstProfile:
          normalizedResult.profiles[0]

      },
      null,
      2
    )
  );

}