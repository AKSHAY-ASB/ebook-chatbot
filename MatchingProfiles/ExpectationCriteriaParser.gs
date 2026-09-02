// ============================================================
// FILE : ExpectationCriteriaParser.gs
// MODULE : Matching
// PURPOSE : Convert expectation text into structured criteria
//
// FLOW
//
// अपेक्षा
//   ↓
// ExpectationParser
//   ↓
// Structured Matching Criteria
//   ↓
// MatchingEngine
//
// IMPORTANT
// - Does NOT read Google Sheets
// - Does NOT load candidate profiles
// - Does NOT perform final matching
// - Does NOT apply LIKE / DISLIKE
// ============================================================



// ============================================================
// MAIN FUNCTION
// ============================================================

function parseExpectationCriteria(
  expectationText
) {

  // ==========================================================
  // RAW TEXT
  // ==========================================================

  const raw =
    String(
      expectationText || ""
    ).trim();


  const normalizedText =
    normalizeExpectationText(
      raw
    );


  // ==========================================================
  // EMPTY EXPECTATION
  // ==========================================================

  if (
    !normalizedText
  ) {

    return {

      raw: "",

      normalizedText: "",

      educationCategories: [],

      professionCategories: [],

      employmentTypes: [],

      educationRequired: false,

      employmentRequired: false,

      age: {

        enabled: false,

        min: null,

        max: null

      },

      height: {

        enabled: false,

        minInches: null,

        maxInches: null

      },

      districts: [],

      income: {

        enabled: false,

        min: null,

        max: null

      },

      caste: {

        enabled: false,

        values: []

      },

      rashi: {

        enabled: false,

        values: []

      },

      softPreferences: {},

      hasHardCriteria: false,

      hasSoftPreferences: false,

      hasCriteria: false

    };

  }


  // ==========================================================
  // EXISTING EXPECTATION PARSER
  //
  // Education
  // Profession
  // Employment
  // Soft Preferences
  // ==========================================================

  const parsed =
    parseExpectations(
      raw
    ) || {};


  // ==========================================================
  // AGE
  // ==========================================================

  const ageResult =
    parseExpectationAge(
      raw
    ) || {

      enabled: false,

      min: null,

      max: null

    };


  // ==========================================================
  // HEIGHT
  //
  // IMPORTANT:
  // Use normalized text because the custom height parser
  // supports formats such as:
  //
  // 5'5 to 5'8
  // 5'5-5'8
  // 5 ft 5 in to 5 ft 8 in
  // ==========================================================

  const heightResult =
    parseExpectationHeightRange(
      normalizedText
    ) || {

      enabled: false,

      minInches: null,

      maxInches: null

    };


  // ==========================================================
  // DISTRICT
  // ==========================================================

  const districtResult =
    parseExpectationDistricts(
      normalizedText
    );


  const districts =
    Array.isArray(
      districtResult
    )
      ? [
          ...new Set(
            districtResult
          )
        ]
      : [];


  // ==========================================================
  // INCOME
  // ==========================================================

  const incomeResult =
    parseExpectationIncome(
      raw
    ) || {

      enabled: false,

      min: null,

      max: null

    };


  // ==========================================================
  // CASTE
  // ==========================================================

  const casteResult =
    parseExpectationCaste(
      normalizedText
    );


  const casteValues =
    Array.isArray(
      casteResult
    )
      ? [
          ...new Set(
            casteResult
          )
        ]
      : [];


  // ==========================================================
  // RASHI
  // ==========================================================

  const rashiResult =
    parseExpectationRashi(
      normalizedText
    );


  const rashiValues =
    Array.isArray(
      rashiResult
    )
      ? [
          ...new Set(
            rashiResult
          )
        ]
      : [];


  // ==========================================================
  // EDUCATION
  // ==========================================================

  const educationCategories =
    Array.isArray(
      parsed.educationCategories
    )
      ? [
          ...new Set(
            parsed.educationCategories
          )
        ]
      : [];


  // ==========================================================
  // PROFESSION
  // ==========================================================

  const professionCategories =
    Array.isArray(
      parsed.professionCategories
    )
      ? [
          ...new Set(
            parsed.professionCategories
          )
        ]
      : [];


  // ==========================================================
  // EMPLOYMENT TYPES
  // ==========================================================

  const employmentTypes =
    Array.isArray(
      parsed.employmentTypes
    )
      ? [
          ...new Set(
            parsed.employmentTypes
          )
        ]
      : [];


  // ==========================================================
  // REQUIRED FLAGS
  // ==========================================================

  const educationRequired =
    parsed.educationRequired === true;


  const employmentRequired =
    parsed.employmentRequired === true;


  // ==========================================================
  // SOFT PREFERENCES
  // ==========================================================

  const softPreferences =
    parsed.softPreferences || {};


  const hasSoftPreferences =
    Object.keys(
      softPreferences
    ).some(
      function(key) {

        return (
          softPreferences[key] === true
        );

      }
    );


  // ==========================================================
  // HARD CRITERIA
  //
  // IMPORTANT:
  // Check the FINAL parsed values.
  // ==========================================================

    // ==========================================================
    // HARD CRITERIA
    //
    // IMPORTANT
    // ----------------------------------------------------------
    // educationRequired / employmentRequired alone should NOT
    // make a hard criterion when there are no actual categories.
    //
    // Example:
    //
    // "सुशिक्षित"
    //     ↓
    // educationRequired = true
    // educationCategories = []
    //
    // This should NOT become a hard filter.
    //
    // Specific education such as:
    // "MBA", "M.Com", "BE"
    // will populate educationCategories and therefore
    // remain a genuine hard criterion.
    //
    // Same principle applies to employment.
    // ==========================================================

    const hasHardCriteria =

      educationCategories.length > 0 ||

      professionCategories.length > 0 ||

      employmentTypes.length > 0 ||

      ageResult.enabled === true ||

      heightResult.enabled === true ||

      districts.length > 0 ||

      incomeResult.enabled === true ||

      casteValues.length > 0 ||

      rashiValues.length > 0;


  // ==========================================================
  // FINAL RESULT
  // ==========================================================

    console.log(
      "========== PARSED EXPECTATION =========="
    );

    console.log(
      JSON.stringify(
        {
          raw:
            raw,

          hasHardCriteria:
            hasHardCriteria,

          age:
            ageResult,

          height:
            heightResult,

          districts:
            districts,

          income:
            incomeResult,

          caste:
            casteValues,

          rashi:
            rashiValues,

          education:
            educationCategories,

          profession:
            professionCategories,

          employment:
            employmentTypes
        },
        null,
        2
      )
    );



  return {

    raw:
      raw,

    normalizedText:
      normalizedText,


    // --------------------------------------------------------
    // EDUCATION
    // --------------------------------------------------------

    educationCategories:
      educationCategories,

    educationRequired:
      educationRequired,


    // --------------------------------------------------------
    // PROFESSION
    // --------------------------------------------------------

    professionCategories:
      professionCategories,


    // --------------------------------------------------------
    // EMPLOYMENT
    // --------------------------------------------------------

    employmentTypes:
      employmentTypes,

    employmentRequired:
      employmentRequired,


    // --------------------------------------------------------
    // AGE
    // --------------------------------------------------------

    age: {

      enabled:
        ageResult.enabled === true,

      min:
        ageResult.min !== undefined
          ? ageResult.min
          : null,

      max:
        ageResult.max !== undefined
          ? ageResult.max
          : null

    },


    // --------------------------------------------------------
    // HEIGHT
    // --------------------------------------------------------

    height: {

      enabled:
        heightResult.enabled === true,

      minInches:
        heightResult.minInches !== undefined
          ? heightResult.minInches
          : null,

      maxInches:
        heightResult.maxInches !== undefined
          ? heightResult.maxInches
          : null

    },


    // --------------------------------------------------------
    // DISTRICTS
    // --------------------------------------------------------

    districts:
      districts,


    // --------------------------------------------------------
    // INCOME
    // --------------------------------------------------------

    income: {

      enabled:
        incomeResult.enabled === true,

      min:
        incomeResult.min !== undefined
          ? incomeResult.min
          : null,

      max:
        incomeResult.max !== undefined
          ? incomeResult.max
          : null

    },


    // --------------------------------------------------------
    // CASTE
    // --------------------------------------------------------

    caste: {

      enabled:
        casteValues.length > 0,

      values:
        casteValues

    },


    // --------------------------------------------------------
    // RASHI
    // --------------------------------------------------------

    rashi: {

      enabled:
        rashiValues.length > 0,

      values:
        rashiValues

    },


    // --------------------------------------------------------
    // SOFT PREFERENCES
    // --------------------------------------------------------

    softPreferences:
      softPreferences,


    // --------------------------------------------------------
    // FLAGS
    // --------------------------------------------------------

    hasHardCriteria:
      hasHardCriteria,

    hasSoftPreferences:
      hasSoftPreferences,

    hasCriteria:
      hasHardCriteria ||
      hasSoftPreferences

  };

}


