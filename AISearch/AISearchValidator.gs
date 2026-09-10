/**
 * ============================================================
 * AI SEARCH VALIDATOR
 * ============================================================
 *
 * Purpose:
 * Validate AISearchCriteria before it is allowed to reach
 * the existing matrimonial search engine.
 *
 * IMPORTANT:
 * - No Google Sheet access
 * - No database writes
 * - No modification of existing search functions
 * - Does not guess or repair critical criteria
 * - Works additively with AISearchParser / AISearchCriteria
 * - Search is allowed only when validation passes
 *
 * ============================================================
 */


/* ============================================================
 * PUBLIC ENTRY POINT
 * ============================================================
 */

function validateAISearchCriteria(criteria) {
  try {
    if (!criteria || typeof criteria !== "object") {
      return createAISearchValidationResult(
        false,
        "INVALID_CRITERIA",
        "Search criteria उपलब्ध नाहीत.",
        null,
        []
      );
    }

    var normalized = cloneAISearchCriteria(criteria);

    var errors = [];
    var warnings = [];

    /* ----------------------------------------------------------
     * STATUS
     * ----------------------------------------------------------
     */

    if (
      normalized.status ===
      AI_SEARCH_CONFIG.QUERY_STATUS.CLARIFICATION_REQUIRED
    ) {
      return createAISearchValidationResult(
        false,
        "CLARIFICATION_REQUIRED",
        normalized.clarificationMessage ||
          "कृपया आवश्यक माहिती स्पष्ट करा.",
        normalized,
        []
      );
    }

    if (
      normalized.status ===
      AI_SEARCH_CONFIG.QUERY_STATUS.UNSUPPORTED_QUERY
    ) {
      return createAISearchValidationResult(
        false,
        "UNSUPPORTED_QUERY",
        normalized.clarificationMessage ||
          AI_SEARCH_CONFIG.MESSAGES.UNSUPPORTED_QUERY,
        normalized,
        []
      );
    }

    if (
      normalized.status ===
      AI_SEARCH_CONFIG.QUERY_STATUS.INVALID_QUERY
    ) {
      return createAISearchValidationResult(
        false,
        "INVALID_QUERY",
        "Search query वैध नाही.",
        normalized,
        []
      );
    }

    /* ----------------------------------------------------------
     * PROFILE TYPE
     * ----------------------------------------------------------
     */

    if (!isValidAISearchProfileTypeValue(normalized.profileType)) {
      errors.push({
        field: "profileType",
        code: "INVALID_PROFILE_TYPE",
        message: "वधू किंवा वर यापैकी एक Profile type आवश्यक आहे."
      });
    }

    /* ----------------------------------------------------------
     * DISTRICT
     * ----------------------------------------------------------
     */

    if (!Array.isArray(normalized.district) ||
        normalized.district.length === 0) {
      errors.push({
        field: "district",
        code: "INVALID_DISTRICT",
        message: "जिल्हा आवश्यक आहे."
      });
    } else {
      var invalidDistricts =
        normalized.district.filter(function(value) {
          return !isValidAISearchDistrictValue(value);
        });

      if (invalidDistricts.length > 0) {
        errors.push({
          field: "district",
          code: "INVALID_DISTRICT",
          message: "जिल्ह्याची माहिती वैध नाही.",
          values: invalidDistricts
        });
      }

      if (normalized.district.length > 1) {
        errors.push({
          field: "district",
          code: "MULTIPLE_DISTRICTS_NOT_SUPPORTED",
          message: "सध्या एकाच जिल्ह्याचा Search समर्थित आहे."
        });
      }
    }

    /* ----------------------------------------------------------
     * EDUCATION
     * ----------------------------------------------------------
     */

    if (!Array.isArray(normalized.educationCategory) ||
        normalized.educationCategory.length === 0) {
      errors.push({
        field: "educationCategory",
        code: "INVALID_EDUCATION",
        message: "शिक्षणाची Category आवश्यक आहे."
      });
    } else {
      var invalidEducation =
        normalized.educationCategory.filter(function(value) {
          return !isValidAISearchEducationValue(value);
        });

      if (invalidEducation.length > 0) {
        errors.push({
          field: "educationCategory",
          code: "INVALID_EDUCATION",
          message: "शिक्षणाची Category वैध नाही.",
          values: invalidEducation
        });
      }

      if (normalized.educationCategory.length > 1) {
        warnings.push({
          field: "educationCategory",
          code: "MULTIPLE_EDUCATION_CATEGORIES",
          message: "एकापेक्षा जास्त education categories सापडल्या आहेत."
        });
      }
    }

    /* ----------------------------------------------------------
     * AGE
     * ----------------------------------------------------------
     */

    var ageResult = validateAISearchAgeRange(
      normalized.ageMin,
      normalized.ageMax
    );

    if (!ageResult.valid) {
      errors.push({
        field: "age",
        code: ageResult.code,
        message: ageResult.message
      });
    }

    /* ----------------------------------------------------------
     * INCOME
     * ----------------------------------------------------------
     */

    var incomeResult = validateAISearchIncomeRange(
      normalized.incomeMin,
      normalized.incomeMax,
      normalized.incomeOperator
    );

    if (!incomeResult.valid) {
      errors.push({
        field: "income",
        code: incomeResult.code,
        message: incomeResult.message
      });
    }

    /* ----------------------------------------------------------
     * PROFESSION
     * ----------------------------------------------------------
     *
     * Profession is optional. It is retained as interpreted
     * metadata and is NOT converted into an unsupported filter.
     * This prevents the validator from inventing search behavior.
     * ----------------------------------------------------------
     */

    if (
      normalized.profession !== null &&
      normalized.profession !== undefined &&
      String(normalized.profession).trim() === ""
    ) {
      normalized.profession = null;
    }

    /* ----------------------------------------------------------
     * ORIGINAL QUERY
     * ----------------------------------------------------------
     */

    if (
      normalized.originalQuery === null ||
      normalized.originalQuery === undefined ||
      String(normalized.originalQuery).trim() === ""
    ) {
      warnings.push({
        field: "originalQuery",
        code: "ORIGINAL_QUERY_EMPTY",
        message: "Original query उपलब्ध नाही."
      });
    }

    /* ----------------------------------------------------------
     * FINAL DECISION
     * ----------------------------------------------------------
     */

    if (errors.length > 0) {
      normalized.status =
        AI_SEARCH_CONFIG.QUERY_STATUS.VALIDATION_FAILED;

      return createAISearchValidationResult(
        false,
        "VALIDATION_FAILED",
        "Search criteria validation अयशस्वी झाली.",
        normalized,
        errors,
        warnings
      );
    }

    normalized.status =
      AI_SEARCH_CONFIG.QUERY_STATUS.SEARCH_READY;

    normalized.clarificationReason = null;
    normalized.clarificationMessage = null;

    return createAISearchValidationResult(
      true,
      "VALID",
      "Search criteria valid आहेत.",
      normalized,
      [],
      warnings
    );

  } catch (error) {
    console.error(
      "[AISearchValidator] Validation error:",
      error
    );

    return createAISearchValidationResult(
      false,
      "VALIDATION_ERROR",
      "Search criteria validate करताना त्रुटी आली.",
      criteria || null,
      [{
        field: "validator",
        code: "VALIDATION_EXCEPTION",
        message: String(error && error.message || error)
      }]
    );
  }
}


