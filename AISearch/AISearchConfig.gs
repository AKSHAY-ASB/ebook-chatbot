/**
 * ============================================================
 * AI SEARCH CONFIGURATION
 * ============================================================
 *
 * Purpose:
 * - Central configuration for Natural Language Matrimonial Search
 * - No Sheet access
 * - No database writes
 * - No existing search function modification
 * - Safe to load independently
 *
 * ============================================================
 */


/* ============================================================
 * MODULE IDENTIFIER
 * ============================================================
 */

const AI_SEARCH_CONFIG = Object.freeze({

  MODULE_NAME: "AI_NATURAL_LANGUAGE_SEARCH",

  VERSION: "1.0.0",

  ENABLED: true,


  /* ==========================================================
   * PROFILE TYPES
   * ==========================================================
   *
   * Internal values are kept independent from UI language.
   */

  PROFILE_TYPES: Object.freeze({

    BRIDE: "bride",

    GROOM: "groom",

    OTHER: "other"

  }),


  /* ==========================================================
   * EXISTING SEARCH TYPE MAPPING
   * ==========================================================
   *
   * These values are intended to map to the existing
   * searchProfiles() type parameter.
   *
   * We do NOT modify searchProfiles().
   */

  SEARCH_TYPE_MAP: Object.freeze({

    bride: "वधू",

    groom: "वर",

    other: "इतर"

  }),


  /* ==========================================================
   * EDUCATION CATEGORIES
   * ==========================================================
   *
   * AI Search should return category names.
   * Actual profile matching remains with existing search logic.
   */

  EDUCATION_CATEGORIES: Object.freeze({

    ENGINEERING: "engineering",

    MEDICAL: "medical",

    COMMERCE: "commerce",

    ARTS: "arts",

    SCIENCE: "science",

    MANAGEMENT: "management",

    LAW: "law",

    COMPUTER_IT: "computer_it",

    PHARMACY: "pharmacy",

    EDUCATION: "education",

    OTHER: "other"

  }),


  /* ==========================================================
   * ENGINEERING KEYWORDS
   * ==========================================================
   *
   * These are interpretation keywords only.
   * They do not directly search Sheets.
   */

  ENGINEERING_KEYWORDS: Object.freeze([

    "engineering",

    "engineer",

    "engineers",

    "अभियांत्रिकी",

    "इंजिनिअरिंग",

    "इंजिनियरिंग",

    "इंजिनीअरिंग",

    "इंजिनिअर",

    "इंजिनियर",

    "इंजिनीअर",

    "b.e",

    "b.e.",

    "be",

    "btech",

    "b.tech",

    "b.tech.",

    "m.e",

    "m.e.",

    "me",

    "mtech",

    "m.tech",

    "m.tech.",

    "computer engineering",

    "civil engineering",

    "mechanical engineering",

    "electrical engineering",

    "electronics engineering",

    "electronics",

    "information technology",

    "it engineering"

  ]),


  /* ==========================================================
   * DISTRICT ALIASES
   * ==========================================================
   *
   * Initial safe aliases.
   *
   * More aliases can be added later without touching the
   * existing search engine.
   */

  DISTRICT_ALIASES: Object.freeze({

    "pune": "पुणे",

    "pune city": "पुणे",

    "पुणे": "पुणे",

    "मुंबई": "मुंबई",

    "mumbai": "मुंबई",

    "मुंबई शहर": "मुंबई",

    "thane": "ठाणे",

    "ठाणे": "ठाणे",

    "nagpur": "नागपूर",

    "नागपूर": "नागपूर",

    "nashik": "नाशिक",

    "nasik": "नाशिक",

    "नाशिक": "नाशिक",

    "kolhapur": "कोल्हापूर",

    "कोल्हापूर": "कोल्हापूर",

    "sangli": "सांगली",

    "सांगली": "सांगली",

    "satara": "सातारा",

    "सातारा": "सातारा",

    "solapur": "सोलापूर",

    "sholapur": "सोलापूर",

    "सोलापूर": "सोलापूर",

    "ahmednagar": "अहिल्यानगर",

    "नगर": "अहिल्यानगर",

    "अहिल्यानगर": "अहिल्यानगर",

    "aurangabad": "छत्रपती संभाजीनगर",

    "छत्रपती संभाजीनगर": "छत्रपती संभाजीनगर",

    "jalgaon": "जळगाव",

    "जळगाव": "जळगाव",

    "ratnagiri": "रत्नागिरी",

    "रत्नागिरी": "रत्नागिरी",

    "nanded": "नांदेड",

    "नांदेड": "नांदेड"

  }),


  /* ==========================================================
   * INCOME OPERATORS
   * ==========================================================
   */

  INCOME_OPERATORS: Object.freeze({

    ABOVE: "above",

    BELOW: "below",

    BETWEEN: "between",

    EXACT: "exact"

  }),


  /* ==========================================================
   * QUERY STATUS
   * ==========================================================
   */

  QUERY_STATUS: Object.freeze({

    READY: "READY",

    CLARIFICATION_REQUIRED: "CLARIFICATION_REQUIRED",

    INVALID_QUERY: "INVALID_QUERY",

    UNSUPPORTED_QUERY: "UNSUPPORTED_QUERY",

    VALIDATION_FAILED: "VALIDATION_FAILED",

    SEARCH_READY: "SEARCH_READY"

  }),


  /* ==========================================================
   * CLARIFICATION REASONS
   * ==========================================================
   */

  CLARIFICATION_REASON: Object.freeze({

    PROFILE_TYPE_MISSING: "PROFILE_TYPE_MISSING",

    DISTRICT_MISSING: "DISTRICT_MISSING",

    EDUCATION_MISSING: "EDUCATION_MISSING",

    QUERY_TOO_VAGUE: "QUERY_TOO_VAGUE",

    MULTIPLE_PROFILE_TYPES: "MULTIPLE_PROFILE_TYPES",

    AMBIGUOUS_LOCATION: "AMBIGUOUS_LOCATION",

    AMBIGUOUS_EDUCATION: "AMBIGUOUS_EDUCATION",

    INVALID_RANGE: "INVALID_RANGE"

  }),


  /* ==========================================================
   * ERROR CODES
   * ==========================================================
   */

  ERROR_CODES: Object.freeze({

    EMPTY_QUERY: "AI_SEARCH_EMPTY_QUERY",

    QUERY_TOO_LONG: "AI_SEARCH_QUERY_TOO_LONG",

    INVALID_CRITERIA: "AI_SEARCH_INVALID_CRITERIA",

    INVALID_PROFILE_TYPE: "AI_SEARCH_INVALID_PROFILE_TYPE",

    INVALID_DISTRICT: "AI_SEARCH_INVALID_DISTRICT",

    INVALID_EDUCATION: "AI_SEARCH_INVALID_EDUCATION",

    INVALID_INCOME: "AI_SEARCH_INVALID_INCOME",

    INVALID_AGE: "AI_SEARCH_INVALID_AGE",

    PARSER_ERROR: "AI_SEARCH_PARSER_ERROR",

    VALIDATION_ERROR: "AI_SEARCH_VALIDATION_ERROR",

    ADAPTER_ERROR: "AI_SEARCH_ADAPTER_ERROR"

  }),


  /* ==========================================================
   * LIMITS
   * ==========================================================
   *
   * Protection against unnecessarily large/uncontrolled
   * natural-language input.
   */

  LIMITS: Object.freeze({

    MAX_QUERY_LENGTH: 1000,

    MIN_QUERY_LENGTH: 2,

    MAX_AGE: 100,

    MIN_AGE: 18,

    MAX_INCOME: 999999999,

    MAX_RESULTS_PER_PAGE: 10

  }),


  /* ==========================================================
   * DEFAULT SEARCH VALUES
   * ==========================================================
   *
   * These defaults are deliberately conservative.
   */

  DEFAULTS: Object.freeze({

    PAGE: 1,

    PAGE_SIZE: 10,

    DISTRICT: "",

    EDUCATION: "",

    INCOME: "",

    AGE_MIN: null,

    AGE_MAX: null,

    PROFESSION: "",

    PROFILE_TYPE: ""

  }),


  /* ==========================================================
   * USER-FACING LANGUAGE
   * ==========================================================
   *
   * These messages are intentionally separate from parser
   * logic so wording can be improved later without changing
   * search logic.
   */

  MESSAGES: Object.freeze({

    EMPTY_QUERY:
      "कृपया तुम्हाला कोणत्या प्रकारचा Profile हवा आहे ते सांगा.",

    QUERY_NOT_UNDERSTOOD:
      "तुमची Query मला पूर्णपणे समजली नाही. कृपया जिल्हा, शिक्षण, वय किंवा व्यवसाय यापैकी काही माहिती द्या.",

    PROFILE_TYPE_REQUIRED:
      "तुम्हाला वधूचा Profile हवा आहे की वराचा?",

    DISTRICT_REQUIRED:
      "कृपया कोणत्या जिल्ह्यातील किंवा शहरातील Profile हवा आहे ते सांगा.",

    EDUCATION_REQUIRED:
      "कृपया शिक्षण किंवा क्षेत्र सांगा. उदाहरण: Engineering, Medical, Commerce.",

    AMBIGUOUS_QUERY:
      "तुमची Query थोडी अस्पष्ट आहे. कृपया आणखी थोडी माहिती द्या.",

    UNSUPPORTED_QUERY:
      "ही माहिती Matrimonial Profile Search शी संबंधित दिसत नाही. कृपया Profile Search संबंधी Query द्या.",

    NO_RESULTS:
      "तुमच्या दिलेल्या निकषांनुसार Profile सापडला नाही.",

    SEARCH_ERROR:
      "Profile Search करताना समस्या आली. कृपया पुन्हा प्रयत्न करा."

  })

});