// ============================================================
// AGE PARSER
//
// Supported examples:
//
// age 25 to 30
// 25-30 years
// वय २५ ते ३०
// वय 25 ते 30
// 25 ते 30 वर्षे
// ============================================================

function parseExpectationAge(
  text
) {

  const result = {

    enabled: false,

    min: null,

    max: null

  };


  const original =
    String(
      text || ""
    );


  if (!original.trim()) {

    return result;

  }


  const value =
    convertMarathiDigits(
      original
    );


  // ========================================================
  // IMPORTANT
  //
  // Age range is parsed ONLY when age-related word exists.
  //
  // Examples:
  //
  // वय 25 ते 30
  // age 25 to 30
  // 25 ते 30 वर्षे
  //
  // But NOT:
  //
  // उत्पन्न 15000 ते 30000
  // ========================================================

  const hasAgeKeyword =
    /(?:वय|age|years?|वर्षे|वर्ष)/iu.test(
      value
    );


  if (!hasAgeKeyword) {

    return result;

  }


  // ========================================================
  // RANGE
  // ========================================================

  const rangeMatch =
    value.match(
      /(?:वय|age|years?|वर्षे|वर्ष)?\s*(\d{1,2})\s*(?:to|-|–|ते)\s*(\d{1,2})/iu
    );


  if (rangeMatch) {

    const min =
      Number(
        rangeMatch[1]
      );


    const max =
      Number(
        rangeMatch[2]
      );


    // Basic validation
    if (
      min >= 18 &&
      max <= 100 &&
      min <= max
    ) {

      result.enabled = true;

      result.min =
        min;

      result.max =
        max;

      return result;

    }

  }


  // ========================================================
  // MINIMUM AGE
  //
  // वय 25 पेक्षा जास्त
  // age above 25
  // minimum age 25
  // ========================================================

  const minMatch =
    value.match(
      /(?:वय|age|minimum age|min age)\s*(?:above|over|minimum|min|किमान|पेक्षा जास्त)\s*(\d{1,2})/iu
    );


  if (minMatch) {

    const min =
      Number(
        minMatch[1]
      );


    if (
      min >= 18 &&
      min <= 100
    ) {

      result.enabled = true;

      result.min =
        min;

      return result;

    }

  }


  // ========================================================
  // MAXIMUM AGE
  //
  // वय 30 पेक्षा कमी
  // age below 30
  // maximum age 30
  // ========================================================

  const maxMatch =
    value.match(
      /(?:वय|age|maximum age|max age)\s*(?:below|under|maximum|max|कमाल|पेक्षा कमी)\s*(\d{1,2})/iu
    );


  if (maxMatch) {

    const max =
      Number(
        maxMatch[1]
      );


    if (
      max >= 18 &&
      max <= 100
    ) {

      result.enabled = true;

      result.max =
        max;

    }

  }


  return result;

}