/* ============================================================
 * RESULT FACTORY
 * ============================================================
 */

function createAISearchValidationResult(
  valid,
  code,
  message,
  criteria,
  errors,
  warnings
) {
  return {
    success: valid === true,
    valid: valid === true,
    code: code || null,
    message: message || "",
    criteria: criteria || null,
    errors: errors || [],
    warnings: warnings || []
  };
}


/* ============================================================
 * PROFILE TYPE VALIDATION
 * ============================================================
 */

function isValidAISearchProfileTypeValue(value) {
  if (!AI_SEARCH_CONFIG ||
      !AI_SEARCH_CONFIG.PROFILE_TYPES) {
    return false;
  }

  return (
    value === AI_SEARCH_CONFIG.PROFILE_TYPES.BRIDE ||
    value === AI_SEARCH_CONFIG.PROFILE_TYPES.GROOM ||
    value === AI_SEARCH_CONFIG.PROFILE_TYPES.OTHER
  );
}


/* ============================================================
 * DISTRICT VALIDATION
 * ============================================================
 *
 * We validate against the canonical district values produced
 * by the parser/config instead of accepting arbitrary text.
 * ============================================================
 */

function isValidAISearchDistrictValue(value) {
  if (!AI_SEARCH_CONFIG ||
      !AI_SEARCH_CONFIG.DISTRICT_ALIASES) {
    return false;
  }

  var target =
    String(value || "").trim().toLowerCase();

  if (!target) {
    return false;
  }

  return Object.keys(
    AI_SEARCH_CONFIG.DISTRICT_ALIASES
  ).some(function(key) {
    var entry =
      AI_SEARCH_CONFIG.DISTRICT_ALIASES[key];

    if (!entry) {
      return false;
    }

    var canonical =
      String(entry.value || key)
        .trim()
        .toLowerCase();

    return canonical === target;
  });
}


