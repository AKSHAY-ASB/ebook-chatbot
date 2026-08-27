// ============================================================
// FILE : MatchingEngine.gs
// MODULE : Matching
//
// PURPOSE
// Compare:
//     Expected Criteria
//             VS
//     Candidate Criteria
//
// RESULT:
//     MATCH
//     NOT_MATCH
//
// HARD CRITERIA:
// - Education
// - Education Required
// - Profession Category
// - Employment Type
// - Age
// - Height
// - Income
// - District
// - Caste
// - Rashi
//
// SOFT PREFERENCES:
// - Educated
// - Understanding
// - Cultured
// - Loving
// - Career Supportive
// - Dream Supportive
//
// IMPORTANT
// - This file does NOT read Google Sheets directly.
// - This file does NOT handle LIKE / DISLIKE.
// - This file only evaluates matching.
// ============================================================



// ============================================================
// MAIN MATCHING FUNCTION
// ============================================================

function evaluateCandidateMatch(
  candidateProfile,
  expectationCriteria
) {

  // ----------------------------------------------------------
  // Validate candidate
  // ----------------------------------------------------------

  if (!candidateProfile) {

    return {

      result:
        "NOT_MATCH",

      matched:
        false,

      hardMatch:
        false,

      matchStatus:
        "INVALID",

      reason:
        "Candidate profile missing.",

      applicableCriteria:
        0,

      matchedCriteria:
        0,

      failedCriteria:
        [],

      checks:
        []

    };

  }


  // ----------------------------------------------------------
  // Validate expectation
  // ----------------------------------------------------------

  if (!expectationCriteria) {

    return {

      result:
        "NOT_MATCH",

      matched:
        false,

      hardMatch:
        false,

      matchStatus:
        "INVALID",

      reason:
        "Expectation criteria missing.",

      applicableCriteria:
        0,

      matchedCriteria:
        0,

      failedCriteria:
        [],

      checks:
        []

    };

  }


  // ----------------------------------------------------------
  // Normalize candidate
  // ----------------------------------------------------------

  const candidateResult =
    normalizeCandidateCriteria(
      candidateProfile
    );


  if (
    !candidateResult ||
    !candidateResult.success
  ) {

    return {

      result:
        "NOT_MATCH",

      matched:
        false,

      hardMatch:
        false,

      matchStatus:
        "INVALID",

      reason:
        "Unable to normalize candidate.",

      applicableCriteria:
        0,

      matchedCriteria:
        0,

      failedCriteria:
        [],

      checks:
        []

    };

  }


  const candidate =
    candidateResult.criteria;


  // ----------------------------------------------------------
  // Counters
  // ----------------------------------------------------------

  let applicableCriteria = 0;

  let matchedCriteria = 0;

  const failedCriteria = [];

  const checks = [];


  // ==========================================================
  // 1. EDUCATION CATEGORY
  // ==========================================================

  const educationCheck =
    evaluateEducationMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    educationCheck
  );

  if (
    educationCheck.applicable
  ) {

    applicableCriteria++;

    if (
      educationCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "education"
      );

    }

  }


  // ==========================================================
  // 2. EDUCATION REQUIRED
  // ==========================================================

  const educationRequiredCheck =
    evaluateEducationRequiredMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    educationRequiredCheck
  );

  if (
    educationRequiredCheck.applicable
  ) {

    applicableCriteria++;

    if (
      educationRequiredCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "educationRequired"
      );

    }

  }


  // ==========================================================
  // 3. PROFESSION CATEGORY
  // ==========================================================

  const professionCheck =
    evaluateProfessionMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    professionCheck
  );

  if (
    professionCheck.applicable
  ) {

    applicableCriteria++;

    if (
      professionCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "professionCategory"
      );

    }

  }


  // ==========================================================
  // 4. EMPLOYMENT TYPE
  // ==========================================================

  const employmentCheck =
    evaluateEmploymentMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    employmentCheck
  );

  if (
    employmentCheck.applicable
  ) {

    applicableCriteria++;

    if (
      employmentCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "employmentType"
      );

    }

  }


  // ==========================================================
  // 5. AGE
  // ==========================================================

  const ageCheck =
    evaluateAgeMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    ageCheck
  );

  if (
    ageCheck.applicable
  ) {

    applicableCriteria++;

    if (
      ageCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "age"
      );

    }

  }


  // ==========================================================
  // 6. HEIGHT
  // ==========================================================

  const heightCheck =
    evaluateHeightMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    heightCheck
  );

  if (
    heightCheck.applicable
  ) {

    applicableCriteria++;

    if (
      heightCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "height"
      );

    }

  }


  // ==========================================================
  // 7. INCOME
  // ==========================================================

  const incomeCheck =
    evaluateIncomeMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    incomeCheck
  );

  if (
    incomeCheck.applicable
  ) {

    applicableCriteria++;

    if (
      incomeCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "income"
      );

    }

  }


  // ==========================================================
  // 8. DISTRICT
  // ==========================================================

  const districtCheck =
    evaluateDistrictMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    districtCheck
  );

  if (
    districtCheck.applicable
  ) {

    applicableCriteria++;

    if (
      districtCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "district"
      );

    }

  }


  // ==========================================================
  // 9. CASTE
  // ==========================================================

  const casteCheck =
    evaluateCasteMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    casteCheck
  );

  if (
    casteCheck.applicable
  ) {

    applicableCriteria++;

    if (
      casteCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "caste"
      );

    }

  }


  // ==========================================================
  // 10. RASHI
  // ==========================================================

  const rashiCheck =
    evaluateRashiMatch(
      candidate,
      expectationCriteria
    );

  checks.push(
    rashiCheck
  );

  if (
    rashiCheck.applicable
  ) {

    applicableCriteria++;

    if (
      rashiCheck.matched
    ) {

      matchedCriteria++;

    }
    else {

      failedCriteria.push(
        "rashi"
      );

    }

  }


  // ==========================================================
  // HARD CRITERIA STATUS
  // ==========================================================

  const hasHardCriteria =
    expectationCriteria.hasHardCriteria === true ||
    applicableCriteria > 0;


  let hardMatch = false;

  let matchStatus = "";


  // ----------------------------------------------------------
  // HARD REJECT
  // ----------------------------------------------------------

  if (
    failedCriteria.length > 0
  ) {

    hardMatch =
      false;

    matchStatus =
      "HARD_REJECT";

  }


  // ----------------------------------------------------------
  // HARD MATCH
  // ----------------------------------------------------------

  else if (
    hasHardCriteria &&
    applicableCriteria > 0
  ) {

    hardMatch =
      true;

    matchStatus =
      "HARD_MATCH";

  }


  // ----------------------------------------------------------
  // NO HARD CRITERIA
  // ----------------------------------------------------------

  else {

    hardMatch =
      false;

    matchStatus =
      "NO_HARD_CRITERIA";

  }


      // ==========================================================
      // SOFT PREFERENCE SCORE
      //
      // IMPORTANT:
      //
      // Soft preferences are evaluated independently.
      //
      // We DO NOT require hardMatch === true.
      //
      // This is important for expectations such as:
      //
      // "honest, caring, understanding..."
      //
      // where there are no hard criteria.
      // ==========================================================

    let softPreferenceScore = {

      applicable:
        false,

      score:
        0,

      maxScore:
        0,

      percentage:
        0,

      softMatchPercentage:
        0,

      softDataCoverage:
        0,

      matchedPreferences:
        0,

      knownPreferences:
        0,

      unknownPreferences:
        0,

      conflictPreferences:
        0,

      totalRequiredPreferences:
        0,

      checks:
        []

    };


      if (
        expectationCriteria.hasSoftPreferences === true
      ) {

        softPreferenceScore =
          calculateSoftPreferenceScoreV2(
            candidateProfile,
            expectationCriteria
          );

      }



      // ==========================================================
      // EXPECTATION COLUMN COMPATIBILITY
      //
      // Viewer expectation
      //        VS
      // Candidate expectation column
      //
      // IMPORTANT:
      // This is separate from calculateSoftPreferenceScoreV2().
      //
      // calculateSoftPreferenceScoreV2()
      //     -> candidate profile evidence
      //
      // calculateExpectationCompatibility()
      //     -> candidate "अपेक्षा" column
      // ==========================================================

      const viewerExpectationText =
        expectationCriteria.raw || "";


      const candidateExpectationText =
        getMatchingExpectationText(
          candidateProfile
        );


      const expectationCompatibility =
        calculateExpectationCompatibility(
          viewerExpectationText,
          candidateExpectationText
        );


      console.log(
        "EXPECTATION COMPATIBILITY:",
        JSON.stringify(
          {
            candidateId:
              candidateProfile.id || "",

            candidateName:
              candidateProfile.name || "",

            candidateExpectation:
              candidateExpectationText,

            score:
              expectationCompatibility.score,

            maxScore:
              expectationCompatibility.maxScore,

            percentage:
              expectationCompatibility.percentage,

            matchedKeywords:
              expectationCompatibility.matchedKeywords

          },
          null,
          2
        )
      );


  // ==========================================================
  // FINAL DEBUG
  // ==========================================================

        console.log(
          "FINAL MATCH STATUS:",
          JSON.stringify(
            {

              hardMatch:
                hardMatch,

              matchStatus:
                matchStatus,

              applicableCriteria:
                applicableCriteria,

              matchedCriteria:
                matchedCriteria,

              failedCriteria:
                failedCriteria,

              softScore:
                softPreferenceScore.score,

              maxSoftScore:
                softPreferenceScore.maxScore,

              softMatchPercentage:
                softPreferenceScore.softMatchPercentage,

              softDataCoverage:
                softPreferenceScore.softDataCoverage

            },
            null,
            2
          )
        );


  // ==========================================================
  // FINAL RESULT
  // ==========================================================

          return {

        result:
          matchStatus === "HARD_REJECT"
            ? "REJECT"
            : "MATCH",

        matched:
          matchStatus !== "HARD_REJECT",

        hardMatch:
          hardMatch,

        matchStatus:
          matchStatus,

        applicableCriteria:
          applicableCriteria,

        matchedCriteria:
          matchedCriteria,

        failedCriteria:
          failedCriteria,

        checks:
          checks,


        // ========================================================
        // EXISTING SOFT PROFILE MATCH
        // ========================================================

        softPreferenceScore:
          softPreferenceScore,

        softScore:
          Number(
            softPreferenceScore.score || 0
          ),

        maxSoftScore:
          Number(
            softPreferenceScore.maxScore || 0
          ),

        softMatchPercentage:
          Number(
            softPreferenceScore.softMatchPercentage || 0
          ),

        softDataCoverage:
          Number(
            softPreferenceScore.softDataCoverage || 0
          ),


        // ========================================================
        // EXPECTATION COLUMN MATCH
        // ========================================================

        expectationCompatibility:
          expectationCompatibility,

        expectationCompatibilityScore:
          Number(
            expectationCompatibility.score || 0
          ),

        expectationCompatibilityMaxScore:
          Number(
            expectationCompatibility.maxScore || 0
          ),

        expectationCompatibilityPercentage:
          Number(
            expectationCompatibility.percentage || 0
          ),

        matchedExpectationKeywords:
          Array.isArray(
            expectationCompatibility.matchedKeywords
          )
            ? expectationCompatibility.matchedKeywords
            : []

      };

}

// ============================================================
// EDUCATION CATEGORY MATCH
// ============================================================

function evaluateEducationMatch(
  candidate,
  criteria
) {

  const expectedCategories =
    Array.isArray(
      criteria.educationCategories
    )
      ? criteria.educationCategories
      : [];


  if (
    expectedCategories.length === 0
  ) {

    return {

      criterion:
        "education",

      applicable:
        false,

      matched:
        true,

      matchedCategories:
        []

    };

  }


  const candidateCategories =
    candidate.education &&
    Array.isArray(
      candidate.education.categories
    )
      ? candidate.education.categories
      : [];


  const matchedCategories =
    expectedCategories.filter(
      function(category) {

        return candidateCategories.includes(
          category
        );

      }
    );


  return {

    criterion:
      "education",

    applicable:
      true,

    matched:
      matchedCategories.length > 0,

    expectedCategories:
      expectedCategories,

    candidateCategories:
      candidateCategories,

    matchedCategories:
      matchedCategories

  };

}



// ============================================================
// EDUCATION REQUIRED
// ============================================================

function evaluateEducationRequiredMatch(
  candidate,
  criteria
) {

  if (
    criteria.educationRequired !== true
  ) {

    return {

      criterion:
        "educationRequired",

      applicable:
        false,

      matched:
        true

    };

  }


  const hasEducation =
    candidate.education &&
    candidate.education.enabled === true;


  return {

    criterion:
      "educationRequired",

    applicable:
      true,

    matched:
      hasEducation,

    hasEducationData:
      hasEducation

  };

}



// ============================================================
// PROFESSION CATEGORY MATCH
// ============================================================

function evaluateProfessionMatch(
  candidate,
  criteria
) {

  const expectedCategories =
    Array.isArray(
      criteria.professionCategories
    )
      ? criteria.professionCategories
      : [];


  if (
    expectedCategories.length === 0
  ) {

    return {

      criterion:
        "professionCategory",

      applicable:
        false,

      matched:
        true,

      matchedCategories:
        []

    };

  }


  const candidateCategories =
    candidate.profession &&
    Array.isArray(
      candidate.profession.categories
    )
      ? candidate.profession.categories
      : [];


  const matchedCategories =
    expectedCategories.filter(
      function(category) {

        return candidateCategories.includes(
          category
        );

      }
    );


  return {

    criterion:
      "professionCategory",

    applicable:
      true,

    matched:
      matchedCategories.length > 0,

    expectedCategories:
      expectedCategories,

    candidateCategories:
      candidateCategories,

    matchedCategories:
      matchedCategories

  };

}



// ============================================================
// EMPLOYMENT TYPE MATCH
// ============================================================

function evaluateEmploymentMatch(
  candidate,
  criteria
) {

  const expectedTypes =
    Array.isArray(
      criteria.employmentTypes
    )
      ? criteria.employmentTypes
      : [];


  if (
    expectedTypes.length === 0 &&
    criteria.employmentRequired !== true
  ) {

    return {

      criterion:
        "employmentType",

      applicable:
        false,

      matched:
        true,

      employmentType:
        ""

    };

  }


  const candidateType =
    candidate.employmentType ||
    "NOT_SPECIFIED";


  // ----------------------------------------------------------
  // Specific employment type
  // ----------------------------------------------------------

  if (
    expectedTypes.length > 0
  ) {

    const matched =
      expectedTypes.includes(
        candidateType
      );


    return {

      criterion:
        "employmentType",

      applicable:
        true,

      matched:
        matched,

      expectedTypes:
        expectedTypes,

      employmentType:
        candidateType

    };

  }


  // ----------------------------------------------------------
  // Generic employment required
  // ----------------------------------------------------------

  const matched =
    candidateType !==
    "NOT_SPECIFIED";


  return {

    criterion:
      "employmentType",

    applicable:
      true,

    matched:
      matched,

    employmentType:
      candidateType

  };

}



// ============================================================
// AGE MATCH
// ============================================================

function evaluateAgeMatch(
  candidate,
  criteria
) {

  const expectedAge =
    criteria.age;


  if (
    !expectedAge ||
    expectedAge.enabled !== true
  ) {

    return {

      criterion:
        "age",

      applicable:
        false,

      matched:
        true

    };

  }


  const candidateAge =
    candidate.age;


  if (
    !candidateAge ||
    candidateAge.enabled !== true ||
    candidateAge.decimalAge === null
  ) {

    return {

      criterion:
        "age",

      applicable:
        true,

      matched:
        false,

      reason:
        "Candidate age unavailable."

    };

  }


  const age =
    candidateAge.decimalAge;


  let matched = true;


  if (
    expectedAge.min !== null &&
    age < expectedAge.min
  ) {

    matched = false;

  }


  if (
    expectedAge.max !== null &&
    age > expectedAge.max
  ) {

    matched = false;

  }


  return {

    criterion:
      "age",

    applicable:
      true,

    matched:
      matched,

    candidateAge:
      age,

    expectedMin:
      expectedAge.min,

    expectedMax:
      expectedAge.max

  };

}



// ============================================================
// HEIGHT MATCH
// ============================================================

function evaluateHeightMatch(
  candidate,
  criteria
) {

  const expectedHeight =
    criteria.height;


  if (
    !expectedHeight ||
    expectedHeight.enabled !== true
  ) {

    return {

      criterion:
        "height",

      applicable:
        false,

      matched:
        true

    };

  }


  const candidateHeight =
    candidate.height;


  if (
    !candidateHeight ||
    candidateHeight.enabled !== true ||
    candidateHeight.totalInches === null
  ) {

    return {

      criterion:
        "height",

      applicable:
        true,

      matched:
        false,

      reason:
        "Candidate height unavailable."

    };

  }


  const height =
    candidateHeight.totalInches;


  let matched = true;


  if (
    expectedHeight.minInches !== null &&
    height < expectedHeight.minInches
  ) {

    matched = false;

  }


  if (
    expectedHeight.maxInches !== null &&
    height > expectedHeight.maxInches
  ) {

    matched = false;

  }


  return {

    criterion:
      "height",

    applicable:
      true,

    matched:
      matched,

    candidateHeight:
      height,

    expectedMin:
      expectedHeight.minInches,

    expectedMax:
      expectedHeight.maxInches

  };

}



// ============================================================
// INCOME MATCH
//
// Candidate income can be:
//   min only
//   max only
//   exact
//   min + max
//
// For a range expectation:
//
// Candidate's income range must overlap expectation range.
//
// Example:
//
// Expected: 15k - 30k
// Candidate: <= 10k
//
// => NOT MATCH
//
// Expected: 15k - 30k
// Candidate: 20k - 25k
//
// => MATCH
// ============================================================