// ============================================================
// HEIGHT PARSER
//
// Examples:
//
// 5 feet 2 inches to 5 feet 8 inches
// ५ फूट २ इंच ते ५ फूट ८ इंच
// 5'2" to 5'8"
// ============================================================


function parseExpectationHeight(
  text
) {

  const result = {

    enabled: false,

    minInches: null,

    maxInches: null

  };


  const value =
    convertMarathiDigits(
      String(text || "")
    )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();


  if (!value) {

    return result;

  }


  // ==========================================================
  // HELPER
  // Convert feet + inches to total inches
  // ==========================================================

  function toInches(
    feet,
    inches
  ) {

    return (
      Number(feet || 0) * 12
      +
      Number(inches || 0)
    );

  }


  // ==========================================================
  // 1. FEET + INCHES RANGE
  //
  // Examples:
  //
  // 5 फूट 3 इंच ते 5 फूट 7 इंच
  // 5 feet 3 inches to 5 feet 7 inches
  // 5 ft 3 in - 5 ft 7 in
  // ==========================================================

  const rangeRegex =
    /(\d{1,2})\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?\s*(?:to|-|–|ते)\s*(\d{1,2})\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?/i;


  const rangeMatch =
    value.match(
      rangeRegex
    );


  if (rangeMatch) {

    const minFeet =
      Number(
        rangeMatch[1]
      );


    const minInches =
      Number(
        rangeMatch[2] || 0
      );


    const maxFeet =
      Number(
        rangeMatch[3]
      );


    const maxInches =
      Number(
        rangeMatch[4] || 0
      );


    result.enabled =
      true;


    result.minInches =
      toInches(
        minFeet,
        minInches
      );


    result.maxInches =
      toInches(
        maxFeet,
        maxInches
      );


    return result;

  }


  // ==========================================================
  // 2. MINIMUM HEIGHT
  //
  // IMPORTANT:
  // The height can appear BEFORE the minimum phrase.
  //
  // Examples:
  //
  // 5 फूट 3 इंच किंवा त्यापेक्षा जास्त
  // 5 फूट 3 इंच पेक्षा जास्त
  // 5 feet 3 inches or above
  // 5 ft 3 in minimum
  // ==========================================================

  const minimumHeightRegex =
    /(\d{1,2})\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?\s*(?:or\s+above|or\s+higher|or\s+more|above|over|minimum|min|किंवा\s+त्यापेक्षा\s+जास्त|त्यापेक्षा\s+जास्त|पेक्षा\s+जास्त|किमान)/i;


  const minimumHeightMatch =
    value.match(
      minimumHeightRegex
    );


  if (minimumHeightMatch) {

    result.enabled =
      true;


    result.minInches =
      toInches(
        minimumHeightMatch[1],
        minimumHeightMatch[2] || 0
      );


    result.maxInches =
      null;


    return result;

  }


  // ==========================================================
  // 3. MINIMUM PHRASE BEFORE HEIGHT
  //
  // Examples:
  //
  // किमान 5 फूट 3 इंच
  // minimum 5 feet 3 inches
  // above 5 feet 3 inches
  // ==========================================================

  const minimumBeforeHeightRegex =
    /(?:above|over|minimum|min|at\s+least|किमान|पेक्षा\s+जास्त)\s*(\d{1,2})\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?/i;


  const minimumBeforeHeightMatch =
    value.match(
      minimumBeforeHeightRegex
    );


  if (minimumBeforeHeightMatch) {

    result.enabled =
      true;


    result.minInches =
      toInches(
        minimumBeforeHeightMatch[1],
        minimumBeforeHeightMatch[2] || 0
      );


    result.maxInches =
      null;


    return result;

  }


  // ==========================================================
  // 4. SINGLE EXACT HEIGHT
  //
  // Examples:
  //
  // उंची 5 फूट 3 इंच
  // height 5 feet 3 inches
  // ==========================================================

  const exactHeightRegex =
    /(?:height|उंची)?\s*(\d{1,2})\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?/i;


  const exactHeightMatch =
    value.match(
      exactHeightRegex
    );


  if (exactHeightMatch) {

    result.enabled =
      true;


    const inches =
      toInches(
        exactHeightMatch[1],
        exactHeightMatch[2] || 0
      );


    result.minInches =
      inches;

    result.maxInches =
      inches;


    return result;

  }


  return result;

}