/* ============================================================
 * EDUCATION VALIDATION
 * ============================================================
 */

function isValidAISearchEducationValue(value) {
  if (!AI_SEARCH_CONFIG ||
      !AI_SEARCH_CONFIG.EDUCATION_CATEGORIES) {
    return false;
  }

  var target =
    String(value || "").trim().toLowerCase();

  if (!target) {
    return false;
  }

  return Object.keys(
    AI_SEARCH_CONFIG.EDUCATION_CATEGORIES
  ).some(function(key) {
    return String(key).toLowerCase() === target;
  });
}


/* ============================================================
 * AGE RANGE VALIDATION
 * ============================================================
 */

function validateAISearchAgeRange(ageMin, ageMax) {
  var min =
    normalizeAISearchValidatorNumber(ageMin);

  var max =
    normalizeAISearchValidatorNumber(ageMax);

  var configuredMin =
    Number(
      AI_SEARCH_CONFIG.LIMITS.MIN_AGE ||
      18
    );

  var configuredMax =
    Number(
      AI_SEARCH_CONFIG.LIMITS.MAX_AGE ||
      100
    );

  if (min !== null) {
    if (!isFinite(min) ||
        min < configuredMin ||
        min > configuredMax) {
      return {
        valid: false,
        code: "INVALID_AGE_MIN",
        message:
          "किमान वय वैध मर्यादेत असणे आवश्यक आहे."
      };
    }
  }

  if (max !== null) {
    if (!isFinite(max) ||
        max < configuredMin ||
        max > configuredMax) {
      return {
        valid: false,
        code: "INVALID_AGE_MAX",
        message:
          "कमाल वय वैध मर्यादेत असणे आवश्यक आहे."
      };
    }
  }

  if (
    min !== null &&
    max !== null &&
    min > max
  ) {
    return {
      valid: false,
      code: "INVALID_AGE_RANGE",
      message:
        "किमान वय कमाल वयापेक्षा जास्त असू शकत नाही."
    };
  }

  return {
    valid: true,
    min: min,
    max: max
  };
}


/* ============================================================
 * INCOME VALIDATION
 * ============================================================
 */

