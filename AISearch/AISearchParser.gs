/**
 * ============================================================
 * AI SEARCH PARSER
 * ============================================================
 *
 * Purpose:
 * Convert a natural-language matrimonial search query
 * into the standardized AISearchCriteria model.
 *
 * IMPORTANT:
 * - No Google Sheet access
 * - No database writes
 * - No modification of existing search functions
 * - No external AI API in this phase
 * - Never guess critical search criteria
 *
 * ============================================================
 */


/* ============================================================
 * PUBLIC ENTRY POINT
 * ============================================================
 */

function parseAISearchQuery(query, source) {

  const normalizedQuery =
    normalizeAISearchQueryText(query);

  const normalizedSource =
    normalizeAISearchQuerySource(source);


  /* ----------------------------------------------------------
   * Empty query
   * ----------------------------------------------------------
   */

  if (!normalizedQuery) {

    return createAISearchClarificationCriteria(

      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .QUERY_TOO_VAGUE,

      AI_SEARCH_CONFIG.MESSAGES.EMPTY_QUERY,

      ""

    );

  }


  /* ----------------------------------------------------------
   * Query length protection
   * ----------------------------------------------------------
   */

  if (
    normalizedQuery.length >
    AI_SEARCH_CONFIG.LIMITS.MAX_QUERY_LENGTH
  ) {

    return {

      status:
        AI_SEARCH_CONFIG.QUERY_STATUS.INVALID_QUERY,

      originalQuery:
        normalizedQuery,

      errorCode:
        AI_SEARCH_CONFIG.ERROR_CODES.QUERY_TOO_LONG

    };

  }


  /* ----------------------------------------------------------
   * Detect unsupported / unrelated query
   * ----------------------------------------------------------
   */

  if (isAISearchClearlyUnsupported(normalizedQuery)) {

    return {

      status:
        AI_SEARCH_CONFIG.QUERY_STATUS.UNSUPPORTED_QUERY,

      originalQuery:
        normalizedQuery,

      source:
        normalizedSource,

      clarificationReason:
        null,

      clarificationMessage:
        AI_SEARCH_CONFIG.MESSAGES.UNSUPPORTED_QUERY

    };

  }


  /* ----------------------------------------------------------
   * Extract criteria
   * ----------------------------------------------------------
   */

  const extracted =
    extractAISearchCriteria(normalizedQuery);


  /* ----------------------------------------------------------
   * Convert extracted data into standard model
   * ----------------------------------------------------------
   */

  let criteria =
    createAISearchCriteria({

      profileType:
        extracted.profileType,

      district:
        extracted.district,

      educationCategory:
        extracted.educationCategory,

      ageMin:
        extracted.ageMin,

      ageMax:
        extracted.ageMax,

      incomeMin:
        extracted.incomeMin,

      incomeMax:
        extracted.incomeMax,

      incomeOperator:
        extracted.incomeOperator,

      profession:
        extracted.profession,

      originalQuery:
        normalizedQuery,

      confidence:
        extracted.confidence,

      status:
        AI_SEARCH_CONFIG.QUERY_STATUS.READY

    });


  /* ----------------------------------------------------------
   * Add source information.
   *
   * Source is intentionally non-critical and is added
   * separately so existing criteria contract remains stable.
   * ----------------------------------------------------------
   */

  criteria.source =
    normalizedSource;


  /* ----------------------------------------------------------
   * Determine missing critical criteria
   * ----------------------------------------------------------
   */

  const missing =
    getAISearchMissingCriteria(criteria);


  /* ----------------------------------------------------------
   * Multiple profile types
   * ----------------------------------------------------------
   */

  if (
    extracted.multipleProfileTypes === true
  ) {

    return createAISearchClarificationCriteria(

      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .MULTIPLE_PROFILE_TYPES,

      AI_SEARCH_CONFIG.MESSAGES
        .PROFILE_TYPE_REQUIRED,

      normalizedQuery

    );

  }


  /* ----------------------------------------------------------
   * Ambiguous location
   * ----------------------------------------------------------
   */

  if (
    extracted.ambiguousDistrict === true
  ) {

    return createAISearchClarificationCriteria(

      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .AMBIGUOUS_LOCATION,

      AI_SEARCH_CONFIG.MESSAGES
        .DISTRICT_REQUIRED,

      normalizedQuery

    );

  }


  /* ----------------------------------------------------------
   * Ambiguous education
   * ----------------------------------------------------------
   */

  if (
    extracted.ambiguousEducation === true
  ) {

    return createAISearchClarificationCriteria(

      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .AMBIGUOUS_EDUCATION,

      AI_SEARCH_CONFIG.MESSAGES
        .EDUCATION_REQUIRED,

      normalizedQuery

    );

  }


  /* ----------------------------------------------------------
   * Missing profile type
   * ----------------------------------------------------------
   */

  if (
    missing.indexOf("profileType") !== -1
  ) {

    criteria.status =
      AI_SEARCH_CONFIG.QUERY_STATUS
        .CLARIFICATION_REQUIRED;

    criteria.clarificationReason =
      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .PROFILE_TYPE_MISSING;

    criteria.clarificationMessage =
      AI_SEARCH_CONFIG.MESSAGES
        .PROFILE_TYPE_REQUIRED;

    return criteria;

  }


  /* ----------------------------------------------------------
   * Missing district
   * ----------------------------------------------------------
   */

  if (
    missing.indexOf("district") !== -1
  ) {

    criteria.status =
      AI_SEARCH_CONFIG.QUERY_STATUS
        .CLARIFICATION_REQUIRED;

    criteria.clarificationReason =
      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .DISTRICT_MISSING;

    criteria.clarificationMessage =
      AI_SEARCH_CONFIG.MESSAGES
        .DISTRICT_REQUIRED;

    return criteria;

  }


  /* ----------------------------------------------------------
   * Missing education
   *
   * Education is required for the initial AI search
   * implementation because the current search engine already
   * has a standardized education filter.
   * ----------------------------------------------------------
   */

  if (
    missing.indexOf("educationCategory") !== -1
  ) {

    criteria.status =
      AI_SEARCH_CONFIG.QUERY_STATUS
        .CLARIFICATION_REQUIRED;

    criteria.clarificationReason =
      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .EDUCATION_MISSING;

    criteria.clarificationMessage =
      AI_SEARCH_CONFIG.MESSAGES
        .EDUCATION_REQUIRED;

    return criteria;

  }


  /* ----------------------------------------------------------
   * Search-ready
   * ----------------------------------------------------------
   */

  criteria.status =
    AI_SEARCH_CONFIG.QUERY_STATUS
      .SEARCH_READY;

  criteria.clarificationReason = null;
  criteria.clarificationMessage = null;


  return criteria;

}


