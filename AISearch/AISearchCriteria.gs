/**
 * ============================================================
 * AI SEARCH CRITERIA MODEL
 * ============================================================
 *
 * Purpose:
 * - Create a standardized criteria object for AI Search.
 * - Keep parser output predictable.
 * - Keep validation separate from criteria creation.
 * - No Sheet access.
 * - No database writes.
 * - No existing search function modification.
 *
 * ============================================================
 */


/* ============================================================
 * CREATE EMPTY CRITERIA
 * ============================================================
 */

function createEmptyAISearchCriteria() {

  return {

    profileType: "",

    district: [],

    educationCategory: [],

    ageMin: null,

    ageMax: null,

    incomeMin: null,

    incomeMax: null,

    incomeOperator: null,

    profession: null,

    originalQuery: "",

    confidence: null,

    status: AI_SEARCH_CONFIG.QUERY_STATUS.READY,

    clarificationReason: null,

    clarificationMessage: null

  };

}


/* ============================================================
 * NORMALIZE STRING
 * ============================================================
 */

function normalizeAISearchCriteriaString(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/\s+/g, " ");

}


/* ============================================================
 * NORMALIZE STRING ARRAY
 * ============================================================
 */

function normalizeAISearchCriteriaArray(value) {

  if (value === null || value === undefined) {
    return [];
  }

  let values = value;

  if (!Array.isArray(values)) {
    values = [values];
  }

  return values
    .map(function(item) {
      return normalizeAISearchCriteriaString(item);
    })
    .filter(function(item) {
      return item !== "";
    });

}


/* ============================================================
 * NORMALIZE NUMBER
 * ============================================================
 */

function normalizeAISearchCriteriaNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const numberValue = Number(value);

  if (!isFinite(numberValue)) {
    return null;
  }

  return numberValue;

}


/* ============================================================
 * NORMALIZE PROFILE TYPE
 * ============================================================
 */

function normalizeAISearchProfileType(value) {

  const type =
    normalizeAISearchCriteriaString(value)
      .toLowerCase();

  if (!type) {
    return "";
  }

  const profileTypes =
    AI_SEARCH_CONFIG.PROFILE_TYPES;

  if (
    type === profileTypes.BRIDE ||
    type === "वधू" ||
    type === "brides"
  ) {
    return profileTypes.BRIDE;
  }

  if (
    type === profileTypes.GROOM ||
    type === "वर" ||
    type === "grooms"
  ) {
    return profileTypes.GROOM;
  }

  if (
    type === profileTypes.OTHER ||
    type === "इतर"
  ) {
    return profileTypes.OTHER;
  }

  return "";

}


/* ============================================================
 * NORMALIZE EDUCATION CATEGORY
 * ============================================================
 */

function normalizeAISearchEducationCategory(value) {

  const category =
    normalizeAISearchCriteriaString(value)
      .toLowerCase();

  if (!category) {
    return "";
  }

  const categories =
    AI_SEARCH_CONFIG.EDUCATION_CATEGORIES;

  const aliases = {

    engineering:
      categories.ENGINEERING,

    engineer:
      categories.ENGINEERING,

    "इंजिनिअरिंग":
      categories.ENGINEERING,

    "इंजिनियरिंग":
      categories.ENGINEERING,

    "अभियांत्रिकी":
      categories.ENGINEERING,

    medical:
      categories.MEDICAL,

    doctor:
      categories.MEDICAL,

    mbbs:
      categories.MEDICAL,

    commerce:
      categories.COMMERCE,

    arts:
      categories.ARTS,

    science:
      categories.SCIENCE,

    management:
      categories.MANAGEMENT,

    mba:
      categories.MANAGEMENT,

    law:
      categories.LAW,

    llb:
      categories.LAW,

    "computer_it":
      categories.COMPUTER_IT,

    "computer":
      categories.COMPUTER_IT,

    "information technology":
      categories.COMPUTER_IT,

    pharmacy:
      categories.PHARMACY,

    education:
      categories.EDUCATION,

    teaching:
      categories.EDUCATION,

    other:
      categories.OTHER

  };

  return aliases[category] || "";

}


/* ============================================================
 * NORMALIZE DISTRICT
 * ============================================================
 */

function normalizeAISearchDistrict(value) {

  const district =
    normalizeAISearchCriteriaString(value)
      .toLowerCase();

  if (!district) {
    return "";
  }

  const aliases =
    AI_SEARCH_CONFIG.DISTRICT_ALIASES;

  if (aliases[district]) {
    return aliases[district];
  }

  return "";

}


/* ============================================================
 * NORMALIZE DISTRICT ARRAY
 * ============================================================
 */

function normalizeAISearchDistricts(value) {

  const districts =
    normalizeAISearchCriteriaArray(value);

  const normalized = [];

  districts.forEach(function(district) {

    const result =
      normalizeAISearchDistrict(district);

    if (
      result &&
      normalized.indexOf(result) === -1
    ) {
      normalized.push(result);
    }

  });

  return normalized;

}


