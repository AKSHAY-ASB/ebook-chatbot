/**
 * ============================================================
 * AI SEARCH ADVANCED FILTER
 * ============================================================
 *
 * Version: 1.0.0
 *
 * Purpose:
 *   Apply AI Search criteria that are not currently supported
 *   directly by searchProfiles():
 *
 *      - Age
 *      - Profession / Job
 *
 * IMPORTANT:
 *   - Does NOT modify searchProfiles()
 *   - Does NOT access Sheets directly
 *   - Does NOT write to Sheets
 *   - Does NOT change normal search
 *   - Uses existing searchProfiles() as the base search engine
 *   - Preserves the existing profile objects
 *   - Rebuilds pagination AFTER advanced filtering
 *
 * Flow:
 *
 *   AISearchCriteria
 *          ↓
 *   AISearchAdapter
 *          ↓
 *   Existing searchProfiles() — all base pages
 *          ↓
 *   Age Filter
 *          ↓
 *   Profession Filter
 *          ↓
 *   Correct Pagination
 *
 * ============================================================
 */


/**
 * ============================================================
 * MODULE CONSTANTS
 * ============================================================
 */

var AI_SEARCH_ADVANCED_FILTER_MODULE =
  "AISearchAdvancedFilter";

var AI_SEARCH_ADVANCED_FILTER_VERSION =
  "1.0.0";

var AI_SEARCH_ADVANCED_FILTER_PAGE_SIZE =
  10;


/**
 * ============================================================
 * PUBLIC ENTRY POINT
 * ============================================================
 *
 * Execute AI search with advanced criteria.
 *
 * This function should be called AFTER the normal AI criteria
 * has passed validation.
 *
 * @param {Object} criteria
 * @param {String} userMobile
 * @param {Number} page
 *
 * @return {Object}
 */