/* ============================================================
 * NORMALIZE QUERY
 * ============================================================
 */

function normalizeAISearchQueryText(query) {

  if (
    query === null ||
    query === undefined
  ) {
    return "";
  }

  return String(query)
    .trim()
    .replace(/\s+/g, " ");

}


/* ============================================================
 * NORMALIZE SOURCE
 * ============================================================
 */

function normalizeAISearchQuerySource(source) {

  const value =
    normalizeAISearchQueryText(source)
      .toLowerCase();

  if (
    value === "text" ||
    value === "voice"
  ) {
    return value;
  }

  return "unknown";

}


/* ============================================================
 * EXTRACT ALL SEARCH CRITERIA
 * ============================================================
 */

function extractAISearchCriteria(query) {

  return {

    profileType:
      detectAISearchProfileType(query),

    district:
      detectAISearchDistricts(query),

    educationCategory:
      detectAISearchEducation(query),

    ageMin:
      detectAISearchAgeMin(query),

    ageMax:
      detectAISearchAgeMax(query),

    incomeMin:
      detectAISearchIncomeMin(query),

    incomeMax:
      detectAISearchIncomeMax(query),

    incomeOperator:
      detectAISearchIncomeOperator(query),

    profession:
      detectAISearchProfession(query),

    multipleProfileTypes:
      detectMultipleAISearchProfileTypes(query),

    ambiguousDistrict:
      false,

    ambiguousEducation:
      detectAISearchEducationAmbiguity(query),

    confidence:
      null

  };

}


/* ============================================================
 * PROFILE TYPE
 * ============================================================
 */

/* ============================================================
 * PROFILE TYPE DETECTION
 * ============================================================
 *
 * Supports common Marathi + English matrimonial terms.
 *
 * IMPORTANT:
 * - "वर" must be detected safely.
 * - Do NOT use simple indexOf("वर")
 *   because words like "वर्षांची" contain "वर".
 * ============================================================
 */