function evaluateIncomeMatch(
  candidate,
  criteria
) {

  const expectedIncome =
    criteria.income;


  if (
    !expectedIncome ||
    expectedIncome.enabled !== true
  ) {

    return {

      criterion:
        "income",

      applicable:
        false,

      matched:
        true

    };

  }


  const candidateIncome =
    candidate.income;


  if (
    !candidateIncome ||
    candidateIncome.enabled !== true
  ) {

    return {

      criterion:
        "income",

      applicable:
        true,

      matched:
        false,

      reason:
        "Candidate income unavailable."

    };

  }


  // ----------------------------------------------------------
  // Convert candidate into effective range
  // ----------------------------------------------------------

  const candidateMin =
    candidateIncome.min !== null
      ? candidateIncome.min
      : candidateIncome.value;


  const candidateMax =
    candidateIncome.max !== null
      ? candidateIncome.max
      : candidateIncome.value;


  // ----------------------------------------------------------
  // Expected range
  // ----------------------------------------------------------

  const expectedMin =
    expectedIncome.min !== null
      ? expectedIncome.min
      : 0;


  const expectedMax =
    expectedIncome.max !== null
      ? expectedIncome.max
      : Number.MAX_SAFE_INTEGER;


  // ----------------------------------------------------------
  // Candidate range overlap
  // ----------------------------------------------------------

  const matched =
    candidateMax >= expectedMin &&
    candidateMin <= expectedMax;


  return {

    criterion:
      "income",

    applicable:
      true,

    matched:
      matched,

    candidateMin:
      candidateMin,

    candidateMax:
      candidateMax,

    expectedMin:
      expectedMin,

    expectedMax:
      expectedMax

  };

}


// ============================================================
// NORMALIZE DISTRICT FOR MATCHING
// ============================================================

function normalizeMatchingDistrict(
  value
) {

  // ----------------------------------------------------------
  // Handle object
  // ----------------------------------------------------------

  if (
    value &&
    typeof value === "object"
  ) {

    value =
      value.normalized ||
      value.raw ||
      value.district ||
      value.name ||
      value.value ||
      "";

  }


  let text =
    String(
      value || ""
    )
    .trim()
    .toLowerCase();


  if (!text) {

    return "";

  }


  // ----------------------------------------------------------
  // Remove brackets containing English district name
  //
  // Example:
  // पुणे (Pune) -> पुणे
  // ----------------------------------------------------------

  text =
    text.replace(
      /\s*\([^)]*\)/g,
      ""
    );


  // ----------------------------------------------------------
  // Normalize separators
  // ----------------------------------------------------------

  text =
    text
      .replace(
        /[-–—,]/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();


  // ----------------------------------------------------------
  // Marathi + English district mapping
  // ----------------------------------------------------------

  const districtMap = {

    "pune":
      "पुणे",

    "पुणे":
      "पुणे",

    "mumbai":
      "मुंबई",

    "मुंबई":
      "मुंबई",

    "mumbai city":
      "मुंबई",

    "mumbai suburban":
      "मुंबई",

    "नाशिक":
      "नाशिक",

    "nashik":
      "नाशिक",

    "कोल्हापूर":
      "कोल्हापूर",

    "kolhapur":
      "कोल्हापूर",

    "सातारा":
      "सातारा",

    "satara":
      "सातारा",

    "सांगली":
      "सांगली",

    "sangli":
      "सांगली",

    "सोलापूर":
      "सोलापूर",

    "solapur":
      "सोलापूर",

    "रत्नागिरी":
      "रत्नागिरी",

    "ratnagiri":
      "रत्नागिरी",

    "सिंधुदुर्ग":
      "सिंधुदुर्ग",

    "sindhudurg":
      "सिंधुदुर्ग",

    "अहमदनगर":
      "अहमदनगर",

    "ahmednagar":
      "अहमदनगर",

    "छत्रपती संभाजीनगर":
      "छत्रपती संभाजीनगर",

    "aurangabad":
      "छत्रपती संभाजीनगर",

    "औरंगाबाद":
      "छत्रपती संभाजीनगर"

  };


  // ----------------------------------------------------------
  // Exact mapping
  // ----------------------------------------------------------

  if (
    districtMap[text]
  ) {

    return districtMap[text];

  }


  // ----------------------------------------------------------
  // Handle mixed Marathi + English
  //
  // Example:
  // "पुणे pune"
  // "pune पुणे"
  // ----------------------------------------------------------

  const districtKeys =
    Object.keys(
      districtMap
    );


  for (
    let i = 0;
    i < districtKeys.length;
    i++
  ) {

    const key =
      districtKeys[i];


    if (
      text.includes(key)
    ) {

      return districtMap[key];

    }

  }


  // ----------------------------------------------------------
  // Remove English text if Marathi district exists
  // ----------------------------------------------------------

  const marathiDistricts = [

    "पुणे",
    "मुंबई",
    "नाशिक",
    "कोल्हापूर",
    "सातारा",
    "सांगली",
    "सोलापूर",
    "रत्नागिरी",
    "सिंधुदुर्ग",
    "अहमदनगर",
    "छत्रपती संभाजीनगर"

  ];


  for (
    let i = 0;
    i < marathiDistricts.length;
    i++
  ) {

    if (
      text.includes(
        marathiDistricts[i]
      )
    ) {

      return marathiDistricts[i];

    }

  }


  // ----------------------------------------------------------
  // Fallback
  // ----------------------------------------------------------

  return text;

}


// ============================================================
// DISTRICT MATCH
// ============================================================


function evaluateDistrictMatch(
  candidate,
  criteria
) {

  const expectedDistricts =
    Array.isArray(criteria && criteria.districts)
      ? criteria.districts
      : [];


  // ==========================================================
  // 1. NO DISTRICT REQUIREMENT
  // ==========================================================

  if (
    expectedDistricts.length === 0
  ) {

    return {

      criterion:
        "district",

      applicable:
        false,

      matched:
        true

    };

  }


  // ==========================================================
  // 2. GET CANDIDATE DISTRICT
  // ==========================================================

  let candidateDistrictRaw = "";


  if (
    candidate &&
    candidate.district
  ) {

    // Candidate district is object
    if (
      typeof candidate.district === "object"
    ) {

      candidateDistrictRaw =
        candidate.district.normalized ||
        candidate.district.raw ||
        "";

    }

    // Candidate district is string
    else {

      candidateDistrictRaw =
        String(
          candidate.district
        );

    }

  }


  // ==========================================================
  // 3. NORMALIZE CANDIDATE DISTRICT
  // ==========================================================

  const candidateDistrict =
    normalizeMatchingDistrict(
      candidateDistrictRaw
    );


  // ==========================================================
  // 4. NORMALIZE EXPECTED DISTRICTS
  // ==========================================================

  const normalizedExpectedDistricts =
    expectedDistricts
      .map(
        function(district) {

          let districtValue = "";


          // Expected district can also be object
          if (
            district &&
            typeof district === "object"
          ) {

            districtValue =
              district.normalized ||
              district.raw ||
              "";

          }

          else {

            districtValue =
              String(
                district || ""
              );

          }


          return normalizeMatchingDistrict(
            districtValue
          );

        }
      )
      .filter(Boolean);


  // ==========================================================
  // 5. MATCH
  // ==========================================================

  const matched =
    candidateDistrict !== "" &&
    normalizedExpectedDistricts.includes(
      candidateDistrict
    );


  // ==========================================================
  // 6. DEBUG
  // ==========================================================

  console.log(
    "DISTRICT MATCH DEBUG:",
    JSON.stringify(
      {
        candidateDistrictRaw:
          candidateDistrictRaw,

        candidateDistrict:
          candidateDistrict,

        expectedDistricts:
          normalizedExpectedDistricts,

        matched:
          matched
      },
      null,
      2
    )
  );


  // ==========================================================
  // 7. RETURN
  // ==========================================================

  return {

    criterion:
      "district",

    applicable:
      true,

    matched:
      matched,

    expectedDistricts:
      normalizedExpectedDistricts,

    district:
      candidateDistrict

  };

}


// ============================================================
// CASTE MATCH
// ============================================================

function evaluateCasteMatch(
  candidate,
  criteria
) {

  const expectedCaste =
    criteria.caste;


  if (
    !expectedCaste ||
    expectedCaste.enabled !== true ||
    !Array.isArray(
      expectedCaste.values
    ) ||
    expectedCaste.values.length === 0
  ) {

    return {

      criterion:
        "caste",

      applicable:
        false,

      matched:
        true

    };

  }


  const candidateCaste =
    candidate.caste &&
    candidate.caste.normalized
      ? candidate.caste.normalized
      : "";


  if (!candidateCaste) {

    return {

      criterion:
        "caste",

      applicable:
        true,

      matched:
        false

    };

  }


  const matched =
    expectedCaste.values.some(
      function(value) {

        const normalized =
          normalizeMatchingText(
            value
          );


        return candidateCaste.includes(
          normalized
        );

      }
    );


  return {

    criterion:
      "caste",

    applicable:
      true,

    matched:
      matched,

    expectedValues:
      expectedCaste.values,

    candidateCaste:
      candidateCaste

  };

}



// ============================================================
// RASHI MATCH
// ============================================================

function evaluateRashiMatch(
  candidate,
  criteria
) {

  const expectedRashi =
    criteria.rashi;


  if (
    !expectedRashi ||
    expectedRashi.enabled !== true ||
    !Array.isArray(
      expectedRashi.values
    ) ||
    expectedRashi.values.length === 0
  ) {

    return {

      criterion:
        "rashi",

      applicable:
        false,

      matched:
        true

    };

  }


  const candidateRashi =
    candidate.rashi &&
    candidate.rashi.normalized
      ? candidate.rashi.normalized
      : "";


  if (!candidateRashi) {

    return {

      criterion:
        "rashi",

      applicable:
        true,

      matched:
        false

    };

  }


  const matched =
    expectedRashi.values.some(
      function(value) {

        return candidateRashi.includes(
          normalizeMatchingText(
            value
          )
        );

      }
    );


  return {

    criterion:
      "rashi",

    applicable:
      true,

    matched:
      matched,

    expectedValues:
      expectedRashi.values,

    candidateRashi:
      candidateRashi

  };

}



// ============================================================
// TEXT NORMALIZATION
// ============================================================

function normalizeMatchingText(
  value
) {

  return String(
    value || ""
  )
  .toLowerCase()
  .trim()
  .replace(
    /[.,\/\\()_\-]+/g,
    " "
  )
  .replace(
    /\s+/g,
    " "
  )
  .trim();

}



// ============================================================
// TEST — SINGLE CANDIDATE
//
// Uses:
//
// Candidate:
// ID003
//
// Expectation:
// Age 25-30
// Height 5'2 - 5'7
// Education required
//
// ============================================================

function testSingleCandidateMatch() {

  const candidateProfile = {

    id:
      "ID003",

    name:
      "डॉ. श्रेया विकास कोष्टी",

    type:
      "bride",

    district:
      "नाशिक",

    ageRaw:
      "28 years, 8 months, 11 days",

    heightRaw:
      "५ फूट २ इंच",

    incomeRaw:
      "मासिक उत्पन्न रु. १०,००० पेक्षा कमी",

    casteRaw:
      "हिंदू - देवांग कोष्टी",

    rashiRaw:
      "कर्क",

    education: {

      raw:
        "BHMS, MD (SCHOLAR)",

      categories: [

        "Medical & Healthcare"

      ],

      matchedKeywords: [

        "md",
        "bhms"

      ],

      hasEducationData:
        true

    },

    profession: {

      raw:
        "शिक्षण चालू",

      categories: [

        "Education & Teaching"

      ],

      matchedKeywords: [

        "शिक्षण"

      ],

      employmentType:
        "STUDENT",

      hasProfessionData:
        true

    }

  };


  // ----------------------------------------------------------
  // Expectation
  // ----------------------------------------------------------

  const expectationText =
    "वय 25 ते 30, उंची ५ फूट २ इंच ते ५ फूट ७ इंच, सुशिक्षित";


  const criteria =
    parseExpectationCriteria(
      expectationText
    );


  // ----------------------------------------------------------
  // Match
  // ----------------------------------------------------------

  const result =
    evaluateCandidateMatch(
      candidateProfile,
      criteria
    );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}



// ============================================================
// TEST — GOVERNMENT JOB
// ============================================================

function testGovernmentEmploymentMatch() {

  const candidateProfile = {

    id:
      "TEST001",

    name:
      "Government Candidate",

    type:
      "bride",

    district:
      "पुणे",

    ageRaw:
      "27 years",

    heightRaw:
      "५ फूट ४ इंच",

    incomeRaw:
      "मासिक उत्पन्न रु. ३०,०००",

    casteRaw:
      "हिंदू",

    rashiRaw:
      "कर्क",

    education: {

      raw:
        "BE Computer Engineering",

      categories: [

        "Engineering & Technology"

      ],

      matchedKeywords: [

        "be",
        "engineering"

      ],

      hasEducationData:
        true

    },

    profession: {

      raw:
        "सरकारी अभियंता",

      categories: [

        "Engineering & Technology",
        "Government / Public Sector"

      ],

      matchedKeywords: [

        "engineer"

      ],

      employmentType:
        "GOVERNMENT",

      hasProfessionData:
        true

    }

  };


  const expectation =
    "सुशिक्षित, सरकारी नोकरी";


  const criteria =
    parseExpectationCriteria(
      expectation
    );


  const result =
    evaluateCandidateMatch(
      candidateProfile,
      criteria
    );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}



// ============================================================
// TEST — NON MATCH GOVERNMENT
// ============================================================

function testNonGovernmentEmploymentMatch() {

  const candidateProfile = {

    id:
      "TEST002",

    name:
      "Private Candidate",

    type:
      "bride",

    district:
      "नाशिक",

    ageRaw:
      "27 years",

    heightRaw:
      "५ फूट ४ इंच",

    incomeRaw:
      "मासिक उत्पन्न रु. ३०,०००",

    casteRaw:
      "हिंदू",

    rashiRaw:
      "कर्क",

    education: {

      raw:
        "BE Computer Engineering",

      categories: [

        "Engineering & Technology"

      ],

      matchedKeywords: [

        "be",
        "engineering"

      ],

      hasEducationData:
        true

    },

    profession: {

      raw:
        "Software Engineer",

      categories: [

        "IT & Software"

      ],

      matchedKeywords: [

        "software",
        "engineer"

      ],

      employmentType:
        "PRIVATE",

      hasProfessionData:
        true

    }

  };


  const expectation =
    "सुशिक्षित, सरकारी नोकरी";


  const criteria =
    parseExpectationCriteria(
      expectation
    );


  const result =
    evaluateCandidateMatch(
      candidateProfile,
      criteria
    );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}







// ============================================================
// SOFT PREFERENCE SCORING
//
// Soft preferences NEVER reject a candidate.
// They only increase / decrease ranking score.
//
// Current supported preferences:
//
// educated
// understanding
// cultured
// loving
// careerSupportive
// dreamSupportive
// familyOriented
// goodNature
// ============================================================





// ============================================================
// BUILD CANDIDATE SOFT PREFERENCE TEXT
//
// NOTE:
// This is intentionally conservative.
// We don't treat "has profession" as proof of being
// understanding / cultured / loving etc.
// ============================================================

function buildCandidateSoftPreferenceText(candidateProfile) {

  candidateProfile =
    candidateProfile || {};

  const parts = [];

  // ----------------------------------------------------------
  // IMPORTANT:
  // Candidate's own "अपेक्षा" is NOT treated as proof
  // that the candidate possesses those qualities.
  //
  // We only use explicit self/profile information here.
  // Education is handled separately by isCandidateEducated().
  // ----------------------------------------------------------

  const selfDescriptionFields = [
    "about",
    "aboutMe",
    "selfDescription",
    "personality",
    "nature",
    "swabhav",
    "स्वतःबद्दल",
    "स्वभाव"
  ];

  selfDescriptionFields.forEach(function(field) {

    if (
      candidateProfile[field] !== undefined &&
      candidateProfile[field] !== null
    ) {

      const value =
        String(
          candidateProfile[field] || ""
        ).trim();

      if (value) {
        parts.push(value);
      }

    }

  });

  return parts
    .join(" ")
    .trim();

}


// ============================================================
// CHECK WHETHER CANDIDATE IS EDUCATED
// ============================================================

function isCandidateEducated(
  candidateProfile
) {

  if (
    !candidateProfile ||
    !candidateProfile.education
  ) {

    return false;

  }


  const education =
    candidateProfile.education;


  // ----------------------------------------------------------
  // 1. Explicit enabled flag
  // ----------------------------------------------------------

  if (
    education.enabled === true
  ) {

    return true;

  }


  // ----------------------------------------------------------
  // 2. Existing normalized education data
  // ----------------------------------------------------------

  if (
    education.hasEducationData === true
  ) {

    return true;

  }


  // ----------------------------------------------------------
  // 3. Qualifications
  // ----------------------------------------------------------

  if (
    Array.isArray(
      education.qualifications
    ) &&
    education.qualifications.length > 0
  ) {

    return true;

  }


  // ----------------------------------------------------------
  // 4. Raw education
  // ----------------------------------------------------------

  if (
    education.raw &&
    String(
      education.raw
    ).trim() !== ""
  ) {

    return true;

  }


  return false;

}



// ============================================================
// KEYWORD CHECK
// ============================================================

function containsSoftPreferenceKeyword(
  text,
  keywords
) {

  if (
    !text ||
    !Array.isArray(
      keywords
    )
  ) {

    return false;

  }


  const normalizedText =
    normalizeMatchingText(
      text
    );


  return keywords.some(
    function(keyword) {

      const normalizedKeyword =
        normalizeMatchingText(
          keyword
        );


      if (
        !normalizedKeyword
      ) {

        return false;

      }


      return normalizedText.includes(
        normalizedKeyword
      );

    }
  );

}



// ============================================================
// EXPECTATION COMPATIBILITY V2
//
// Compares:
// Viewer "अपेक्षा"
//        VS
// Candidate "अपेक्षा"
//
// No new Google Sheet column required.
//
// Score:
// 1 matched preference = 10 points
//
// Example:
// Viewer has 8 preferences
// Candidate matches 4
//
// score = 40
// maxScore = 80
// percentage = 50
// ============================================================