/* ============================================================
 * CONFIG ACCESSOR
 * ============================================================
 */

function getAISearchConfig() {

  return AI_SEARCH_CONFIG;

}


/* ============================================================
 * CONFIG HEALTH CHECK
 * ============================================================
 *
 * This test does not access Sheets.
 * It only verifies that the configuration is available
 * and internally consistent.
 */

function testAISearchConfig() {

  const config = getAISearchConfig();

  const checks = [];

  checks.push({
    name: "Config exists",
    pass: !!config
  });

  checks.push({
    name: "Module name exists",
    pass: config.MODULE_NAME === "AI_NATURAL_LANGUAGE_SEARCH"
  });

  checks.push({
    name: "Version exists",
    pass: !!config.VERSION
  });

  checks.push({
    name: "Profile types available",
    pass:
      !!config.PROFILE_TYPES.BRIDE &&
      !!config.PROFILE_TYPES.GROOM
  });

  checks.push({
    name: "Search type mapping available",
    pass:
      !!config.SEARCH_TYPE_MAP.bride &&
      !!config.SEARCH_TYPE_MAP.groom
  });

  checks.push({
    name: "Engineering category available",
    pass:
      config.EDUCATION_CATEGORIES.ENGINEERING === "engineering"
  });

  checks.push({
    name: "Engineering keywords available",
    pass:
      Array.isArray(config.ENGINEERING_KEYWORDS) &&
      config.ENGINEERING_KEYWORDS.length > 0
  });

  checks.push({
    name: "District aliases available",
    pass:
      Object.keys(config.DISTRICT_ALIASES).length > 0
  });

  checks.push({
    name: "Query statuses available",
    pass:
      !!config.QUERY_STATUS.CLARIFICATION_REQUIRED
  });

  checks.push({
    name: "Clarification reasons available",
    pass:
      !!config.CLARIFICATION_REASON.QUERY_TOO_VAGUE
  });

  checks.push({
    name: "Error codes available",
    pass:
      !!config.ERROR_CODES.PARSER_ERROR
  });

  checks.push({
    name: "Limits available",
    pass:
      config.LIMITS.MAX_QUERY_LENGTH > 0 &&
      config.LIMITS.MIN_AGE >= 18
  });

  checks.push({
    name: "Messages available",
    pass:
      !!config.MESSAGES.QUERY_NOT_UNDERSTOOD
  });


  const failedChecks =
    checks.filter(function(check) {
      return check.pass !== true;
    });


  const result = {

    success: failedChecks.length === 0,

    module: config.MODULE_NAME,

    version: config.VERSION,

    totalChecks: checks.length,

    passedChecks:
      checks.filter(function(check) {
        return check.pass === true;
      }).length,

    failedChecks: failedChecks.length,

    checks: checks

  };


  console.log(
    "[AISearchConfig] TEST RESULT:",
    result
  );


  return result;

}