function detectAISearchProfileType(query) {

  const text =
    String(query || "")
      .toLowerCase()
      .trim();


  /* ----------------------------------------------------------
   * BRIDE / FEMALE
   * ----------------------------------------------------------
   */

  const bridePatterns = [

    // Marathi
    "मुलगी",
    "मुली",
    "मुलीं",
    "मुलींची",
    "मुलींच्या",
    "मुलींसाठी",

    "वधू",

    // English
    "bride",
    "girl",
    "female",
    "woman",
    "women"

  ];


  /* ----------------------------------------------------------
   * GROOM / MALE
   * ----------------------------------------------------------
   */

  const groomPatterns = [

    // Marathi
    "मुलगा",
    "मुलगे",
    "मुलांना",
    "मुलांचा",
    "मुलांच्या",
    "मुले",

    // English
    "groom",
    "boy",
    "male",
    "man",
    "men"

  ];


  /* ----------------------------------------------------------
   * BRIDE DETECTION
   * ----------------------------------------------------------
   */

  const brideFound =
    bridePatterns.some(function(pattern) {

      return text.indexOf(pattern) !== -1;

    });


  /* ----------------------------------------------------------
   * GROOM DETECTION
   * ----------------------------------------------------------
   *
   * "वर" is handled separately with a boundary-safe regex.
   *
   * This prevents:
   *
   *   वर्ष
   *   वर्षांची
   *   वर्षांचा
   *
   * from being incorrectly detected as "वर".
   */

  const groomFoundByPattern =
    groomPatterns.some(function(pattern) {

      return text.indexOf(pattern) !== -1;

    });


  const groomFoundByVarWord =
    /(^|[\s,।,.!?;:()\-\u00A0])वर($|[\s,।,.!?;:()\-\u00A0])/
      .test(text);


  const groomFound =
    groomFoundByPattern ||
    groomFoundByVarWord;


  /* ----------------------------------------------------------
   * FINAL RESULT
   * ----------------------------------------------------------
   */

  if (
    brideFound &&
    !groomFound
  ) {

    return AI_SEARCH_CONFIG
      .PROFILE_TYPES
      .BRIDE;

  }


  if (
    groomFound &&
    !brideFound
  ) {

    return AI_SEARCH_CONFIG
      .PROFILE_TYPES
      .GROOM;

  }


  /*
   * Both found OR neither found
   */
  return "";

}

/* ============================================================
 * MULTIPLE PROFILE TYPE DETECTION
 * ============================================================
 */

/* ============================================================
 * MULTIPLE PROFILE TYPE DETECTION
 * ============================================================
 *
 * Detects whether the query contains BOTH bride and groom
 * profile references.
 *
 * IMPORTANT:
 * - "वर" uses boundary-safe detection.
 * - Prevents false detection from "वर्ष", "वर्षांची" etc.
 * ============================================================
 */

function detectMultipleAISearchProfileTypes(query) {

  const text =
    String(query || "")
      .toLowerCase()
      .trim();


  /* ----------------------------------------------------------
   * BRIDE / FEMALE PATTERNS
   * ----------------------------------------------------------
   */

  const bridePatterns = [

    // Marathi
    "मुलगी",
    "मुली",
    "मुलीं",
    "मुलींची",
    "मुलींच्या",
    "मुलींसाठी",

    "वधू",

    // English
    "bride",
    "girl",
    "female",
    "woman",
    "women"

  ];


  /* ----------------------------------------------------------
   * GROOM / MALE PATTERNS
   * ----------------------------------------------------------
   */

  const groomPatterns = [

    // Marathi
    "मुलगा",
    "मुलगे",
    "मुलांना",
    "मुलांचा",
    "मुलांच्या",
    "मुले",

    // English
    "groom",
    "boy",
    "male",
    "man",
    "men"

  ];


  /* ----------------------------------------------------------
   * BRIDE DETECTION
   * ----------------------------------------------------------
   */

  const brideFound =
    bridePatterns.some(function(pattern) {

      return text.indexOf(pattern) !== -1;

    });


  /* ----------------------------------------------------------
   * GROOM DETECTION
   * ----------------------------------------------------------
   */

  const groomFoundByPattern =
    groomPatterns.some(function(pattern) {

      return text.indexOf(pattern) !== -1;

    });


  /*
   * Boundary-safe "वर"
   *
   * Prevents:
   *
   *   वर्ष
   *   वर्षांची
   *   वर्षांचा
   *
   * from being treated as groom.
   */

  const groomFoundByVarWord =
    /(^|[\s,।,.!?;:()\-\u00A0])वर($|[\s,।,.!?;:()\-\u00A0])/
      .test(text);


  const groomFound =
    groomFoundByPattern ||
    groomFoundByVarWord;


  /* ----------------------------------------------------------
   * BOTH FOUND = MULTIPLE PROFILE TYPES
   * ----------------------------------------------------------
   */

  return (
    brideFound &&
    groomFound
  );

}