function calculateExpectationCompatibility(
  viewerExpectation,
  candidateExpectation
) {


    // ==========================================================
    // GENERIC EXPECTATION CHECK
    // ==========================================================

    const candidateHasMeaningfulExpectation =
      hasMeaningfulMatchingExpectation(
        candidateExpectation
      );


    if (
      !candidateHasMeaningfulExpectation
    ) {

      return {

        applicable:
          false,

        meaningful:
          false,

        score:
          0,

        maxScore:
          0,

        percentage:
          0,

        matchedKeywords:
          [],

        viewerPreferences:
          [],

        candidatePreferences:
          [],

        unmatchedPreferences:
          [],

        reason:
          "Candidate expectation is generic or contains no supported matching preference."

      };

    }


  const viewerText =
    normalizeExpectationCompatibilityText(
      viewerExpectation
    );


  const candidateText =
    normalizeExpectationCompatibilityText(
      candidateExpectation
    );


  // ==========================================================
  // NO EXPECTATION DATA
  // ==========================================================

  if (
    !viewerText ||
    !candidateText
  ) {

    return {

      applicable:
        false,

      score:
        0,

      maxScore:
        0,

      percentage:
        0,

      matchedKeywords:
        [],

      viewerPreferences:
        [],

      candidatePreferences:
        [],

      unmatchedPreferences:
        [],

      reason:
        "Viewer or candidate expectation is unavailable."

    };

  }


  // ==========================================================
  // EXPECTATION SYNONYM MAP
  //
  // IMPORTANT:
  // Keep all Marathi + English variations here.
  // ==========================================================

  const preferenceKeywords = {

    // --------------------------------------------------------
    // EDUCATED
    // --------------------------------------------------------

    educated: [

      "educated",
      "well educated",
      "well-educated",
      "highly educated",
      "qualified",
      "well qualified",
      "शिक्षित",
      "सुशिक्षित",
      "उच्चशिक्षित",
      "उच्च शिक्षित",
      "शिक्षण घेतलेली",
      "शिक्षण घेतलेला",
      "पदवीधर"

    ],


    // --------------------------------------------------------
    // UNDERSTANDING
    // --------------------------------------------------------

    understanding: [

      "understanding",
      "understand",
      "mature",
      "mature minded",
      "emotionally mature",
      "empathetic",
      "समजूतदार",
      "समंजस",
      "समजून घेणारी",
      "समजून घेणारा",
      "समजून घेणारे",
      "समजणारी",
      "समजणारा",
      "मनमिळावू"

    ],


    // --------------------------------------------------------
    // CULTURED
    // --------------------------------------------------------

    cultured: [

      "cultured",
      "well mannered",
      "good manners",
      "traditional values",
      "good values",
      "संस्कारी",
      "सुसंस्कृत",
      "संस्कृती जपणारी",
      "संस्कृती जपणारा",
      "चांगले संस्कार",
      "चांगले संस्कार असलेली",
      "चांगले संस्कार असलेला"

    ],


    // --------------------------------------------------------
    // LOVING / CARING
    // --------------------------------------------------------

    loving: [

      "loving",
      "love",
      "lovable",
      "affectionate",
      "caring",
      "care",
      "kind",
      "kind hearted",
      "kind-hearted",
      "प्रेमळ",
      "प्रेमळ स्वभाव",
      "प्रेम करणारी",
      "प्रेम करणारा",
      "काळजी घेणारी",
      "काळजी घेणारा",
      "काळजीवाहू",
      "आपुलकी",
      "जिव्हाळ्याची",
      "जिव्हाळ्याचा",
      "दयाळू"

    ],


    // --------------------------------------------------------
    // RESPECTFUL
    // --------------------------------------------------------

    respectful: [

      "respectful",
      "respect",
      "respects",
      "mutual respect",
      "respect elders",
      "respects elders",
      "आदर",
      "आदर करणारी",
      "आदर करणारा",
      "सन्मान",
      "सन्मान करणारी",
      "सन्मान करणारा",
      "वडिलधाऱ्यांचा आदर",
      "मोठ्यांचा आदर"

    ],


    // --------------------------------------------------------
    // HONEST / LOYAL
    // --------------------------------------------------------

    honest: [

      "honest",
      "honesty",
      "truthful",
      "trustworthy",
      "loyal",
      "loyalty",
      "faithful",
      "प्रामाणिक",
      "प्रामाणिकपणा",
      "विश्वासू",
      "विश्वासू मैत्रीण",
      "विश्वासू जीवनसाथी",
      "निष्ठावान",
      "निष्ठा"

    ],


    // --------------------------------------------------------
    // RESPONSIBLE
    // --------------------------------------------------------

    responsible: [

      "responsible",
      "responsibility",
      "reliable",
      "dependable",
      "जबाबदार",
      "जबाबदारी",
      "जबाबदारीची जाणीव",
      "विश्वसनीय",
      "कर्तव्यदक्ष"

    ],


    // --------------------------------------------------------
    // FAMILY ORIENTED
    // --------------------------------------------------------

    familyOriented: [

      "family oriented",
      "family-oriented",
      "family values",
      "values family",
      "family person",
      "family loving",
      "respect family",
      "कुटुंबवत्सल",
      "कुटुंबप्रिय",
      "कुटुंबाला महत्त्व",
      "कुटुंबाला महत्व",
      "कुटुंबाला मान देणारी",
      "कुटुंबाला मान देणारा",
      "कुटुंबाची काळजी",
      "कुटुंबाशी जुळवून घेणारी",
      "कुटुंबाशी जुळवून घेणारा",
      "कुटुंबकेंद्री"

    ],


    // --------------------------------------------------------
    // DREAM SUPPORTIVE
    // --------------------------------------------------------

    dreamSupportive: [

      "supports my dreams",
      "support my dreams",
      "support dreams",
      "dream supportive",
      "dream-supportive",
      "supportive of dreams",
      "respect my dreams",
      "respects my dreams",
      "स्वप्नांचा आदर",
      "स्वप्नांचा सन्मान",
      "स्वप्नांना साथ",
      "स्वप्नांना पाठिंबा",
      "स्वप्नांना समर्थन",
      "ध्येयांना साथ",
      "ध्येयांना पाठिंबा",
      "ध्येयांचा आदर",
      "स्वप्नांचा आणि ध्येयांचा आदर"

    ],


    // --------------------------------------------------------
    // CAREER SUPPORTIVE
    // --------------------------------------------------------

    careerSupportive: [

      "career supportive",
      "career-supportive",
      "support my career",
      "supports my career",
      "supportive of career",
      "career support",
      "respect my career",
      "respects my career",
      "करिअरचा आदर",
      "करिअरला साथ",
      "करिअरला पाठिंबा",
      "करिअरला समर्थन",
      "करिअरला प्रोत्साहन",
      "नोकरीला साथ",
      "नोकरीला पाठिंबा",
      "व्यवसायाला साथ",
      "व्यवसायाला पाठिंबा"

    ],


    // --------------------------------------------------------
    // COMMUNICATION
    // --------------------------------------------------------

    communication: [

      "communication",
      "good communication",
      "open communication",
      "clear communication",
      "communicative",
      "good communicator",
      "संवाद",
      "चांगला संवाद",
      "मोकळा संवाद",
      "स्पष्ट संवाद",
      "संवाद साधणारी",
      "संवाद साधणारा",
      "मनमोकळा संवाद",
      "मोकळेपणाने बोलणारी",
      "मोकळेपणाने बोलणारा"

    ]

  };


  // ==========================================================
  // FIND PREFERENCES IN TEXT
  // ==========================================================

  function detectPreferences(
    text
  ) {

    const detected = [];


    Object.keys(
      preferenceKeywords
    ).forEach(
      function(preference) {

        const keywords =
          preferenceKeywords[
            preference
          ];


        const found =
          keywords.some(
            function(keyword) {

              return text.indexOf(
                keyword
              ) !== -1;

            }
          );


        if (
          found
        ) {

          detected.push(
            preference
          );

        }

      }
    );


    return detected;

  }


  // ==========================================================
  // DETECT VIEWER PREFERENCES
  // ==========================================================

  const viewerPreferences =
    detectPreferences(
      viewerText
    );


  // ==========================================================
  // DETECT CANDIDATE PREFERENCES
  // ==========================================================

  const candidatePreferences =
    detectPreferences(
      candidateText
    );


  // ==========================================================
  // NO VIEWER PREFERENCES
  // ==========================================================

  if (
    viewerPreferences.length === 0
  ) {

    return {

      applicable:
        false,

      score:
        0,

      maxScore:
        0,

      percentage:
        0,

      matchedKeywords:
        [],

      viewerPreferences:
        [],

      candidatePreferences:
        candidatePreferences,

      unmatchedPreferences:
        [],

      reason:
        "No supported expectation preferences found in viewer expectation."

    };

  }


  // ==========================================================
  // MATCH
  // ==========================================================

  const matchedKeywords =
    viewerPreferences.filter(
      function(preference) {

        return candidatePreferences.includes(
          preference
        );

      }
    );


  // ==========================================================
  // UNMATCHED
  // ==========================================================

  const unmatchedPreferences =
    viewerPreferences.filter(
      function(preference) {

        return !candidatePreferences.includes(
          preference
        );

      }
    );


  // ==========================================================
  // SCORE
  //
  // 10 points per matched preference.
  // ==========================================================

  const score =
    matchedKeywords.length * 10;


  const maxScore =
    viewerPreferences.length * 10;


  const percentage =
    maxScore > 0
      ? (
          score /
          maxScore
        ) * 100
      : 0;


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    applicable:
      true,

    score:
      score,

    maxScore:
      maxScore,

    percentage:
      Number(
        percentage.toFixed(2)
      ),

    matchedKeywords:
      matchedKeywords,

    viewerPreferences:
      viewerPreferences,

    candidatePreferences:
      candidatePreferences,

    unmatchedPreferences:
      unmatchedPreferences,

    reason:
      matchedKeywords.length > 0
        ? "Common expectation preferences found."
        : "No common expectation preferences found."

  };

}




// ============================================================
// NORMALIZE EXPECTATION TEXT
// ============================================================