// ============================================================
// DISTRICT PARSER
//
// We intentionally parse only explicit district phrases.
//
// Examples:
//
// Pune
// पुणे
// Pune / Mumbai
// पुणे, मुंबई
//
// NOTE:
// This does NOT treat every city mentioned in an expectation
// as a strict district requirement yet.
// ============================================================

function parseExpectationDistricts(text) {

  const value =
    normalizeExpectationText(
      text
    );


  const districtAliases = {

    "pune":
      "Pune",

    "पुणे":
      "Pune",

    "kolhapur":
      "Kolhapur",

    "कोल्हापूर":
      "Kolhapur",

    "mumbai":
      "Mumbai",

    "मुंबई":
      "Mumbai",

    "thane":
      "Thane",

    "ठाणे":
      "Thane",

    "nashik":
      "Nashik",

    "नाशिक":
      "Nashik",

    "nagpur":
      "Nagpur",

    "नागपूर":
      "Nagpur",

    "satara":
      "Satara",

    "सातारा":
      "Satara",

    "sangli":
      "Sangli",

    "सांगली":
      "Sangli",

    "solapur":
      "Solapur",

    "सोलापूर":
      "Solapur",

    "ratnagiri":
      "Ratnagiri",

    "रत्नागिरी":
      "Ratnagiri",

    "sindhudurg":
      "Sindhudurg",

    "सिंधुदुर्ग":
      "Sindhudurg",

    "raigad":
      "Raigad",

    "रायगड":
      "Raigad",

    "palghar":
      "Palghar",

    "पालघर":
      "Palghar"

  };


  const districts = [];


  Object.keys(
    districtAliases
  ).forEach(
    function(alias) {

      if (
        value.indexOf(
          alias
        ) !== -1
      ) {

        districts.push(
          districtAliases[alias]
        );

      }

    }
  );


  return [
    ...new Set(
      districts
    )
  ];

}