/* ============================================================
 * DISTRICT DETECTION
 * ============================================================
 */

function detectAISearchDistricts(query) {

  const text =
    String(query || "")
      .toLowerCase()
      .trim();

  const districtPatterns = [

    {
      patterns: [
        "पुणे",
        "पुण्यात",
        "पुण्यातील",
        "pune"
      ],
      value: "पुणे"
    },

    {
      patterns: [
        "मुंबई",
        "मुंबईत",
        "मुंबईतील",
        "mumbai"
      ],
      value: "मुंबई"
    },

    {
      patterns: [
        "ठाणे",
        "ठाण्यात",
        "ठाण्यातील",
        "thane"
      ],
      value: "ठाणे"
    },

    {
      patterns: [
        "नागपूर",
        "नागपुर",
        "नागपुरात",
        "नागपूरातील",
        "nagpur"
      ],
      value: "नागपूर"
    },

    {
      patterns: [
        "नाशिक",
        "नाशिकमध्ये",
        "नाशिकमधील",
        "nashik"
      ],
      value: "नाशिक"
    },

    {
      patterns: [
        "कोल्हापूर",
        "कोल्हापुर",
        "कोल्हापुरात",
        "कोल्हापूरातील",
        "kolhapur"
      ],
      value: "कोल्हापूर"
    },

    {
      patterns: [
        "सांगली",
        "सांगलीत",
        "सांगलीतील",
        "sangli"
      ],
      value: "सांगली"
    },

    {
      patterns: [
        "सातारा",
        "सातार्यात",
        "साताऱ्यात",
        "साताऱ्यातील",
        "satara"
      ],
      value: "सातारा"
    },

    {
      patterns: [
        "सोलापूर",
        "सोलापुर",
        "सोलापुरात",
        "solapur"
      ],
      value: "सोलापूर"
    },

    {
      patterns: [
        "अहमदनगर",
        "अहिल्यानगर",
        "ahmednagar",
        "ahilyanagar"
      ],
      value: "अहमदनगर"
    },

    {
      patterns: [
        "औरंगाबाद",
        "छत्रपती संभाजीनगर",
        "संभाजीनगर",
        "aurangabad",
        "chhatrapati sambhajinagar"
      ],
      value: "औरंगाबाद"
    },

    {
      patterns: [
        "जळगाव",
        "जलगाव",
        "jalgaon"
      ],
      value: "जळगाव"
    },

    {
      patterns: [
        "रत्नागिरी",
        "रत्नागिरीत",
        "रत्नागिरीतील",
        "ratnagiri"
      ],
      value: "रत्नागिरी"
    },

    {
      patterns: [
        "नांदेड",
        "नांदेडमध्ये",
        "नांदेडमधील",
        "nanded"
      ],
      value: "नांदेड"
    }

  ];


  const found = [];


  districtPatterns.forEach(function(item) {

    const matched =
      item.patterns.some(function(pattern) {

        return text.indexOf(
          pattern.toLowerCase()
        ) !== -1;

      });


    if (
      matched &&
      found.indexOf(item.value) === -1
    ) {

      found.push(item.value);

    }

  });


  return found;

}


/* ============================================================
 * EDUCATION DETECTION
 * ============================================================
 */

