/**
 * ============================================================
 * AI SEARCH ADAPTER
 * ============================================================
 *
 * Purpose:
 *   Connect validated AI Search Criteria with the existing
 *   searchProfiles() engine.
 *
 * Architecture:
 *
 *   Natural Language Query
 *          ↓
 *   AISearchParser.gs
 *          ↓
 *   AISearchValidator.gs
 *          ↓
 *   AISearchAdapter.gs
 *          ↓
 *   Existing searchProfiles()
 *          ↓
 *   Existing profile search / UI flow
 *
 * IMPORTANT:
 *   - Does NOT modify searchProfiles()
 *   - Does NOT access Sheets directly
 *   - Does NOT write to Sheets
 *   - Does NOT replace normal search
 *   - Does NOT guess unsupported criteria
 *   - Failures are isolated and returned as structured results
 *
 * Supported existing search filters:
 *   - profile type
 *   - district
 *   - education
 *   - income
 *
 * Parsed criteria such as:
 *   - age
 *   - profession
 *
 * are preserved in the adapter result but are NOT silently
 * passed as unsupported filters to searchProfiles().
 *
 * ============================================================
 */


/**
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

var AI_SEARCH_ADAPTER_MODULE = "AISearchAdapter";
var AI_SEARCH_ADAPTER_VERSION = "1.0.0";


/**
 * ============================================================
 * PUBLIC ENTRY POINT
 * ============================================================
 *
 * Executes an AI-generated search against the existing
 * searchProfiles() engine.
 *
 * @param {Object} criteria Validated AISearchCriteria object
 * @param {String} userMobile Current logged-in user's mobile
 * @param {Number} page Page number
 *
 * @return {Object} Structured adapter/search result
 */