function normalizeExpectationCompatibilityText(
  value
) {

  let text =
    String(
      value || ""
    )
    .toLowerCase()
    .trim();


  if (
    typeof convertMarathiDigits ===
    "function"
  ) {

    try {

      text =
        convertMarathiDigits(
          text
        );

    }

    catch (error) {

      // Keep original normalized text.

    }

  }


  // ----------------------------------------------------------
  // Normalize punctuation
  // ----------------------------------------------------------

  text =
    text
      .replace(/[.,!?;:()[\]{}"'“”‘’]/g, " ")
      .replace(/\s+/g, " ")
      .trim();


  return text;

}



// ============================================================
// SOFT PREFERENCE SCORING V2
//
// MATCH    = preference is supported by candidate data
// UNKNOWN  = insufficient candidate data
// CONFLICT = candidate data explicitly conflicts
//
// Soft preferences NEVER reject a candidate.
// They are used only for ranking.
// ============================================================


function calculateSoftPreferenceScoreV2(
  candidateProfile,
  expectationCriteria
) {

  candidateProfile =
    candidateProfile || {};

  expectationCriteria =
    expectationCriteria || {};

  const preferences =
    expectationCriteria.softPreferences || {};


  const preferenceKeys = [

    "educated",
    "understanding",
    "cultured",
    "loving",
    "respectful",
    "honest",
    "responsible",
    "familyOriented",
    "dreamSupportive",
    "careerSupportive",
    "communication"

  ];


  let score = 0;

  let maxScore = 0;

  let matchedPreferences = 0;

  let knownPreferences = 0;

  let unknownPreferences = 0;

  let conflictPreferences = 0;


  const checks = [];


  preferenceKeys.forEach(
    function(preference) {

      if (
        preferences[preference] !== true
      ) {

        return;

      }


      maxScore += 10;


      let result = null;

      let status = "UNKNOWN";


      try {

        result =
          evaluateSoftPreference(
            preference,
            candidateProfile
          );


        status =
          result &&
          result.status
            ? String(
                result.status
              )
              .trim()
              .toUpperCase()
            : "UNKNOWN";

      }

      catch (error) {

        status =
          "UNKNOWN";

        result = {

          status:
            "UNKNOWN",

          matched:
            false,

          reason:
            "Soft preference evaluation failed: " +
            (
              error &&
              error.message
                ? error.message
                : String(error)
            )

        };

      }


      // ========================================================
      // MATCH
      // ========================================================

      if (
        status === "MATCH"
      ) {

        score += 10;

        matchedPreferences++;

        knownPreferences++;

      }


      // ========================================================
      // CONFLICT / MISMATCH
      // ========================================================

      else if (
        status === "CONFLICT" ||
        status === "MISMATCH"
      ) {

        conflictPreferences++;

        knownPreferences++;

      }


      // ========================================================
      // UNKNOWN
      // ========================================================

      else {

        unknownPreferences++;

      }


      checks.push({

        preference:
          preference,

        required:
          true,

        status:
          status,

        matched:
          status === "MATCH",

        known:
          status === "MATCH" ||
          status === "CONFLICT" ||
          status === "MISMATCH",

        score:
          status === "MATCH"
            ? 10
            : 0,

        maxScore:
          10,

        keyword:
          result &&
          result.keyword
            ? result.keyword
            : "",

        reason:
          result &&
          result.reason
            ? result.reason
            : ""

      });

    }
  );


  const totalRequiredPreferences =
    maxScore / 10;


  // ==========================================================
  // DATA COVERAGE
  // ==========================================================

  const softDataCoverage =
    totalRequiredPreferences > 0
      ? (
          knownPreferences /
          totalRequiredPreferences
        ) * 100
      : 0;


  // ==========================================================
  // VERIFIED COMPATIBILITY
  //
  // MATCH / (MATCH + CONFLICT)
  //
  // UNKNOWN excluded.
  // ==========================================================

  const verifiedCompatibility =
    knownPreferences > 0
      ? (
          matchedPreferences /
          knownPreferences
        ) * 100
      : 0;


  // ==========================================================
  // RAW SCORE
  // ==========================================================

  const rawPreferencePercentage =
    maxScore > 0
      ? (
          score /
          maxScore
        ) * 100
      : 0;


  return {

    applicable:
      maxScore > 0,

    score:
      score,

    maxScore:
      maxScore,

    percentage:
      Number(
        rawPreferencePercentage.toFixed(2)
      ),

    // IMPORTANT:
    // This is verified compatibility,
    // NOT raw score percentage.
    softMatchPercentage:
      Number(
        verifiedCompatibility.toFixed(2)
      ),

    verifiedCompatibility:
      Number(
        verifiedCompatibility.toFixed(2)
      ),

    softDataCoverage:
      Number(
        softDataCoverage.toFixed(2)
      ),

    matchedPreferences:
      matchedPreferences,

    knownPreferences:
      knownPreferences,

    unknownPreferences:
      unknownPreferences,

    conflictPreferences:
      conflictPreferences,

    totalRequiredPreferences:
      totalRequiredPreferences,

    checks:
      checks

  };

}


// ============================================================
// EVALUATE ONE SOFT PREFERENCE
// ============================================================

function evaluateSoftPreference(
  preference,
  candidateProfile
) {

  candidateProfile =
    candidateProfile || {};


  const candidateText =
    buildCandidateSoftPreferenceText(
      candidateProfile
    );


  // ==========================================================
  // EDUCATED
  // ==========================================================

  if (
    preference === "educated"
  ) {

    const educated =
      isCandidateEducated(
        candidateProfile
      );


    if (educated) {

      return {

        status:
          "MATCH",

        matched:
          true,

        keyword:
          "education",

        reason:
          "Candidate has education data."

      };

    }


    return {

      status:
        "UNKNOWN",

      matched:
        false,

      reason:
        "No education data available."

    };

  }


  // ==========================================================
  // NO TEXTUAL EVIDENCE
  // ==========================================================

  if (!candidateText) {

    return {

      status:
        "UNKNOWN",

      matched:
        false,

      reason:
        "No explicit self/profile evidence available."

    };

  }


  // ==========================================================
  // POSITIVE KEYWORDS
  // ==========================================================

  const preferenceKeywords = {

    understanding: [

      "समजूतदार",
      "समंजस",
      "समजून घेणारा",
      "समजून घेणारी",
      "understanding",
      "mature",
      "empathetic"

    ],


    cultured: [

      "संस्कारी",
      "सुसंस्कृत",
      "संस्कृती",
      "cultured",
      "well mannered",
      "traditional values"

    ],


    loving: [

      "प्रेमळ",
      "आपुलकी",
      "जिव्हाळा",
      "काळजी घेणारा",
      "काळजी घेणारी",
      "caring",
      "loving",
      "affectionate"

    ],


    respectful: [

      "आदर",
      "आदर करणारा",
      "आदर करणारी",
      "respectful",
      "respect",
      "mutual respect"

    ],


    honest: [

      "प्रामाणिक",
      "प्रामाणिकपणा",
      "honest",
      "honesty",
      "truthful",
      "trustworthy"

    ],


    responsible: [

      "जबाबदार",
      "जबाबदारी",
      "responsible",
      "responsibility",
      "reliable"

    ],


    familyOriented: [

      "कुटुंबवत्सल",
      "कुटुंबाला महत्त्व",
      "कुटुंबाला महत्व",
      "कुटुंबप्रिय",
      "family oriented",
      "family-oriented",
      "values family",
      "family values"

    ],


    dreamSupportive: [

      "स्वप्नांचा आदर",
      "स्वप्नांना पाठिंबा",
      "स्वप्नांना साथ",
      "स्वप्नांना समर्थन",
      "supports my dreams",
      "support my dreams",
      "supportive of dreams",
      "dream supportive"

    ],


    careerSupportive: [

      "करिअरचा आदर",
      "करिअरला पाठिंबा",
      "करिअरला साथ",
      "करिअरला समर्थन",
      "career supportive",
      "career-supportive",
      "supports career",
      "support my career"

    ],


    communication: [

      "संवाद",
      "मोकळा संवाद",
      "स्पष्ट संवाद",
      "communication",
      "good communication",
      "open communication"

    ]

  };


  // ==========================================================
  // NEGATIVE / CONFLICT KEYWORDS
  // ==========================================================

  const conflictKeywords = {

    understanding: [

      "समजून घेत नाही",
      "समजूतदार नाही",
      "समंजस नाही",
      "समजूतदारपणा नाही",
      "इतरांच्या भावना समजून घेत नाही",
      "understanding नाही",
      "not understanding",
      "not empathetic",
      "not mature",
      "does not understand",
      "don't understand",
      "do not understand"

    ],


    cultured: [

      "संस्कारी नाही",
      "सुसंस्कृत नाही",
      "संस्कारीपणा नाही",
      "संस्कृती नाही",
      "not cultured",
      "not well mannered"

    ],


    loving: [

      "प्रेमळ नाही",
      "आपुलकी नाही",
      "जिव्हाळा नाही",
      "काळजी घेत नाही",
      "काळजी घेणारा नाही",
      "काळजी घेणारी नाही",
      "not loving",
      "not caring",
      "does not care",
      "don't care",
      "do not care"

    ],


    respectful: [

      "आदर करत नाही",
      "आदर देत नाही",
      "आदर नाही",
      "आदर करणारा नाही",
      "आदर करणारी नाही",
      "not respectful",
      "does not respect",
      "don't respect",
      "do not respect"

    ],


    honest: [

      "प्रामाणिक नाही",
      "प्रामाणिकपणा नाही",
      "खोटे बोलतो",
      "खोटे बोलते",
      "not honest",
      "dishonest",
      "not trustworthy"

    ],


    responsible: [

      "जबाबदार नाही",
      "जबाबदारी घेत नाही",
      "जबाबदारीची जाणीव नाही",
      "not responsible",
      "irresponsible",
      "not reliable"

    ],


    familyOriented: [

      "कुटुंबाला महत्त्व देत नाही",
      "कुटुंबाला महत्व देत नाही",
      "कुटुंबप्रिय नाही",
      "कुटुंबवत्सल नाही",
      "not family oriented",
      "does not value family",
      "don't value family"

    ],


    dreamSupportive: [

      "स्वप्नांना साथ देत नाही",
      "स्वप्नांना पाठिंबा देत नाही",
      "स्वप्नांना समर्थन देत नाही",
      "स्वप्नांचा आदर करत नाही",
      "स्वप्नांना साथ नाही",
      "स्वप्नांना पाठिंबा नाही",
      "not supportive of dreams",
      "does not support dreams",
      "does not support my dreams",
      "don't support my dreams",
      "do not support my dreams"

    ],


    careerSupportive: [

      "करिअरला पाठिंबा देत नाही",
      "करिअरला साथ देत नाही",
      "करिअरला समर्थन देत नाही",
      "करिअरचा आदर करत नाही",
      "करिअरला पाठिंबा नाही",
      "करिअरला साथ नाही",
      "not supportive of career",
      "does not support career",
      "does not support my career",
      "don't support my career",
      "do not support my career"

    ],


    communication: [

      "संवाद साधत नाही",
      "संवाद करत नाही",
      "मोकळा संवाद नाही",
      "स्पष्ट संवाद नाही",
      "communication नाही",
      "not good communication",
      "does not communicate",
      "don't communicate"

    ]

  };


  const keywords =
    preferenceKeywords[
      preference
    ] || [];


  const negativeKeywords =
    conflictKeywords[
      preference
    ] || [];


  // ==========================================================
  // NO RULE
  // ==========================================================

  if (
    keywords.length === 0 &&
    negativeKeywords.length === 0
  ) {

    return {

      status:
        "UNKNOWN",

      matched:
        false,

      reason:
        "No matching rule configured."

    };

  }


  // ==========================================================
  // 1. CHECK CONFLICT FIRST
  //
  // Important:
  // Negative evidence must be checked BEFORE positive evidence.
  //
  // Example:
  // "मी इतरांचा आदर करत नाही"
  //
  // contains "आदर"
  // but should be CONFLICT, not MATCH.
  // ==========================================================

  const matchedConflictKeyword =
    negativeKeywords.find(
      function(keyword) {

        return expectationKeywordExists(
          candidateText,
          keyword
        );

      }
    );


  if (
    matchedConflictKeyword
  ) {

    return {

      status:
        "CONFLICT",

      matched:
        false,

      known:
        true,

      keyword:
        matchedConflictKeyword,

      reason:
        "Explicit negative evidence found for this preference."

    };

  }


  // ==========================================================
  // 2. CHECK POSITIVE EVIDENCE
  // ==========================================================

  const matchedKeyword =
    keywords.find(
      function(keyword) {

        return expectationKeywordExists(
          candidateText,
          keyword
        );

      }
    );


  if (
    matchedKeyword
  ) {

    return {

      status:
        "MATCH",

      matched:
        true,

      known:
        true,

      keyword:
        matchedKeyword,

      reason:
        "Explicit positive evidence found."

    };

  }


  // ==========================================================
  // 3. UNKNOWN
  //
  // Absence of evidence is NOT conflict.
  // ==========================================================

  return {

    status:
      "UNKNOWN",

    matched:
      false,

    known:
      false,

    keyword:
      "",

    reason:
      "No explicit evidence found."

  };

}


// ============================================================
// KEYWORD PREFERENCE
// ============================================================

function evaluateKeywordPreference(
  preference,
  candidateText,
  keywords
) {

  if (
    !candidateText
  ) {

    return {

      preference:
        preference,

      status:
        "UNKNOWN",

      reason:
        "Candidate text unavailable."

    };

  }


  const matched =
    containsSoftPreferenceKeyword(
      candidateText,
      keywords
    );


  if (matched) {

    return {

      preference:
        preference,

      status:
        "MATCH",

      matched:
        true,

      reason:
        "Supporting keyword found."

    };

  }


  return {

    preference:
      preference,

    status:
      "UNKNOWN",

    matched:
      false,

    reason:
      "No reliable supporting information found."

  };

}



// ============================================================
// GET PROFILE EXPECTATION TEXT
//
// Supports both:
//   profile.expectation.raw
//   profile.expectationRaw
//
// This keeps the matching engine compatible with the
// normalized profile produced by MatchingController.
// ============================================================

function getMatchingExpectationText(
  profile
) {

  if (!profile) {
    return "";
  }

  // ----------------------------------------------------------
  // Preferred normalized expectation
  // ----------------------------------------------------------

  if (
    profile.expectation &&
    profile.expectation.raw
  ) {

    return String(
      profile.expectation.raw
    ).trim();

  }


  // ----------------------------------------------------------
  // Controller raw expectation
  // ----------------------------------------------------------

  if (
    profile.expectationRaw
  ) {

    return String(
      profile.expectationRaw
    ).trim();

  }


  return "";

}


function calculateMutualMatch(
  viewerProfile,
  candidateProfile
) {

    const viewerExpectationText =
      getMatchingExpectationText(
        viewerProfile
      );


    const candidateExpectationText =
      getMatchingExpectationText(
        candidateProfile
      );


    // const viewerExpectation =
    //   parseExpectationCriteria(
    //     viewerExpectationText
    //   );


    // const candidateExpectation =
    //   parseExpectationCriteria(
    //     candidateExpectationText
    //   );

    // ==========================================================
    // EXPECTATION COMPATIBILITY
    // ==========================================================

    const viewerExpectation =
      expectationCriteria.raw || "";


    const candidateExpectation =
      candidateProfile.expectationRaw || "";


    const expectationCompatibility =
      calculateExpectationCompatibility(
        viewerExpectation,
        candidateExpectation
      );


    console.log(
      "EXPECTATION COMPATIBILITY:",
      JSON.stringify(
        expectationCompatibility,
        null,
        2
      )
    );


  // ----------------------------------------------------------
  // VIEWER → CANDIDATE
  // ----------------------------------------------------------

  const viewerToCandidate =
    evaluateCandidateAgainstExpectation(
      candidateProfile,
      viewerExpectation
    );


  // ----------------------------------------------------------
  // CANDIDATE → VIEWER
  // ----------------------------------------------------------

  const candidateToViewer =
    evaluateCandidateAgainstExpectation(
      viewerProfile,
      candidateExpectation
    );


  // ----------------------------------------------------------
  // MUTUAL
  // ----------------------------------------------------------

  const mutualMatch =
    viewerToCandidate.hardMatch === true &&
    candidateToViewer.hardMatch === true;


  return {

    mutualMatch:

      mutualMatch,

    viewerToCandidate:
      viewerToCandidate,

    candidateToViewer:
      candidateToViewer

  };

}



function evaluateCandidateAgainstExpectation(
  candidate,
  criteria
) {

  const hardResult =
    evaluateHardCriteria(
      candidate,
      criteria
    );


  if (!hardResult.matched) {

    return {

      hardMatch: false,

      softScore: 0,

      maxSoftScore: 0,

      softMatchPercentage: 0,

      softDataCoverage: 0,

      matchedPreferences: 0,

      knownPreferences: 0,

      failedCriteria:
        hardResult.failedCriteria || []

    };

  }


  const softResult =
    calculateSoftPreferenceScore(
      candidate,
      criteria
    );


  return {

    hardMatch: true,

    softScore:
      softResult.score,

    maxSoftScore:
      softResult.maxScore,

    softMatchPercentage:
      softResult.percentage,

    softDataCoverage:
      softResult.coverage,

    matchedPreferences:
      softResult.matchedPreferences,

    knownPreferences:
      softResult.knownPreferences,

    failedCriteria: []

  };

}




// ============================================================
// GENERIC EXPECTATION DETECTOR
//
// These values do NOT contain meaningful matching evidence.
// ============================================================

function isGenericMatchingExpectation(
  expectationText
) {

  const raw =
    String(
      expectationText || ""
    )
    .trim()
    .toLowerCase();


  if (!raw) {

    return true;

  }


  const normalized =
    normalizeExpectationCompatibilityText(
      raw
    );


  // ----------------------------------------------------------
  // Exact generic values
  // ----------------------------------------------------------

  const genericExactValues = [

    "सर्व साधारण",
    "सर्वसाधारण",
    "सामान्य",
    "अनुरूप",
    "नाही",
    "none",
    "no",
    "nothing",
    "normal",
    "general",
    "any",
    "anything",
    "not specified",
    "not applicable",
    "na",
    "n a",
    "nil",
    "-"

  ];


  if (
    genericExactValues.indexOf(
      normalized
    ) !== -1
  ) {

    return true;

  }


  // ----------------------------------------------------------
  // Generic phrases
  // ----------------------------------------------------------

  const genericPhrases = [

    "सर्व साधारण अपेक्षा",
    "सर्वसाधारण अपेक्षा",
    "विशेष अपेक्षा नाही",
    "विशेष अशी अपेक्षा नाही",
    "काही विशेष अपेक्षा नाही",
    "काहीही चालेल",
    "काही हरकत नाही",
    "कोणतीही विशेष अपेक्षा नाही",
    "सामान्य अपेक्षा",
    "अनुरूप असावी",
    "अनुरूप असावा",
    "suitable",
    "suitable partner",
    "no special expectation",
    "no specific expectation",
    "no particular expectation",
    "nothing specific",
    "any suitable partner",
    "anyone suitable"

  ];


  for (
    let i = 0;
    i < genericPhrases.length;
    i++
  ) {

    if (
      normalized.indexOf(
        genericPhrases[i]
      ) !== -1
    ) {

      return true;

    }

  }


  return false;

}




// ============================================================
// MEANINGFUL EXPECTATION CHECK
// ============================================================

function hasMeaningfulMatchingExpectation(
  expectationText
) {

  const raw =
    String(
      expectationText || ""
    ).trim();


  if (!raw) {

    return false;

  }


  if (
    isGenericMatchingExpectation(
      raw
    )
  ) {

    return false;

  }


  // ----------------------------------------------------------
  // If expectation compatibility function exists,
  // check whether at least one supported preference exists.
  // ----------------------------------------------------------

  const normalized =
    normalizeExpectationCompatibilityText(
      raw
    );


  const supportedKeywords = [

    // Education
    "educated",
    "well educated",
    "qualified",
    "शिक्षित",
    "सुशिक्षित",

    // Understanding
    "understanding",
    "mature",
    "समजूतदार",
    "समंजस",

    // Loving / Caring
    "loving",
    "caring",
    "kind",
    "प्रेमळ",
    "काळजी",
    "दयाळू",

    // Respectful
    "respectful",
    "respect",
    "आदर",
    "सन्मान",

    // Honest
    "honest",
    "loyal",
    "trustworthy",
    "प्रामाणिक",
    "विश्वासू",
    "निष्ठावान",

    // Responsible
    "responsible",
    "reliable",
    "जबाबदार",
    "विश्वसनीय",

    // Family
    "family",
    "family oriented",
    "family-oriented",
    "कुटुंब",
    "कुटुंबवत्सल",
    "कुटुंबप्रिय",

    // Dreams
    "dream",
    "dreams",
    "स्वप्न",
    "ध्येय",

    // Career
    "career",
    "career supportive",
    "करिअर",
    "नोकरी",
    "व्यवसाय",

    // Communication
    "communication",
    "communicative",
    "संवाद"

  ];


  for (
    let i = 0;
    i < supportedKeywords.length;
    i++
  ) {

    if (
      normalized.indexOf(
        supportedKeywords[i]
      ) !== -1
    ) {

      return true;

    }

  }


  // ----------------------------------------------------------
  // Text exists but no known preference.
  //
  // Treat it as generic / unknown rather than
  // meaningful compatibility evidence.
  // ----------------------------------------------------------

  return false;

}






function testMatchingByIds(
  viewerId,
  candidateId
) {

  viewerId =
    String(viewerId || "").trim();

  candidateId =
    String(candidateId || "").trim();


  if (!viewerId || !candidateId) {

    console.log(
      "Please provide viewerId and candidateId."
    );

    return;

  }


  // ==========================================================
  // 1. LOAD ALL PROFILE DATA
  // ==========================================================

  const repositoryResult =
    getAllMatchingCandidateData([
      "bride",
      "groom",
      "other"
    ]);


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:"
    );

    console.log(
      JSON.stringify(
        repositoryResult,
        null,
        2
      )
    );

    return;

  }


  // ==========================================================
  // 2. NORMALIZE ALL PROFILES
  // ==========================================================

  const allProfiles = [];


  repositoryResult.profiles.forEach(
    function(sheetData) {

      const rows =
        sheetData.rows || [];

      rows.forEach(
        function(row) {

          const profile =
            normalizeMatchingCandidateProfile(
              row,
              sheetData.headers,
              sheetData.profileType
            );

          if (profile) {

            allProfiles.push(
              profile
            );

          }

        }
      );

    }
  );


  // ==========================================================
  // 3. FIND VIEWER
  // ==========================================================

  const viewerProfile =
    allProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        ).trim()
        ===
        viewerId;

      }
    );


  if (!viewerProfile) {

    console.log(
      "Viewer not found:"
    );

    console.log(
      viewerId
    );

    return;

  }


  // ==========================================================
  // 4. FIND CANDIDATE
  // ==========================================================

  const candidateProfile =
    allProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        ).trim()
        ===
        candidateId;

      }
    );


  if (!candidateProfile) {

    console.log(
      "Candidate not found:"
    );

    console.log(
      candidateId
    );

    return;

  }


  // ==========================================================
  // 5. PARSE VIEWER EXPECTATION
  // ==========================================================

  const expectationCriteria =
    parseExpectationCriteria(
      viewerProfile.expectationRaw || ""
    );


  // ==========================================================
  // 6. RUN MATCHING ENGINE
  // ==========================================================

  const matchingResult =
    evaluateCandidateMatch(
      candidateProfile,
      expectationCriteria
    );


  // ==========================================================
  // 7. PRINT USEFUL RESULT ONLY
  // ==========================================================

  const output = {

    viewer: {

      id:
        viewerProfile.id,

      name:
        viewerProfile.name,

      type:
        viewerProfile.type,

      expectation:
        viewerProfile.expectationRaw

    },

    candidate: {

      id:
        candidateProfile.id,

      name:
        candidateProfile.name,

      type:
        candidateProfile.type,

      education:
        candidateProfile.educationRaw,

      profession:
        candidateProfile.professionRaw,

      district:
        candidateProfile.district

    },

    expectationCriteria: {

      educationRequired:
        expectationCriteria.educationRequired,

      employmentRequired:
        expectationCriteria.employmentRequired,

      softPreferences:
        expectationCriteria.softPreferences

    },

    matchingResult:
      matchingResult

  };


  console.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );


  return output;

}



function testMatchingByIds(
  viewerId,
  candidateId
) {

  viewerId =
    String(viewerId || "").trim();

  candidateId =
    String(candidateId || "").trim();


  if (!viewerId || !candidateId) {

    console.log(
      "Please provide viewerId and candidateId."
    );

    return;

  }


  // ==========================================================
  // 1. LOAD PROFILE SHEETS
  // ==========================================================

  const repositoryResult =
    getAllMatchingCandidateData([
      "bride",
      "groom",
      "other"
    ]);


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:"
    );

    console.log(
      JSON.stringify(
        repositoryResult,
        null,
        2
      )
    );

    return;

  }


  // ==========================================================
  // 2. NORMALIZE ALL PROFILES
  // ==========================================================

  const allProfiles = [];


  repositoryResult.profiles.forEach(
    function(sheetData) {

      const rows =
        sheetData.rows || [];


      rows.forEach(
        function(row) {

          const profile =
            normalizeMatchingCandidateProfile(
              sheetData.headers,
              row,
              sheetData.profileType
            );


          if (profile) {

            allProfiles.push(
              profile
            );

          }

        }
      );

    }
  );


  console.log(
    "TOTAL PROFILES:",
    allProfiles.length
  );


  // ==========================================================
  // 3. FIND VIEWER
  // ==========================================================

  const viewerProfile =
    allProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        )
        .trim()
        .toUpperCase()
        ===
        viewerId
          .trim()
          .toUpperCase();

      }
    );


  if (!viewerProfile) {

    console.log(
      "Viewer not found:"
    );

    console.log(
      viewerId
    );

    console.log(
      "Available first IDs:"
    );

    console.log(
      JSON.stringify(
        allProfiles
          .slice(0, 20)
          .map(
            function(profile) {
              return profile.id;
            }
          ),
        null,
        2
      )
    );

    return;

  }


  // ==========================================================
  // 4. FIND CANDIDATE
  // ==========================================================

  const candidateProfile =
    allProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        )
        .trim()
        .toUpperCase()
        ===
        candidateId
          .trim()
          .toUpperCase();

      }
    );


  if (!candidateProfile) {

    console.log(
      "Candidate not found:"
    );

    console.log(
      candidateId
    );

    return;

  }


  // ==========================================================
  // 5. VIEWER EXPECTATION
  // ==========================================================

  const expectationCriteria =
    viewerProfile.expectation;


  // ==========================================================
  // 6. RUN MATCHING
  // ==========================================================

  const matchingResult =
    evaluateCandidateMatch(
      candidateProfile,
      expectationCriteria
    );


  // ==========================================================
  // 7. FINAL DEBUG OUTPUT
  // ==========================================================

  const output = {

    success:
      true,

    viewer: {

      id:
        viewerProfile.id,

      name:
        viewerProfile.name,

      type:
        viewerProfile.type,

      expectation:
        viewerProfile.expectationRaw

    },

    candidate: {

      id:
        candidateProfile.id,

      name:
        candidateProfile.name,

      type:
        candidateProfile.type,

      district:
        candidateProfile.district,

      ageRaw:
        candidateProfile.ageRaw,

      heightRaw:
        candidateProfile.heightRaw,

      incomeRaw:
        candidateProfile.incomeRaw,

      educationRaw:
        candidateProfile.educationRaw,

      professionRaw:
        candidateProfile.professionRaw,

      expectation:
        candidateProfile.expectationRaw

    },

    expectationCriteria:
      expectationCriteria,

    matchingResult:
      matchingResult

  };


  console.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );


  return output;

}