function detectAISearchEducation(query) {

  const text =
    String(query || "")
      .toLowerCase()
      .trim();


  const categories = {

    engineering: [
      "engineering",
      "engineer",
      "इंजिनिअरिंग",
      "इंजिनियरिंग",
      "अभियांत्रिकी",
      "इंजिनिअर",
      "इंजिनियर",
      "b.e",
      "b.e.",
      "be",
      "b.tech",
      "btech",
      "b.tech.",
      "m.e",
      "m.e.",
      "me",
      "m.tech",
      "mtech",
      "m.tech.",
      "civil engineering",
      "mechanical engineering",
      "electrical engineering",
      "electronics engineering",
      "computer engineering"
    ],

    medical: [
      "medical",
      "doctor",
      "mbbs",
      "bams",
      "bhms",
      "मेडिकल",
      "डॉक्टर"
    ],

    commerce: [
      "commerce",
      "कॉमर्स",
      "वाणिज्य"
    ],

    arts: [
      "arts",
      "आर्ट्स",
      "कला"
    ],

    science: [
      "science",
      "सायन्स",
      "विज्ञान"
    ],

    management: [
      "management",
      "mba",
      "व्यवस्थापन"
    ],

    law: [
      "law",
      "llb",
      "कायदा",
      "वकील"
    ],

    computer_it: [
      "computer science",
      "computer",
      "information technology",
      "it field",
      "software",
      "संगणक",
      "आयटी"
    ],

    pharmacy: [
      "pharmacy",
      "b.pharm",
      "bpharm",
      "m.pharm",
      "mpharm",
      "फार्मसी"
    ],

    education: [
      "education",
      "teacher",
      "teaching",
      "शिक्षण",
      "शिक्षक",
      "शिक्षिका"
    ]

  };


  const found = [];


  Object.keys(categories).forEach(
    function(category) {

      categories[category].some(
        function(keyword) {

          if (
            text.indexOf(
              keyword.toLowerCase()
            ) !== -1
          ) {

            if (
              found.indexOf(category) === -1
            ) {

              found.push(category);

            }

            return true;

          }

          return false;

        }
      );

    }
  );


  return found;

}

/* ============================================================
 * EDUCATION AMBIGUITY
 * ============================================================
 */

function detectAISearchEducationAmbiguity(query) {

  const text =
    String(query).toLowerCase();


  const broadEducationWords = [
    "शिक्षित",
    "सुशिक्षित",
    "educated",
    "well educated",
    "उच्चशिक्षित",
    "well-educated"
  ];


  const hasBroadEducation =
    broadEducationWords.some(function(keyword) {

      return text.indexOf(keyword) !== -1;

    });


  const education =
    detectAISearchEducation(query);


  return (
    hasBroadEducation &&
    education.length === 0
  );

}


/* ============================================================
 * AGE MIN
 * ============================================================
 */

function detectAISearchAgeMin(query) {

  const text =
    normalizeAISearchDigits(query)
      .toLowerCase()
      .trim();

  /* 25 ते 30 / 25 to 30 / 25-30 */
  let match =
    text.match(
      /(\d{1,3})\s*(?:ते|to|-)\s*(\d{1,3})/
    );

  if (match) {
    return Number(match[1]);
  }

  /* वय 25 पेक्षा जास्त / वय 25 पेक्षा अधिक / वय किमान 25 */
  match =
    text.match(
      /(?:वय|age)\s*(?:above|over|more than|at least|पेक्षा जास्त|पेक्षा अधिक|किमान)\s*(\d{1,3})/
    );

  if (match) {
    return Number(match[1]);
  }

  /* 25 वर्षांपेक्षा जास्त / 25 वर्षांहून अधिक */
  match =
    text.match(
      /(\d{1,3})\s*(?:वर्षांपेक्षा|वर्षांहून|वर्षे|वर्ष)\s*(?:जास्त|अधिक|किमान)/
    );

  if (match) {
    return Number(match[1]);
  }

  return null;
}


/* ============================================================
 * AGE MAX
 * ============================================================
 */