function executeAISearch(criteria, userMobile, page) {

  try {

    // ----------------------------------------------------------
    // 1. BASIC INPUT CHECK
    // ----------------------------------------------------------

    if (!criteria || typeof criteria !== "object") {

      return createAISearchAdapterFailure(
        "INVALID_CRITERIA",
        "Invalid AI search criteria."
      );

    }


    // ----------------------------------------------------------
    // 2. VALIDATE AGAIN
    // ----------------------------------------------------------
    //
    // Even though the UI/parser should already validate criteria,
    // the adapter performs a defensive validation before calling
    // the existing search engine.
    //
    // This prevents malformed AI criteria from reaching
    // searchProfiles().
    // ----------------------------------------------------------

    if (
      typeof validateAISearchCriteria !== "function"
    ) {

      return createAISearchAdapterFailure(
        "VALIDATOR_NOT_FOUND",
        "AI Search Validator is not available."
      );

    }


    var validationResult =
      validateAISearchCriteria(criteria);


    if (
      !validationResult ||
      validationResult.success !== true
    ) {

      return {
        success: false,

        module:
          AI_SEARCH_ADAPTER_MODULE,

        version:
          AI_SEARCH_ADAPTER_VERSION,

        status:
          "VALIDATION_FAILED",

        errorCode:
          "VALIDATION_FAILED",

        message:
          validationResult &&
          validationResult.message
            ? validationResult.message
            : "AI search criteria validation failed.",

        profiles: [],

        count: 0
      };

    }


    // ----------------------------------------------------------
    // 3. CHECK EXISTING SEARCH FUNCTION
    // ----------------------------------------------------------

    if (
      typeof searchProfiles !== "function"
    ) {

      return createAISearchAdapterFailure(
        "SEARCH_FUNCTION_NOT_FOUND",
        "Existing searchProfiles() function is not available."
      );

    }


    // ----------------------------------------------------------
    // 4. NORMALIZE PAGE
    // ----------------------------------------------------------

    var searchPage =
      parseInt(page, 10);

    if (
      isNaN(searchPage) ||
      searchPage < 1
    ) {

      searchPage = 1;

    }


    // ----------------------------------------------------------
    // 5. MAP PROFILE TYPE
    // ----------------------------------------------------------

    var searchType =
      mapAISearchProfileTypeToExistingType(
        criteria.profileType
      );


    if (!searchType) {

      return createAISearchAdapterFailure(
        "PROFILE_TYPE_MAPPING_FAILED",
        "Unable to map AI profile type to existing search type."
      );

    }


    // ----------------------------------------------------------
    // 6. MAP DISTRICT
    // ----------------------------------------------------------

    var searchDistrict =
      mapAISearchDistrictToExistingValue(
        criteria.district
      );


    if (!searchDistrict) {

      return createAISearchAdapterFailure(
        "DISTRICT_MAPPING_FAILED",
        "Unable to map AI district criteria."
      );

    }


    // ----------------------------------------------------------
    // 7. MAP EDUCATION
    // ----------------------------------------------------------

    var searchEducation =
      mapAISearchEducationToExistingValue(
        criteria.educationCategory
      );


    if (!searchEducation) {

      return createAISearchAdapterFailure(
        "EDUCATION_MAPPING_FAILED",
        "Unable to map AI education criteria."
      );

    }


    // ----------------------------------------------------------
    // 8. MAP INCOME
    // ----------------------------------------------------------

    var searchIncome =
      mapAISearchIncomeToExistingValue(
        criteria
      );


    if (!searchIncome) {

      return createAISearchAdapterFailure(
        "INCOME_MAPPING_FAILED",
        "Unable to map AI income criteria."
      );

    }


    // ----------------------------------------------------------
    // 9. DETERMINE UNSUPPORTED CRITERIA
    // ----------------------------------------------------------
    //
    // Existing searchProfiles() currently supports:
    //
    //   type
    //   district
    //   education
    //   income
    //
    // Age and profession exist in returned profile objects,
    // but searchProfiles() does not expose them as input
    // parameters.
    //
    // Therefore we DO NOT fake them into the existing call.
    // ----------------------------------------------------------

    var unsupportedCriteria =
      getAISearchUnsupportedCriteria(
        criteria
      );


    // ----------------------------------------------------------
    // 10. CALL EXISTING SEARCH ENGINE
    // ----------------------------------------------------------
    //
    // IMPORTANT:
    // Existing signature remains:
    //
    // searchProfiles(
    //   type,
    //   district,
    //   education,
    //   income,
    //   page,
    //   userMobile
    // )
    //
    // No modification to searchProfiles().
    // ----------------------------------------------------------

    var searchResult =
      searchProfiles(
        searchType,
        searchDistrict,
        searchEducation,
        searchIncome,
        searchPage,
        userMobile
      );


    // ----------------------------------------------------------
    // 11. HANDLE SEARCH FAILURE
    // ----------------------------------------------------------

    if (
      !searchResult ||
      searchResult.success !== true
    ) {

      return {

        success: false,

        module:
          AI_SEARCH_ADAPTER_MODULE,

        version:
          AI_SEARCH_ADAPTER_VERSION,

        status:
          "SEARCH_FAILED",

        errorCode:
          "EXISTING_SEARCH_FAILED",

        message:
          searchResult &&
          searchResult.message
            ? searchResult.message
            : "Profile search failed.",

        profiles: [],

        count: 0,

        searchResult:
          searchResult || null,

        unsupportedCriteria:
          unsupportedCriteria

      };

    }


    // ----------------------------------------------------------
    // 12. RETURN ADAPTER RESULT
    // ----------------------------------------------------------
    //
    // We preserve the complete existing search response.
    // Additional AI metadata is added without changing the
    // existing search result structure.
    // ----------------------------------------------------------

    return {

      success: true,

      module:
        AI_SEARCH_ADAPTER_MODULE,

      version:
        AI_SEARCH_ADAPTER_VERSION,

      status:
        "SEARCH_COMPLETED",

      searchType:
        searchType,

      searchDistrict:
        searchDistrict,

      searchEducation:
        searchEducation,

      searchIncome:
        searchIncome,

      page:
        searchPage,

      unsupportedCriteria:
        unsupportedCriteria,

      criteria:
        cloneAISearchAdapterCriteria(
          criteria
        ),

      searchResult:
        searchResult,

      profiles:
        searchResult.profiles || [],

      count:
        searchResult.count || 0,

      totalCount:
        searchResult.totalCount || 0,

      totalPages:
        searchResult.totalPages || 0,

      hasNext:
        searchResult.hasNext === true,

      hasPrevious:
        searchResult.hasPrevious === true,

      message:
        buildAISearchAdapterMessage(
          searchResult,
          unsupportedCriteria
        )

    };


  } catch (error) {

    console.error(
      "[AISearchAdapter] executeAISearch error:",
      error
    );


    return {

      success: false,

      module:
        AI_SEARCH_ADAPTER_MODULE,

      version:
        AI_SEARCH_ADAPTER_VERSION,

      status:
        "ADAPTER_ERROR",

      errorCode:
        "ADAPTER_EXCEPTION",

      message:
        error &&
        error.message
          ? error.message
          : String(error),

      profiles: [],

      count: 0

    };

  }

}


