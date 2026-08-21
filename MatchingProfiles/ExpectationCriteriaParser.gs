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

  const raw =
    String(
      expectationText || ""
    ).trim();


  const normalizedText =
    normalizeExpectationText(
      raw
    );


  if (!normalizedText) {

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
  // ==========================================================

  const parsed =
    parseExpectations(
      raw
    );


  // ==========================================================
  // AGE
  // ==========================================================

  const age =
    parseExpectationAge(
      raw
    );


  // ==========================================================
  // HEIGHT
  // ==========================================================

  const height =
    parseExpectationHeight(
      raw
    );


  // ==========================================================
  // DISTRICT
  // ==========================================================

  const districts =
    parseExpectationDistricts(
      raw
    );


  // ==========================================================
  // INCOME
  // ==========================================================

  const income =
    parseExpectationIncome(
      raw
    );


  // ==========================================================
  // CASTE
  // ==========================================================

  const caste =
    parseExpectationCaste(
      raw
    );


  // ==========================================================
  // RASHI
  // ==========================================================

  const rashi =
    parseExpectationRashi(
      raw
    );


  // ==========================================================
  // HARD CRITERIA
  // ==========================================================

  const hasHardCriteria =
    (
      parsed.educationCategories &&
      parsed.educationCategories.length > 0
    ) ||

    (
      parsed.professionCategories &&
      parsed.professionCategories.length > 0
    ) ||

    (
      parsed.employmentTypes &&
      parsed.employmentTypes.length > 0
    ) ||

    parsed.educationRequired === true ||

    parsed.employmentRequired === true ||

    age.enabled === true ||

    height.enabled === true ||

    districts.length > 0 ||

    income.enabled === true ||

    caste.enabled === true ||

    rashi.enabled === true;


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
  // FINAL RESULT
  // ==========================================================

  return {

    raw:
      raw,

    normalizedText:
      normalizedText,

    educationCategories:
      parsed.educationCategories || [],

    professionCategories:
      parsed.professionCategories || [],

    employmentTypes:
      parsed.employmentTypes || [],

    educationRequired:
      parsed.educationRequired === true,

    employmentRequired:
      parsed.employmentRequired === true,

    age:
      age,

    height:
      height,

    districts:
      districts,

    income:
      income,

    caste:
      caste,

    rashi:
      rashi,

    softPreferences:
      softPreferences,

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
    );


  // ----------------------------------------------------------
  // Feet + inches range
  // ----------------------------------------------------------

  const rangeRegex =
    /(\d)\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?\s*(?:to|-|–|ते)\s*(\d)\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?/i;


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


    result.enabled = true;

    result.minInches =
      minFeet * 12 +
      minInches;

    result.maxInches =
      maxFeet * 12 +
      maxInches;

    return result;

  }


  // ----------------------------------------------------------
  // Single minimum height
  // ----------------------------------------------------------

  const minimumRegex =
    /(?:above|over|minimum|min|किमान|पेक्षा जास्त)\s*(\d)\s*(?:feet|foot|ft|फूट)\s*(\d{1,2})?/i;


  const minimumMatch =
    value.match(
      minimumRegex
    );


  if (minimumMatch) {

    result.enabled = true;

    result.minInches =
      Number(
        minimumMatch[1]
      ) * 12 +
      Number(
        minimumMatch[2] || 0
      );

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

function parseExpectationDistricts(
  text
) {

  const value =
    String(
      text || ""
    ).trim();


  if (!value) {

    return [];

  }


  const districts = [];


  // ----------------------------------------------------------
  // Known Maharashtra districts
  // ----------------------------------------------------------

  const knownDistricts = [

    "पुणे",
    "मुंबई",
    "मुंबई शहर",
    "मुंबई उपनगर",
    "कोल्हापूर",
    "सांगली",
    "सातारा",
    "सोलापूर",
    "नाशिक",
    "जळगाव",
    "धुळे",
    "नंदुरबार",
    "अहमदनगर",
    "अहिल्यानगर",
    "औरंगाबाद",
    "छत्रपती संभाजीनगर",
    "बीड",
    "लातूर",
    "उस्मानाबाद",
    "धाराशिव",
    "नांदेड",
    "परभणी",
    "हिंगोली",
    "अमरावती",
    "अकोला",
    "बुलढाणा",
    "वाशिम",
    "यवतमाळ",
    "नागपूर",
    "वर्धा",
    "भंडारा",
    "गोंदिया",
    "चंद्रपूर",
    "गडचिरोली",
    "रत्नागिरी",
    "सिंधुदुर्ग",
    "ठाणे",
    "पालघर",
    "रायगड"
  ];


  knownDistricts.forEach(
    function(district) {

      if (
        value.includes(
          district
        )
      ) {

        districts.push(
          district
        );

      }

    }
  );


  return expectationUnique(
    districts
  );

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
    value.replace(
      /,/g,
      ""
    );


  // ----------------------------------------------------------
  // Range
  // ----------------------------------------------------------

  let match =
    value.match(
      /(?:rs\.?|रु\.?|₹)?\s*(\d{4,7})\s*(?:to|–|-|ते)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,7})/i
    );


  if (match) {

    result.enabled = true;

    result.min =
      Number(match[1]);

    result.max =
      Number(match[2]);

    return result;

  }


  // ----------------------------------------------------------
  // Minimum
  // ----------------------------------------------------------

  match =
    value.match(
      /(?:above|over|minimum|min|किमान|पेक्षा जास्त)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,7})/i
    );


  if (match) {

    result.enabled = true;

    result.min =
      Number(match[1]);

    return result;

  }


  // ----------------------------------------------------------
  // Maximum
  // ----------------------------------------------------------

  match =
    value.match(
      /(?:below|under|maximum|max|कमाल|पेक्षा कमी)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,7})/i
    );


  if (match) {

    result.enabled = true;

    result.max =
      Number(match[1]);

  }


  return result;

}



// ============================================================
// CASTE PARSER
//
// Only explicit caste phrases are parsed.
// ============================================================

function parseExpectationCaste(
  text
) {

  const value =
    String(
      text || ""
    ).trim();


  const result = {

    enabled: false,

    values: []

  };


  if (!value) {

    return result;

  }


  const keywords = [

    "देवांग कोष्टी",
    "कोष्टी",
    "हिंदू",
    "मराठा",
    "ब्राह्मण",
    "सोनार",
    "नाभिक",
    "जैन",
    "लिंगायत"

  ];


  keywords.forEach(
    function(keyword) {

      if (
        value.includes(
          keyword
        )
      ) {

        result.values.push(
          keyword
        );

      }

    }
  );


  result.values =
    expectationUnique(
      result.values
    );


  result.enabled =
    result.values.length > 0;


  return result;

}



// ============================================================
// RASHI PARSER
// ============================================================

function parseExpectationRashi(
  text
) {

  const value =
    String(
      text || ""
    ).trim();


  const result = {

    enabled: false,

    values: []

  };


  const rashis = [

    "मेष",
    "वृषभ",
    "मिथुन",
    "कर्क",
    "सिंह",
    "कन्या",
    "तुला",
    "वृश्चिक",
    "धनु",
    "मकर",
    "कुंभ",
    "मीन"

  ];


  rashis.forEach(
    function(rashi) {

      if (
        value.includes(
          rashi
        )
      ) {

        result.values.push(
          rashi
        );

      }

    }
  );


  result.values =
    expectationUnique(
      result.values
    );


  result.enabled =
    result.values.length > 0;


  return result;

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