function detectAISearchAgeMax(query) {

  const text =
    normalizeAISearchDigits(query)
      .toLowerCase()
      .trim();

  /* 25 ते 30 / 25 to 30 / 25-30 */
  let match =
    text.match(
      /(\d{1,3})\s*(?:ते|to|-)\s*(\d{1,3})/
    );

  if (match) {
    return Number(match[2]);
  }

  /* वय 30 पेक्षा कमी / वय 30 पर्यंत / वय कमाल 30 */
  match =
    text.match(
      /(?:वय|age)\s*(?:below|under|up to|maximum|less than|पेक्षा कमी|पर्यंत|कमाल)\s*(\d{1,3})/
    );

  if (match) {
    return Number(match[1]);
  }

  /* 30 वर्षांपर्यंत / 30 वर्षेपर्यंत / 30 वर्षापर्यंत */
  match =
    text.match(
      /(\d{1,3})\s*(?:वर्षांपर्यंत|वर्षेपर्यंत|वर्षापर्यंत)/
    );

  if (match) {
    return Number(match[1]);
  }

  /* 30 पेक्षा कमी / 30 पेक्षा लहान */
  match =
    text.match(
      /(\d{1,3})\s*(?:पेक्षा कमी|पेक्षा लहान)/
    );

  if (match) {
    return Number(match[1]);
  }

  return null;
}

/* ============================================================
 * INCOME MIN
 * ============================================================
 */

function detectAISearchIncomeMin(query) {

  const text =
    String(query).toLowerCase();


  const match =
    text.match(
      /(?:income|salary|पगार|उत्पन्न|उत्पन्न\s*किमान)\s*(?:above|over|more than|at least|पेक्षा जास्त|पेक्षा अधिक|किमान)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|लाख|l)?/
    );


  if (!match) {
    return null;
  }


  return normalizeAISearchIncomeValue(
    match[1],
    match[0]
  );

}


/* ============================================================
 * INCOME MAX
 * ============================================================
 */

function detectAISearchIncomeMax(query) {

  const text =
    String(query).toLowerCase();


  const match =
    text.match(
      /(?:income|salary|पगार|उत्पन्न)\s*(?:below|under|up to|maximum|less than|पेक्षा कमी|पर्यंत|कमाल)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|लाख|l)?/
    );


  if (!match) {
    return null;
  }


  return normalizeAISearchIncomeValue(
    match[1],
    match[0]
  );

}


/* ============================================================
 * INCOME OPERATOR
 * ============================================================
 */

function detectAISearchIncomeOperator(query) {

  const text =
    String(query).toLowerCase();


  if (
    /between|दरम्यान|मध्ये/.test(text)
  ) {
    return "between";
  }


  if (
    /above|over|more than|पेक्षा जास्त|पेक्षा अधिक|किमान/.test(text)
  ) {
    return "above";
  }


  if (
    /below|under|less than|पेक्षा कमी|पर्यंत|कमाल/.test(text)
  ) {
    return "below";
  }


  return null;

}


/* ============================================================
 * INCOME VALUE NORMALIZER
 * ============================================================
 */

function normalizeAISearchIncomeValue(
  value,
  matchedText
) {

  const numberValue =
    Number(value);


  if (
    !isFinite(numberValue)
  ) {
    return null;
  }


  const text =
    String(matchedText)
      .toLowerCase();


  if (
    text.indexOf("lakh") !== -1 ||
    text.indexOf("lakhs") !== -1 ||
    text.indexOf("लाख") !== -1 ||
    /\bl\b/.test(text)
  ) {

    return numberValue * 100000;

  }


  return numberValue;

}


/* ============================================================
 * PROFESSION DETECTION
 * ============================================================
 */

function detectAISearchProfession(query) {

  const text =
    String(query);


  const professionPatterns = [

    {
      patterns: [
        "software engineer",
        "software developer",
        "सॉफ्टवेअर इंजिनिअर",
        "सॉफ्टवेअर डेव्हलपर"
      ],
      value: "Software Engineer"
    },

    {
      patterns: [
        "doctor",
        "डॉक्टर"
      ],
      value: "Doctor"
    },

    {
      patterns: [
        "teacher",
        "शिक्षक",
        "शिक्षिका"
      ],
      value: "Teacher"
    },

    {
      patterns: [
        "lawyer",
        "वकील"
      ],
      value: "Lawyer"
    },

    {
      patterns: [
        "business",
        "व्यवसाय",
        "व्यावसायिक"
      ],
      value: "Business"
    }

  ];


  for (
    let i = 0;
    i < professionPatterns.length;
    i++
  ) {

    const item =
      professionPatterns[i];


    for (
      let j = 0;
      j < item.patterns.length;
      j++
    ) {

      if (
        text.toLowerCase()
          .indexOf(
            item.patterns[j].toLowerCase()
          ) !== -1
      ) {

        return item.value;

      }

    }

  }


  return null;

}


/* ============================================================
 * MISSING CRITERIA
 * ============================================================
 */