/* ============================================================
 * NORMALIZE EDUCATION ARRAY
 * ============================================================
 */

function normalizeAISearchEducationCategories(value) {

  const categories =
    normalizeAISearchCriteriaArray(value);

  const normalized = [];

  categories.forEach(function(category) {

    const result =
      normalizeAISearchEducationCategory(category);

    if (
      result &&
      normalized.indexOf(result) === -1
    ) {
      normalized.push(result);
    }

  });

  return normalized;

}


/* ============================================================
 * CREATE CRITERIA
 * ============================================================
 */

function createAISearchCriteria(input) {

  const source =
    input && typeof input === "object"
      ? input
      : {};


  const criteria =
    createEmptyAISearchCriteria();


  criteria.profileType =
    normalizeAISearchProfileType(
      source.profileType
    );


  criteria.district =
    normalizeAISearchDistricts(
      source.district
    );


  criteria.educationCategory =
    normalizeAISearchEducationCategories(
      source.educationCategory
    );


  criteria.ageMin =
    normalizeAISearchCriteriaNumber(
      source.ageMin
    );


  criteria.ageMax =
    normalizeAISearchCriteriaNumber(
      source.ageMax
    );


  criteria.incomeMin =
    normalizeAISearchCriteriaNumber(
      source.incomeMin
    );


  criteria.incomeMax =
    normalizeAISearchCriteriaNumber(
      source.incomeMax
    );


  criteria.incomeOperator =
    normalizeAISearchCriteriaString(
      source.incomeOperator
    ).toLowerCase() || null;


  criteria.profession =
    normalizeAISearchCriteriaString(
      source.profession
    ) || null;


  criteria.originalQuery =
    normalizeAISearchCriteriaString(
      source.originalQuery
    );


  criteria.confidence =
    normalizeAISearchCriteriaNumber(
      source.confidence
    );


  criteria.status =
    normalizeAISearchCriteriaString(
      source.status
    ) ||
    AI_SEARCH_CONFIG.QUERY_STATUS.READY;


  criteria.clarificationReason =
    normalizeAISearchCriteriaString(
      source.clarificationReason
    ) || null;


  criteria.clarificationMessage =
    normalizeAISearchCriteriaString(
      source.clarificationMessage
    ) || null;


  return criteria;

}


/* ============================================================
 * CLARIFICATION CRITERIA
 * ============================================================
 */

function createAISearchClarificationCriteria(
  reason,
  message,
  originalQuery
) {

  const criteria =
    createEmptyAISearchCriteria();


  criteria.originalQuery =
    normalizeAISearchCriteriaString(
      originalQuery
    );


  criteria.status =
    AI_SEARCH_CONFIG.QUERY_STATUS
      .CLARIFICATION_REQUIRED;


  criteria.clarificationReason =
    normalizeAISearchCriteriaString(
      reason
    );


  criteria.clarificationMessage =
    normalizeAISearchCriteriaString(
      message
    );


  return criteria;

}


/* ============================================================
 * SEARCH-READY CHECK
 * ============================================================
 */

function isAISearchCriteriaReady(criteria) {

  if (
    !criteria ||
    typeof criteria !== "object"
  ) {
    return false;
  }

  if (
    criteria.status !==
    AI_SEARCH_CONFIG.QUERY_STATUS.SEARCH_READY
  ) {
    return false;
  }

  if (!criteria.profileType) {
    return false;
  }

  return true;

}


/* ============================================================
 * CRITERIA CLONE
 * ============================================================
 */

function cloneAISearchCriteria(criteria) {

  if (
    !criteria ||
    typeof criteria !== "object"
  ) {
    return createEmptyAISearchCriteria();
  }

  return JSON.parse(
    JSON.stringify(criteria)
  );

}


/* ============================================================
 * UNIT TEST
 * ============================================================
 */