function testMultipleCandidateRanking() {

  const viewerId =
    "ID001";


  const candidateIds = [

    "ID003",
    "ID005",
    "ID012",
    "ID036",
    "ID072",
    "ID173",
    "ID227",
    "ID294",
    "ID628"

  ];


  // ==========================================================
  // 1. LOAD PROFILE SHEETS
  // ==========================================================

  const repositoryResult =
    getAllMatchingCandidateData([
      "bride",
      "groom",
      "other"
    ]);


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:"
    );

    console.log(
      JSON.stringify(
        repositoryResult,
        null,
        2
      )
    );

    return;

  }


  // ==========================================================
  // 2. NORMALIZE ALL PROFILES
  // ==========================================================

  const allProfiles = [];


  repositoryResult.profiles.forEach(
    function(sheetData) {

      const rows =
        sheetData.rows || [];


      rows.forEach(
        function(row) {

          const profile =
            normalizeMatchingCandidateProfile(
              sheetData.headers,
              row,
              sheetData.profileType
            );


          if (profile) {

            allProfiles.push(
              profile
            );

          }

        }
      );

    }
  );


  console.log(
    "TOTAL PROFILES:",
    allProfiles.length
  );


  // ==========================================================
  // 3. FIND VIEWER
  // ==========================================================

  const viewerProfile =
    allProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        )
        .trim()
        .toUpperCase()
        ===
        viewerId
          .trim()
          .toUpperCase();

      }
    );


  if (!viewerProfile) {

    console.log(
      "Viewer not found:",
      viewerId
    );

    return;

  }


  // ==========================================================
  // 4. GET VIEWER EXPECTATION
  // ==========================================================

  const expectationCriteria =
    viewerProfile.expectation;


  if (!expectationCriteria) {

    console.log(
      "Viewer expectation missing:",
      viewerId
    );

    return;

  }


  // ==========================================================
  // 5. FIND REQUESTED CANDIDATES
  // ==========================================================

  const rankingResults = [];


  candidateIds.forEach(
    function(candidateId) {

      const candidateProfile =
        allProfiles.find(
          function(profile) {

            return String(
              profile.id || ""
            )
            .trim()
            .toUpperCase()
            ===
            String(
              candidateId || ""
            )
            .trim()
            .toUpperCase();

          }
        );


      if (!candidateProfile) {

        rankingResults.push({

          id:
            candidateId,

          found:
            false,

          error:
            "Candidate not found."

        });

        return;

      }


      // ======================================================
      // 6. RUN MATCHING
      // ======================================================

      const matchingResult =
        evaluateCandidateMatch(
          candidateProfile,
          expectationCriteria
        );


      const softPreferenceScore =
        matchingResult
          .softPreferenceScore || {};


      rankingResults.push({

        id:
          candidateProfile.id,

        name:
          candidateProfile.name,

        found:
          true,

        hardMatch:
          matchingResult.hardMatch === true,

        softScore:
          Number(
            matchingResult.softScore
          ) || 0,

        maxSoftScore:
          Number(
            matchingResult.maxSoftScore
          ) || 0,

        softMatchPercentage:
          Number(
            matchingResult.softMatchPercentage
          ) || 0,

        softDataCoverage:
          Number(
            matchingResult.softDataCoverage
          ) || 0,

        matchedPreferences:
          Number(
            softPreferenceScore
              .matchedPreferences
          ) || 0,

        knownPreferences:
          Number(
            softPreferenceScore
              .knownPreferences
          ) || 0

      });

    }
  );


  // ==========================================================
  // 7. SORT RANKING
  // ==========================================================

  rankingResults.sort(
    function(a, b) {

      // ------------------------------------------------------
      // Candidates not found go last
      // ------------------------------------------------------

      if (
        a.found !== b.found
      ) {

        return a.found
          ? -1
          : 1;

      }


      if (!a.found) {

        return 0;

      }


      // ------------------------------------------------------
      // HARD MATCH FIRST
      // ------------------------------------------------------

      if (
        a.hardMatch !==
        b.hardMatch
      ) {

        return a.hardMatch
          ? -1
          : 1;

      }


      // ------------------------------------------------------
      // SOFT SCORE
      // ------------------------------------------------------

      if (
        b.softScore !==
        a.softScore
      ) {

        return (
          b.softScore -
          a.softScore
        );

      }


      // ------------------------------------------------------
      // DATA COVERAGE
      // ------------------------------------------------------

      if (
        b.softDataCoverage !==
        a.softDataCoverage
      ) {

        return (
          b.softDataCoverage -
          a.softDataCoverage
        );

      }


      // ------------------------------------------------------
      // MATCH PERCENTAGE
      // ------------------------------------------------------

      return (
        b.softMatchPercentage -
        a.softMatchPercentage
      );

    }
  );


  // ==========================================================
  // 8. ADD RANK
  // ==========================================================

  rankingResults.forEach(
    function(item, index) {

      item.rank =
        index + 1;

    }
  );


  // ==========================================================
  // 9. FINAL OUTPUT
  // ==========================================================

  const output = {

    success:
      true,

    viewer: {

      id:
        viewerProfile.id,

      name:
        viewerProfile.name,

      type:
        viewerProfile.type

    },

    candidateCount:
      rankingResults.length,

    ranking:
      rankingResults

  };


  console.log(
    "=================================================="
  );

  console.log(
    "MULTIPLE CANDIDATE RANKING TEST"
  );

  console.log(
    "=================================================="
  );


  console.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );


  return output;

}


function testCandidateEducationStructure(
  candidateId
) {

  candidateId =
    String(candidateId || "").trim();


  const repositoryResult =
    getAllMatchingCandidateData([
      "bride",
      "groom",
      "other"
    ]);


  const allProfiles = [];


  repositoryResult.profiles.forEach(
    function(sheetData) {

      (sheetData.rows || []).forEach(
        function(row) {

          const profile =
            normalizeMatchingCandidateProfile(
              sheetData.headers,
              row,
              sheetData.profileType
            );

          if (profile) {
            allProfiles.push(profile);
          }

        }
      );

    }
  );


  const candidate =
    allProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        ).trim()
        .toUpperCase()
        ===
        candidateId.toUpperCase();

      }
    );


  if (!candidate) {

    console.log(
      "Candidate not found:",
      candidateId
    );

    return;

  }


  const result = {

    id:
      candidate.id,

    name:
      candidate.name,

    education:
      candidate.education,

    educationRaw:
      candidate.educationRaw,

    isCandidateEducated:
      isCandidateEducated(
        candidate
      )

  };


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}


function testID001toID628() {

  return testMatchingByIds(
    "ID001",
    "ID628"
  );

}


function testID001toID003() {

  return testMatchingByIds(
    "ID001",
    "ID003"
  );

}


function testID628Education() {

  return testCandidateEducationStructure(
    "ID628"
  );

}


function testMatchingHeaders() {

  const result =
    getAllMatchingCandidateData([
      "bride",
      "groom"
    ]);

  if (
    !result ||
    !result.success
  ) {

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

    return;

  }


  result.profiles.forEach(
    function(sheetData) {

      console.log(
        "======================================"
      );

      console.log(
        "SHEET:",
        sheetData.sheetName
      );

      console.log(
        JSON.stringify(
          sheetData.headers,
          null,
          2
        )
      );

    }
  );

}



function testCandidateDataCoverage() {

  // ==========================================================
  // 1. LOAD PROFILE SHEETS
  // ==========================================================

  const repositoryResult =
    getAllMatchingCandidateData([
      "bride",
      "groom",
      "other"
    ]);


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:"
    );

    console.log(
      JSON.stringify(
        repositoryResult,
        null,
        2
      )
    );

    return;

  }


  // ==========================================================
  // 2. NORMALIZE ALL PROFILES
  // ==========================================================

  const allProfiles = [];


  repositoryResult.profiles.forEach(
    function(sheetData) {

      const rows =
        sheetData.rows || [];


      rows.forEach(
        function(row) {

          const profile =
            normalizeMatchingCandidateProfile(
              sheetData.headers,
              row,
              sheetData.profileType
            );


          if (profile) {

            allProfiles.push(
              profile
            );

          }

        }
      );

    }
  );


  // ==========================================================
  // 3. FIELD DEFINITIONS
  // ==========================================================

  const fields = [

    {
      key: "education",
      label: "Education",
      getter: function(profile) {
        return profile.educationRaw;
      }
    },

    {
      key: "profession",
      label: "Profession",
      getter: function(profile) {
        return profile.professionRaw;
      }
    },

    {
      key: "age",
      label: "Age",
      getter: function(profile) {
        return profile.ageRaw;
      }
    },

    {
      key: "height",
      label: "Height",
      getter: function(profile) {
        return profile.heightRaw;
      }
    },

    {
      key: "income",
      label: "Income",
      getter: function(profile) {
        return profile.incomeRaw;
      }
    },

    {
      key: "district",
      label: "District",
      getter: function(profile) {
        return profile.district;
      }
    },

    {
      key: "caste",
      label: "Caste",
      getter: function(profile) {
        return profile.casteRaw;
      }
    },

    {
      key: "rashi",
      label: "Rashi",
      getter: function(profile) {
        return profile.rashiRaw;
      }
    },

    {
      key: "expectation",
      label: "Expectation",
      getter: function(profile) {
        return profile.expectationRaw;
      }
    }

  ];


  // ==========================================================
  // 4. INITIALIZE ANALYSIS
  // ==========================================================

  const analysis = {};


  fields.forEach(
    function(field) {

      analysis[field.key] = {

        label:
          field.label,

        total:
          allProfiles.length,

        known:
          0,

        missing:
          0,

        coveragePercentage:
          0

      };

    }
  );


  // ==========================================================
  // 5. ANALYZE EVERY PROFILE
  // ==========================================================

  allProfiles.forEach(
    function(profile) {

      fields.forEach(
        function(field) {

          let value = "";


          try {

            value =
              field.getter(
                profile
              );

          }

          catch (error) {

            value = "";

          }


          const hasData =
            value !== null &&
            value !== undefined &&
            String(
              value
            ).trim() !== "";


          if (hasData) {

            analysis[field.key].known++;

          }
          else {

            analysis[field.key].missing++;

          }

        }
      );

    }
  );


  // ==========================================================
  // 6. CALCULATE COVERAGE
  // ==========================================================

  fields.forEach(
    function(field) {

      const item =
        analysis[field.key];


      item.coveragePercentage =
        item.total > 0
          ? Number(
              (
                item.known /
                item.total
              * 100
              ).toFixed(2)
            )
          : 0;

    }
  );


  // ==========================================================
  // 7. PROFILE TYPE ANALYSIS
  // ==========================================================

  const typeAnalysis = {};


  [
    "bride",
    "groom",
    "other"
  ].forEach(
    function(type) {

      const profilesOfType =
        allProfiles.filter(
          function(profile) {

            return profile.type === type;

          }
        );


      typeAnalysis[type] = {

        total:
          profilesOfType.length

      };

    }
  );


  // ==========================================================
  // 8. SOFT EVIDENCE ANALYSIS
  //
  // This checks whether the current profile structure
  // contains explicit evidence for soft preferences.
  // ==========================================================

  const softEvidenceFields = {

    understanding: 0,
    cultured: 0,
    loving: 0,
    respectful: 0,
    honest: 0,
    responsible: 0,
    familyOriented: 0,
    dreamSupportive: 0,
    careerSupportive: 0,
    communication: 0

  };


  // ----------------------------------------------------------
  // IMPORTANT
  //
  // At present there are no dedicated profile columns
  // for these preferences.
  //
  // Therefore we DO NOT infer them from expectations.
  //
  // This section intentionally remains zero unless
  // evaluateSoftPreference() has explicit evidence.
  // ----------------------------------------------------------

  allProfiles.forEach(
    function(profile) {

      Object.keys(
        softEvidenceFields
      ).forEach(
        function(preference) {

          const result =
            evaluateSoftPreference(
              preference,
              profile
            );


          if (
            result &&
            (
              result.status === "MATCH" ||
              result.status === "CONFLICT"
            )
          ) {

            softEvidenceFields[
              preference
            ]++;

          }

        }
      );

    }
  );


  // ==========================================================
  // 9. SOFT EVIDENCE COVERAGE
  // ==========================================================

  const softEvidenceAnalysis = {};


  Object.keys(
    softEvidenceFields
  ).forEach(
    function(preference) {

      const known =
        softEvidenceFields[
          preference
        ];


      softEvidenceAnalysis[
        preference
      ] = {

        known:
          known,

        missing:
          allProfiles.length -
          known,

        coveragePercentage:
          allProfiles.length > 0
            ? Number(
                (
                  known /
                  allProfiles.length
                  * 100
                ).toFixed(2)
              )
            : 0

      };

    }
  );


  // ==========================================================
  // 10. FINAL OUTPUT
  // ==========================================================

  const output = {

    success:
      true,

    totalProfiles:
      allProfiles.length,

    typeAnalysis:
      typeAnalysis,

    fieldCoverage:
      analysis,

    softEvidenceAnalysis:
      softEvidenceAnalysis

  };


  // ==========================================================
  // 11. LOG SUMMARY
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "PROFILE EVIDENCE ANALYSIS"
  );

  console.log(
    "=================================================="
  );


  console.log(
    "TOTAL PROFILES:",
    allProfiles.length
  );


  console.log(
    "=================================================="
  );

  console.log(
    "FIELD COVERAGE"
  );

  console.log(
    "=================================================="
  );


  fields.forEach(
    function(field) {

      const item =
        analysis[field.key];


      console.log(

        field.label +
        " | Known: " +
        item.known +
        " | Missing: " +
        item.missing +
        " | Coverage: " +
        item.coveragePercentage +
        "%"

      );

    }
  );


  console.log(
    "=================================================="
  );

  console.log(
    "SOFT EVIDENCE COVERAGE"
  );

  console.log(
    "=================================================="
  );


  console.log(
    JSON.stringify(
      softEvidenceAnalysis,
      null,
      2
    )
  );


  console.log(
    "=================================================="
  );

  console.log(
    "COMPLETE ANALYSIS"
  );

  console.log(
    "=================================================="
  );


  console.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );


  return output;

}




function testID001HardMatchingAnalysis() {

  // ==========================================================
  // 1. LOAD ONLY BRIDE PROFILES
  // ==========================================================

  const repositoryResult =
    getAllMatchingCandidateData([
      "bride"
    ]);


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:"
    );

    console.log(
      JSON.stringify(
        repositoryResult,
        null,
        2
      )
    );

    return;

  }


  // ==========================================================
  // 2. NORMALIZE ALL BRIDE PROFILES
  // ==========================================================

  const brideProfiles = [];


  repositoryResult.profiles.forEach(
    function(sheetData) {

      const rows =
        sheetData.rows || [];


      rows.forEach(
        function(row) {

          const profile =
            normalizeMatchingCandidateProfile(
              sheetData.headers,
              row,
              sheetData.profileType
            );


          if (profile) {

            brideProfiles.push(
              profile
            );

          }

        }
      );

    }
  );


  // ==========================================================
  // 3. FIND VIEWER ID001
  // ==========================================================

  let viewerProfile =
    brideProfiles.find(
      function(profile) {

        return String(
          profile.id || ""
        )
        .trim()
        .toUpperCase()
        ===
        "ID001";

      }
    );


  // ----------------------------------------------------------
  // ID001 is a groom, so it will not be inside brideProfiles.
  // Therefore load groom profile separately.
  // ----------------------------------------------------------

  if (!viewerProfile) {

    const groomRepositoryResult =
      getAllMatchingCandidateData([
        "groom"
      ]);


    if (
      groomRepositoryResult &&
      groomRepositoryResult.success
    ) {

      groomRepositoryResult.profiles.forEach(
        function(sheetData) {

          const rows =
            sheetData.rows || [];


          rows.forEach(
            function(row) {

              const profile =
                normalizeMatchingCandidateProfile(
                  sheetData.headers,
                  row,
                  sheetData.profileType
                );


              if (
                profile &&
                String(
                  profile.id || ""
                )
                .trim()
                .toUpperCase()
                ===
                "ID001"
              ) {

                viewerProfile =
                  profile;

              }

            }
          );

        }
      );

    }

  }


  // ==========================================================
  // 4. VIEWER VALIDATION
  // ==========================================================

  if (!viewerProfile) {

    console.log(
      "Viewer ID001 not found."
    );

    return;

  }


  // ==========================================================
  // 5. GET EXPECTATION
  // ==========================================================

  const expectationCriteria =
    viewerProfile.expectation;


  if (!expectationCriteria) {

    console.log(
      "Expectation criteria not found for ID001."
    );

    return;

  }


  // ==========================================================
  // 6. SUMMARY COUNTERS
  // ==========================================================

  let totalCandidates =
    brideProfiles.length;

  let hardMatched =
    0;

  let rejected =
    0;


  const rejectionReasons = {

    education: 0,

    educationRequired: 0,

    professionCategory: 0,

    employmentType: 0,

    age: 0,

    height: 0,

    income: 0,

    district: 0,

    caste: 0,

    rashi: 0

  };


  const results = [];


  // ==========================================================
  // 7. EVALUATE EVERY BRIDE
  // ==========================================================

  brideProfiles.forEach(
    function(candidateProfile) {

      const matchingResult =
        evaluateCandidateMatch(
          candidateProfile,
          expectationCriteria
        );


      const failedCriteria =
        matchingResult &&
        Array.isArray(
          matchingResult.failedCriteria
        )
          ? matchingResult.failedCriteria
          : [];


      const hardMatch =
        matchingResult &&
        matchingResult.hardMatch === true;


      if (hardMatch) {

        hardMatched++;

      }
      else {

        rejected++;

      }


      // --------------------------------------------------------
      // COUNT REJECTION REASONS
      // --------------------------------------------------------

      failedCriteria.forEach(
        function(reason) {

          if (
            Object.prototype.hasOwnProperty.call(
              rejectionReasons,
              reason
            )
          ) {

            rejectionReasons[
              reason
            ]++;

          }

        }
      );


      // --------------------------------------------------------
      // STORE RESULT
      // --------------------------------------------------------

      results.push({

        id:
          candidateProfile.id,

        name:
          candidateProfile.name,

        hardMatch:
          hardMatch,

        applicableCriteria:
          matchingResult.applicableCriteria,

        matchedCriteria:
          matchingResult.matchedCriteria,

        failedCriteria:
          failedCriteria

      });

    }
  );


  // ==========================================================
  // 8. CALCULATE PERCENTAGES
  // ==========================================================

  const hardMatchPercentage =
    totalCandidates > 0
      ? Number(
          (
            hardMatched /
            totalCandidates *
            100
          ).toFixed(2)
        )
      : 0;


  const rejectionPercentage =
    totalCandidates > 0
      ? Number(
          (
            rejected /
            totalCandidates *
            100
          ).toFixed(2)
        )
      : 0;


  // ==========================================================
  // 9. FINAL OUTPUT
  // ==========================================================

  const output = {

    success:
      true,

    viewer: {

      id:
        viewerProfile.id,

      name:
        viewerProfile.name,

      type:
        viewerProfile.type

    },

    candidatePool: {

      type:
        "bride",

      total:
        totalCandidates

    },

    expectationCriteria:
      expectationCriteria,

    summary: {

      totalCandidates:
        totalCandidates,

      hardMatched:
        hardMatched,

      rejected:
        rejected,

      hardMatchPercentage:
        hardMatchPercentage,

      rejectionPercentage:
        rejectionPercentage

    },

    rejectionReasons:
      rejectionReasons,

    results:
      results

  };


  // ==========================================================
  // 10. CONSOLE OUTPUT
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "ID001 HARD MATCHING ANALYSIS"
  );

  console.log(
    "=================================================="
  );


  console.log(
    "Viewer:",
    viewerProfile.name
  );


  console.log(
    "Candidate Pool: BRIDE"
  );


  console.log(
    "Total Candidates:",
    totalCandidates
  );


  console.log(
    "Hard Matched:",
    hardMatched
  );


  console.log(
    "Rejected:",
    rejected
  );


  console.log(
    "Hard Match Percentage:",
    hardMatchPercentage + "%"
  );


  console.log(
    "Rejection Percentage:",
    rejectionPercentage + "%"
  );


  console.log(
    "=================================================="
  );

  console.log(
    "REJECTION REASONS"
  );

  console.log(
    "=================================================="
  );


  Object.keys(
    rejectionReasons
  ).forEach(
    function(reason) {

      console.log(
        reason +
        " : " +
        rejectionReasons[reason]
      );

    }
  );


  console.log(
    "=================================================="
  );

  console.log(
    "COMPLETE RESULT"
  );

  console.log(
    "=================================================="
  );


  console.log(
    JSON.stringify(
      output,
      null,
      2
    )
  );


  return output;

}