function validateAISearchIncomeRange(
  incomeMin,
  incomeMax,
  incomeOperator
) {
  var min =
    normalizeAISearchValidatorNumber(incomeMin);

  var max =
    normalizeAISearchValidatorNumber(incomeMax);

  var hasMin = min !== null;
  var hasMax = max !== null;
  var hasOperator =
    incomeOperator !== null &&
    incomeOperator !== undefined &&
    String(incomeOperator).trim() !== "";

  var configuredMax =
    Number(
      AI_SEARCH_CONFIG.LIMITS.MAX_INCOME ||
      999999999
    );

  if (hasMin &&
      (!isFinite(min) ||
       min < 0 ||
       min > configuredMax)) {
    return {
      valid: false,
      code: "INVALID_INCOME_MIN",
      message:
        "किमान उत्पन्न वैध मर्यादेत असणे आवश्यक आहे."
    };
  }

  if (hasMax &&
      (!isFinite(max) ||
       max < 0 ||
       max > configuredMax)) {
    return {
      valid: false,
      code: "INVALID_INCOME_MAX",
      message:
        "कमाल उत्पन्न वैध मर्यादेत असणे आवश्यक आहे."
    };
  }

  if (
    hasMin &&
    hasMax &&
    min > max
  ) {
    return {
      valid: false,
      code: "INVALID_INCOME_RANGE",
      message:
        "किमान उत्पन्न कमाल उत्पन्नापेक्षा जास्त असू शकत नाही."
    };
  }

  if (
    hasOperator &&
    [
      "above",
      "below",
      "between",
      "exact"
    ].indexOf(
      String(incomeOperator).toLowerCase()
    ) === -1
  ) {
    return {
      valid: false,
      code: "INVALID_INCOME_OPERATOR",
      message:
        "उत्पन्नाचा operator वैध नाही."
    };
  }

  /*
   * Do not invent income values.
   * If an operator is present, the corresponding numeric
   * information must also be present.
   */

  if (
    hasOperator &&
    String(incomeOperator).toLowerCase() === "above" &&
    !hasMin &&
    !hasMax
  ) {
    return {
      valid: false,
      code: "INCOME_VALUE_MISSING",
      message:
        "उत्पन्नाची किमान रक्कम उपलब्ध नाही."
    };
  }

  if (
    hasOperator &&
    String(incomeOperator).toLowerCase() === "below" &&
    !hasMin &&
    !hasMax
  ) {
    return {
      valid: false,
      code: "INCOME_VALUE_MISSING",
      message:
        "उत्पन्नाची कमाल रक्कम उपलब्ध नाही."
    };
  }

  if (
    hasOperator &&
    String(incomeOperator).toLowerCase() === "between" &&
    (!hasMin || !hasMax)
  ) {
    return {
      valid: false,
      code: "INCOME_RANGE_INCOMPLETE",
      message:
        "उत्पन्नाची दोन्ही मर्यादा आवश्यक आहेत."
    };
  }

  if (
    hasOperator &&
    String(incomeOperator).toLowerCase() === "exact" &&
    !hasMin &&
    !hasMax
  ) {
    return {
      valid: false,
      code: "INCOME_VALUE_MISSING",
      message:
        "उत्पन्नाची रक्कम उपलब्ध नाही."
    };
  }

  return {
    valid: true,
    min: min,
    max: max,
    operator:
      hasOperator
        ? String(incomeOperator).toLowerCase()
        : null
  };
}


/* ============================================================
 * NUMBER NORMALIZATION
 * ============================================================
 */

function normalizeAISearchValidatorNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  var normalized =
    String(value)
      .replace(/[०-९]/g, function(char) {
        var digits = {
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

        return digits[char];
      })
      .replace(/,/g, "")
      .trim();

  if (normalized === "") {
    return null;
  }

  var parsed = Number(normalized);

  return isFinite(parsed)
    ? parsed
    : null;
}


/* ============================================================
 * UNIT TESTS
 * ============================================================
 */