function testAISearchCriteria() {

  const results = [];


  /* ----------------------------------------------------------
   * TEST 1: Empty criteria
   * ----------------------------------------------------------
   */

  const empty =
    createEmptyAISearchCriteria();

  results.push({

    name: "Empty criteria created",

    pass:
      !!empty &&
      empty.profileType === "" &&
      Array.isArray(empty.district) &&
      Array.isArray(empty.educationCategory)

  });


  /* ----------------------------------------------------------
   * TEST 2: Bride normalization
   * ----------------------------------------------------------
   */

  const bride =
    createAISearchCriteria({

      profileType: "वधू"

    });

  results.push({

    name: "Bride profile type normalization",

    pass:
      bride.profileType ===
      AI_SEARCH_CONFIG.PROFILE_TYPES.BRIDE

  });


  /* ----------------------------------------------------------
   * TEST 3: Groom normalization
   * ----------------------------------------------------------
   */

  const groom =
    createAISearchCriteria({

      profileType: "groom"

    });

  results.push({

    name: "Groom profile type normalization",

    pass:
      groom.profileType ===
      AI_SEARCH_CONFIG.PROFILE_TYPES.GROOM

  });


  /* ----------------------------------------------------------
   * TEST 4: Pune normalization
   * ----------------------------------------------------------
   */

  const pune =
    createAISearchCriteria({

      district: ["Pune"]

    });

  results.push({

    name: "Pune district normalization",

    pass:
      pune.district.length === 1 &&
      pune.district[0] === "पुणे"

  });


  /* ----------------------------------------------------------
   * TEST 5: Engineering normalization
   * ----------------------------------------------------------
   */

  const engineering =
    createAISearchCriteria({

      educationCategory: [
        "Engineering"
      ]

    });

  results.push({

    name: "Engineering category normalization",

    pass:
      engineering.educationCategory.length === 1 &&
      engineering.educationCategory[0] ===
        AI_SEARCH_CONFIG
          .EDUCATION_CATEGORIES
          .ENGINEERING

  });


  /* ----------------------------------------------------------
   * TEST 6: Marathi engineering normalization
   * ----------------------------------------------------------
   */

  const marathiEngineering =
    createAISearchCriteria({

      educationCategory: [
        "इंजिनिअरिंग"
      ]

    });

  results.push({

    name: "Marathi engineering normalization",

    pass:
      marathiEngineering
        .educationCategory[0] ===
        "engineering"

  });


  /* ----------------------------------------------------------
   * TEST 7: Age normalization
   * ----------------------------------------------------------
   */

  const age =
    createAISearchCriteria({

      ageMin: "25",

      ageMax: "30"

    });

  results.push({

    name: "Age range normalization",

    pass:
      age.ageMin === 25 &&
      age.ageMax === 30

  });


  /* ----------------------------------------------------------
   * TEST 8: Income normalization
   * ----------------------------------------------------------
   */

  const income =
    createAISearchCriteria({

      incomeMin: "500000",

      incomeMax: "1000000",

      incomeOperator: "between"

    });

  results.push({

    name: "Income normalization",

    pass:
      income.incomeMin === 500000 &&
      income.incomeMax === 1000000 &&
      income.incomeOperator === "between"

  });


  /* ----------------------------------------------------------
   * TEST 9: Profession normalization
   * ----------------------------------------------------------
   */

  const profession =
    createAISearchCriteria({

      profession:
        "Software Engineer"

    });

  results.push({

    name: "Profession normalization",

    pass:
      profession.profession ===
      "Software Engineer"

  });


  /* ----------------------------------------------------------
   * TEST 10: Original query preserved
   * ----------------------------------------------------------
   */

  const query =
    createAISearchCriteria({

      originalQuery:
        "पुण्यातील इंजिनिअर मुलगी पाहिजे"

    });

  results.push({

    name: "Original query preserved",

    pass:
      query.originalQuery ===
      "पुण्यातील इंजिनिअर मुलगी पाहिजे"

  });


  /* ----------------------------------------------------------
   * TEST 11: Clarification criteria
   * ----------------------------------------------------------
   */

  const clarification =
    createAISearchClarificationCriteria(

      AI_SEARCH_CONFIG
        .CLARIFICATION_REASON
        .DISTRICT_MISSING,

      AI_SEARCH_CONFIG
        .MESSAGES
        .DISTRICT_REQUIRED,

      "मला इंजिनिअर मुलगी पाहिजे"

    );

  results.push({

    name: "Clarification criteria",

    pass:
      clarification.status ===
        AI_SEARCH_CONFIG
          .QUERY_STATUS
          .CLARIFICATION_REQUIRED &&

      clarification.clarificationReason ===
        AI_SEARCH_CONFIG
          .CLARIFICATION_REASON
          .DISTRICT_MISSING &&

      !!clarification.clarificationMessage

  });


  /* ----------------------------------------------------------
   * TEST 12: Clone criteria
   * ----------------------------------------------------------
   */

  const cloned =
    cloneAISearchCriteria(
      clarification
    );

  results.push({

    name: "Criteria clone",

    pass:
      cloned &&
      cloned.status ===
        clarification.status &&
      cloned.originalQuery ===
        clarification.originalQuery

  });


  /* ----------------------------------------------------------
   * FINAL RESULT
   * ----------------------------------------------------------
   */

  const failed =
    results.filter(function(item) {

      return item.pass !== true;

    });


  const passed =
    results.filter(function(item) {

      return item.pass === true;

    });


  const result = {

    success:
      failed.length === 0,

    module:
      "AISearchCriteria",

    totalChecks:
      results.length,

    passedChecks:
      passed.length,

    failedChecks:
      failed.length,

    checks:
      results

  };


  console.log(
    "[AISearchCriteria] TEST RESULT:",
    result
  );


  return result;

}