/**
 * ============================================================
 * PROFILE TYPE MAPPING
 * ============================================================
 *
 * AI config:
 *
 *   bride  → वधू
 *   groom  → वर
 *   other  → इतर
 *
 * Existing searchProfiles() accepts both English and Marathi,
 * but we intentionally pass the existing sheet-facing Marathi
 * values.
 * ============================================================
 */

function mapAISearchProfileTypeToExistingType(
  profileType
) {

  var normalized =
    String(
      profileType || ""
    )
      .trim()
      .toLowerCase();


  if (
    normalized === "bride" ||
    normalized === "वधू"
  ) {

    return "वधू";

  }


  if (
    normalized === "groom" ||
    normalized === "वर"
  ) {

    return "वर";

  }


  if (
    normalized === "other" ||
    normalized === "इतर"
  ) {

    return "इतर";

  }


  return "";

}


/**
 * ============================================================
 * DISTRICT MAPPING
 * ============================================================
 *
 * criteria.district is normally an array.
 *
 * Current searchProfiles() accepts ONE district value.
 *
 * Therefore:
 *
 *   []        → "all"
 *   [Pune]    → "पुणे"
 *
 * Multiple districts are NOT silently joined together.
 *
 * This is intentional safety behavior.
 * ============================================================
 */

function mapAISearchDistrictToExistingValue(
  district
) {

  if (
    district === null ||
    district === undefined
  ) {

    return "";

  }


  var districts =
    Array.isArray(district)
      ? district
      : [district];


  districts =
    districts
      .map(function (item) {

        return String(
          item || ""
        ).trim();

      })
      .filter(function (item) {

        return item !== "";

      });


  if (districts.length === 0) {

    return "all";

  }


  if (districts.length > 1) {

    console.warn(
      "[AISearchAdapter] Multiple districts detected. " +
      "Existing searchProfiles() supports one district. " +
      "Using first normalized district only is NOT allowed."
    );

    return "";

  }


  return normalizeAISearchDistrictForExistingSearch(
    districts[0]
  );

}


/**
 * ============================================================
 * DISTRICT NORMALIZER
 * ============================================================
 */

function normalizeAISearchDistrictForExistingSearch(
  district
) {

  var value =
    String(
      district || ""
    ).trim();


  if (!value) {

    return "";

  }


  var lower =
    value.toLowerCase();


  var aliases = {

    "pune": "पुणे",
    "पुणे": "पुणे",

    "mumbai": "मुंबई",
    "मुंबई": "मुंबई",

    "thane": "ठाणे",
    "ठाणे": "ठाणे",

    "nagpur": "नागपूर",
    "नागपूर": "नागपूर",

    "nashik": "नाशिक",
    "नाशिक": "नाशिक",

    "kolhapur": "कोल्हापूर",
    "कोल्हापूर": "कोल्हापूर",

    "sangli": "सांगली",
    "सांगली": "सांगली",

    "satara": "सातारा",
    "सातारा": "सातारा",

    "solapur": "सोलापूर",
    "सोलापूर": "सोलापूर",

    "ahmednagar": "अहमदनगर",
    "ahilyanagar": "अहिल्यानगर",
    "अहमदनगर": "अहमदनगर",
    "अहिल्यानगर": "अहिल्यानगर",

    "aurangabad": "औरंगाबाद",
    "chhatrapati sambhajinagar": "छत्रपती संभाजीनगर",
    "औरंगाबाद": "औरंगाबाद",
    "छत्रपती संभाजीनगर": "छत्रपती संभाजीनगर",

    "jalgaon": "जळगाव",
    "जळगाव": "जळगाव",

    "ratnagiri": "रत्नागिरी",
    "रत्नागिरी": "रत्नागिरी",

    "nanded": "नांदेड",
    "नांदेड": "नांदेड"

  };


  if (
    aliases.hasOwnProperty(lower)
  ) {

    return aliases[lower];

  }


  if (
    aliases.hasOwnProperty(value)
  ) {

    return aliases[value];

  }


  // ----------------------------------------------------------
  // If AI criteria already contains the exact sheet value,
  // allow it to pass through.
  // ----------------------------------------------------------

  return value;

}