// ============================================================
// INCOME PARSER
//
// Examples:
//
// 15000 ते 30000
// रु. १५,००० ते ३०,०००
// 50000+
//50000 पेक्षा जास्त
// ============================================================

function parseExpectationIncome(
  text
) {

  const result = {

    enabled: false,

    min: null,

    max: null

  };


  let value =
    convertMarathiDigits(
      String(text || "")
    );


  value =
    value
      .replace(/,/g, "")
      .replace(/\s+/g, " ")
      .trim();


  if (!value) {

    return result;

  }


  // ==========================================================
  // 1. RANGE
  //
  // Examples:
  //
  // 50000 to 80000
  // 50,000 ते 80,000
  // रु. 50000 - रु. 80000
  // ==========================================================

  let match =
    value.match(
      /(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})\s*(?:to|–|-|ते)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;


    result.min =
      Number(
        match[1]
      );


    result.max =
      Number(
        match[2]
      );


    return result;

  }


  // ==========================================================
  // 2. MINIMUM — AMOUNT FIRST
  //
  // Examples:
  //
  // 50000 पेक्षा जास्त
  // 50000 पेक्षा अधिक
  // 50000 किंवा त्यापेक्षा जास्त
  // 50000 or above
  // 50000 or more
  // 50000+
  // ==========================================================

  match =
    value.match(
      /(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})\s*(?:\+|or\s+above|or\s+higher|or\s+more|above|over|पेक्षा\s+जास्त|पेक्षा\s+अधिक|किंवा\s+त्यापेक्षा\s+जास्त|किंवा\s+त्यापेक्षा\s+अधिक)/i
    );


  if (match) {

    result.enabled =
      true;


    result.min =
      Number(
        match[1]
      );


    result.max =
      null;


    return result;

  }


  // ==========================================================
  // 3. MINIMUM — PHRASE FIRST
  //
  // Examples:
  //
  // किमान 50000
  // minimum 50000
  // min 50000
  // above 50000
  // over 50000
  // ==========================================================

  match =
    value.match(
      /(?:above|over|minimum|min|at\s+least|किमान|पेक्षा\s+जास्त)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;


    result.min =
      Number(
        match[1]
      );


    result.max =
      null;


    return result;

  }


  // ==========================================================
  // 4. MAXIMUM — AMOUNT FIRST
  //
  // Examples:
  //
  // 50000 पेक्षा कमी
  // 50000 च्या आत
  // 50000 or below
  // below 50000
  // ==========================================================

  match =
    value.match(
      /(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})\s*(?:or\s+below|or\s+less|below|under|पेक्षा\s+कमी|पेक्षा\s+खाली|किंवा\s+त्यापेक्षा\s+कमी)/i
    );


  if (match) {

    result.enabled =
      true;


    result.min =
      null;


    result.max =
      Number(
        match[1]
      );


    return result;

  }


  // ==========================================================
  // 5. MAXIMUM — PHRASE FIRST
  //
  // Examples:
  //
  // कमाल 50000
  // maximum 50000
  // max 50000
  // below 50000
  // under 50000
  // ==========================================================

  match =
    value.match(
      /(?:below|under|maximum|max|कमाल|पेक्षा\s+कमी)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;


    result.min =
      null;


    result.max =
      Number(
        match[1]
      );


    return result;

  }


  return result;

}