function executeAISearchAdvancedFilter(
  criteria,
  userMobile,
  page
) {

  try {

    // ----------------------------------------------------------
    // 1. BASIC VALIDATION
    // ----------------------------------------------------------

    if (
      !criteria ||
      typeof criteria !== "object"
    ) {

      return createAISearchAdvancedFilterFailure(
        "INVALID_CRITERIA",
        "Invalid AI search criteria."
      );

    }


    // ----------------------------------------------------------
    // 2. CHECK EXISTING SEARCH FUNCTION
    // ----------------------------------------------------------

    if (
      typeof searchProfiles !== "function"
    ) {

      return createAISearchAdvancedFilterFailure(
        "SEARCH_FUNCTION_NOT_FOUND",
        "Existing searchProfiles() function is not available."
      );

    }


    // ----------------------------------------------------------
    // 3. NORMALIZE PAGE
    // ----------------------------------------------------------

    var requestedPage =
      parseInt(page, 10);


    if (
      isNaN(requestedPage) ||
      requestedPage < 1
    ) {

      requestedPage = 1;

    }


    // ----------------------------------------------------------
    // 4. MAP PROFILE TYPE
    // ----------------------------------------------------------

    var searchType =
      mapAISearchAdvancedProfileType(
        criteria.profileType
      );


    if (!searchType) {

      return createAISearchAdvancedFilterFailure(
        "PROFILE_TYPE_MAPPING_FAILED",
        "Unable to map profile type."
      );

    }


    // ----------------------------------------------------------
    // 5. MAP DISTRICT
    // ----------------------------------------------------------

    var searchDistrict =
      mapAISearchAdvancedDistrict(
        criteria.district
      );


    if (!searchDistrict) {

      return createAISearchAdvancedFilterFailure(
        "DISTRICT_MAPPING_FAILED",
        "Unable to map district."
      );

    }


    // ----------------------------------------------------------
    // 6. MAP EDUCATION
    // ----------------------------------------------------------

    var searchEducation =
      mapAISearchAdvancedEducation(
        criteria.educationCategory
      );


    if (!searchEducation) {

      return createAISearchAdvancedFilterFailure(
        "EDUCATION_MAPPING_FAILED",
        "Unable to map education criteria."
      );

    }


    // ----------------------------------------------------------
    // 7. MAP INCOME
    // ----------------------------------------------------------

    var searchIncome =
      mapAISearchAdvancedIncome(
        criteria
      );


    if (!searchIncome) {

      return createAISearchAdvancedFilterFailure(
        "INCOME_MAPPING_FAILED",
        "Unable to map income criteria."
      );

    }


    // ----------------------------------------------------------
    // 8. CHECK ADVANCED CRITERIA
    // ----------------------------------------------------------

    var hasAgeFilter =
      hasAISearchAdvancedAgeCriteria(
        criteria
      );


    var hasProfessionFilter =
      hasAISearchAdvancedProfessionCriteria(
        criteria
      );


    // ----------------------------------------------------------
    // 9. IF NO ADVANCED FILTER EXISTS
    // ----------------------------------------------------------
    //
    // In this case there is no reason to fetch every page.
    // Delegate directly to the existing adapter.
    // ----------------------------------------------------------

    if (
      !hasAgeFilter &&
      !hasProfessionFilter
    ) {

      if (
        typeof executeAISearch === "function"
      ) {

        return executeAISearch(
          criteria,
          userMobile,
          requestedPage
        );

      }


      return createAISearchAdvancedFilterFailure(
        "ADAPTER_NOT_FOUND",
        "AISearchAdapter executeAISearch() is not available."
      );

    }


    // ----------------------------------------------------------
    // 10. FETCH ALL BASE SEARCH PAGES
    // ----------------------------------------------------------
    //
    // This is necessary for correct advanced filtering.
    //
    // Example:
    //
    // Base search = 37 profiles
    // Page size   = 10
    //
    // We fetch:
    //   Page 1
    //   Page 2
    //   Page 3
    //   Page 4
    //
    // Then apply age/profession filter.
    //
    // Only AFTER filtering do we create page 1/page 2/etc.
    // ----------------------------------------------------------

    var baseSearchCollection =
      collectAllAISearchBaseProfiles(
        searchType,
        searchDistrict,
        searchEducation,
        searchIncome,
        userMobile
      );


    if (
      !baseSearchCollection.success
    ) {

      return {

        success: false,

        module:
          AI_SEARCH_ADVANCED_FILTER_MODULE,

        version:
          AI_SEARCH_ADVANCED_FILTER_VERSION,

        status:
          "BASE_SEARCH_FAILED",

        errorCode:
          baseSearchCollection.errorCode,

        message:
          baseSearchCollection.message,

        profiles: [],

        count: 0

      };

    }


    // ----------------------------------------------------------
    // 11. APPLY ADVANCED FILTER
    // ----------------------------------------------------------

    var filteredProfiles =
      applyAISearchAdvancedFilters(
        baseSearchCollection.profiles,
        criteria
      );


    // ----------------------------------------------------------
    // 12. CREATE CORRECT PAGINATION
    // ----------------------------------------------------------

    var pagination =
      paginateAISearchAdvancedProfiles(
        filteredProfiles,
        requestedPage,
        AI_SEARCH_ADVANCED_FILTER_PAGE_SIZE
      );


    // ----------------------------------------------------------
    // 13. BUILD RESULT
    // ----------------------------------------------------------

    var unsupportedCriteria = [];


    // These are now supported by this advanced module.
    //
    // Therefore they should NOT appear as unsupported.
    //

    var result = {

      success: true,

      module:
        AI_SEARCH_ADVANCED_FILTER_MODULE,

      version:
        AI_SEARCH_ADVANCED_FILTER_VERSION,

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
        pagination.page,

      pageSize:
        pagination.pageSize,

      totalCount:
        pagination.totalCount,

      totalPages:
        pagination.totalPages,

      count:
        pagination.count,

      profiles:
        pagination.profiles,

      hasNext:
        pagination.hasNext,

      hasPrevious:
        pagination.hasPrevious,

      unsupportedCriteria:
        unsupportedCriteria,

      advancedFiltersApplied: {

        age:
          hasAgeFilter,

        profession:
          hasProfessionFilter

      },

      baseSearchCount:
        baseSearchCollection.profiles.length,

      message:
        pagination.totalCount > 0

          ? pagination.totalCount +
            " matching profiles found."

          : "No matching profiles found."

    };


    console.log(
      "[AISearchAdvancedFilter] SEARCH RESULT:",
      result
    );


    return result;


  } catch (error) {

    console.error(
      "[AISearchAdvancedFilter] execute error:",
      error
    );


    return {

      success: false,

      module:
        AI_SEARCH_ADVANCED_FILTER_MODULE,

      version:
        AI_SEARCH_ADVANCED_FILTER_VERSION,

      status:
        "ADVANCED_FILTER_ERROR",

      errorCode:
        "ADVANCED_FILTER_EXCEPTION",

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
 * COLLECT ALL BASE PROFILES
 * ============================================================
 *
 * Calls existing searchProfiles() page-by-page.
 *
 * No Sheet access occurs here.
 *
 * ============================================================
 */

function collectAllAISearchBaseProfiles(
  searchType,
  searchDistrict,
  searchEducation,
  searchIncome,
  userMobile
) {

  try {

    var allProfiles = [];

    var currentPage = 1;

    var totalPages = 1;


    while (
      currentPage <= totalPages
    ) {

      var result =
        searchProfiles(
          searchType,
          searchDistrict,
          searchEducation,
          searchIncome,
          currentPage,
          userMobile
        );


      if (
        !result ||
        result.success !== true
      ) {

        return {

          success: false,

          errorCode:
            "BASE_SEARCH_PAGE_FAILED",

          message:
            result &&
            result.message
              ? result.message
              : "Base profile search failed.",

          profiles: []

        };

      }


      // --------------------------------------------------------
      // Add profiles
      // --------------------------------------------------------

      if (
        Array.isArray(result.profiles)
      ) {

        result.profiles.forEach(
          function(profile) {

            allProfiles.push(
              profile
            );

          }
        );

      }


      // --------------------------------------------------------
      // Determine total pages
      // --------------------------------------------------------

      var returnedTotalPages =
        parseInt(
          result.totalPages,
          10
        );


      if (
        !isNaN(returnedTotalPages) &&
        returnedTotalPages > 0
      ) {

        totalPages =
          returnedTotalPages;

      }


      // --------------------------------------------------------
      // Safety:
      // If backend says no next page, stop.
      // --------------------------------------------------------

      if (
        result.hasNext !== true
      ) {

        break;

      }


      currentPage++;


      // --------------------------------------------------------
      // Absolute safety guard.
      //
      // Prevents an unexpected backend response from creating
      // an infinite loop.
      // --------------------------------------------------------

      if (
        currentPage > 10000
      ) {

        return {

          success: false,

          errorCode:
            "BASE_SEARCH_PAGE_LIMIT",

          message:
            "Base search exceeded the maximum safe page limit.",

          profiles: []

        };

      }

    }


    return {

      success: true,

      profiles:
        allProfiles,

      totalProfiles:
        allProfiles.length

    };


  } catch (error) {

    console.error(
      "[AISearchAdvancedFilter] collect pages error:",
      error
    );


    return {

      success: false,

      errorCode:
        "BASE_SEARCH_EXCEPTION",

      message:
        error &&
        error.message
          ? error.message
          : String(error),

      profiles: []

    };

  }

}


/**
 * ============================================================
 * APPLY AGE + PROFESSION FILTERS
 * ============================================================
 */

function applyAISearchAdvancedFilters(
  profiles,
  criteria
) {

  if (
    !Array.isArray(profiles)
  ) {

    return [];

  }


  if (
    !criteria
  ) {

    return profiles.slice();

  }


  var ageMin =
    normalizeAISearchAdvancedNumber(
      criteria.ageMin
    );


  var ageMax =
    normalizeAISearchAdvancedNumber(
      criteria.ageMax
    );


  var profession =
    String(
      criteria.profession || ""
    ).trim();


  return profiles.filter(
    function(profile) {

      // --------------------------------------------------------
      // AGE
      // --------------------------------------------------------

      if (
        ageMin !== null ||
        ageMax !== null
      ) {

        var profileAge =
          extractAISearchProfileAge(
            profile &&
            profile.age
          );


        // If an age filter is requested but the profile has no
        // readable age, do NOT guess.
        //
        // The profile is excluded because it cannot be proven
        // to satisfy the requested age range.
        //

        if (
          profileAge === null
        ) {

          return false;

        }


        if (
          ageMin !== null &&
          profileAge < ageMin
        ) {

          return false;

        }


        if (
          ageMax !== null &&
          profileAge > ageMax
        ) {

          return false;

        }

      }


      // --------------------------------------------------------
      // PROFESSION / JOB
      // --------------------------------------------------------

      if (
        profession
      ) {

        var profileJob =
          profile &&
          profile.job !== undefined &&
          profile.job !== null

            ? String(
                profile.job
              ).trim()

            : "";


        if (
          !matchesAISearchProfession(
            profileJob,
            profession
          )
        ) {

          return false;

        }

      }


      return true;

    }
  );

}


/**
 * ============================================================
 * AGE EXTRACTION
 * ============================================================
 *
 * Supports examples such as:
 *
 *   "30 years, 3 months, 4 days"
 *   "30 years"
 *   "30 वर्षे"
 *   "३० वर्षे"
 *   "30"
 *
 * Returns completed integer age.
 * ============================================================
 */

function extractAISearchProfileAge(
  ageValue
) {

  if (
    ageValue === null ||
    ageValue === undefined
  ) {

    return null;

  }


  var text =
    String(ageValue).trim();


  if (!text) {

    return null;

  }


  text =
    normalizeAISearchAdvancedDigits(
      text
    );


  // ----------------------------------------------------------
  // English age format
  // ----------------------------------------------------------

  var englishMatch =
    text.match(
      /(?:^|\D)(\d{1,3})\s*(?:years?|yrs?)(?:\D|$)/i
    );


  if (
    englishMatch
  ) {

    var englishAge =
      parseInt(
        englishMatch[1],
        10
      );


    return isValidAISearchAdvancedAge(
      englishAge
    )
      ? englishAge
      : null;

  }


  // ----------------------------------------------------------
  // Marathi age format
  // ----------------------------------------------------------

  var marathiMatch =
    text.match(
      /(?:^|\D)(\d{1,3})\s*(?:वर्ष|वर्षे|वर्षांचा|वर्षांची|वर्षाचे)/i
    );


  if (
    marathiMatch
  ) {

    var marathiAge =
      parseInt(
        marathiMatch[1],
        10
      );


    return isValidAISearchAdvancedAge(
      marathiAge
    )
      ? marathiAge
      : null;

  }


  // ----------------------------------------------------------
  // Pure numeric age
  // ----------------------------------------------------------

  if (
    /^\d{1,3}$/.test(text)
  ) {

    var numericAge =
      parseInt(
        text,
        10
      );


    return isValidAISearchAdvancedAge(
      numericAge
    )
      ? numericAge
      : null;

  }


  return null;

}


/**
 * ============================================================
 * AGE VALIDATION
 * ============================================================
 */

function isValidAISearchAdvancedAge(
  age
) {

  return (
    typeof age === "number" &&
    !isNaN(age) &&
    age >= 18 &&
    age <= 100
  );

}


/**
 * ============================================================
 * PROFESSION MATCHING
 * ============================================================
 *
 * The AI parser may produce:
 *
 *   engineer
 *   engineering
 *   इंजिनिअर
 *   इंजिनिअरिंग
 *
 * A conservative keyword/alias approach is used.
 *
 * The actual profile job is never rewritten.
 * ============================================================
 */

function matchesAISearchProfession(
  profileJob,
  requestedProfession
) {

  var job =
    normalizeAISearchProfessionText(
      profileJob
    );


  var requested =
    normalizeAISearchProfessionText(
      requestedProfession
    );


  if (
    !job ||
    !requested
  ) {

    return false;

  }


  // ----------------------------------------------------------
  // Direct match
  // ----------------------------------------------------------

  if (
    job.indexOf(requested) !== -1
  ) {

    return true;

  }


  // ----------------------------------------------------------
  // Profession alias groups
  // ----------------------------------------------------------

  var aliases = {

    engineer: [
      "engineer",
      "engineering",
      "इंजिनिअर",
      "इंजिनियर",
      "इंजिनिअरिंग",
      "इंजिनियरिंग",
      "अभियंता",
      "अभियांत्रिकी"
    ],

    engineering: [
      "engineer",
      "engineering",
      "इंजिनिअर",
      "इंजिनियर",
      "इंजिनिअरिंग",
      "इंजिनियरिंग",
      "अभियंता",
      "अभियांत्रिकी"
    ],

    doctor: [
      "doctor",
      "dr.",
      "dr ",
      "physician",
      "doctorate",
      "डॉक्टर",
      "वैद्य"
    ],

    medical: [
      "doctor",
      "medical",
      "physician",
      "hospital",
      "डॉक्टर",
      "मेडिकल",
      "वैद्यकीय"
    ],

    teacher: [
      "teacher",
      "teaching",
      "professor",
      "lecturer",
      "शिक्षक",
      "शिक्षिका",
      "प्राध्यापक",
      "अध्यापक"
    ],

    lawyer: [
      "lawyer",
      "advocate",
      "legal",
      "वकील",
      "अॅडव्होकेट",
      "कायदा"
    ],

    software: [
      "software",
      "developer",
      "programmer",
      "software engineer",
      "सॉफ्टवेअर",
      "डेव्हलपर",
      "प्रोग्रामर"
    ],

    it: [
      "it",
      "software",
      "developer",
      "technology",
      "tech",
      "आयटी",
      "सॉफ्टवेअर",
      "तंत्रज्ञान"
    ]

  };


  // ----------------------------------------------------------
  // Find requested alias group
  // ----------------------------------------------------------

  var requestedGroup =
    null;


  var aliasKeys =
    Object.keys(
      aliases
    );


  for (
    var i = 0;
    i < aliasKeys.length;
    i++
  ) {

    var key =
      aliasKeys[i];


    var values =
      aliases[key];


    if (
      key === requested
    ) {

      requestedGroup =
        values;

      break;

    }


    if (
      values.indexOf(requested) !== -1
    ) {

      requestedGroup =
        values;

      break;

    }

  }


  if (
    !requestedGroup
  ) {

    return false;

  }


  // ----------------------------------------------------------
  // Check profile job against alias group
  // ----------------------------------------------------------

  for (
    var j = 0;
    j < requestedGroup.length;
    j++
  ) {

    var alias =
      normalizeAISearchProfessionText(
        requestedGroup[j]
      );


    if (
      alias &&
      job.indexOf(alias) !== -1
    ) {

      return true;

    }

  }


  return false;

}


/**
 * ============================================================
 * PROFESSION TEXT NORMALIZER
 * ============================================================
 */

function normalizeAISearchProfessionText(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );

}


/**
 * ============================================================
 * PAGINATION
 * ============================================================
 */

function paginateAISearchAdvancedProfiles(
  profiles,
  page,
  pageSize
) {

  var safeProfiles =
    Array.isArray(profiles)
      ? profiles
      : [];


  var safePage =
    parseInt(
      page,
      10
    );


  if (
    isNaN(safePage) ||
    safePage < 1
  ) {

    safePage = 1;

  }


  var safePageSize =
    parseInt(
      pageSize,
      10
    );


  if (
    isNaN(safePageSize) ||
    safePageSize < 1
  ) {

    safePageSize =
      AI_SEARCH_ADVANCED_FILTER_PAGE_SIZE;

  }


  var totalCount =
    safeProfiles.length;


  var totalPages =
    totalCount > 0

      ? Math.ceil(
          totalCount /
          safePageSize
        )

      : 0;


  // ----------------------------------------------------------
  // If requested page is beyond available pages, return an
  // empty page but preserve pagination metadata.
  // ----------------------------------------------------------

  if (
    totalPages > 0 &&
    safePage > totalPages
  ) {

    return {

      page:
        safePage,

      pageSize:
        safePageSize,

      totalCount:
        totalCount,

      totalPages:
        totalPages,

      count:
        0,

      profiles:
        [],

      hasNext:
        false,

      hasPrevious:
        safePage > 1

    };

  }


  var startIndex =
    (safePage - 1) *
    safePageSize;


  var endIndex =
    startIndex +
    safePageSize;


  var currentProfiles =
    safeProfiles.slice(
      startIndex,
      endIndex
    );


  return {

    page:
      safePage,

    pageSize:
      safePageSize,

    totalCount:
      totalCount,

    totalPages:
      totalPages,

    count:
      currentProfiles.length,

    profiles:
      currentProfiles,

    hasNext:
      totalPages > 0 &&
      safePage < totalPages,

    hasPrevious:
      safePage > 1

  };

}


/**
 * ============================================================
 * PROFILE TYPE MAPPING
 * ============================================================
 */

function mapAISearchAdvancedProfileType(
  profileType
) {

  var value =
    String(
      profileType || ""
    )
      .trim()
      .toLowerCase();


  if (
    value === "bride" ||
    value === "वधू"
  ) {

    return "वधू";

  }


  if (
    value === "groom" ||
    value === "वर"
  ) {

    return "वर";

  }


  if (
    value === "other" ||
    value === "इतर"
  ) {

    return "इतर";

  }


  return "";

}


/**
 * ============================================================
 * DISTRICT MAPPING
 * ============================================================
 */

function mapAISearchAdvancedDistrict(
  district
) {

  var values =
    Array.isArray(district)
      ? district
      : [district];


  values =
    values
      .map(function(item) {

        return String(
          item || ""
        ).trim();

      })
      .filter(function(item) {

        return item !== "";

      });


  if (
    values.length === 0
  ) {

    return "all";

  }


  // Existing search engine accepts one district.
  if (
    values.length > 1
  ) {

    return "";

  }


  var value =
    values[0];


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
    "अहमदनगर": "अहमदनगर",

    "ahilyanagar": "अहिल्यानगर",
    "अहिल्यानगर": "अहिल्यानगर",

    "aurangabad": "औरंगाबाद",
    "औरंगाबाद": "औरंगाबाद",

    "chhatrapati sambhajinagar":
      "छत्रपती संभाजीनगर",

    "छत्रपती संभाजीनगर":
      "छत्रपती संभाजीनगर",

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


  return value;

}


/**
 * ============================================================
 * EDUCATION MAPPING
 * ============================================================
 */

function mapAISearchAdvancedEducation(
  educationCategory
) {

  var values =
    Array.isArray(educationCategory)
      ? educationCategory
      : [educationCategory];


  values =
    values
      .map(function(item) {

        return String(
          item || ""
        ).trim();

      })
      .filter(function(item) {

        return item !== "";

      });


  if (
    values.length === 0
  ) {

    return "all";

  }


  // Existing searchProfiles() supports one category.
  if (
    values.length > 1
  ) {

    return "";

  }


  var value =
    values[0];


  var lower =
    value.toLowerCase();


  var aliases = {

    "engineering":
      "engineering",

    "engineer":
      "engineering",

    "इंजिनिअरिंग":
      "engineering",

    "अभियांत्रिकी":
      "engineering",

    "medical":
      "medical",

    "medicine":
      "medical",

    "मेडिकल":
      "medical",

    "commerce":
      "commerce",

    "वाणिज्य":
      "commerce",

    "arts":
      "arts",

    "कला":
      "arts",

    "science":
      "science",

    "विज्ञान":
      "science",

    "management":
      "management",

    "व्यवस्थापन":
      "management",

    "law":
      "law",

    "कायदा":
      "law",

    "computer_it":
      "computer_it",

    "computer":
      "computer_it",

    "it":
      "computer_it",

    "आयटी":
      "computer_it",

    "pharmacy":
      "pharmacy",

    "फार्मसी":
      "pharmacy",

    "education":
      "education",

    "शिक्षण":
      "education",

    "other":
      "other",

    "इतर":
      "other"

  };


  if (
    aliases.hasOwnProperty(lower)
  ) {

    return aliases[lower];

  }


  return value;

}


/**
 * ============================================================
 * INCOME MAPPING
 * ============================================================
 */

function mapAISearchAdvancedIncome(
  criteria
) {

  if (
    !criteria
  ) {

    return "";

  }


  var min =
    normalizeAISearchAdvancedNumber(
      criteria.incomeMin
    );


  var max =
    normalizeAISearchAdvancedNumber(
      criteria.incomeMax
    );


  var operator =
    String(
      criteria.incomeOperator || ""
    )
      .trim()
      .toLowerCase();


  if (
    min === null &&
    max === null &&
    !operator
  ) {

    return "all";

  }


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


  if (
    operator === "above" ||
    operator === "greater_than" ||
    operator === "gt"
  ) {

    return min !== null
      ? String(min)
      : "";

  }


  if (
    operator === "below" ||
    operator === "less_than" ||
    operator === "lt"
  ) {

    if (
      max !== null
    ) {

      return String(max);

    }


    if (
      min !== null
    ) {

      return String(min);

    }


    return "";

  }


  if (
    operator === "exact" ||
    operator === "equals" ||
    operator === "equal"
  ) {

    if (
      min !== null
    ) {

      return String(min);

    }


    if (
      max !== null
    ) {

      return String(max);

    }


    return "";

  }


  if (
    min !== null &&
    max !== null
  ) {

    return String(min) +
      "-" +
      String(max);

  }


  if (
    min !== null
  ) {

    return String(min);

  }


  if (
    max !== null
  ) {

    return String(max);

  }


  return "all";

}


/**
 * ============================================================
 * ADVANCED CRITERIA CHECKS
 * ============================================================
 */

function hasAISearchAdvancedAgeCriteria(
  criteria
) {

  if (
    !criteria
  ) {

    return false;

  }


  return (
    normalizeAISearchAdvancedNumber(
      criteria.ageMin
    ) !== null ||

    normalizeAISearchAdvancedNumber(
      criteria.ageMax
    ) !== null
  );

}


function hasAISearchAdvancedProfessionCriteria(
  criteria
) {

  if (
    !criteria
  ) {

    return false;

  }


  return (
    String(
      criteria.profession || ""
    ).trim() !== ""
  );

}


/**
 * ============================================================
 * NUMBER NORMALIZER
 * ============================================================
 */

function normalizeAISearchAdvancedNumber(
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
    String(value).trim();


  text =
    normalizeAISearchAdvancedDigits(
      text
    );


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
 * MARATHI DIGITS NORMALIZER
 * ============================================================
 */

function normalizeAISearchAdvancedDigits(
  value
) {

  var text =
    String(
      value || ""
    );


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


  return text;

}


/**
 * ============================================================
 * FAILURE RESULT
 * ============================================================
 */

function createAISearchAdvancedFilterFailure(
  errorCode,
  message
) {

  return {

    success: false,

    module:
      AI_SEARCH_ADVANCED_FILTER_MODULE,

    version:
      AI_SEARCH_ADVANCED_FILTER_VERSION,

    status:
      "ADVANCED_FILTER_FAILED",

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
 * TEST ASSERTION
 * ============================================================
 */

function assertAISearchAdvancedFilterTest(
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
 * Age extraction.
 * ============================================================
 */

function testAISearchAdvancedAgeExtraction() {

  var checks = [];


  checks.push(
    assertAISearchAdvancedFilterTest(
      "English age format",
      extractAISearchProfileAge(
        "30 years, 3 months, 4 days"
      ) === 30
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "English short age format",
      extractAISearchProfileAge(
        "28 years"
      ) === 28
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Marathi age format",
      extractAISearchProfileAge(
        "३० वर्षे"
      ) === 30
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Marathi detailed age format",
      extractAISearchProfileAge(
        "२५ वर्षांची"
      ) === 25
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Numeric age",
      extractAISearchProfileAge(
        "27"
      ) === 27
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Invalid age rejected",
      extractAISearchProfileAge(
        "12 years"
      ) === null
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Empty age rejected",
      extractAISearchProfileAge(
        ""
      ) === null
    )
  );


  var passed =
    checks.filter(
      function(check) {

        return check.pass === true;

      }
    ).length;


  var result = {

    success:
      passed === checks.length,

    module:
      AI_SEARCH_ADVANCED_FILTER_MODULE,

    test:
      "AGE_EXTRACTION",

    totalChecks:
      checks.length,

    passedChecks:
      passed,

    failedChecks:
      checks.length - passed,

    checks:
      checks

  };


  console.log(
    "[AISearchAdvancedFilter] AGE TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * TEST 2
 * ============================================================
 *
 * Profession matching.
 * ============================================================
 */

function testAISearchAdvancedProfessionMatching() {

  var checks = [];


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Engineer matches TCS engineer",
      matchesAISearchProfession(
        "Software Engineer, TCS",
        "engineer"
      ) === true
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Engineering matches engineer",
      matchesAISearchProfession(
        "Mechanical Engineering",
        "engineering"
      ) === true
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Marathi engineer matches",
      matchesAISearchProfession(
        "इंजिनिअर - पुणे",
        "इंजिनिअरिंग"
      ) === true
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Unrelated profession rejected",
      matchesAISearchProfession(
        "Teacher",
        "engineer"
      ) === false
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Empty job rejected",
      matchesAISearchProfession(
        "",
        "engineer"
      ) === false
    )
  );


  var passed =
    checks.filter(
      function(check) {

        return check.pass === true;

      }
    ).length;


  var result = {

    success:
      passed === checks.length,

    module:
      AI_SEARCH_ADVANCED_FILTER_MODULE,

    test:
      "PROFESSION_MATCHING",

    totalChecks:
      checks.length,

    passedChecks:
      passed,

    failedChecks:
      checks.length - passed,

    checks:
      checks

  };


  console.log(
    "[AISearchAdvancedFilter] PROFESSION TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * TEST 3
 * ============================================================
 *
 * Combined age + profession filtering.
 * ============================================================
 */

function testAISearchAdvancedCombinedFilter() {

  var profiles = [

    {
      id: "TEST001",
      age: "25 years",
      job: "Software Engineer, Pune"
    },

    {
      id: "TEST002",
      age: "28 years",
      job: "Teacher, Pune"
    },

    {
      id: "TEST003",
      age: "31 years",
      job: "Software Engineer, Pune"
    },

    {
      id: "TEST004",
      age: "29 years",
      job: "Mechanical Engineer"
    },

    {
      id: "TEST005",
      age: "24 years",
      job: "Engineer"
    }

  ];


  var criteria = {

    ageMin:
      25,

    ageMax:
      30,

    profession:
      "engineer"

  };


  var filtered =
    applyAISearchAdvancedFilters(
      profiles,
      criteria
    );


  var ids =
    filtered.map(
      function(profile) {

        return profile.id;

      }
    );


  var expected =
    [
      "TEST001",
      "TEST004"
    ];


  var sameLength =
    ids.length === expected.length;


  var sameValues =
    sameLength &&
    ids[0] === expected[0] &&
    ids[1] === expected[1];


  var result = {

    success:
      sameValues,

    module:
      AI_SEARCH_ADVANCED_FILTER_MODULE,

    test:
      "COMBINED_AGE_PROFESSION_FILTER",

    expected:
      expected,

    actual:
      ids,

    filteredCount:
      filtered.length

  };


  console.log(
    "[AISearchAdvancedFilter] COMBINED TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * TEST 4
 * ============================================================
 *
 * Pagination AFTER filtering.
 * ============================================================
 */

function testAISearchAdvancedPagination() {

  var profiles = [];


  for (
    var i = 1;
    i <= 23;
    i++
  ) {

    profiles.push({

      id:
        "P" +
        String(i),

      age:
        "25 years",

      job:
        "Engineer"

    });

  }


  var page1 =
    paginateAISearchAdvancedProfiles(
      profiles,
      1,
      10
    );


  var page2 =
    paginateAISearchAdvancedProfiles(
      profiles,
      2,
      10
    );


  var page3 =
    paginateAISearchAdvancedProfiles(
      profiles,
      3,
      10
    );


  var checks = [];


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Total count is 23",
      page1.totalCount === 23
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Total pages is 3",
      page1.totalPages === 3
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Page 1 contains 10",
      page1.count === 10
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Page 2 contains 10",
      page2.count === 10
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Page 3 contains 3",
      page3.count === 3
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Page 1 has next",
      page1.hasNext === true
    )
  );


  checks.push(
    assertAISearchAdvancedFilterTest(
      "Page 3 has no next",
      page3.hasNext === false
    )
  );


  var passed =
    checks.filter(
      function(check) {

        return check.pass === true;

      }
    ).length;


  var result = {

    success:
      passed === checks.length,

    module:
      AI_SEARCH_ADVANCED_FILTER_MODULE,

    test:
      "POST_FILTER_PAGINATION",

    totalChecks:
      checks.length,

    passedChecks:
      passed,

    failedChecks:
      checks.length - passed,

    checks:
      checks

  };


  console.log(
    "[AISearchAdvancedFilter] PAGINATION TEST RESULT:",
    result
  );


  return result;

}


/**
 * ============================================================
 * MASTER TEST
 * ============================================================
 *
 * IMPORTANT:
 * This master test does NOT access the spreadsheet.
 *
 * It validates:
 *
 *   1. Age parsing
 *   2. Profession matching
 *   3. Combined filtering
 *   4. Pagination
 *
 * Run this BEFORE the real search integration test.
 * ============================================================
 */

function testAISearchAdvancedFilter() {

  var ageResult =
    testAISearchAdvancedAgeExtraction();


  var professionResult =
    testAISearchAdvancedProfessionMatching();


  var combinedResult =
    testAISearchAdvancedCombinedFilter();


  var paginationResult =
    testAISearchAdvancedPagination();


  var success =
    ageResult.success === true &&
    professionResult.success === true &&
    combinedResult.success === true &&
    paginationResult.success === true;


  var result = {

    success:
      success,

    module:
      AI_SEARCH_ADVANCED_FILTER_MODULE,

    version:
      AI_SEARCH_ADVANCED_FILTER_VERSION,

    ageTest:
      ageResult,

    professionTest:
      professionResult,

    combinedTest:
      combinedResult,

    paginationTest:
      paginationResult

  };


  console.log(
    "[AISearchAdvancedFilter] MASTER TEST RESULT:",
    result
  );


  return result;

}



/**
 * ============================================================
 * STEP 8 — REAL ADVANCED SEARCH TEST
 * ============================================================
 *
 * Test query:
 *
 *   "मला पुण्यातील २५ ते ३० वर्षांची इंजिनिअर मुलगी पाहिजे"
 *
 * This test verifies:
 *
 *   Bride
 *      +
 *   Pune
 *      +
 *   Engineering
 *      +
 *   Age 25–30
 *      +
 *   Engineer profession
 *
 * against REAL profile data.
 *
 * IMPORTANT:
 *   - Does NOT modify existing searchProfiles()
 *   - Does NOT write to Sheets
 *   - Does NOT modify profiles
 *   - Uses the existing search engine
 * ============================================================
 */

function testAISearchAdvancedFilterRealSearch() {

  try {

    // ========================================================
    // 1. TEST USER
    // ========================================================

    var TEST_USER_MOBILE =
      "8975593689";


    // ========================================================
    // 2. REAL AI CRITERIA
    // ========================================================

    var testCriteria = {

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


    console.log(
      "[AISearchAdvancedFilter] REAL TEST CRITERIA:",
      testCriteria
    );


    // ========================================================
    // 3. VALIDATE CRITERIA
    // ========================================================

    if (
      typeof validateAISearchCriteria !== "function"
    ) {

      throw new Error(
        "validateAISearchCriteria() not found."
      );

    }


    var validationResult =
      validateAISearchCriteria(
        testCriteria
      );


    console.log(
      "[AISearchAdvancedFilter] VALIDATION RESULT:",
      validationResult
    );


    if (
      !validationResult ||
      validationResult.success !== true
    ) {

      return {

        success:
          false,

        stage:
          "VALIDATION",

        validationResult:
          validationResult

      };

    }


    // ========================================================
    // 4. EXECUTE REAL ADVANCED SEARCH
    // ========================================================

    var result =
      executeAISearchAdvancedFilter(
        testCriteria,
        TEST_USER_MOBILE,
        1
      );


    console.log(
      "[AISearchAdvancedFilter] REAL SEARCH RESULT:",
      result
    );


    // ========================================================
    // 5. BASIC RESULT CHECKS
    // ========================================================

    var checks = [];


    checks.push({

      name:
        "Search returned a result object",

      pass:
        !!result

    });


    checks.push({

      name:
        "Search completed successfully",

      pass:
        !!result &&
        result.success === true

    });


    checks.push({

      name:
        "Correct profile type",

      pass:
        !!result &&
        result.searchType === "वधू"

    });


    checks.push({

      name:
        "Correct district",

      pass:
        !!result &&
        result.searchDistrict === "पुणे"

    });


    checks.push({

      name:
        "Correct education",

      pass:
        !!result &&
        result.searchEducation === "engineering"

    });


    checks.push({

      name:
        "Advanced age filter applied",

      pass:
        !!result &&
        result.advancedFiltersApplied &&
        result.advancedFiltersApplied.age === true

    });


    checks.push({

      name:
        "Advanced profession filter applied",

      pass:
        !!result &&
        result.advancedFiltersApplied &&
        result.advancedFiltersApplied.profession === true

    });


    checks.push({

      name:
        "Age and profession are no longer unsupported",

      pass:
        !!result &&
        Array.isArray(
          result.unsupportedCriteria
        ) &&
        result.unsupportedCriteria.length === 0

    });


    checks.push({

      name:
        "Profiles is an array",

      pass:
        !!result &&
        Array.isArray(
          result.profiles
        )

    });


    checks.push({

      name:
        "Count is numeric",

      pass:
        !!result &&
        typeof result.count === "number"

    });


    checks.push({

      name:
        "Total count is numeric",

      pass:
        !!result &&
        typeof result.totalCount === "number"

    });


    checks.push({

      name:
        "Pagination is valid",

      pass:
        !!result &&
        typeof result.totalPages === "number"

    });


    // ========================================================
    // 6. VERIFY EVERY RETURNED PROFILE
    // ========================================================
    //
    // This is the most important real-data check.
    //
    // Every returned profile must satisfy:
    //
    //   Age 25–30
    //   Engineer profession
    //
    // We deliberately verify the actual returned data rather
    // than trusting only the result metadata.
    // ========================================================

    var profileChecksPassed =
      true;


    var invalidProfiles = [];


    if (
      result &&
      Array.isArray(result.profiles)
    ) {

      result.profiles.forEach(
        function(profile) {

          var age =
            extractAISearchProfileAge(
              profile.age
            );


          var ageValid =
            age !== null &&
            age >= 25 &&
            age <= 30;


          var job =
            profile.job !== null &&
            profile.job !== undefined
              ? String(
                  profile.job
                )
              : "";


          var professionValid =
            matchesAISearchProfession(
              job,
              "engineer"
            );


          if (
            !ageValid ||
            !professionValid
          ) {

            profileChecksPassed =
              false;


            invalidProfiles.push({

              id:
                profile.id,

              name:
                profile.name,

              age:
                profile.age,

              parsedAge:
                age,

              job:
                job,

              ageValid:
                ageValid,

              professionValid:
                professionValid

            });

          }

        }
      );

    }


    checks.push({

      name:
        "Every returned profile satisfies age 25–30 and engineer criteria",

      pass:
        profileChecksPassed,

      details:
        invalidProfiles.length === 0
          ? "All returned profiles passed."
          : invalidProfiles

    });


    // ========================================================
    // 7. VERIFY CORRECT PAGINATION
    // ========================================================

    var paginationValid =
      false;


    if (
      result &&
      typeof result.totalCount === "number" &&
      typeof result.totalPages === "number" &&
      typeof result.count === "number"
    ) {

      var expectedTotalPages =
        result.totalCount > 0
          ? Math.ceil(
              result.totalCount / 10
            )
          : 0;


      paginationValid =
        result.totalPages ===
        expectedTotalPages;


      if (
        result.totalCount > 0
      ) {

        paginationValid =
          paginationValid &&
          result.count <= 10;

      }

    }


    checks.push({

      name:
        "Advanced-filter pagination is correct",

      pass:
        paginationValid

    });


    // ========================================================
    // 8. FINAL RESULT
    // ========================================================

    var passedChecks =
      checks.filter(
        function(check) {

          return check.pass === true;

        }
      ).length;


    var failedChecks =
      checks.length -
      passedChecks;


    var finalResult = {

      success:
        failedChecks === 0,

      module:
        AI_SEARCH_ADVANCED_FILTER_MODULE,

      version:
        AI_SEARCH_ADVANCED_FILTER_VERSION,

      test:
        "REAL_ADVANCED_SEARCH",

      query:
        testCriteria.originalQuery,

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

      ageRange:
        "25-30",

      profession:
        "engineer",

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

      invalidProfiles:
        invalidProfiles,

      checks:
        checks

    };


    // ========================================================
    // 9. LOG RESULT
    // ========================================================

    console.log(
      "[AISearchAdvancedFilter] REAL ADVANCED SEARCH TEST RESULT:",
      finalResult
    );


    // ========================================================
    // 10. LOG ALL RETURNED PROFILES
    // ========================================================

    if (
      result &&
      Array.isArray(result.profiles)
    ) {

      console.log(
        "[AISearchAdvancedFilter] RETURNED PROFILES COUNT:",
        result.profiles.length
      );


      result.profiles.forEach(
        function(profile, index) {

          console.log(
            "[AISearchAdvancedFilter] PROFILE " +
            (index + 1) +
            ":",
            {

              id:
                profile.id,

              name:
                profile.name,

              district:
                profile.district,

              education:
                profile.education,

              age:
                profile.age,

              job:
                profile.job

            }
          );

        }
      );

    }


    return finalResult;


  } catch (error) {

    console.error(
      "[AISearchAdvancedFilter] REAL SEARCH TEST ERROR:",
      error
    );


    return {

      success:
        false,

      module:
        AI_SEARCH_ADVANCED_FILTER_MODULE,

      version:
        AI_SEARCH_ADVANCED_FILTER_VERSION,

      test:
        "REAL_ADVANCED_SEARCH",

      error:
        error &&
        error.message
          ? error.message
          : String(error)

    };

  }

}