/**
 * ============================================================
 * EDUCATION MAPPING
 * ============================================================
 *
 * Existing searchProfiles() eventually passes education into
 * getEducationCategoryName().
 *
 * AI criteria uses category names such as:
 *
 *   engineering
 *   medical
 *   commerce
 *   arts
 *   science
 *   management
 *   law
 *   computer_it
 *   pharmacy
 *   education
 *   other
 *
 * We therefore return the category key expected by the
 * existing search normalization layer.
 * ============================================================
 */

function mapAISearchEducationToExistingValue(
  educationCategory
) {

  if (
    educationCategory === null ||
    educationCategory === undefined
  ) {

    return "";

  }


  var education =
    Array.isArray(educationCategory)
      ? educationCategory
      : [educationCategory];


  education =
    education
      .map(function (item) {

        return String(
          item || ""
        ).trim();

      })
      .filter(function (item) {

        return item !== "";

      });


  if (education.length === 0) {

    return "all";

  }


  // ----------------------------------------------------------
  // Existing searchProfiles() supports ONE education filter.
  // ----------------------------------------------------------

  if (education.length > 1) {

    console.warn(
      "[AISearchAdapter] Multiple education categories detected. " +
      "Existing searchProfiles() supports one education filter."
    );

    return "";

  }


  var value =
    education[0];


  var normalized =
    value.toLowerCase();


  var aliases = {

    "engineering": "engineering",
    "engineer": "engineering",
    "अभियांत्रिकी": "engineering",
    "इंजिनिअरिंग": "engineering",

    "medical": "medical",
    "medicine": "medical",
    "वैद्यकीय": "medical",
    "मेडिकल": "medical",

    "commerce": "commerce",
    "वाणिज्य": "commerce",
    "कॉमर्स": "commerce",

    "arts": "arts",
    "कला": "arts",
    "आर्ट्स": "arts",

    "science": "science",
    "विज्ञान": "science",
    "सायन्स": "science",

    "management": "management",
    "व्यवस्थापन": "management",
    "मॅनेजमेंट": "management",

    "law": "law",
    "कायदा": "law",
    "लॉ": "law",

    "computer_it": "computer_it",
    "computer": "computer_it",
    "it": "computer_it",
    "संगणक": "computer_it",
    "आयटी": "computer_it",

    "pharmacy": "pharmacy",
    "फार्मसी": "pharmacy",

    "education": "education",
    "शिक्षण": "education",

    "other": "other",
    "इतर": "other"

  };


  if (
    aliases.hasOwnProperty(normalized)
  ) {

    return aliases[normalized];

  }


  if (
    aliases.hasOwnProperty(value)
  ) {

    return aliases[value];

  }


  return value;

}


/**
 * ============================================================
 * INCOME MAPPING
 * ============================================================
 *
 * Existing searchProfiles() accepts a single income criterion.
 *
 * The existing backend's normalizeIncome() is responsible for
 * understanding its final value.
 *
 * This adapter converts AI income criteria into a conservative
 * string representation.
 *
 * ============================================================
 */