function getAISearchMissingCriteria(criteria) {

  const missing = [];


  if (
    !criteria ||
    !criteria.profileType
  ) {

    missing.push(
      "profileType"
    );

  }


  if (
    !criteria ||
    !Array.isArray(criteria.district) ||
    criteria.district.length === 0
  ) {

    missing.push(
      "district"
    );

  }


  if (
    !criteria ||
    !Array.isArray(criteria.educationCategory) ||
    criteria.educationCategory.length === 0
  ) {

    missing.push(
      "educationCategory"
    );

  }


  return missing;

}


/* ============================================================
 * CLEARLY UNSUPPORTED QUERY
 * ============================================================
 *
 * We deliberately keep this conservative.
 * Unknown matrimonial queries should NOT automatically be
 * classified as unsupported because a future AI layer may
 * understand them.
 * ============================================================
 */

function isAISearchClearlyUnsupported(query) {

  const text =
    String(query).toLowerCase();


  const unsupportedPatterns = [

    "weather",
    "आजचे हवामान",
    "cricket score",
    "शेअर बाजार",
    "stock price",
    "recipe",
    "रेसिपी",
    "movie ticket",
    "flight booking"

  ];


  return unsupportedPatterns.some(
    function(pattern) {

      return text.indexOf(pattern) !== -1;

    }
  );

}



function normalizeAISearchDigits(value) {

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

  return String(value || "")
    .replace(/[०-९]/g, function(char) {
      return marathiDigits[char];
    });

}



/* ============================================================
 * UNIT TEST
 * ============================================================
 */