function testExpectationParserValidation() {

  const testCases = [

    {
      label: "1 - Education only",
      input: "सुशिक्षित मुलगी हवी."
    },

    {
      label: "2 - Government Job",
      input: "सुशिक्षित आणि सरकारी नोकरी करणारी मुलगी हवी."
    },

    {
      label: "3 - Engineering",
      input: "Engineering किंवा IT क्षेत्रातील मुलगी हवी."
    },

    {
      label: "4 - Medical",
      input: "Doctor किंवा Medical field मधील मुलगी हवी."
    },

    {
      label: "5 - Age",
      input: "वय 25 ते 30 वर्षे असावे."
    },

    {
      label: "6 - Height",
      input: "उंची 5 फूट 3 इंच किंवा त्यापेक्षा जास्त असावी."
    },

    {
      label: "7 - Income",
      input: "मासिक उत्पन्न 50,000 पेक्षा जास्त असावे."
    },

    {
      label: "8 - District",
      input: "पुणे किंवा कोल्हापूर जिल्ह्यातील मुलगी हवी."
    },

    {
      label: "9 - Caste",
      input: "विशिष्ट पोटजातीतील मुलगी हवी."
    },

    {
      label: "10 - Rashi",
      input: "रास मेष किंवा सिंह असावी."
    },

    {
      label: "11 - Profession + Government",
      input: "सुशिक्षित, सरकारी नोकरी करणारी आणि समजूतदार मुलगी हवी."
    },

    {
      label: "12 - Multiple Criteria",
      input:
        "MBA किंवा Engineering केलेली, पुणे जिल्ह्यातील, वय 25 ते 30 वर्षे आणि सरकारी नोकरी करणारी मुलगी हवी."
    },

    {
      label: "13 - Soft Preferences",
      input:
        "समजूतदार, संस्कारी, प्रेमळ आणि कुटुंबाला महत्त्व देणारी मुलगी हवी."
    },

    {
      label: "14 - Career Support",
      input:
        "करिअर आणि स्वप्नांचा आदर करणारी, career supportive जीवनसाथी हवी."
    },

    {
      label: "15 - Complete Natural Language",
      input:
        "आयुष्यभराची विश्वासू मैत्रीण, सुशिक्षित, समजूतदार, संस्कारी आणि प्रेमळ व करिअरचा आणि स्वप्नांचा आदर करणारी जीवनसाथी असावी."
    }

  ];


  const results = [];


  testCases.forEach(
    function(testCase) {

      let output = null;

      let error = "";


      try {

        output =
          parseExpectationCriteria(
            testCase.input
          );

      }

      catch (e) {

        error =
          e.message || String(e);

      }


      results.push({

        label:
          testCase.label,

        input:
          testCase.input,

        success:
          !error,

        error:
          error,

        output:
          output

      });

    }
  );


  console.log(
    "=================================================="
  );

  console.log(
    "EXPECTATION PARSER VALIDATION"
  );

  console.log(
    "=================================================="
  );


  results.forEach(
    function(result) {

      console.log(
        "--------------------------------------------------"
      );

      console.log(
        result.label
      );

      console.log(
        "INPUT:",
        result.input
      );


      if (result.error) {

        console.log(
          "ERROR:",
          result.error
        );

      }
      else {

        console.log(
          JSON.stringify(
            result.output,
            null,
            2
          )
        );

      }

    }
  );


  console.log(
    "=================================================="
  );


  return results;

}