function mapAISearchIncomeToExistingValue(
  criteria
) {

  if (!criteria) {

    return "";

  }


  var min =
    normalizeAISearchAdapterNumber(
      criteria.incomeMin
    );


  var max =
    normalizeAISearchAdapterNumber(
      criteria.incomeMax
    );


  var operator =
    String(
      criteria.incomeOperator || ""
    )
      .trim()
      .toLowerCase();


  // ----------------------------------------------------------
  // No income criterion
  // ----------------------------------------------------------

  if (
    min === null &&
    max === null &&
    !operator
  ) {

    return "all";

  }


  // ----------------------------------------------------------
  // BETWEEN
  // ----------------------------------------------------------

  if (
    operator === "between"
  ) {

    if (
      min === null ||
      max === null
    ) {

      return "";

    }


    return String(min) +
      "-" +
      String(max);

  }


  // ----------------------------------------------------------
  // ABOVE / GREATER THAN
  // ----------------------------------------------------------

  if (
    operator === "above" ||
    operator === "greater_than" ||
    operator === "gt"
  ) {

    if (min === null) {

      return "";

    }


    return String(min);

  }


  // ----------------------------------------------------------
  // BELOW / LESS THAN
  // ----------------------------------------------------------

  if (
    operator === "below" ||
    operator === "less_than" ||
    operator === "lt"
  ) {

    if (max !== null) {

      return String(max);

    }


    if (min !== null) {

      return String(min);

    }


    return "";

  }


  // ----------------------------------------------------------
  // EXACT
  // ----------------------------------------------------------

  if (
    operator === "exact" ||
    operator === "equals" ||
    operator === "equal"
  ) {

    if (min !== null) {

      return String(min);

    }


    if (max !== null) {

      return String(max);

    }


    return "";

  }


  // ----------------------------------------------------------
  // Defensive fallback
  // ----------------------------------------------------------

  if (
    min !== null &&
    max === null
  ) {

    return String(min);

  }


  if (
    max !== null &&
    min === null
  ) {

    return String(max);

  }


  if (
    min !== null &&
    max !== null
  ) {

    return String(min) +
      "-" +
      String(max);

  }


  return "all";

}


/**
 * ============================================================
 * UNSUPPORTED CRITERIA
 * ============================================================
 *
 * Existing searchProfiles() currently accepts only:
 *
 *   type
 *   district
 *   education
 *   income
 *
 * Age and profession are therefore reported rather than
 * pretending that they were applied.
 *
 * This is important because silently ignoring an AI criterion
 * would produce misleading matrimonial search results.
 * ============================================================
 */

function getAISearchUnsupportedCriteria(
  criteria
) {

  var unsupported = [];


  if (!criteria) {

    return unsupported;

  }


  var ageMin =
    normalizeAISearchAdapterNumber(
      criteria.ageMin
    );


  var ageMax =
    normalizeAISearchAdapterNumber(
      criteria.ageMax
    );


  if (
    ageMin !== null ||
    ageMax !== null
  ) {

    unsupported.push("age");

  }


  var profession =
    String(
      criteria.profession || ""
    ).trim();


  if (profession) {

    unsupported.push("profession");

  }


  return unsupported;

}


/**
 * ============================================================
 * NUMBER NORMALIZATION
 * ============================================================
 */

function normalizeAISearchAdapterNumber(
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return null;

  }


  var text =
    String(value)
      .trim();


  // Marathi digits → English digits
  var marathiDigits =
    "०१२३४५६७८९";


  for (
    var i = 0;
    i < marathiDigits.length;
    i++
  ) {

    text =
      text.replace(
        new RegExp(
          marathiDigits[i],
          "g"
        ),
        String(i)
      );

  }


  // Remove commas and spaces
  text =
    text.replace(
      /[, ]/g,
      ""
    );


  var number =
    Number(text);


  if (
    isNaN(number)
  ) {

    return null;

  }


  return number;

}


/**
 * ============================================================
 * RESULT MESSAGE
 * ============================================================
 */

function buildAISearchAdapterMessage(
  searchResult,
  unsupportedCriteria
) {

  var baseMessage =
    searchResult &&
    searchResult.message
      ? String(searchResult.message)
      : "Search completed.";


  if (
    !unsupportedCriteria ||
    unsupportedCriteria.length === 0
  ) {

    return baseMessage;

  }


  var labels = [];


  unsupportedCriteria.forEach(
    function (criterion) {

      if (
        criterion === "age"
      ) {

        labels.push(
          "वय"
        );

      }

      else if (
        criterion === "profession"
      ) {

        labels.push(
          "व्यवसाय"
        );

      }

    }
  );


  if (
    labels.length === 0
  ) {

    return baseMessage;

  }


  return baseMessage +
    " अतिरिक्त निकष (" +
    labels.join(", ") +
    ") सध्या विद्यमान search engine मध्ये लागू केलेले नाहीत.";

}


/**
 * ============================================================
 * CRITERIA CLONE
 * ============================================================
 */