// ============================================================
// CASTE PARSER
//
// Only explicit caste phrases are parsed.
// ============================================================


function parseExpectationCaste(text) {

  const value =
    normalizeExpectationText(
      text
    );


  const values = [];


  // ==========================================================
  // DEVANG KOSHTI
  // ==========================================================

  if (
    value.indexOf(
      "devang koshti"
    ) !== -1 ||

    value.indexOf(
      "devang"
    ) !== -1 &&
    value.indexOf(
      "koshti"
    ) !== -1 ||

    value.indexOf(
      "देवांग कोष्टी"
    ) !== -1
  ) {

    values.push(
      "देवांग कोष्टी"
    );

  }


  // ==========================================================
  // KOSHTI
  // ==========================================================

  else if (
    value.indexOf(
      "koshti"
    ) !== -1 ||

    value.indexOf(
      "कोष्टी"
    ) !== -1
  ) {

    values.push(
      "कोष्टी"
    );

  }


  return [
    ...new Set(
      values
    )
  ];

}


// ============================================================
// RASHI PARSER
// ============================================================

function parseExpectationRashi(text) {

  const value =
    normalizeExpectationText(
      text
    );


  const rashiMap = {

    "mesh":
      "मेष",

    "aries":
      "मेष",

    "मेष":
      "मेष",


    "vrushabh":
      "वृषभ",

    "vrishabh":
      "वृषभ",

    "taurus":
      "वृषभ",

    "वृषभ":
      "वृषभ",


    "mithun":
      "मिथुन",

    "gemini":
      "मिथुन",

    "मिथुन":
      "मिथुन",


    "kark":
      "कर्क",

    "cancer":
      "कर्क",

    "कर्क":
      "कर्क",


    "simha":
      "सिंह",

    "leo":
      "सिंह",

    "सिंह":
      "सिंह",


    "kanya":
      "कन्या",

    "virgo":
      "कन्या",

    "कन्या":
      "कन्या",


    "tula":
      "तुळ",

    "libra":
      "तुळ",

    "तुळ":
      "तुळ",


    "vrushchik":
      "वृश्चिक",

    "scorpio":
      "वृश्चिक",

    "वृश्चिक":
      "वृश्चिक",


    "dhanu":
      "धनु",

    "sagittarius":
      "धनु",

    "धनु":
      "धनु",


    "makar":
      "मकर",

    "capricorn":
      "मकर",

    "मकर":
      "मकर",


    "kumbh":
      "कुंभ",

    "aquarius":
      "कुंभ",

    "कुंभ":
      "कुंभ",


    "meen":
      "मीन",

    "pisces":
      "मीन",

    "मीन":
      "मीन"

  };


  const result = [];


  Object.keys(
    rashiMap
  ).forEach(
    function(key) {

      if (
        value.indexOf(
          key
        ) !== -1
      ) {

        result.push(
          rashiMap[key]
        );

      }

    }
  );


  return [
    ...new Set(
      result
    )
  ];

}