function testExpectationHeightParser() {

  const testCases = [

    "उंची 5 फूट 3 इंच किंवा त्यापेक्षा जास्त असावी.",

    "उंची 5 फूट 3 इंच ते 5 फूट 7 इंच असावी.",

    "किमान 5 फूट 3 इंच उंची असावी.",

    "height 5 feet 3 inches or above"

  ];


  testCases.forEach(
    function(input) {

      const result =
        parseExpectationHeight(
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




// ============================================================
// WEIGHTED EXPECTATION COMPATIBILITY
// ============================================================

function calculateWeightedExpectationCompatibility(
  viewerExpectation,
  candidateExpectation
) {

  const viewerText =
    String(
      viewerExpectation || ""
    ).trim();

  const candidateText =
    String(
      candidateExpectation || ""
    ).trim();


  if (
    !viewerText ||
    !candidateText
  ) {

    return {

      score: 0,

      maxScore: 0,

      percentage: 0,

      matchedKeywords: [],

      matchedDetails: [],

      applicable: false

    };

  }


  // ==========================================================
  // WEIGHTS
  // ==========================================================

  const preferenceWeights = {

    honest:
      15,

    respectful:
      15,

    understanding:
      15,

    familyOriented:
      12,

    communication:
      10,

    responsible:
      10,

    loving:
      8,

    cultured:
      8,

    educated:
      7,

    dreamSupportive:
      7,

    careerSupportive:
      7

  };


  // ==========================================================
  // NORMALIZE TEXT
  // ==========================================================

  const normalizedViewer =
    normalizeExpectationCompatibilityText(
      viewerText
    );


  const normalizedCandidate =
    normalizeExpectationCompatibilityText(
      candidateText
    );


  // ==========================================================
  // VIEWER PREFERENCES
  // ==========================================================

  const viewerCriteria =
    parseExpectationCriteria(
      viewerText
    );


  const preferences =
    viewerCriteria &&
    viewerCriteria.softPreferences
      ? viewerCriteria.softPreferences
      : {};


  const requiredPreferences = [];


  Object.keys(
    preferenceWeights
  ).forEach(
    function(preference) {

      if (
        preferences[preference] === true
      ) {

        requiredPreferences.push(
          preference
        );

      }

    }
  );


  if (
    requiredPreferences.length === 0
  ) {

    return {

      score: 0,

      maxScore: 0,

      percentage: 0,

      matchedKeywords: [],

      matchedDetails: [],

      applicable: false

    };

  }


  // ==========================================================
  // EVALUATE EACH PREFERENCE
  // ==========================================================

  let score = 0;

  let maxScore = 0;

  const matchedKeywords = [];

  const matchedDetails = [];


  requiredPreferences.forEach(
    function(preference) {

      const weight =
        preferenceWeights[
          preference
        ] || 0;


      maxScore += weight;


      // ------------------------------------------------------
      // Use existing evaluator
      // ------------------------------------------------------

      let result = null;


      try {

        result =
          evaluateSoftPreference(
            preference,
            {
              expectationRaw:
                candidateText,

              expectation:
                candidateText,

              expectationText:
                candidateText,

              candidateExpectation:
                candidateText,

              rawExpectation:
                candidateText,

              normalizedExpectation:
                normalizedCandidate
            }
          );

      }
      catch (error) {

        result = null;

      }


      const status =
        result &&
        result.status
          ? String(
              result.status
            )
            .trim()
            .toUpperCase()
          : "";


      // ------------------------------------------------------
      // MATCH
      // ------------------------------------------------------

      if (
        status === "MATCH"
      ) {

        score += weight;

        matchedKeywords.push(
          preference
        );


        matchedDetails.push({

          preference:
            preference,

          weight:
            weight,

          status:
            "MATCH",

          score:
            weight

        });

      }


      // ------------------------------------------------------
      // FALLBACK TEXT MATCH
      // ------------------------------------------------------

      else {

        const keywordMap = {

          honest: [
            "honest",
            "loyal",
            "trustworthy",
            "प्रामाणिक",
            "विश्वासू",
            "निष्ठावान"
          ],

          respectful: [
            "respectful",
            "respect",
            "आदर",
            "सन्मान"
          ],

          understanding: [
            "understanding",
            "समजूतदार",
            "समंजस"
          ],

          familyOriented: [
            "family",
            "family oriented",
            "family-oriented",
            "कुटुंब",
            "कुटुंबवत्सल",
            "कुटुंबप्रिय"
          ],

          communication: [
            "communication",
            "communicative",
            "संवाद"
          ],

          responsible: [
            "responsible",
            "reliable",
            "जबाबदार",
            "विश्वसनीय"
          ],

          loving: [
            "loving",
            "caring",
            "kind",
            "प्रेमळ",
            "काळजी",
            "दयाळू"
          ],

          cultured: [
            "cultured",
            "संस्कारी"
          ],

          educated: [
            "educated",
            "well educated",
            "शिक्षित",
            "सुशिक्षित"
          ],

          dreamSupportive: [
            "dream",
            "dreams",
            "स्वप्न",
            "ध्येय"
          ],

          careerSupportive: [
            "career",
            "professional growth",
            "करिअर",
            "नोकरी",
            "व्यवसाय"
          ]

        };


        const keywords =
          keywordMap[
            preference
          ] || [];


        let matched =
          false;

        let matchedKeyword =
          "";


        for (
          let i = 0;
          i < keywords.length;
          i++
        ) {

          if (
            normalizedCandidate.indexOf(
              keywords[i]
            ) !== -1
          ) {

            matched =
              true;

            matchedKeyword =
              keywords[i];

            break;

          }

        }


        if (
          matched
        ) {

          score += weight;

          matchedKeywords.push(
            preference
          );


          matchedDetails.push({

            preference:
              preference,

            keyword:
              matchedKeyword,

            weight:
              weight,

            status:
              "MATCH",

            score:
              weight

          });

        }

      }

    }
  );


  // ==========================================================
  // FINAL %
  // ==========================================================

  const percentage =
    maxScore > 0

      ? Number(
          (
            score /
            maxScore *
            100
          ).toFixed(2)
        )

      : 0;


  return {

    score:
      score,

    maxScore:
      maxScore,

    percentage:
      percentage,

    matchedKeywords:
      matchedKeywords,

    matchedDetails:
      matchedDetails,

    applicable:
      maxScore > 0

  };

}




// ============================================================
// TEST WEIGHTED EXPECTATION COMPATIBILITY
// ============================================================

function testWeightedExpectationCompatibility() {

  console.log(
    "=================================================="
  );

  console.log(
    "WEIGHTED EXPECTATION VALIDATION"
  );

  console.log(
    "=================================================="
  );


  // ==========================================================
  // TEST CASES
  // ==========================================================

  const tests = [

    // --------------------------------------------------------
    // TEST 1 - PERFECT MATCH
    // --------------------------------------------------------

    {
      name:
        "Perfect Match",

      viewer:
        "Honest, respectful, understanding, family-oriented, loving",

      candidate:
        "Honest, respectful, understanding, family-oriented, loving"
    },


    // --------------------------------------------------------
    // TEST 2 - PARTIAL MATCH
    // --------------------------------------------------------

    {
      name:
        "Partial Match",

      viewer:
        "Honest, respectful, understanding, family-oriented, loving",

      candidate:
        "Honest, respectful and understanding partner"
    },


    // --------------------------------------------------------
    // TEST 3 - NO MATCH
    // --------------------------------------------------------

    {
      name:
        "No Match",

      viewer:
        "Honest, respectful, understanding, family-oriented",

      candidate:
        "Career-oriented and financially responsible partner"
    },


    // --------------------------------------------------------
    // TEST 4 - GENERIC EXPECTATION
    // --------------------------------------------------------

    {
      name:
        "Generic Expectation",

      viewer:
        "Honest, respectful, understanding, family-oriented",

      candidate:
        "सर्व साधारण"
    },


    // --------------------------------------------------------
    // TEST 5 - MARATHI / ENGLISH
    // --------------------------------------------------------

    {
      name:
        "Marathi English Match",

      viewer:
        "Honest, respectful, understanding, family-oriented",

      candidate:
        "प्रामाणिक, आदर करणारा, समजूतदार आणि कुटुंबवत्सल जीवनसाथी"
    }

  ];


  // ==========================================================
  // RESULTS
  // ==========================================================

  const results = [];


  tests.forEach(
    function(test, index) {

      let result = null;

      let error = "";


      try {

        // ------------------------------------------------------
        // GENERIC EXPECTATION
        // ------------------------------------------------------

        const isGeneric =
          isGenericMatchingExpectation(
            test.candidate
          );


        // ------------------------------------------------------
        // MEANINGFUL EXPECTATION
        // ------------------------------------------------------

        const meaningful =
          hasMeaningfulMatchingExpectation(
            test.candidate
          );


        // ------------------------------------------------------
        // COMPATIBILITY
        // ------------------------------------------------------

        if (
          meaningful
        ) {

          result =
            calculateWeightedExpectationCompatibility(
              test.viewer,
              test.candidate
            );

        }

        else {

          result = {

            score: 0,

            maxScore: 0,

            percentage: 0,

            matchedKeywords: [],

            applicable: false

          };

        }


        // ------------------------------------------------------
        // RESULT
        // ------------------------------------------------------

        results.push({

          test:
            index + 1,

          name:
            test.name,

          generic:
            isGeneric,

          meaningful:
            meaningful,

          score:
            Number(
              result.score || 0
            ),

          maxScore:
            Number(
              result.maxScore || 0
            ),

          percentage:
            Number(
              result.percentage || 0
            ),

          matchedKeywords:
            Array.isArray(
              result.matchedKeywords
            )
              ? result.matchedKeywords
              : [],

          passed:
            true

        });

      }

      catch (err) {

        error =
          err &&
          err.message
            ? err.message
            : String(err);


        results.push({

          test:
            index + 1,

          name:
            test.name,

          generic:
            false,

          meaningful:
            false,

          score:
            0,

          maxScore:
            0,

          percentage:
            0,

          matchedKeywords:
            [],

          passed:
            false,

          error:
            error

        });

      }

    }
  );


  // ==========================================================
  // EXPECTED BEHAVIOUR
  // ==========================================================

  const test1 =
    results[0];


  const test2 =
    results[1];


  const test3 =
    results[2];


  const test4 =
    results[3];


  const test5 =
    results[4];


  // ----------------------------------------------------------
  // TEST 1
  // Perfect should be high
  // ----------------------------------------------------------

  const test1Passed =
    test1 &&
    test1.passed === true &&
    test1.percentage >= 90;


  // ----------------------------------------------------------
  // TEST 2
  // Partial should be between 0 and 100
  // ----------------------------------------------------------

  const test2Passed =
    test2 &&
    test2.passed === true &&
    test2.percentage > 0 &&
    test2.percentage < 100;


  // ----------------------------------------------------------
  // TEST 3
  // No match should be 0
  // ----------------------------------------------------------

  const test3Passed =
    test3 &&
    test3.passed === true &&
    test3.percentage === 0;


  // ----------------------------------------------------------
  // TEST 4
  // Generic should not be meaningful
  // ----------------------------------------------------------

  const test4Passed =
    test4 &&
    test4.passed === true &&
    test4.generic === true &&
    test4.meaningful === false &&
    test4.percentage === 0;


  // ----------------------------------------------------------
  // TEST 5
  // Marathi / English should match
  // ----------------------------------------------------------

  const test5Passed =
    test5 &&
    test5.passed === true &&
    test5.percentage > 0;


  // ==========================================================
  // FINAL TEST STATUS
  // ==========================================================

  const testStatuses = [

    test1Passed,

    test2Passed,

    test3Passed,

    test4Passed,

    test5Passed

  ];


  const passed =
    testStatuses.filter(
      function(status) {

        return status === true;

      }
    ).length;


  const failed =
    testStatuses.length -
    passed;


  const summary = {

    totalTests:
      testStatuses.length,

    passed:
      passed,

    failed:
      failed,

    allPassed:
      failed === 0

  };


  // ==========================================================
  // ONLY REQUIRED OUTPUT
  // ==========================================================

  console.log(
    "WEIGHTED EXPECTATION TEST RESULTS"
  );


  console.log(
    JSON.stringify(
      results,
      null,
      2
    )
  );


  console.log(
    "WEIGHTED EXPECTATION TEST SUMMARY"
  );


  console.log(
    JSON.stringify(
      summary,
      null,
      2
    )
  );


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    success:
      failed === 0,

    summary:
      summary,

    results:
      results

  };

}






// ============================================================
// FINAL COMPATIBILITY SCORE V1
// ============================================================

function calculateFinalCompatibilityScore(
  hardMatch,
  expectationCompatibility,
  profile
) {

  hardMatch =
    hardMatch === true;

  expectationCompatibility =
    expectationCompatibility || {};

  profile =
    profile || {};


  // ==========================================================
  // WEIGHTS
  // ==========================================================

  const HARD_MATCH_WEIGHT = 50;
  const EXPECTATION_WEIGHT = 30;
  const PROFILE_WEIGHT = 20;


  // ==========================================================
  // HARD SCORE
  // ==========================================================

  const hardScore =
    hardMatch
      ? HARD_MATCH_WEIGHT
      : 0;


  // ==========================================================
  // EXPECTATION SCORE
  // ==========================================================

  const expectationPercentage =
    Number(
      expectationCompatibility.percentage || 0
    );


  const expectationScore =
    expectationPercentage *
    EXPECTATION_WEIGHT /
    100;


  // ==========================================================
  // PROFILE COMPATIBILITY
  //
  // V1:
  // We only use fields that are actually available in
  // the normalized profile.
  //
  // No "स्वतःबद्दल" / "स्वभाव" fields are used.
  // ==========================================================

  const profileChecks = [];


  // ----------------------------------------------------------
  // Education
  // ----------------------------------------------------------

  if (
    profile.education
  ) {

    profileChecks.push({
      field:
        "education",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // Profession
  // ----------------------------------------------------------

  if (
    profile.profession
  ) {

    profileChecks.push({
      field:
        "profession",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // Age
  // ----------------------------------------------------------

  if (
    profile.ageRaw
  ) {

    profileChecks.push({
      field:
        "age",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // Height
  // ----------------------------------------------------------

  if (
    profile.heightRaw
  ) {

    profileChecks.push({
      field:
        "height",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // Income
  // ----------------------------------------------------------

  if (
    profile.incomeRaw
  ) {

    profileChecks.push({
      field:
        "income",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // District
  // ----------------------------------------------------------

  if (
    profile.district
  ) {

    profileChecks.push({
      field:
        "district",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // Caste
  // ----------------------------------------------------------

  if (
    profile.casteRaw
  ) {

    profileChecks.push({
      field:
        "caste",

      available:
        true
    });

  }


  // ----------------------------------------------------------
  // Rashi
  // ----------------------------------------------------------

  if (
    profile.rashiRaw
  ) {

    profileChecks.push({
      field:
        "rashi",

      available:
        true
    });

  }


  // ==========================================================
  // PROFILE SCORE
  //
  // IMPORTANT:
  // At this stage we calculate profile evidence coverage,
  // not compatibility.
  // Actual field-vs-expectation comparison will be added
  // after this validation passes.
  // ==========================================================

  const totalProfileFields = 8;

  const availableProfileFields =
    profileChecks.length;


  const profileCoverage =
    totalProfileFields > 0

      ? (
          availableProfileFields /
          totalProfileFields
        ) * 100

      : 0;


  const profileScore =
    profileCoverage *
    PROFILE_WEIGHT /
    100;


  // ==========================================================
  // FINAL SCORE
  // ==========================================================

  const finalScore =
    hardScore +
    expectationScore +
    profileScore;


  const finalPercentage =
    Number(
      Math.min(
        100,
        finalScore
      ).toFixed(2)
    );


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    finalScore:
      finalPercentage,

    finalPercentage:
      finalPercentage,

    hardScore:
      Number(
        hardScore.toFixed(2)
      ),

    expectationScore:
      Number(
        expectationScore.toFixed(2)
      ),

    expectationPercentage:
      expectationPercentage,

    profileScore:
      Number(
        profileScore.toFixed(2)
      ),

    profileCoverage:
      Number(
        profileCoverage.toFixed(2)
      ),

    profileFieldsAvailable:
      availableProfileFields,

    profileFieldsTotal:
      totalProfileFields,

    profileFields:
      profileChecks.map(
        function(item) {

          return item.field;

        }
      )

  };

}


// ============================================================
// TEST FINAL COMPATIBILITY SCORE
// ============================================================

function testFinalCompatibilityScore() {

  const testProfile = {

    ageRaw:
      "27 years, 10 months, 3 days",

    heightRaw:
      "५ फूट ३ इंच",

    incomeRaw:
      "मासिक उत्पन्न रु. ३५,००० ते ४०,०००",

    district:
      "पुणे (Pune)",

    education:
      "B.Com",

    profession:
      "Interior Designer",

    casteRaw:
      "हिंदू - देवांग कोष्टी",

    rashiRaw:
      "वृश्चिक"

  };


  const expectationCompatibility = {

    score:
      63,

    maxScore:
      92,

    percentage:
      68.48

  };


  const result =
    calculateFinalCompatibilityScore(
      false,
      expectationCompatibility,
      testProfile
    );


  console.log(
    "FINAL COMPATIBILITY TEST"
  );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}



// ============================================================
// ACTUAL PROFILE COMPATIBILITY
// ============================================================

// ============================================================
// ACTUAL PROFILE COMPATIBILITY
// ============================================================

// const profileCompatibility =
//   calculateActualProfileCompatibility(
//     viewerProfile,
//     normalizedCandidate
//   );

// Logger.log(
//   "PROFILE COMPATIBILITY RESULT: " +
//   JSON.stringify(profileCompatibility, null, 2)
// );


// ============================================================
// ACTUAL PROFILE COMPATIBILITY
// ============================================================
// Calculates compatibility using ACTUAL candidate profile data.
//
// HARD / OBJECTIVE CHECKS:
//   - Age
//   - Height
//   - Income
//   - District
//   - Caste
//   - Rashi
//   - Education
//   - Profession
//
// SOFT / PROFILE-EVIDENCE CHECKS:
//   - Educated
//   - Understanding
//   - Cultured
//   - Loving
//   - Respectful
//   - Career Supportive
//   - Dream Supportive
//
// IMPORTANT:
// UNKNOWN is NOT treated as MATCH.
// Only actual evidence can increase compatibility.
// ============================================================


/**
 * ============================================================
 * ACTUAL PROFILE COMPATIBILITY
 * ============================================================
 *
 * Compares VIEWER'S actual preferences/criteria against
 * CANDIDATE'S normalized profile.
 *
 * Result:
 * {
 *   applicable: true,
 *   percentage: 75,
 *   matched: 6,
 *   failed: 2,
 *   unknown: 0,
 *   totalChecks: 8,
 *   matchedCriteria: [...],
 *   failedCriteria: [...],
 *   unknownCriteria: [...]
 * }
 */



function calculateActualProfileCompatibility(
  actualProfileCriteria,
  compatibilityCandidate
) {

  const result = {
    applicable: false,
    percentage: 0,
    matched: 0,
    failed: 0,
    unknown: 0,
    totalChecks: 0,
    matchedCriteria: [],
    failedCriteria: [],
    unknownCriteria: []
  };

  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (
    !actualProfileCriteria ||
    !compatibilityCandidate
  ) {
    return result;
  }

  // ==========================================================
  // HELPERS
  // ==========================================================

  function hasValue(value) {

    return (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    );

  }


  function normalize(value) {

    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

  }


  function extractText(value) {

    if (!hasValue(value)) {
      return "";
    }

    if (
      typeof value !== "object"
    ) {

      return String(value);

    }

    const parts = [];

    if (hasValue(value.raw)) {
      parts.push(String(value.raw));
    }

    if (hasValue(value.normalized)) {
      parts.push(String(value.normalized));
    }

    if (hasValue(value.normalizedText)) {
      parts.push(String(value.normalizedText));
    }

    if (hasValue(value.value)) {
      parts.push(String(value.value));
    }

    if (hasValue(value.name)) {
      parts.push(String(value.name));
    }

    if (Array.isArray(value.categories)) {

      value.categories.forEach(
        function(item) {

          if (hasValue(item)) {
            parts.push(String(item));
          }

        }
      );

    }

    if (Array.isArray(value.values)) {

      value.values.forEach(
        function(item) {

          if (hasValue(item)) {
            parts.push(String(item));
          }

        }
      );

    }

    return parts.join(" ");

  }


  function extractNumber(value) {

    if (
      value === undefined ||
      value === null
    ) {
      return null;
    }

    if (
      typeof value === "number"
    ) {

      return isNaN(value)
        ? null
        : value;

    }

    if (
      typeof value === "object"
    ) {

      const possibleValues = [

        value.decimalAge,
        value.totalInches,
        value.value,
        value.number,
        value.amount,
        value.monthly,
        value.min

      ];

      for (
        let i = 0;
        i < possibleValues.length;
        i++
      ) {

        if (
          possibleValues[i] !== undefined &&
          possibleValues[i] !== null
        ) {

          const n =
            Number(
              possibleValues[i]
            );

          if (!isNaN(n)) {
            return n;
          }

        }

      }

      return null;

    }

    const n =
      Number(value);

    return isNaN(n)
      ? null
      : n;

  }

  // ==========================================================
  // TEXT COMPARISON
  // ==========================================================

  function compareText(
    expected,
    actual
  ) {

    if (!hasValue(expected)) {
      return null;
    }

    if (!hasValue(actual)) {
      return null;
    }

    const expectedText =
      normalize(
        extractText(expected)
      );

    const actualText =
      normalize(
        extractText(actual)
      );

    if (
      !expectedText ||
      !actualText
    ) {
      return null;
    }

    if (
      expectedText ===
      actualText
    ) {

      return true;

    }

    // --------------------------------------------------------
    // ARRAY EXPECTATION
    // --------------------------------------------------------

    if (
      Array.isArray(expected)
    ) {

      return expected.some(
        function(item) {

          const itemText =
            normalize(
              extractText(item)
            );

          if (!itemText) {
            return false;
          }

          return (
            actualText.includes(itemText) ||
            itemText.includes(actualText)
          );

        }
      );

    }

    // --------------------------------------------------------
    // COMMA SEPARATED EXPECTATION
    // --------------------------------------------------------

    const expectedValues =
      expectedText
        .split(",")
        .map(
          function(item) {
            return item.trim();
          }
        )
        .filter(Boolean);

    if (
      expectedValues.length > 1
    ) {

      return expectedValues.some(
        function(item) {

          return (
            actualText.includes(item) ||
            item.includes(actualText)
          );

        }
      );

    }

    return (
      actualText.includes(expectedText) ||
      expectedText.includes(actualText)
    );

  }

  // ==========================================================
  // ADD TEXT CHECK
  // ==========================================================

  function addCheck(
    name,
    expected,
    actual
  ) {

    /*
     * IMPORTANT:
     *
     * Never create a check when criteria is disabled.
     *
     * Example:
     *
     * {
     *   enabled: false,
     *   values: []
     * }
     *
     * must NOT become an UNKNOWN check.
     */

    if (
      expected &&
      typeof expected === "object" &&
      !Array.isArray(expected)
    ) {

      if (
        expected.enabled === false
      ) {

        return;

      }

      if (
        Array.isArray(expected.values) &&
        expected.values.length === 0
      ) {

        return;

      }

    }

    if (!hasValue(expected)) {
      return;
    }

    result.totalChecks++;
    result.applicable = true;

    const comparison =
      compareText(
        expected,
        actual
      );

    if (
      comparison === true
    ) {

      result.matched++;

      result.matchedCriteria.push({

        criterion:
          name,

        expected:
          expected,

        actual:
          extractText(actual)

      });

    }

    else if (
      comparison === false
    ) {

      result.failed++;

      result.failedCriteria.push({

        criterion:
          name,

        expected:
          expected,

        actual:
          extractText(actual)

      });

    }

    else {

      result.unknown++;

      result.unknownCriteria.push({

        criterion:
          name,

        expected:
          expected,

        actual:
          hasValue(actual)
            ? extractText(actual)
            : null

      });

    }

  }

  // ==========================================================
  // ADD RANGE CHECK
  // ==========================================================

  function addRangeCheck(
    name,
    minExpected,
    maxExpected,
    actualValue
  ) {

    if (
      !hasValue(minExpected) &&
      !hasValue(maxExpected)
    ) {

      return;

    }

    result.totalChecks++;
    result.applicable = true;

    const actual =
      extractNumber(
        actualValue
      );

    const min =
      hasValue(minExpected)
        ? Number(minExpected)
        : null;

    const max =
      hasValue(maxExpected)
        ? Number(maxExpected)
        : null;

    if (
      actual === null ||
      isNaN(actual)
    ) {

      result.unknown++;

      result.unknownCriteria.push({

        criterion:
          name,

        expected: {

          min:
            minExpected,

          max:
            maxExpected

        },

        actual:
          null

      });

      return;

    }

    let pass = true;

    if (
      min !== null &&
      !isNaN(min) &&
      actual < min
    ) {

      pass = false;

    }

    if (
      max !== null &&
      !isNaN(max) &&
      actual > max
    ) {

      pass = false;

    }

    if (pass) {

      result.matched++;

      result.matchedCriteria.push({

        criterion:
          name,

        expected: {

          min:
            minExpected,

          max:
            maxExpected

        },

        actual:
          actual

      });

    }

    else {

      result.failed++;

      result.failedCriteria.push({

        criterion:
          name,

        expected: {

          min:
            minExpected,

          max:
            maxExpected

        },

        actual:
          actual

      });

    }

  }

  // ==========================================================
  // CRITERIA
  // ==========================================================

  const criteria =
    actualProfileCriteria;

  console.log(
    "🔴 ACTUAL PROFILE CRITERIA:",
    JSON.stringify(
      criteria,
      null,
      2
    )
  );

  // ==========================================================
  // CANDIDATE
  // ==========================================================

  const candidate =
    compatibilityCandidate;

  // ==========================================================
  // 1. DISTRICT
  // ==========================================================

  /*
   * Supports both:
   *
   * criteria.district
   *
   * and:
   *
   * criteria.districts
   */

  let districtCriteria =
    criteria.district;

  if (
    !hasValue(districtCriteria) &&
    Array.isArray(criteria.districts) &&
    criteria.districts.length > 0
  ) {

    districtCriteria =
      criteria.districts;

  }

  addCheck(
    "district",
    districtCriteria,
    candidate.district
  );

  // ==========================================================
  // 2. EDUCATION
  // ==========================================================

  let educationCriteria =
    criteria.education;

  if (
    !hasValue(educationCriteria) &&
    Array.isArray(criteria.educationCategories) &&
    criteria.educationCategories.length > 0
  ) {

    educationCriteria =
      criteria.educationCategories;

  }

  addCheck(
    "education",
    educationCriteria,
    candidate.education
  );

  // ==========================================================
  // 3. PROFESSION
  // ==========================================================

  let professionCriteria =
    criteria.profession;

  if (
    !hasValue(professionCriteria) &&
    Array.isArray(criteria.professionCategories) &&
    criteria.professionCategories.length > 0
  ) {

    professionCriteria =
      criteria.professionCategories;

  }

  addCheck(
    "profession",
    professionCriteria,
    candidate.profession
  );

      // ==========================================================
      // 4. EMPLOYMENT TYPE
      // ==========================================================

      const expectedEmploymentType =
        String(
          criteria.employmentType || ""
        )
          .trim()
          .toUpperCase();

      const actualEmploymentType =
        String(
          candidate.employmentType || ""
        )
          .trim()
          .toUpperCase();


      // ----------------------------------------------------------
      // NOT_SPECIFIED = NO EMPLOYMENT PREFERENCE
      // ----------------------------------------------------------

      if (
        expectedEmploymentType &&
        expectedEmploymentType !== "NOT_SPECIFIED"
      ) {

        result.totalChecks++;
        result.applicable = true;


        // --------------------------------------------------------
        // CANDIDATE EMPLOYMENT TYPE AVAILABLE
        // --------------------------------------------------------

        if (
          actualEmploymentType &&
          actualEmploymentType !== "NOT_SPECIFIED"
        ) {

          if (
            actualEmploymentType ===
            expectedEmploymentType
          ) {

            result.matched++;

            result.matchedCriteria.push({

              criterion:
                "employmentType",

              expected:
                expectedEmploymentType,

              actual:
                actualEmploymentType

            });

          }

          else {

            result.failed++;

            result.failedCriteria.push({

              criterion:
                "employmentType",

              expected:
                expectedEmploymentType,

              actual:
                actualEmploymentType

            });

          }

        }


        // --------------------------------------------------------
        // CANDIDATE EMPLOYMENT TYPE UNKNOWN
        // --------------------------------------------------------

        else {

          result.unknown++;

          result.unknownCriteria.push({

            criterion:
              "employmentType",

            expected:
              expectedEmploymentType,

            actual:
              null

          });

        }

      }

  
    // ==========================================================
    // 5. CASTE
    // ==========================================================

    const casteCriteria =
      criteria.caste;

    if (
      casteCriteria &&
      typeof casteCriteria === "object" &&
      !Array.isArray(casteCriteria)
    ) {

      if (
        casteCriteria.enabled === true &&
        Array.isArray(casteCriteria.values) &&
        casteCriteria.values.length > 0
      ) {

        addCheck(
          "caste",
          casteCriteria.values,
          candidate.caste ||
          candidate.casteRaw
        );

      }

    }
    else {

      // Direct format:
      // caste: "देवांग कोष्टी"

      addCheck(
        "caste",
        casteCriteria,
        candidate.caste ||
        candidate.casteRaw
      );

    }


    // ==========================================================
    // 6. RASHI
    // ==========================================================

    const rashiCriteria =
      criteria.rashi;

    if (
      rashiCriteria &&
      typeof rashiCriteria === "object" &&
      !Array.isArray(rashiCriteria)
    ) {

      if (
        rashiCriteria.enabled === true &&
        Array.isArray(rashiCriteria.values) &&
        rashiCriteria.values.length > 0
      ) {

        addCheck(
          "rashi",
          rashiCriteria.values,
          candidate.rashi ||
          candidate.rashiRaw
        );

      }

    }
    else {

      // Direct format:
      // rashi: "कन्या"

      addCheck(
        "rashi",
        rashiCriteria,
        candidate.rashi ||
        candidate.rashiRaw
      );

    }

  // ==========================================================
  // 7. AGE
  // ==========================================================

  let minAge =
    criteria.minAge;

  let maxAge =
    criteria.maxAge;

  /*
   * Support normalized format:
   *
   * criteria.age = {
   *   enabled: true,
   *   min: 28,
   *   max: 34
   * }
   */

  if (
    criteria.age &&
    typeof criteria.age === "object" &&
    criteria.age.enabled === true
  ) {

    if (
      hasValue(criteria.age.min)
    ) {

      minAge =
        criteria.age.min;

    }

    if (
      hasValue(criteria.age.max)
    ) {

      maxAge =
        criteria.age.max;

    }

  }

  addRangeCheck(
    "age",
    minAge,
    maxAge,
    candidate.age
  );

  // ==========================================================
  // 8. HEIGHT
  // ==========================================================

  let minHeight =
    criteria.minHeight;

  let maxHeight =
    criteria.maxHeight;

  /*
   * Support normalized format:
   *
   * criteria.height = {
   *   enabled: true,
   *   minInches: 65,
   *   maxInches: 70
   * }
   */

  if (
    criteria.height &&
    typeof criteria.height === "object" &&
    criteria.height.enabled === true
  ) {

    if (
      hasValue(criteria.height.minInches)
    ) {

      minHeight =
        criteria.height.minInches;

    }

    if (
      hasValue(criteria.height.maxInches)
    ) {

      maxHeight =
        criteria.height.maxInches;

    }

  }

  addRangeCheck(
    "height",
    minHeight,
    maxHeight,
    candidate.height
  );

  


    // ==========================================================
    // 9. INCOME
    // ==========================================================

    const expectedMinIncome =
      Number(
        actualProfileCriteria.minIncome
      );

    const expectedMaxIncome =
      Number(
        actualProfileCriteria.maxIncome
      );

    const candidateIncome =
      candidate.income || {};

    const candidateMinIncome =
      Number(candidateIncome.min);

    const candidateMaxIncome =
      Number(candidateIncome.max);

    const candidateIncomeValue =
      Number(candidateIncome.value);


    // ----------------------------------------------------------
    // Determine candidate income range
    // ----------------------------------------------------------

    let candidateIncomeMin = null;

    let candidateIncomeMax = null;


    // Candidate has an income range
    if (
      Number.isFinite(candidateMinIncome) &&
      Number.isFinite(candidateMaxIncome)
    ) {

      candidateIncomeMin =
        candidateMinIncome;

      candidateIncomeMax =
        candidateMaxIncome;

    }


    // Candidate has only a single income value
    else if (
      Number.isFinite(candidateIncomeValue)
    ) {

      candidateIncomeMin =
        candidateIncomeValue;

      candidateIncomeMax =
        candidateIncomeValue;

    }


    // ----------------------------------------------------------
    // Validate expected income range
    // ----------------------------------------------------------

    const hasExpectedIncomeRange =
      Number.isFinite(expectedMinIncome) ||
      Number.isFinite(expectedMaxIncome);


    // ----------------------------------------------------------
    // Perform income compatibility check
    // ----------------------------------------------------------

    if (
      hasExpectedIncomeRange &&
      candidateIncomeMin !== null &&
      candidateIncomeMax !== null
    ) {

      const expectedRange = {

        min:
          Number.isFinite(expectedMinIncome)
            ? expectedMinIncome
            : null,

        max:
          Number.isFinite(expectedMaxIncome)
            ? expectedMaxIncome
            : null

      };


      const candidateRange = {

        min:
          candidateIncomeMin,

        max:
          candidateIncomeMax

      };


      // --------------------------------------------------------
      // RANGE OVERLAP
      //
      // Viewer:    15,000 - 30,000
      // Candidate: 20,000 - 25,000
      //
      // => MATCH
      // --------------------------------------------------------

      const incomeMatches =
        (
          expectedRange.min === null ||
          candidateRange.max >=
          expectedRange.min
        ) &&
        (
          expectedRange.max === null ||
          candidateRange.min <=
          expectedRange.max
        );


      if (
        incomeMatches
      ) {

        result.matchedCriteria.push({

          criterion:
            "income",

          expected:
            expectedRange,

          actual:
            candidateRange.min ===
            candidateRange.max
              ? candidateRange.min
              : candidateRange

        });

        result.matched++;

      }


      else {

        result.failedCriteria.push({

          criterion:
            "income",

          expected:
            expectedRange,

          actual:
            candidateRange

        });

        result.failed++;

      }


      result.totalChecks++;

    }


    // ----------------------------------------------------------
    // Income requirement exists but candidate income unavailable
    // ----------------------------------------------------------

    else if (
      hasExpectedIncomeRange
    ) {

      result.unknownCriteria.push({

        criterion:
          "income",

        expected: {

          min:
            Number.isFinite(
              expectedMinIncome
            )
              ? expectedMinIncome
              : null,

          max:
            Number.isFinite(
              expectedMaxIncome
            )
              ? expectedMaxIncome
              : null

        },

        actual:
          candidate.income || null

      });

      result.unknown++;

      result.totalChecks++;

    }






  // ==========================================================
  // FINAL PERCENTAGE
  // ==========================================================

  const knownChecks =
    result.matched +
    result.failed;

  if (
    knownChecks > 0
  ) {

    result.percentage =
      Number(

        (
          result.matched /
          knownChecks *
          100

        ).toFixed(2)

      );

  }
  else {

    result.percentage = 0;

  }

  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log(
    "🟢 ACTUAL PROFILE COMPATIBILITY:",
    JSON.stringify(
      result,
      null,
      2
    )
  );

  return result;

}


// ============================================================
// TEST ACTUAL PROFILE COMPATIBILITY
// ============================================================

function testActualProfileCompatibility() {

  const viewerProfile = {

    id:
      "ID628",

    name:
      "Shrutika Ashok Ware"

  };


  const candidateProfile = {

    id:
      "ID001",

    name:
      "अक्षय माधवी सुभाष बुचडे",

    ageRaw:
      "32 years, 4 months, 6 days",

    heightRaw:
      "५ फूट ७ इंच",

    incomeRaw:
      "मासिक उत्पन्न रु. १५,००० ते २०,०००",

    district:
      "कोल्हापूर (Kolhapur)",

    educationRaw:
      "BE computer science & engineering",

    education:
      "BE computer science & engineering",

    professionRaw:
      "Entrepreneur in Web Design & Development",

    profession:
      "Entrepreneur in Web Design & Development",

    casteRaw:
      "हिंदू - देवांग कोष्टी",

    rashiRaw:
      "कन्या"

  };


  // ==========================================================
  // TEST EXPECTATION
  // ==========================================================

  const expectation =
    "Age 28 to 32, height 5'5 to 5'8, income 15000 to 70000, Pune or Kolhapur, BE or MBA, Engineering and Technology, Hindu Devang Koshti, Rashi Kanya, understanding, respectful, family-oriented";


  // ==========================================================
  // PARSE EXPECTATION
  // ==========================================================

  const criteria =
    parseExpectationCriteria(
      expectation
    );


  // ==========================================================
  // PROFILE COMPATIBILITY
  // ==========================================================

  const result =
    calculateActualProfileCompatibility(
      viewerProfile,
      candidateProfile,
      criteria
    );


  // ==========================================================
  // ONLY REQUIRED TEST OUTPUT
  // ==========================================================

  console.log(
    "ACTUAL PROFILE COMPATIBILITY TEST"
  );

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}
// ============================================================
// FINAL COMPATIBILITY SCORE V2
// ============================================================

function calculateFinalCompatibilityScoreV2(
  hardScore,
  expectationPercentage,
  profilePercentage
) {

  // ==========================================================
  // WEIGHTS
  // ==========================================================

  const HARD_WEIGHT = 50;
  const EXPECTATION_WEIGHT = 30;
  const PROFILE_WEIGHT = 20;


  // ==========================================================
  // NORMALIZE INPUTS
  // ==========================================================

  const hard =
    Math.max(
      0,
      Math.min(
        100,
        Number(hardScore) || 0
      )
    );


  const expectation =
    Math.max(
      0,
      Math.min(
        100,
        Number(expectationPercentage) || 0
      )
    );


  const profile =
    Math.max(
      0,
      Math.min(
        100,
        Number(profilePercentage) || 0
      )
    );


  // ==========================================================
  // WEIGHTED SCORES
  // ==========================================================

  const hardContribution =
    hard *
    HARD_WEIGHT /
    100;


  const expectationContribution =
    expectation *
    EXPECTATION_WEIGHT /
    100;


  const profileContribution =
    profile *
    PROFILE_WEIGHT /
    100;


  // ==========================================================
  // FINAL SCORE
  // ==========================================================

  const finalScore =
    hardContribution +
    expectationContribution +
    profileContribution;


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    finalScore:
      Number(
        finalScore.toFixed(2)
      ),

    finalPercentage:
      Number(
        finalScore.toFixed(2)
      ),


    hardScore:
      hard,

    hardWeight:
      HARD_WEIGHT,

    hardContribution:
      Number(
        hardContribution.toFixed(2)
      ),


    expectationScore:
      Number(
        expectationContribution.toFixed(2)
      ),

    expectationPercentage:
      expectation,

    expectationWeight:
      EXPECTATION_WEIGHT,

    expectationContribution:
      Number(
        expectationContribution.toFixed(2)
      ),


    profileScore:
      Number(
        profileContribution.toFixed(2)
      ),

    profilePercentage:
      profile,

    profileWeight:
      PROFILE_WEIGHT,

    profileContribution:
      Number(
        profileContribution.toFixed(2)
      )

  };

}


// ============================================================
// TEST FINAL COMPATIBILITY SCORE V2
// ============================================================

function testFinalCompatibilityScoreV2() {

  // ----------------------------------------------------------
  // Example values from our validated profile test
  // ----------------------------------------------------------

  const hardScore =
    0;


  const expectationPercentage =
    68.48;


  const profilePercentage =
    75;


  const result =
    calculateFinalCompatibilityScoreV2(

      hardScore,

      expectationPercentage,

      profilePercentage

    );


  console.log(
    "=================================================="
  );


  console.log(
    "FINAL COMPATIBILITY SCORE V2"
  );


  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}


function calculateCandidateFinalRankingScoreV2(
  matchResult,
  expectationCompatibilityPercentage,
  profileCompatibilityPercentage
) {

  const hardScore =
    Number(
      matchResult &&
      matchResult.hardScore
        ? matchResult.hardScore
        : 0
    );


  const expectationScore =
    Number(
      expectationCompatibilityPercentage || 0
    );


  const profileScore =
    Number(
      profileCompatibilityPercentage || 0
    );


  const final =
    calculateFinalCompatibilityScoreV2(

      hardScore,

      expectationScore,

      profileScore

    );


  return final;

}



function testDirectProfileCompatibility() {

  const viewerProfile = {

    id:
      "ID628",

    name:
      "Shrutika Ashok Ware"

  };


  const candidateProfile = {

    id:
      "ID001",

    name:
      "अक्षय माधवी सुभाष बुचडे",

    ageRaw:
      "32 years, 4 months, 6 days",

    heightRaw:
      "५ फूट ७ इंच",

    incomeRaw:
      "मासिक उत्पन्न रु. १५,००० ते २०,०००",

    district:
      "कोल्हापूर (Kolhapur)",

    educationRaw:
      "BE computer science & engineering",

    education:
      "BE computer science & engineering",

    professionRaw:
      "Entrepreneur in Web Design & Development",

    profession:
      "Entrepreneur in Web Design & Development",

    casteRaw:
      "हिंदू - देवांग कोष्टी",

    rashiRaw:
      "कन्या"

  };


  const expectation =
    "Age 28 to 32, height 5'5 to 5'8, income 15000 to 70000, Pune or Kolhapur, BE or MBA, Engineering and Technology, Hindu Devang Koshti, Rashi Kanya, understanding, respectful, family-oriented";


  const criteria =
    parseExpectationCriteria(
      expectation
    );


  console.log(
    "DIRECT PROFILE TEST START"
  );


  const result =
    calculateActualProfileCompatibility(
      viewerProfile,
      candidateProfile,
      criteria
    );


  console.log(
    "DIRECT PROFILE TEST RESULT:",
    JSON.stringify(
      result,
      null,
      2
    )
  );


  return result;

}




function testActualProfileCompatibilityStandalone() {

  console.log(
    "=============================================="
  );

  console.log(
    "🧪 STANDALONE ACTUAL PROFILE COMPATIBILITY TEST"
  );

  console.log(
    "=============================================="
  );


  // ==========================================================
  // 1. TEST VIEWER
  // ==========================================================

  const viewerProfile = {

    id:
      "TEST_VIEWER_001",

    name:
      "Test Bride",

    type:
      "bride",

    criteria: {

      district:
        "कोल्हापूर",

      education:
        "Engineering",

      profession:
        "IT",

      employmentType:
        "BUSINESS",

      caste:
        "देवांग कोष्टी",

      rashi:
        "कन्या",

      minAge:
        28,

      maxAge:
        34,

      minHeight:
        65,

      maxHeight:
        70,

      // ------------------------------------------------------
      // RAW INCOME FOR TEST
      // ------------------------------------------------------

      income:
        "१५,००० ते ३०,०००"

    }

  };


  // ==========================================================
  // 2. TEST CANDIDATE
  // ==========================================================

  const candidateProfile = {

    id:
      "TEST_CANDIDATE_001",

    name:
      "Test Groom",

    type:
      "groom",

    district: {

      raw:
        "कोल्हापूर (Kolhapur)",

      normalized:
        "कोल्हापूर kolhapur"

    },

    education: {

      raw:
        "BE Computer Science",

      categories: [

        "Engineering & Technology"

      ]

    },

    profession: {

      raw:
        "Entrepreneur in IT and Software",

      categories: [

        "IT & Software"

      ]

    },

    employmentType:
      "BUSINESS",

    caste: {

      raw:
        "हिंदू - देवांग कोष्टी",

      normalized:
        "हिंदू देवांग कोष्टी"

    },

    rashi: {

      raw:
        "कन्या",

      normalized:
        "कन्या"

    },

    age: {

      decimalAge:
        32

    },

    height: {

      totalInches:
        67

    },

    income: {

      min:
        20000,

      max:
        25000,

      value:
        null

    }

  };


  // ==========================================================
  // 3. EXTRACT CRITERIA
  // ==========================================================

  const actualProfileCriteria = {

    ...viewerProfile.criteria

  };


  // ==========================================================
  // 4. NORMALIZE RAW INCOME
  // ==========================================================

  const incomeRange =
    parseActualProfileIncomeRange(
      actualProfileCriteria.income
    );


  actualProfileCriteria.minIncome =
    incomeRange.minIncome;


  actualProfileCriteria.maxIncome =
    incomeRange.maxIncome;


  // Keep raw income for debugging if required.
  // It does not participate directly in calculation.


  // ==========================================================
  // 5. VALIDATION
  // ==========================================================

  if (
    !actualProfileCriteria ||
    typeof actualProfileCriteria !== "object"
  ) {

    console.error(
      "❌ TEST FAILED: Actual profile criteria not found."
    );

    return {

      applicable:
        false,

      percentage:
        0,

      matched:
        0,

      failed:
        0,

      unknown:
        0,

      totalChecks:
        0

    };

  }


  // ==========================================================
  // 6. DISPLAY CRITERIA
  // ==========================================================

  console.log(
    "🔴 TEST VIEWER CRITERIA:"
  );

  console.log(
    JSON.stringify(
      actualProfileCriteria,
      null,
      2
    )
  );


  // ==========================================================
  // 7. DISPLAY CANDIDATE
  // ==========================================================

  console.log(
    "🔵 TEST CANDIDATE:"
  );

  console.log(
    JSON.stringify(
      candidateProfile,
      null,
      2
    )
  );


  // ==========================================================
  // 8. CALL ACTUAL COMPATIBILITY FUNCTION
  // ==========================================================

  let result = null;


  try {

    result =
      calculateActualProfileCompatibility(
        actualProfileCriteria,
        candidateProfile
      );

  }

  catch (error) {

    console.error(
      "❌ ACTUAL PROFILE COMPATIBILITY TEST ERROR:",
      error &&
      error.stack
        ? error.stack
        : String(error)
    );

    return null;

  }


  // ==========================================================
  // 9. DISPLAY RESULT
  // ==========================================================

  console.log(
    "🟢 ACTUAL PROFILE COMPATIBILITY RESULT:"
  );

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );


  // ==========================================================
  // 10. SUMMARY
  // ==========================================================

  console.log(
    "=============================================="
  );

  console.log(
    "📊 TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {

        applicable:
          result?.applicable || false,

        percentage:
          result?.percentage || 0,

        matched:
          result?.matched || 0,

        failed:
          result?.failed || 0,

        unknown:
          result?.unknown || 0,

        totalChecks:
          result?.totalChecks || 0

      },
      null,
      2
    )
  );

  console.log(
    "=============================================="
  );


  // ==========================================================
  // 11. EXPECTED RESULT
  // ==========================================================

  const expected = {

    applicable:
      true,

    percentage:
      100,

    matched:
      9,

    failed:
      0,

    unknown:
      0,

    totalChecks:
      9

  };


  const passed =
    result &&
    result.applicable === expected.applicable &&
    result.percentage === expected.percentage &&
    result.matched === expected.matched &&
    result.failed === expected.failed &&
    result.unknown === expected.unknown &&
    result.totalChecks === expected.totalChecks;


  if (passed) {

    console.log(
      "✅ STANDALONE TEST PASSED: 9/9 = 100%"
    );

  }

  else {

    console.log(
      "⚠️ STANDALONE TEST RESULT IS NOT 9/9."
    );

    console.log(
      "EXPECTED:",
      JSON.stringify(
        expected,
        null,
        2
      )
    );

    console.log(
      "ACTUAL:",
      JSON.stringify(
        result,
        null,
        2
      )
    );

  }


  // ==========================================================
  // 12. RETURN
  // ==========================================================

  return result;

}



function parseActualProfileIncomeRange(value) {

  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {

    return {
      minIncome: null,
      maxIncome: null
    };

  }


  const marathiDigits =
    "०१२३४५६७८९";

  const englishDigits =
    "0123456789";


  const normalizedText =
    String(value)
      .trim()

      .replace(
        /[०-९]/g,
        digit =>
          englishDigits[
            marathiDigits.indexOf(digit)
          ]
      )

      .replace(/,/g, "");


  const numbers =
    normalizedText.match(
      /\d+(?:\.\d+)?/g
    );


  if (
    !numbers ||
    numbers.length === 0
  ) {

    return {
      minIncome: null,
      maxIncome: null
    };

  }


  const values =
    numbers
      .map(Number)
      .filter(
        Number.isFinite
      );


  if (
    values.length >= 2
  ) {

    return {

      minIncome:
        values[0],

      maxIncome:
        values[1]

    };

  }


  if (
    values.length === 1
  ) {

    return {

      minIncome:
        values[0],

      maxIncome:
        values[0]

    };

  }


  return {

    minIncome:
      null,

    maxIncome:
      null

  };

}