function testAISearchValidator() {
  var tests = [];

  /* TEST 1: Valid complete criteria */
  var test1 =
    validateAISearchCriteria(
      createAISearchCriteria({
        profileType: "bride",
        district: ["पुणे"],
        educationCategory: ["engineering"],
        ageMin: 25,
        ageMax: 30,
        originalQuery:
          "मला पुण्यातील २५ ते ३० वर्षांची इंजिनिअर मुलगी पाहिजे",
        status:
          AI_SEARCH_CONFIG.QUERY_STATUS.SEARCH_READY
      })
    );

  tests.push({
    name: "Valid complete criteria",
    pass:
      test1.success === true &&
      test1.valid === true &&
      test1.criteria.status ===
        AI_SEARCH_CONFIG.QUERY_STATUS.SEARCH_READY
  });


  /* TEST 2: Missing profile type */
  var test2 =
    validateAISearchCriteria(
      createAISearchCriteria({
        profileType: "",
        district: ["पुणे"],
        educationCategory: ["engineering"],
        status:
          AI_SEARCH_CONFIG.QUERY_STATUS.READY
      })
    );

  tests.push({
    name: "Invalid profile type rejected",
    pass:
      test2.success === false &&
      test2.code === "VALIDATION_FAILED"
  });


  /* TEST 3: Missing district */
  var test3 =
    validateAISearchCriteria(
      createAISearchCriteria({
        profileType: "bride",
        district: [],
        educationCategory: ["engineering"],
        status:
          AI_SEARCH_CONFIG.QUERY_STATUS.READY
      })
    );

  tests.push({
    name: "Missing district rejected",
    pass:
      test3.success === false &&
      test3.code === "VALIDATION_FAILED"
  });


  /* TEST 4: Invalid education */
  var test4 =
    validateAISearchCriteria(
      createAISearchCriteria({
        profileType: "bride",
        district: ["पुणे"],
        educationCategory: ["not-a-real-category"],
        status:
          AI_SEARCH_CONFIG.QUERY_STATUS.READY
      })
    );

  tests.push({
    name: "Invalid education rejected",
    pass:
      test4.success === false &&
      test4.code === "VALIDATION_FAILED"
  });


  /* TEST 5: Age range */
  var test5 =
    validateAISearchAgeRange(25, 30);

  tests.push({
    name: "Valid age range accepted",
    pass:
      test5.valid === true
  });


  /* TEST 6: Reversed age range */
  var test6 =
    validateAISearchAgeRange(35, 25);

  tests.push({
    name: "Reversed age range rejected",
    pass:
      test6.valid === false &&
      test6.code === "INVALID_AGE_RANGE"
  });


  /* TEST 7: Out-of-range age */
  var test7 =
    validateAISearchAgeRange(17, 25);

  tests.push({
    name: "Age below minimum rejected",
    pass:
      test7.valid === false &&
      test7.code === "INVALID_AGE_MIN"
  });


  /* TEST 8: Valid income */
  var test8 =
    validateAISearchIncomeRange(
      500000,
      null,
      "above"
    );

  tests.push({
    name: "Valid income criterion accepted",
    pass:
      test8.valid === true
  });


  /* TEST 9: Incomplete between income */
  var test9 =
    validateAISearchIncomeRange(
      500000,
      null,
      "between"
    );

  tests.push({
    name: "Incomplete income range rejected",
    pass:
      test9.valid === false &&
      test9.code === "INCOME_RANGE_INCOMPLETE"
  });


  /* TEST 10: Clarification must not search */
  var clarification =
    createAISearchClarificationCriteria(
      AI_SEARCH_CONFIG.CLARIFICATION_REASON
        .DISTRICT_MISSING,
      AI_SEARCH_CONFIG.MESSAGES
        .DISTRICT_REQUIRED,
      "मला इंजिनिअर मुलगी पाहिजे"
    );

  var test10 =
    validateAISearchCriteria(clarification);

  tests.push({
    name: "Clarification criteria blocked",
    pass:
      test10.success === false &&
      test10.code === "CLARIFICATION_REQUIRED"
  });


  /* TEST 11: Unsupported query blocked */
  var test11 =
    validateAISearchCriteria({
      status:
        AI_SEARCH_CONFIG.QUERY_STATUS.UNSUPPORTED_QUERY,
      clarificationMessage:
        AI_SEARCH_CONFIG.MESSAGES.UNSUPPORTED_QUERY
    });

  tests.push({
    name: "Unsupported query blocked",
    pass:
      test11.success === false &&
      test11.code === "UNSUPPORTED_QUERY"
  });


  /* TEST 12: Marathi digits normalized */
  var test12 =
    validateAISearchAgeRange("२५", "३०");

  tests.push({
    name: "Marathi digits accepted",
    pass:
      test12.valid === true &&
      test12.min === 25 &&
      test12.max === 30
  });


  /* FINAL */
  var failed =
    tests.filter(function(test) {
      return test.pass !== true;
    });

  var passed =
    tests.filter(function(test) {
      return test.pass === true;
    });

  var result = {
    success: failed.length === 0,
    module: "AISearchValidator",
    totalChecks: tests.length,
    passedChecks: passed.length,
    failedChecks: failed.length,
    checks: tests
  };

  console.log(
    "[AISearchValidator] TEST RESULT:",
    result
  );

  return result;
}