// ============================================================
// MARATHI DIGIT CONVERTER
// ============================================================

function convertMarathiDigits(
  value
) {

  const marathiDigits = {

    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9"

  };


  return String(
    value || ""
  ).replace(
    /[०-९]/g,
    function(digit) {

      return (
        marathiDigits[digit]
      );

    }
  );

}



// ============================================================
// TEST CASES
// ============================================================

function testExpectationCriteriaParser() {

  const testCases = [

    {

      label:
        "Case 1 - Age Range",

      input:
        "वय 25 ते 30"

    },


    {

      label:
        "Case 2 - Marathi Age",

      input:
        "वय २५ ते ३० वर्षे"

    },


    {

      label:
        "Case 3 - Height",

      input:
        "उंची ५ फूट २ इंच ते ५ फूट ७ इंच"

    },


    {

      label:
        "Case 4 - Income",

      input:
        "मासिक उत्पन्न १५,००० ते ३०,०००"

    },


    {

      label:
        "Case 5 - District",

      input:
        "पुणे किंवा कोल्हापूर"

    },


    {

      label:
        "Case 6 - Education + Employment",

      input:
        "सुशिक्षित, सरकारी नोकरी"

    },


    {

      label:
        "Case 7 - User ID001",

      input:
        "आयुष्यभराची विश्वासू मैत्रीण, सुशिक्षित, समजूतदार, संस्कारी आणि प्रेमळ व करिअरचा आणि स्वप्नांचा आदर करणारी जीवनसाथी असावी."

    }

  ];


  const results =
    testCases.map(
      function(testCase) {

        return {

          label:
            testCase.label,

          input:
            testCase.input,

          output:
            parseExpectationCriteria(
              testCase.input
            )

        };

      }
    );


  console.log(
    JSON.stringify(
      results,
      null,
      2
    )
  );


  return results;

}



function testExpectationIncomeParser() {

  const testCases = [

    "मासिक उत्पन्न 50,000 पेक्षा जास्त असावे.",

    "मासिक उत्पन्न 50,000 ते 80,000 असावे.",

    "किमान 50,000 रुपये मासिक उत्पन्न असावे.",

    "income 50000 or above",

    "income above 50000",

    "मासिक उत्पन्न 50,000 पेक्षा कमी असावे.",

    "income below 50000"

  ];


  testCases.forEach(
    function(input) {

      const result =
        parseExpectationIncome(
          input
        );


      console.log(
        "INPUT:",
        input
      );


      console.log(
        "OUTPUT:",
        JSON.stringify(
          result,
          null,
          2
        )
      );


      console.log(
        "--------------------------------------"
      );

    }
  );

}