function testAISearchParser() {

  const tests = [];


  /* ----------------------------------------------------------
   * TEST 1
   * ----------------------------------------------------------
   */

  const test1 =
    parseAISearchQuery(
      "पुण्यातील मला इंजिनिअरिंग क्षेत्रातील मुलगी हवी आहे.",
      "text"
    );


  tests.push({

    name:
      "Marathi Pune engineering bride query",

    pass:
      test1.profileType === "bride" &&
      test1.district.indexOf("पुणे") !== -1 &&
      test1.educationCategory.indexOf("engineering") !== -1 &&
      test1.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS.SEARCH_READY

  });


  /* ----------------------------------------------------------
   * TEST 2
   * ----------------------------------------------------------
   */

  const test2 =
    parseAISearchQuery(
      "पुण्यातील इंजिनिअर मुलगा पाहिजे",
      "text"
    );


  tests.push({

    name:
      "Marathi Pune engineering groom query",

    pass:
      test2.profileType === "groom" &&
      test2.district.indexOf("पुणे") !== -1 &&
      test2.educationCategory.indexOf("engineering") !== -1 &&
      test2.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS.SEARCH_READY

  });


  /* ----------------------------------------------------------
   * TEST 3
   * ----------------------------------------------------------
   */

  const test3 =
    parseAISearchQuery(
      "मला एक छान मुलगी पाहिजे",
      "text"
    );


  tests.push({

    name:
      "Vague query requires clarification",

    pass:
      test3.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS
          .CLARIFICATION_REQUIRED

  });


  /* ----------------------------------------------------------
   * TEST 4
   * ----------------------------------------------------------
   */

  const test4 =
    parseAISearchQuery(
      "मला इंजिनिअर मुलगी पाहिजे",
      "voice"
    );


  tests.push({

    name:
      "Partial query asks for missing district",

    pass:
      test4.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS
          .CLARIFICATION_REQUIRED &&

      test4.clarificationReason ===
        AI_SEARCH_CONFIG.CLARIFICATION_REASON
          .DISTRICT_MISSING

  });


  /* ----------------------------------------------------------
   * TEST 5
   * ----------------------------------------------------------
   */

  const test5 =
    parseAISearchQuery(
      "मला पुण्यातील मुलगी पाहिजे",
      "text"
    );


  tests.push({

    name:
      "Partial query asks for missing education",

    pass:
      test5.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS
          .CLARIFICATION_REQUIRED &&

      test5.clarificationReason ===
        AI_SEARCH_CONFIG.CLARIFICATION_REASON
          .EDUCATION_MISSING

  });


  /* ----------------------------------------------------------
   * TEST 6
   * ----------------------------------------------------------
   */

  const test6 =
    parseAISearchQuery(
      "मला पुण्यातील मुलगा किंवा मुलगी इंजिनिअर पाहिजे",
      "text"
    );


  tests.push({

    name:
      "Multiple profile types are rejected safely",

    pass:
      test6.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS
          .CLARIFICATION_REQUIRED &&

      test6.clarificationReason ===
        AI_SEARCH_CONFIG.CLARIFICATION_REASON
          .MULTIPLE_PROFILE_TYPES

  });


  /* ----------------------------------------------------------
   * TEST 7
   * ----------------------------------------------------------
   */

  const test7 =
    parseAISearchQuery(
      "पुण्यातील B.Tech मुलगी पाहिजे",
      "text"
    );


  tests.push({

    name:
      "B.Tech engineering recognition",

    pass:
      test7.educationCategory
        .indexOf("engineering") !== -1

  });


  /* ----------------------------------------------------------
   * TEST 8
   * ----------------------------------------------------------
   */

  const test8 =
    parseAISearchQuery(
      "मला पुण्यातील software engineer मुलगी पाहिजे",
      "text"
    );


  tests.push({

    name:
      "Profession extraction",

    pass:
      test8.profession ===
      "Software Engineer"

  });


  /* ----------------------------------------------------------
   * TEST 9
   * ----------------------------------------------------------
   */

  const test9 =
    parseAISearchQuery(
      "weather आज कसे आहे",
      "text"
    );


  tests.push({

    name:
      "Clearly unrelated query",

    pass:
      test9.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS
          .UNSUPPORTED_QUERY

  });


  /* ----------------------------------------------------------
   * TEST 10
   * ----------------------------------------------------------
   */

      const test10Query =
        "मला पुण्यातील २५ ते ३० वर्षांची इंजिनिअर मुलगी पाहिजे";

      const test10 =
        parseAISearchQuery(
          test10Query,
          "text"
        );

      console.log(
        "[AISearchParser] AGE DEBUG:",
        {
          query: test10Query,
          ageMin: test10.ageMin,
          ageMax: test10.ageMax,
          status: test10.status,
          criteria: test10
        }
      );

      tests.push({

        name:
          "Age range extraction",

        pass:
          test10.ageMin === 25 &&
          test10.ageMax === 30

      });

  /* ----------------------------------------------------------
   * TEST 11
   * ----------------------------------------------------------
   */

  const test11 =
    parseAISearchQuery(
      "मला पुण्यातील engineer मुलगी पाहिजे",
      "voice"
    );


  tests.push({

    name:
      "Voice source normalization",

    pass:
      test11.source === "voice"

  });


  /* ----------------------------------------------------------
   * TEST 12
   * ----------------------------------------------------------
   */

  const test12 =
    parseAISearchQuery(
      "   पुण्यातील इंजिनिअर मुलगी पाहिजे   ",
      "text"
    );


  tests.push({

    name:
      "Query whitespace normalization",

    pass:
      test12.originalQuery ===
        "पुण्यातील इंजिनिअर मुलगी पाहिजे"

  });


  /* ----------------------------------------------------------
   * FINAL RESULT
   * ----------------------------------------------------------
   */

  const failed =
    tests.filter(function(test) {

      return test.pass !== true;

    });


  const passed =
    tests.filter(function(test) {

      return test.pass === true;

    });


  const result = {

    success:
      failed.length === 0,

    module:
      "AISearchParser",

    totalChecks:
      tests.length,

    passedChecks:
      passed.length,

    failedChecks:
      failed.length,

    checks:
      tests

  };


  console.log(
    "[AISearchParser] TEST RESULT:",
    result
  );


  return result;

}


function debugAISearchParserBrideQuery() {

  const query =
    "पुण्यातील मला इंजिनिअरिंग क्षेत्रातील मुलगी हवी आहे.";

  const result =
    parseAISearchQuery(
      query,
      "text"
    );

  console.log(
    "[AISearchParser] BRIDE QUERY DEBUG:",
    {
      query: query,
      profileType: result.profileType,
      district: result.district,
      educationCategory: result.educationCategory,
      ageMin: result.ageMin,
      ageMax: result.ageMax,
      profession: result.profession,
      status: result.status,
      clarificationReason: result.clarificationReason,
      clarificationMessage: result.clarificationMessage,
      fullResult: result
    }
  );

  return result;
}