function cloneAISearchAdapterCriteria(
  criteria
) {

  if (!criteria) {

    return null;

  }


  try {

    return JSON.parse(
      JSON.stringify(criteria)
    );

  } catch (error) {

    return criteria;

  }

}


/**
 * ============================================================
 * STANDARD FAILURE RESULT
 * ============================================================
 */

function createAISearchAdapterFailure(
  errorCode,
  message
) {

  return {

    success: false,

    module:
      AI_SEARCH_ADAPTER_MODULE,

    version:
      AI_SEARCH_ADAPTER_VERSION,

    status:
      "ADAPTER_FAILED",

    errorCode:
      errorCode,

    message:
      message,

    profiles: [],

    count: 0

  };

}


/**
 * ============================================================
 * TEST HELPERS
 * ============================================================
 */

function assertAISearchAdapterTest(
  name,
  condition,
  details
) {

  return {

    name:
      name,

    pass:
      condition === true,

    details:
      details || ""

  };

}


/**
 * ============================================================
 * TEST 1
 * ============================================================
 *
 * Valid bride + Pune + engineering + no income.
 * ============================================================
 */

function testAISearchAdapterMapping() {

  var checks = [];


  // ----------------------------------------------------------
  // Profile type
  // ----------------------------------------------------------

  checks.push(
    assertAISearchAdapterTest(
      "Bride profile type mapping",
      mapAISearchProfileTypeToExistingType(
        "bride"
      ) === "वधू"
    )
  );


  checks.push(
    assertAISearchAdapterTest(
      "Groom profile type mapping",
      mapAISearchProfileTypeToExistingType(
        "groom"
      ) === "वर"
    )
  );


  checks.push(
    assertAISearchAdapterTest(
      "Other profile type mapping",
      mapAISearchProfileTypeToExistingType(
        "other"
      ) === "इतर"
    )
  );


  // ----------------------------------------------------------
  // District
  // ----------------------------------------------------------

  checks.push(
    assertAISearchAdapterTest(
      "Pune district mapping",
      mapAISearchDistrictToExistingValue(
        ["Pune"]
      ) === "पुणे"
    )
  );


  checks.push(
    assertAISearchAdapterTest(
      "Marathi Pune district mapping",
      mapAISearchDistrictToExistingValue(
        ["पुणे"]
      ) === "पुणे"
    )
  );


  // ----------------------------------------------------------
  // Education
  // ----------------------------------------------------------

  checks.push(
    assertAISearchAdapterTest(
      "Engineering education mapping",
      mapAISearchEducationToExistingValue(
        ["engineering"]
      ) === "engineering"
    )
  );


  checks.push(
    assertAISearchAdapterTest(
      "Marathi engineering education mapping",
      mapAISearchEducationToExistingValue(
        ["इंजिनिअरिंग"]
      ) === "engineering"
    )
  );


  // ----------------------------------------------------------
  // Income
  // ----------------------------------------------------------

  checks.push(
    assertAISearchAdapterTest(
      "No income maps to all",
      mapAISearchIncomeToExistingValue({
        incomeMin: null,
        incomeMax: null,
        incomeOperator: null
      }) === "all"
    )
  );


  checks.push(
    assertAISearchAdapterTest(
      "Between income mapping",
      mapAISearchIncomeToExistingValue({
        incomeMin: 30000,
        incomeMax: 60000,
        incomeOperator: "between"
      }) === "30000-60000"
    )
  );


  // ----------------------------------------------------------
  // Unsupported criteria
  // ----------------------------------------------------------

  var unsupported =
    getAISearchUnsupportedCriteria({

      ageMin: 25,
      ageMax: 30,

      profession:
        "engineer"

    });


  checks.push(
    assertAISearchAdapterTest(
      "Age detected as unsupported",
      unsupported.indexOf("age") !== -1
    )
  );


  checks.push(
    assertAISearchAdapterTest(
      "Profession detected as unsupported",
      unsupported.indexOf("profession") !== -1
    )
  );


  // ----------------------------------------------------------
  // RESULT
  // ----------------------------------------------------------

  var passed =
    checks.filter(
      function (check) {

        return check.pass === true;

      }
    ).length;


  var failed =
    checks.length -
    passed;


  var result = {

    success:
      failed === 0,

    module:
      AI_SEARCH_ADAPTER_MODULE,

    version:
      AI_SEARCH_ADAPTER_VERSION,

    totalChecks:
      checks.length,

    passedChecks:
      passed,

    failedChecks:
      failed,

    checks:
      checks

  };


  console.log(
    "[AISearchAdapter] MAPPING TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * TEST 2
 * ============================================================
 *
 * Test adapter structure without performing a real search.
 *
 * This confirms that the adapter can safely identify
 * unsupported criteria.
 * ============================================================
 */

function testAISearchAdapterCriteriaHandling() {

  var criteria = {

    profileType:
      "bride",

    district:
      ["Pune"],

    educationCategory:
      ["engineering"],

    ageMin:
      25,

    ageMax:
      30,

    incomeMin:
      null,

    incomeMax:
      null,

    incomeOperator:
      null,

    profession:
      "engineer",

    originalQuery:
      "मला पुण्यातील २५ ते ३० वर्षांची इंजिनिअर मुलगी पाहिजे",

    confidence:
      0.95,

    status:
      "SEARCH_READY",

    clarificationReason:
      null,

    clarificationMessage:
      null

  };


  var unsupported =
    getAISearchUnsupportedCriteria(
      criteria
    );


  var result = {

    success:
      unsupported.indexOf("age") !== -1 &&
      unsupported.indexOf("profession") !== -1,

    module:
      AI_SEARCH_ADAPTER_MODULE,

    unsupportedCriteria:
      unsupported,

    expected:
      ["age", "profession"]

  };


  console.log(
    "[AISearchAdapter] CRITERIA TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * MASTER TEST
 * ============================================================
 *
 * Run this first after adding the file.
 *
 * IMPORTANT:
 * This test does NOT perform a real profile search.
 * It only tests the adapter's safe mapping layer.
 * ============================================================
 */

function testAISearchAdapter() {

  var mappingResult =
    testAISearchAdapterMapping();


  var criteriaResult =
    testAISearchAdapterCriteriaHandling();


  var success =
    mappingResult.success === true &&
    criteriaResult.success === true;


  var result = {

    success:
      success,

    module:
      AI_SEARCH_ADAPTER_MODULE,

    version:
      AI_SEARCH_ADAPTER_VERSION,

    mappingTest:
      mappingResult,

    criteriaTest:
      criteriaResult

  };


  console.log(
    "[AISearchAdapter] MASTER TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * REAL SEARCH INTEGRATION TEST
 * ============================================================
 *
 * Purpose:
 *   Verify the complete backend bridge:
 *
 *   AI Criteria
 *        ↓
 *   AISearchValidator
 *        ↓
 *   AISearchAdapter
 *        ↓
 *   Existing searchProfiles()
 *        ↓
 *   Actual profile results
 *
 * IMPORTANT:
 *   - Does NOT modify searchProfiles()
 *   - Does NOT write to Sheets
 *   - Does NOT modify profiles
 *   - Uses a controlled test query
 *
 * Before running:
 *   Replace TEST_USER_MOBILE below with a valid test/login
 *   mobile number from your system.
 * ============================================================
 */

function testAISearchAdapterRealSearch() {

  try {

    // ========================================================
    // 1. TEST USER MOBILE
    // ========================================================
    //
    // Use a valid mobile number from your existing system.
    //
    // Example:
    // var TEST_USER_MOBILE = "8975593689";
    //
    // IMPORTANT:
    // Replace this with your actual test user's mobile if
    // required.
    // ========================================================

    var TEST_USER_MOBILE = "8975593689";


    // ========================================================
    // 2. CONTROLLED AI SEARCH CRITERIA
    // ========================================================

    var testCriteria = {

      profileType:
        "bride",

      district:
        ["Pune"],

      educationCategory:
        ["engineering"],

      ageMin:
        null,

      ageMax:
        null,

      incomeMin:
        null,

      incomeMax:
        null,

      incomeOperator:
        null,

      profession:
        null,

      originalQuery:
        "पुण्यातील इंजिनिअर मुलगी पाहिजे",

      confidence:
        0.95,

      status:
        "SEARCH_READY",

      clarificationReason:
        null,

      clarificationMessage:
        null

    };


    console.log(
      "[AISearchAdapter] REAL TEST CRITERIA:",
      testCriteria
    );


    // ========================================================
    // 3. EXECUTE REAL AI SEARCH
    // ========================================================

    var result =
      executeAISearch(
        testCriteria,
        TEST_USER_MOBILE,
        1
      );


    // ========================================================
    // 4. BASIC RESULT VALIDATION
    // ========================================================

    var resultExists =
      !!result;


    var successIsBoolean =
      resultExists &&
      typeof result.success === "boolean";


    var hasProfilesArray =
      resultExists &&
      Array.isArray(result.profiles);


    var hasCount =
      resultExists &&
      typeof result.count === "number";


    var hasSearchResult =
      resultExists &&
      !!result.searchResult;


    // ========================================================
    // 5. VERIFY PROFILE STRUCTURE
    // ========================================================

    var profileStructureValid =
      true;


    if (
      hasProfilesArray &&
      result.profiles.length > 0
    ) {

      var firstProfile =
        result.profiles[0];


      profileStructureValid =
        !!firstProfile &&
        typeof firstProfile === "object";

    }


    // ========================================================
    // 6. BUILD CHECKS
    // ========================================================

    var checks = [];


    checks.push({
      name:
        "Adapter returned a result",
      pass:
        resultExists
    });


    checks.push({
      name:
        "Result success field is boolean",
      pass:
        successIsBoolean
    });


    checks.push({
      name:
        "Profiles is an array",
      pass:
        hasProfilesArray
    });


    checks.push({
      name:
        "Count is numeric",
      pass:
        hasCount
    });


    checks.push({
      name:
        "Existing search result preserved",
      pass:
        hasSearchResult
    });


    checks.push({
      name:
        "Returned profile structure is valid",
      pass:
        profileStructureValid
    });


    // ========================================================
    // 7. PASS / FAIL
    // ========================================================

    var passedChecks =
      checks.filter(function(check) {

        return check.pass === true;

      }).length;


    var failedChecks =
      checks.length -
      passedChecks;


    var finalResult = {

      success:
        failedChecks === 0,

      module:
        AI_SEARCH_ADAPTER_MODULE,

      version:
        AI_SEARCH_ADAPTER_VERSION,

      test:
        "REAL_SEARCH_INTEGRATION",

      totalChecks:
        checks.length,

      passedChecks:
        passedChecks,

      failedChecks:
        failedChecks,

      searchSuccess:
        result &&
        result.success === true,

      searchType:
        result &&
        result.searchType
          ? result.searchType
          : null,

      searchDistrict:
        result &&
        result.searchDistrict
          ? result.searchDistrict
          : null,

      searchEducation:
        result &&
        result.searchEducation
          ? result.searchEducation
          : null,

      count:
        result &&
        typeof result.count === "number"
          ? result.count
          : 0,

      totalCount:
        result &&
        typeof result.totalCount === "number"
          ? result.totalCount
          : 0,

      totalPages:
        result &&
        typeof result.totalPages === "number"
          ? result.totalPages
          : 0,

      unsupportedCriteria:
        result &&
        Array.isArray(
          result.unsupportedCriteria
        )
          ? result.unsupportedCriteria
          : [],

      message:
        result &&
        result.message
          ? result.message
          : null,

      checks:
        checks

    };


    // ========================================================
    // 8. LOG COMPLETE RESULT
    // ========================================================

    console.log(
      "[AISearchAdapter] REAL SEARCH TEST RESULT:",
      finalResult
    );


    // ========================================================
    // 9. LOG FIRST PROFILE FOR VERIFICATION
    // ========================================================

    if (
      result &&
      Array.isArray(result.profiles) &&
      result.profiles.length > 0
    ) {

      console.log(
        "[AISearchAdapter] FIRST PROFILE:",
        result.profiles[0]
      );

    } else {

      console.log(
        "[AISearchAdapter] No profiles returned for test criteria."
      );

    }


    return finalResult;


  } catch (error) {

    console.error(
      "[AISearchAdapter] REAL SEARCH TEST ERROR:",
      error
    );


    return {

      success:
        false,

      module:
        AI_SEARCH_ADAPTER_MODULE,

      version:
        AI_SEARCH_ADAPTER_VERSION,

      test:
        "REAL_SEARCH_INTEGRATION",

      error:
        error &&
        error.message
          ? error.message
          : String(error)

    };

  }

}