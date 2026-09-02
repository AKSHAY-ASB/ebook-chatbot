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


    console.log(
      "========== EXPECTATION CRITERIA DEBUG =========="
    );

    console.log(
      JSON.stringify(
        {
          raw:
            expectationCriteria.raw || "",

          hasHardCriteria:
            expectationCriteria.hasHardCriteria,

          educationCategories:
            expectationCriteria.educationCategories || [],

          professionCategories:
            expectationCriteria.professionCategories || [],

          employmentTypes:
            expectationCriteria.employmentTypes || [],

          educationRequired:
            expectationCriteria.educationRequired,

          employmentRequired:
            expectationCriteria.employmentRequired,

          age:
            expectationCriteria.age || {},

          height:
            expectationCriteria.height || {},

          districts:
            expectationCriteria.districts || [],

          income:
            expectationCriteria.income || {},

          caste:
            expectationCriteria.caste || {},

          rashi:
            expectationCriteria.rashi || {},

          hasSoftPreferences:
            expectationCriteria.hasSoftPreferences
        },
        null,
        2
      )
    );


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

        console.log(
        "========== HARD MATCH INPUT ==========",
        JSON.stringify(
          {
            candidateId:
              candidate.id,

            candidateName:
              candidate.name,

            expectationRaw:
              expectationCriteria.raw,

            hasHardCriteria:
              expectationCriteria.hasHardCriteria,

            educationRequired:
              expectationCriteria.educationRequired,

            educationCategories:
              expectationCriteria.educationCategories,

            professionCategories:
              expectationCriteria.professionCategories,

            employmentTypes:
              expectationCriteria.employmentTypes,

            age:
              expectationCriteria.age,

            height:
              expectationCriteria.height,

            districts:
              expectationCriteria.districts,

            income:
              expectationCriteria.income,

            caste:
              expectationCriteria.caste,

            rashi:
              expectationCriteria.rashi
          },
          null,
          2
        )
      );
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
          "profession"
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
  // HARD MATCH DIAGNOSTIC
  // ==========================================================

  console.log(
    "🔥 HARD MATCH DIAGNOSTIC:",
    JSON.stringify(
      {
        candidateId:
          candidate.id || "",

        candidateName:
          candidate.name || "",

        education:
          educationCheck,

        educationRequired:
          educationRequiredCheck,

        profession:
          professionCheck,

        employment:
          employmentCheck,

        age:
          ageCheck,

        height:
          heightCheck,

        income:
          incomeCheck,

        district:
          districtCheck,

        caste:
          casteCheck,

        rashi:
          rashiCheck,

        applicableCriteria:
          applicableCriteria,

        matchedCriteria:
          matchedCriteria,

        failedCriteria:
          failedCriteria

      },
      null,
      2
    )
  );
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

  // ==========================================================
  // SAFE INPUT
  // ==========================================================

  const safeCandidate =
    candidate || {};

  const safeCriteria =
    criteria || {};


  // ==========================================================
  // EXPECTED EDUCATION
  //
  // Support BOTH:
  //
  // 1. criteria.educationCategories
  // 2. criteria.education
  //
  // Example:
  // educationCategories:
  // ["Engineering & Technology"]
  //
  // OR:
  // education:
  // "B.E (IT)"
  // ==========================================================

  let expectedCategories =
    Array.isArray(
      safeCriteria.educationCategories
    )
      ? safeCriteria.educationCategories.slice()
      : [];


  let expectedRaw =
    "";


  if (
    safeCriteria.education !== null &&
    safeCriteria.education !== undefined
  ) {

    if (
      Array.isArray(
        safeCriteria.education
      )
    ) {

      expectedCategories =
        expectedCategories.concat(
          safeCriteria.education
        );

    }

    else if (
      typeof safeCriteria.education === "object"
    ) {

      if (
        Array.isArray(
          safeCriteria.education.categories
        )
      ) {

        expectedCategories =
          expectedCategories.concat(
            safeCriteria.education.categories
          );

      }

      expectedRaw =
        String(
          safeCriteria.education.raw || ""
        );

    }

    else {

      expectedRaw =
        String(
          safeCriteria.education || ""
        );

    }

  }


  // ==========================================================
  // REMOVE DUPLICATES
  // ==========================================================

  expectedCategories =
    Array.from(
      new Set(
        expectedCategories
          .map(function(value) {

            return String(
              value || ""
            )
              .trim();

          })
          .filter(Boolean)
      )
    );


  // ==========================================================
  // NO EDUCATION REQUIREMENT
  // ==========================================================

  if (
    expectedCategories.length === 0 &&
    !expectedRaw.trim()
  ) {

    return {

      criterion:
        "education",

      applicable:
        false,

      matched:
        true,

      expectedCategories:
        [],

      candidateCategories:
        [],

      matchedCategories:
        []

    };

  }


  // ==========================================================
  // CANDIDATE EDUCATION
  // ==========================================================

  const candidateEducation =
    safeCandidate.education || null;


  let candidateCategories =
    candidateEducation &&
    Array.isArray(
      candidateEducation.categories
    )
      ? candidateEducation.categories.slice()
      : [];


  const candidateRaw =
    candidateEducation
      ? String(
          candidateEducation.raw || ""
        )
      : "";


  // ==========================================================
  // NORMALIZE EDUCATION TEXT
  // ==========================================================

  function normalizeEducationText(
    value
  ) {

    return String(
      value || ""
    )
      .toLowerCase()
      .replace(/[().,\/\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  const normalizedExpectedRaw =
    normalizeEducationText(
      expectedRaw
    );


  const normalizedCandidateRaw =
    normalizeEducationText(
      candidateRaw
    );


  const normalizedExpectedCategories =
    expectedCategories
      .map(
        normalizeEducationText
      )
      .filter(Boolean);


  const normalizedCandidateCategories =
    candidateCategories
      .map(
        normalizeEducationText
      )
      .filter(Boolean);


  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log(
    "EDUCATION MATCH DEBUG:",
    JSON.stringify(
      {

        expectedRaw:
          normalizedExpectedRaw,

        expectedCategories:
          normalizedExpectedCategories,

        candidateRaw:
          normalizedCandidateRaw,

        candidateCategories:
          normalizedCandidateCategories

      },
      null,
      2
    )
  );


  // ==========================================================
  // EMPTY CANDIDATE EDUCATION
  // ==========================================================

  if (
    !normalizedCandidateRaw &&
    normalizedCandidateCategories.length === 0
  ) {

    return {

      criterion:
        "education",

      applicable:
        true,

      matched:
        false,

      expectedCategories:
        expectedCategories,

      candidateCategories:
        candidateCategories,

      matchedCategories:
        [],

      reason:
        "Candidate education unavailable."

    };

  }


  // ==========================================================
  // 1. DIRECT CATEGORY MATCH
  // ==========================================================

  const matchedCategories =
    normalizedExpectedCategories.filter(
      function(expectedCategory) {

        return normalizedCandidateCategories.some(
          function(candidateCategory) {

            return (
              expectedCategory ===
              candidateCategory
            );

          }
        );

      }
    );


  if (
    matchedCategories.length > 0
  ) {

    console.log(
      "🟢 EDUCATION CATEGORY MATCH"
    );

    return {

      criterion:
        "education",

      applicable:
        true,

      matched:
        true,

      expectedCategories:
        expectedCategories,

      candidateCategories:
        candidateCategories,

      matchedCategories:
        matchedCategories

    };

  }


  // ==========================================================
  // 2. ENGINEERING DEGREE COMPATIBILITY
  //
  // B.E
  // B.E. (IT)
  // BE
  // BE CSE
  // B.Tech
  // M.E
  // M.Tech
  //
  // All are Engineering & Technology.
  // ==========================================================

  const engineeringDegreePattern =
    /\b(?:b\s*e|be|b\s*tech|btech|m\s*e|me|m\s*tech|mtech)\b/i;


  const expectedEngineering =
    engineeringDegreePattern.test(
      normalizedExpectedRaw
    ) ||
    normalizedExpectedCategories.includes(
      "engineering & technology"
    );


  const candidateEngineering =
    engineeringDegreePattern.test(
      normalizedCandidateRaw
    ) ||
    normalizedCandidateCategories.includes(
      "engineering & technology"
    );


  if (
    expectedEngineering &&
    candidateEngineering
  ) {

    console.log(
      "🟢 EDUCATION ENGINEERING DEGREE MATCH"
    );

    return {

      criterion:
        "education",

      applicable:
        true,

      matched:
        true,

      expectedCategories:
        expectedCategories,

      candidateCategories:
        candidateCategories,

      matchedCategories:
        [
          "Engineering & Technology"
        ]

    };

  }


  // ==========================================================
  // 3. COMPUTER / IT ENGINEERING
  // ==========================================================

  const computerEngineeringPattern =
    /\b(?:computer|cse|it|information technology|computer science|computer engineering)\b/i;


  const expectedComputerEngineering =
    computerEngineeringPattern.test(
      normalizedExpectedRaw
    );


  const candidateComputerEngineering =
    computerEngineeringPattern.test(
      normalizedCandidateRaw
    );


  if (
    expectedComputerEngineering &&
    candidateComputerEngineering
  ) {

    console.log(
      "🟢 EDUCATION COMPUTER / IT ENGINEERING MATCH"
    );

    return {

      criterion:
        "education",

      applicable:
        true,

      matched:
        true,

      expectedCategories:
        expectedCategories,

      candidateCategories:
        candidateCategories,

      matchedCategories:
        [
          "Computer / IT Engineering"
        ]

    };

  }


  // ==========================================================
  // 4. FINAL NO MATCH
  // ==========================================================

  console.log(
    "🔴 EDUCATION COMPATIBILITY FALSE"
  );


  return {

    criterion:
      "education",

    applicable:
      true,

    matched:
      false,

    expectedCategories:
      expectedCategories,

    expectedRaw:
      expectedRaw,

    candidateCategories:
      candidateCategories,

    candidateRaw:
      candidateRaw,

    matchedCategories:
      []

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

  // ==========================================================
  // EXPECTED PROFESSION CATEGORIES
  // ==========================================================

  let expectedCategories = [];


  if (
    Array.isArray(
      criteria.professionCategories
    )
  ) {

    expectedCategories =
      criteria.professionCategories.slice();

  }


  // ----------------------------------------------------------
  // FALLBACK
  // ----------------------------------------------------------

  if (
    expectedCategories.length === 0 &&
    Array.isArray(
      criteria.profession
    )
  ) {

    expectedCategories =
      criteria.profession.slice();

  }


  // ==========================================================
  // NO PROFESSION CRITERIA
  // ==========================================================

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

      expectedCategories:
        [],

      candidateCategories:
        [],

      matchedCategories:
        []

    };

  }


  // ==========================================================
  // CANDIDATE PROFESSION
  // ==========================================================

  const candidateProfession =
    candidate &&
    candidate.profession
      ? candidate.profession
      : null;


  const candidateCategories =
    candidateProfession &&
    Array.isArray(
      candidateProfession.categories
    )
      ? candidateProfession.categories
      : [];


  // ==========================================================
  // NORMALIZE CATEGORY VALUES
  // ==========================================================

  const normalizedExpectedCategories =
    expectedCategories
      .map(
        function(category) {

          return String(
            category || ""
          )
          .trim()
          .toLowerCase();

        }
      )
      .filter(Boolean);


  const normalizedCandidateCategories =
    candidateCategories
      .map(
        function(category) {

          return String(
            category || ""
          )
          .trim()
          .toLowerCase();

        }
      )
      .filter(Boolean);


  // ==========================================================
  // CATEGORY MATCH ONLY
  //
  // IMPORTANT:
  //
  // DO NOT compare:
  //
  // J P Morgan Chase
  // Infosys
  // ArtCode Pvt Limited
  //
  // against profession.
  //
  // ONLY normalized categories are compared.
  // ==========================================================

  const matchedCategories =
    normalizedExpectedCategories.filter(
      function(expectedCategory) {

        return normalizedCandidateCategories.some(
          function(candidateCategory) {

            return (
              candidateCategory ===
              expectedCategory
            );

          }
        );

      }
    );


  // ==========================================================
  // RESULT
  // ==========================================================

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


  let totalRequiredPreferences =
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

      // ========================================================
      // RAW SCORE PERCENTAGE
      //
      // Example:
      // 10 / 70 = 14.29%
      //
      // This considers ALL requested preferences.
      // ========================================================

      percentage:
        Number(
          rawPreferencePercentage.toFixed(2)
        ),


      // ========================================================
      // SOFT MATCH PERCENTAGE
      //
      // IMPORTANT:
      // Use RAW SCORE percentage here.
      //
      // DO NOT use verifiedCompatibility here.
      //
      // Otherwise:
      // 1 MATCH + 6 UNKNOWN
      // becomes 100%, which is misleading.
      // ========================================================

      softMatchPercentage:
        Number(
          rawPreferencePercentage.toFixed(2)
        ),


      // ========================================================
      // VERIFIED COMPATIBILITY
      //
      // MATCH / (MATCH + CONFLICT)
      //
      // UNKNOWN excluded.
      //
      // Keep this separately for diagnostics.
      // DO NOT use this as the main ranking percentage.
      // ========================================================

      verifiedCompatibility:
        Number(
          verifiedCompatibility.toFixed(2)
        ),


      // ========================================================
      // DATA COVERAGE
      // ========================================================

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

  const safeProfile =
    candidateProfile || {};


  // ==========================================================
  // BUILD ACTUAL PROFILE EVIDENCE
  //
  // IMPORTANT:
  // This function evaluates the requested preference against
  // the ACTUAL PROFILE of the person being evaluated.
  //
  // It does NOT use the person's expectation as evidence.
  //
  // Example:
  //
  // Candidate expectation:
  // "सुशिक्षित, समजूतदार असावी"
  //
  // Candidate being evaluated:
  // Viewer profile
  //
  // Therefore:
  // "educated" / "understanding"
  // must be checked against Viewer actual profile.
  // ==========================================================

  const candidateText =
    buildCandidateSoftPreferenceText(
      safeProfile
    );


  const safePreference =
    String(
      preference || ""
    )
    .trim();


  if (!safePreference) {

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
        "No preference supplied."

    };

  }


  // ==========================================================
  // EDUCATED
  //
  // Education is verified from actual education data.
  //
  // Do NOT depend on textual expectation evidence here.
  // ==========================================================

  if (
    safePreference === "educated"
  ) {

    const educated =
      isCandidateEducated(
        safeProfile
      );


    if (educated) {

      return {

        status:
          "MATCH",

        matched:
          true,

        known:
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

      known:
        false,

      keyword:
        "",

      reason:
        "No education data available."

    };

  }


  // ==========================================================
  // NO ACTUAL PROFILE TEXT
  // ==========================================================

  if (!candidateText) {

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
      "संवाद नाही",
      "communication नाही",
      "not good communication",
      "does not communicate",
      "don't communicate"

    ]

  };


  const keywords =
    preferenceKeywords[
      safePreference
    ] || [];


  const negativeKeywords =
    conflictKeywords[
      safePreference
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

      known:
        false,

      keyword:
        "",

      reason:
        "No matching rule configured."

    };

  }


  // ==========================================================
  // CONFLICT FIRST
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
  // POSITIVE EVIDENCE
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
  // UNKNOWN
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
    evaluateCandidateMatch(
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

// ============================================================
// WEIGHTED EXPECTATION COMPATIBILITY
// ============================================================

function calculateWeightedExpectationCompatibility(
  viewerExpectation,
  candidateProfile
) {

  // ==========================================================
  // SAFE INPUT
  // ==========================================================

  const viewerText =
    String(
      viewerExpectation || ""
    ).trim();


  const safeCandidateProfile =
    candidateProfile || {};


  // ==========================================================
  // CANDIDATE EXPECTATION
  //
  // IMPORTANT:
  // Candidate expectation is used only for evaluating
  // expectation-based soft preferences.
  //
  // Candidate's actual profile data is still passed to
  // evaluateSoftPreference().
  // ==========================================================

  const candidateText =
    String(
      safeCandidateProfile.expectationRaw ||
      safeCandidateProfile.expectation ||
      safeCandidateProfile.expectationText ||
      safeCandidateProfile.candidateExpectation ||
      ""
    ).trim();


  // ==========================================================
  // EMPTY VIEWER EXPECTATION
  // ==========================================================
  //
  // Candidate expectation is OPTIONAL.
  //
  // We can still evaluate the viewer's preferences
  // against the candidate's actual profile.
  //
  // ==========================================================

  if (
    !viewerText
  ) {

    return {

      score:
        0,

      maxScore:
        0,

      percentage:
        0,

      matchedKeywords:
        [],

      matchedDetails:
        [],

      applicable:
        false

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


  // ==========================================================
  // NO SOFT PREFERENCES
  // ==========================================================

  if (
    requiredPreferences.length === 0
  ) {

    return {

      score:
        0,

      maxScore:
        0,

      percentage:
        0,

      matchedKeywords:
        [],

      matchedDetails:
        [],

      applicable:
        false

    };

  }


  // ==========================================================
  // SCORE VARIABLES
  // ==========================================================

  let score =
    0;

  let maxScore =
    0;

  const matchedKeywords =
    [];

  const matchedDetails =
    [];

  let matchedPreferences =
    0;

  let knownPreferences =
    0;

  let unknownPreferences =
    0;

  let conflictPreferences =
    0;

  const totalRequiredPreferences =
    requiredPreferences.length;

  // ==========================================================
  // EVALUATE EACH PREFERENCE
  // ==========================================================

  requiredPreferences.forEach(
    function(preference) {

      const weight =
        Number(
          preferenceWeights[
            preference
          ]
        ) || 0;


      if (
        weight <= 0
      ) {

        return;

      }


      maxScore +=
        weight;


      // ======================================================
      // IMPORTANT
      //
      // Pass the COMPLETE candidate profile.
      //
      // This fixes:
      //
      // isCandidateEducated()
      // buildCandidateSoftPreferenceText()
      //
      // because both functions need actual profile data.
      // ======================================================

      let result =
        null;


      try {

        result =
          evaluateSoftPreference(
            preference,
            {

              ...safeCandidateProfile,

              // ----------------------------------------------
              // Explicit expectation aliases
              // ----------------------------------------------

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

        console.error(
          "evaluateSoftPreference ERROR:",
          {
            preference:
              preference,

            error:
              error
          }
        );

        result =
          null;

      }


      const status =
        result &&
        result.status
          ? String(
              result.status
            )
            .trim()
            .toUpperCase()
          : "UNKNOWN";


      // ======================================================
      // MATCH
      // ======================================================

      if (
        status === "MATCH"
      ) {

        score +=
          weight;

        matchedPreferences++;

        knownPreferences++;

        const keyword =
          result.keyword ||
          preference;


        matchedKeywords.push(
          preference
        );


        matchedDetails.push({

          preference:
            preference,

          keyword:
            keyword,

          weight:
            weight,

          status:
            "MATCH",

          score:
            weight

        });


        return;

      }


      // ======================================================
      // CONFLICT
      // ======================================================

      if (
        status === "CONFLICT"
      ) {

        knownPreferences++;

        conflictPreferences++;

        matchedDetails.push({

          preference:
            preference,

          keyword:
            result.keyword ||
            "",

          weight:
            weight,

          status:
            "CONFLICT",

          score:
            0

        });


        return;

      }


      // ======================================================
      // UNKNOWN
      // ======================================================
      unknownPreferences++;

      matchedDetails.push({

        preference:
          preference,

        keyword:
          result &&
          result.keyword
            ? result.keyword
            : "",

        weight:
          weight,

        status:
          "UNKNOWN",

        score:
          0

      });

    }
  );


  // ==========================================================
  // REMOVE DUPLICATE MATCHED KEYWORDS
  // ==========================================================

  const uniqueMatchedKeywords =
    Array.from(
      new Set(
        matchedKeywords
      )
    );


  // ==========================================================
  // FINAL PERCENTAGE
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


  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log(
    "EXPECTATION COMPATIBILITY:",
    JSON.stringify(
      {

        viewerExpectation:
          viewerText,

        candidateId:
          safeCandidateProfile.id ||
          "",

        candidateName:
          safeCandidateProfile.name ||
          "",

        candidateExpectation:
          candidateText,

        requiredPreferences:
          requiredPreferences,

        score:
          score,

        maxScore:
          maxScore,

        percentage:
          percentage,

        matchedKeywords:
          uniqueMatchedKeywords

      },
      null,
      2
    )
  );


  // ==========================================================
  // RETURN
  // ==========================================================

      return {

        score:
          score,

        maxScore:
          maxScore,

        percentage:
          percentage,

        // ----------------------------------------------------------
        // VERIFIED COMPATIBILITY
        // UNKNOWN IS EXCLUDED
        // ----------------------------------------------------------

        softMatchPercentage:
          Number(
            (
              knownPreferences > 0
                ? (
                    matchedPreferences /
                    knownPreferences *
                    100
                  )
                : 0
            ).toFixed(2)
          ),

        verifiedCompatibility:
          Number(
            (
              knownPreferences > 0
                ? (
                    matchedPreferences /
                    knownPreferences *
                    100
                  )
                : 0
            ).toFixed(2)
          ),

        softDataCoverage:
          Number(
            (
              totalRequiredPreferences > 0
                ? (
                    knownPreferences /
                    totalRequiredPreferences *
                    100
                  )
                : 0
            ).toFixed(2)
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

        matchedKeywords:
          uniqueMatchedKeywords,

        matchedDetails:
          matchedDetails,

        applicable:
          maxScore > 0

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


function calculateFinalMutualCompatibilityScore(
  mutualHardMatch,
  mutualExpectationCompatibility,
  mutualProfileCompatibility
) {

  // ==========================================================
  // SAFE INPUT
  // ==========================================================

  const hardMatch =
    mutualHardMatch === true;

  const expectation =
    mutualExpectationCompatibility &&
    typeof mutualExpectationCompatibility === "object"

      ? mutualExpectationCompatibility

      : {};

  const profile =
    mutualProfileCompatibility &&
    typeof mutualProfileCompatibility === "object"

      ? mutualProfileCompatibility

      : {};


  // ==========================================================
  // FIXED WEIGHTS
  //
  // Total possible score = 100
  //
  // HARD MATCH       = 50
  // EXPECTATION      = 30
  // ACTUAL PROFILE   = 20
  //
  // IMPORTANT:
  // These weights are ALWAYS fixed.
  // We do NOT redistribute missing/N/A weight.
  // ==========================================================

  const HARD_MATCH_WEIGHT =
    50;

  const EXPECTATION_WEIGHT =
    30;

  const PROFILE_WEIGHT =
    20;


  // ==========================================================
  // HARD MATCH SCORE
  // ==========================================================

  const hardScore =
    hardMatch
      ? HARD_MATCH_WEIGHT
      : 0;


  // ==========================================================
  // EXPECTATION APPLICABILITY
  //
  // applicable = false means:
  // There is NO meaningful expectation evidence.
  //
  // Example:
  // "अनुरूप"
  //
  // IMPORTANT:
  // N/A is NOT treated as a mismatch.
  // N/A simply gives NO expectation contribution.
  // ==========================================================

  const expectationApplicable =
    expectation.applicable === true;


  // ==========================================================
  // EXPECTATION PERCENTAGE
  // ==========================================================

  let expectationPercentage =
    0;


  if (
    expectationApplicable
  ) {

    expectationPercentage =
      Number(
        expectation.percentage
      ) || 0;

    // Safety clamp
    expectationPercentage =
      Math.max(
        0,
        Math.min(
          100,
          expectationPercentage
        )
      );

  }


  // ==========================================================
  // EXPECTATION SCORE
  //
  // Applicable:
  //     percentage contributes up to 30 points.
  //
  // Not applicable:
  //     0 points.
  //
  // IMPORTANT:
  // We DO NOT increase the final score by
  // removing the 30-point expectation weight.
  // ==========================================================

  const expectationScore =
    expectationApplicable

      ? (
          expectationPercentage *
          EXPECTATION_WEIGHT /
          100
        )

      : 0;


  // ==========================================================
  // PROFILE APPLICABILITY
  //
  // Existing behaviour PRESERVED.
  //
  // Profile is considered applicable unless it explicitly
  // returns applicable:false.
  //
  // DO NOT change this rule as part of the
  // Expectation N/A fix.
  // ==========================================================

  const profileApplicable =
    profile.applicable !== false;


  // ==========================================================
  // PROFILE PERCENTAGE
  // ==========================================================

  let profilePercentage =
    0;


  if (
    profileApplicable
  ) {

    profilePercentage =
      Number(
        profile.percentage
      ) || 0;

    // Safety clamp
    profilePercentage =
      Math.max(
        0,
        Math.min(
          100,
          profilePercentage
        )
      );

  }


  // ==========================================================
  // PROFILE SCORE
  //
  // Maximum = 20 points
  // ==========================================================

  const profileScore =
    profileApplicable

      ? (
          profilePercentage *
          PROFILE_WEIGHT /
          100
        )

      : 0;


  // ==========================================================
  // AVAILABLE WEIGHT
  //
  // IMPORTANT:
  //
  // Keep this property for backward compatibility /
  // diagnostics.
  //
  // BUT:
  // It is NO LONGER used to normalize finalScore.
  //
  // This prevents:
  //
  // Hard       = 50
  // Expectation = N/A
  // Profile     = 16.33
  //
  // 66.33 / 70 * 100
  // = 94.76  ❌
  //
  // Instead:
  //
  // 50 + 0 + 16.33
  // = 66.33 / 100
  // ==========================================================

  let availableWeight =
    HARD_MATCH_WEIGHT;


  if (
    expectationApplicable
  ) {

    availableWeight +=
      EXPECTATION_WEIGHT;

  }


  if (
    profileApplicable
  ) {

    availableWeight +=
      PROFILE_WEIGHT;

  }


  // ==========================================================
  // RAW SCORE
  //
  // Always calculated against the fixed 100-point model.
  // ==========================================================

  const rawScore =
    hardScore +
    expectationScore +
    profileScore;


  // ==========================================================
  // FINAL SCORE
  //
  // IMPORTANT TARGETED FIX:
  //
  // DO NOT normalize using availableWeight.
  //
  // Final score is always:
  //
  //     Hard Score
  //   + Expectation Score
  //   + Profile Score
  //
  // out of 100.
  //
  // Therefore:
  //
  // Expectation N/A
  // does NOT inflate the remaining components.
  // ==========================================================

  let finalScore =
    rawScore;


  // ==========================================================
  // SAFETY CLAMP
  // ==========================================================

  finalScore =
    Math.max(
      0,
      Math.min(
        100,
        finalScore
      )
    );


  finalScore =
    Number(
      finalScore.toFixed(2)
    );


  // ==========================================================
  // RETURN
  //
  // Existing property names are preserved.
  // ==========================================================

  return {

    // --------------------------------------------------------
    // FINAL
    // --------------------------------------------------------

    finalScore:
      finalScore,

    finalPercentage:
      finalScore,


    // --------------------------------------------------------
    // COMPONENT SCORES
    // --------------------------------------------------------

    hardScore:
      Number(
        hardScore.toFixed(2)
      ),

    expectationScore:
      Number(
        expectationScore.toFixed(2)
      ),

    profileScore:
      Number(
        profileScore.toFixed(2)
      ),


    // --------------------------------------------------------
    // COMPONENT PERCENTAGES
    // --------------------------------------------------------

    expectationPercentage:
      expectationPercentage,

    profilePercentage:
      profilePercentage,


    // --------------------------------------------------------
    // APPLICABILITY
    //
    // Existing + diagnostic fields preserved.
    // --------------------------------------------------------

    expectationApplicable:
      expectationApplicable,

    profileApplicable:
      profileApplicable,


    // --------------------------------------------------------
    // DIAGNOSTIC
    //
    // Kept for backward compatibility.
    // IMPORTANT:
    // availableWeight is NOT used for final normalization.
    // --------------------------------------------------------

    availableWeight:
      availableWeight,

    rawScore:
      Number(
        rawScore.toFixed(2)
      )

  };

}

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
  compatibilityCandidate,
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


   console.log(
    "========== EDUCATION TEST RESULT =========="
    );

    console.log(
      JSON.stringify(
        result.matchedCriteria &&
        result.matchedCriteria.filter(
          function(item) {
            return item.criterion === "education";
          }
        ),
        null,
        2
      )
    );

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



    
  // ==========================================================
  // EDUCATION COMPATIBILITY
  // ==========================================================

  if (
    hasValue(educationCriteria)
  ) {

    result.totalChecks++;
    result.applicable = true;


    const expectedEducation =
      educationCriteria;


    const actualEducation =
      candidate.education;


    const educationMatched =
      educationFieldsCompatible(
        expectedEducation,
        actualEducation
      );


    // --------------------------------------------------------
    // MATCH
    // --------------------------------------------------------

    if (
      educationMatched === true
    ) {

      result.matched++;


      result.matchedCriteria.push({

        criterion:
          "education",

        expected:
          expectedEducation,

        actual:
          extractText(
            actualEducation
          )

      });

    }


    // --------------------------------------------------------
    // FAILED
    // --------------------------------------------------------

    else if (
      educationMatched === false
    ) {

      result.failed++;


      result.failedCriteria.push({

        criterion:
          "education",

        expected:
          expectedEducation,

        actual:
          hasValue(actualEducation)
            ? extractText(
                actualEducation
              )
            : null

      });

    }


    // --------------------------------------------------------
    // UNKNOWN
    // --------------------------------------------------------

    else {

      result.unknown++;


      result.unknownCriteria.push({

        criterion:
          "education",

        expected:
          expectedEducation,

        actual:
          hasValue(actualEducation)
            ? extractText(
                actualEducation
              )
            : null

      });

    }

  }



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

      let expectedMinIncome =
        criteria.minIncome;

      let expectedMaxIncome =
        criteria.maxIncome;


      // ----------------------------------------------------------
      // Support normalized format:
      //
      // criteria.income = {
      //   enabled: true,
      //   min: 15000,
      //   max: 30000
      // }
      // ----------------------------------------------------------

      if (
        criteria.income &&
        typeof criteria.income === "object" &&
        criteria.income.enabled === true
      ) {

        if (
          hasValue(criteria.income.min)
        ) {

          expectedMinIncome =
            criteria.income.min;

        }

        if (
          hasValue(criteria.income.max)
        ) {

          expectedMaxIncome =
            criteria.income.max;

        }

      }


    const candidateIncome =
      candidate.income || {};

    let candidateMinIncome =
      Number(candidateIncome.min);

    let candidateMaxIncome =
      Number(candidateIncome.max);

    const candidateIncomeValue =
      Number(candidateIncome.value);


    // ----------------------------------------------------------
    // FALLBACK TO TOP-LEVEL NORMALIZED INCOME RANGE
    // ----------------------------------------------------------

    if (
      !Number.isFinite(candidateMinIncome) &&
      candidate.minIncome !== undefined &&
      candidate.minIncome !== null
    ) {

      candidateMinIncome =
        Number(candidate.minIncome);

    }


    if (
      !Number.isFinite(candidateMaxIncome) &&
      candidate.maxIncome !== undefined &&
      candidate.maxIncome !== null
    ) {

      candidateMaxIncome =
        Number(candidate.maxIncome);

    }


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


function educationFieldsCompatible(
  expectedEducation,
  actualEducation
) {

  // ==========================================================
  // SAFE INPUT
  // ==========================================================

  if (
    expectedEducation === null ||
    expectedEducation === undefined ||
    actualEducation === null ||
    actualEducation === undefined
  ) {

    return null;

  }


  // ==========================================================
  // EXTRACT EXPECTED CATEGORIES / TEXT
  // ==========================================================

  let expectedCategories = [];

  let expectedRaw = "";


  if (
    Array.isArray(expectedEducation)
  ) {

    expectedCategories =
      expectedEducation.slice();

  }

  else if (
    typeof expectedEducation === "object"
  ) {

    if (
      Array.isArray(
        expectedEducation.categories
      )
    ) {

      expectedCategories =
        expectedEducation.categories.slice();

    }


    expectedRaw =
      String(
        expectedEducation.raw || ""
      );

  }

  else {

    expectedRaw =
      String(
        expectedEducation || ""
      );

  }


  // ==========================================================
  // EXTRACT ACTUAL CATEGORIES
  // ==========================================================

  let actualCategories = [];

  let actualRaw = "";


  if (
    typeof actualEducation === "object"
  ) {

    if (
      Array.isArray(
        actualEducation.categories
      )
    ) {

      actualCategories =
        actualEducation.categories.slice();

    }


    actualRaw =
      String(
        actualEducation.raw || ""
      );

  }

  else {

    actualRaw =
      String(
        actualEducation || ""
      );

  }


  // ==========================================================
  // NORMALIZE TEXT
  // ==========================================================

  function normalizeEducationValue(
    value
  ) {

    return String(
      value || ""
    )
      .toLowerCase()
      .replace(/[().,\/\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  }


  expectedCategories =
    expectedCategories
      .map(
        normalizeEducationValue
      )
      .filter(Boolean);


  actualCategories =
    actualCategories
      .map(
        normalizeEducationValue
      )
      .filter(Boolean);


  expectedRaw =
    normalizeEducationValue(
      expectedRaw
    );


  actualRaw =
    normalizeEducationValue(
      actualRaw
    );


  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log(
    "EDUCATION COMPATIBILITY INPUT:",
    JSON.stringify(
      {
        expectedEducation:
          expectedEducation,

        expectedCategories:
          expectedCategories,

        expectedRaw:
          expectedRaw,

        actualEducation:
          actualEducation,

        actualCategories:
          actualCategories,

        actualRaw:
          actualRaw
      },
      null,
      2
    )
  );


  // ==========================================================
  // EMPTY ACTUAL
  // ==========================================================

  if (
    !actualRaw &&
    actualCategories.length === 0
  ) {

    return null;

  }


  // ==========================================================
  // 1. DIRECT CATEGORY MATCH
  //
  // Engineering & Technology
  //       ==
  // Engineering & Technology
  //
  // Commerce & Management
  //       ==
  // Commerce & Management
  // ==========================================================

  const categoryMatch =
    expectedCategories.some(
      function(expectedCategory) {

        return actualCategories.some(
          function(actualCategory) {

            return (
              expectedCategory ===
              actualCategory
            );

          }
        );

      }
    );


  if (
    categoryMatch
  ) {

    console.log(
      "EDUCATION CATEGORY MATCH: TRUE"
    );

    return true;

  }


  // ==========================================================
  // 2. ENGINEERING CATEGORY
  // ==========================================================

  const expectedEngineering =
    expectedCategories.indexOf(
      "engineering & technology"
    ) !== -1;


  const actualEngineering =
    actualCategories.indexOf(
      "engineering & technology"
    ) !== -1;


  if (
    expectedEngineering &&
    actualEngineering
  ) {

    console.log(
      "EDUCATION ENGINEERING CATEGORY MATCH: TRUE"
    );

    return true;

  }


  // ==========================================================
  // 3. ENGINEERING DEGREE ALIASES
  //
  // B.E (IT)
  // B.E
  // BE
  // BE CSE
  // BE C.S.E
  // B.Tech
  // B.Tech CSE
  // M.E
  // M.Tech
  // ==========================================================

  const engineeringDegreePattern =
    /\b(?:b\s*e|be|b\s*tech|btech|m\s*e|me|m\s*tech|mtech)\b/i;


  const expectedEngineeringDegree =
    engineeringDegreePattern.test(
      expectedRaw
    );


  const actualEngineeringDegree =
    engineeringDegreePattern.test(
      actualRaw
    );


  if (
    expectedEngineeringDegree &&
    actualEngineeringDegree
  ) {

    console.log(
      "EDUCATION ENGINEERING DEGREE MATCH: TRUE"
    );

    return true;

  }


  // ==========================================================
  // 4. COMPUTER / IT ENGINEERING
  //
  // BE IT
  // BE CSE
  // BE Computer Science
  // BE Information Technology
  // Computer Engineering
  // ==========================================================

  const computerEngineeringPattern =
    /\b(?:computer|cse|it|information technology|computer science|computer engineering)\b/i;


  const expectedComputerEngineering =
    computerEngineeringPattern.test(
      expectedRaw
    );


  const actualComputerEngineering =
    computerEngineeringPattern.test(
      actualRaw
    );


  if (
    expectedComputerEngineering &&
    actualComputerEngineering
  ) {

    console.log(
      "EDUCATION COMPUTER/IT ENGINEERING MATCH: TRUE"
    );

    return true;

  }


  // ==========================================================
  // 5. FINAL NO MATCH
  // ==========================================================

  console.log(
    "EDUCATION COMPATIBILITY: FALSE"
  );


  return false;

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


// PHASE 2



function calculateMutualCompatibility(
  viewer,
  candidate
) {

  if (!viewer || !candidate) {

    return {
      applicable: false,
      matched: false,
      viewerToCandidate: null,
      candidateToViewer: null
    };

  }


  // ----------------------------------------------------------
  // Direction 1
  // Viewer → Candidate
  // ----------------------------------------------------------

  let viewerToCandidate = null;

  try {

    viewerToCandidate =
      evaluateCandidateMatch(
        candidate,
        viewer
      );

  }
  catch (error) {

    viewerToCandidate = {
      error: true,
      message: error.message
    };

  }


  // ----------------------------------------------------------
  // Direction 2
  // Candidate → Viewer
  //
  // IMPORTANT:
  // For STEP 1 we only establish the structure.
  // Reverse matching logic will be implemented in STEP 2.
  // ----------------------------------------------------------

  let candidateToViewer = null;


  return {

    applicable:
      !!(
        viewerToCandidate
      ),

    matched:
      !!(
        viewerToCandidate &&
        viewerToCandidate.matched === true
      ),

    viewerToCandidate:
      viewerToCandidate,

    candidateToViewer:
      candidateToViewer

  };

}

function calculateMutualProfileCompatibility(
  viewer,
  candidate
) {

  // ----------------------------------------------------------
  // SAFE INPUTS
  // ----------------------------------------------------------

  const safeViewer =
    viewer || {};

  const safeCandidate =
    candidate || {};


  // ----------------------------------------------------------
  // VALIDATE PROFILES
  // ----------------------------------------------------------

  if (
    !viewer ||
    !candidate
  ) {

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
        0,

      viewerToCandidate:
        null,

      candidateToViewer:
        null

    };

  }


  // ----------------------------------------------------------
  // VIEWER → CANDIDATE
  //
  // IMPORTANT:
  // calculateActualProfileCompatibility(
  //   actualProfileCriteria,
  //   compatibilityCandidate
  // )
  //
  // Criteria FIRST
  // Candidate SECOND
  // ----------------------------------------------------------

  const viewerCriteria =
    safeViewer.actualProfileCriteria || {};


  const viewerToCandidate =
    calculateActualProfileCompatibility(
      viewerCriteria,
      safeCandidate
    );


  // ----------------------------------------------------------
  // CANDIDATE → VIEWER
  //
  // Candidate's actual criteria are used to evaluate
  // the viewer profile.
  // ----------------------------------------------------------

  const candidateCriteria =
    safeCandidate.actualProfileCriteria || {};


  const candidateToViewer =
    calculateActualProfileCompatibility(
      candidateCriteria,
      safeViewer
    );


  // ----------------------------------------------------------
  // SAFE RESULTS
  // ----------------------------------------------------------

  const first =
    viewerToCandidate || {};


  const second =
    candidateToViewer || {};


  // ----------------------------------------------------------
  // PERCENTAGES
  // ----------------------------------------------------------

  const viewerPercentage =
    Number(
      first.percentage
    ) || 0;


  const candidatePercentage =
    Number(
      second.percentage
    ) || 0;


  // ----------------------------------------------------------
  // MUTUAL APPLICABILITY
  // ----------------------------------------------------------

  const applicable =
    first.applicable === true ||
    second.applicable === true;


  // ----------------------------------------------------------
  // MUTUAL PROFILE PERCENTAGE
  //
  // Average of both directions.
  // ----------------------------------------------------------

  const mutualPercentage =
    applicable
      ? Number(
          (
            (
              viewerPercentage +
              candidatePercentage
            ) / 2
          ).toFixed(2)
        )
      : 0;


  // ----------------------------------------------------------
  // CONSOLIDATED COUNTS
  // ----------------------------------------------------------

  const matched =
    (
      Number(first.matched) || 0
    ) +
    (
      Number(second.matched) || 0
    );


  const failed =
    (
      Number(first.failed) || 0
    ) +
    (
      Number(second.failed) || 0
    );


  const unknown =
    (
      Number(first.unknown) || 0
    ) +
    (
      Number(second.unknown) || 0
    );


  const totalChecks =
    (
      Number(first.totalChecks) || 0
    ) +
    (
      Number(second.totalChecks) || 0
    );


  // ----------------------------------------------------------
  // FINAL RESULT
  // ----------------------------------------------------------

  return {

    applicable:
      applicable,

    percentage:
      mutualPercentage,

    matched:
      matched,

    failed:
      failed,

    unknown:
      unknown,

    totalChecks:
      totalChecks,

    viewerToCandidate: {

      applicable:
        first.applicable === true,

      percentage:
        viewerPercentage,

      matched:
        Number(first.matched) || 0,

      failed:
        Number(first.failed) || 0,

      unknown:
        Number(first.unknown) || 0,

      totalChecks:
        Number(first.totalChecks) || 0

    },

    candidateToViewer: {

      applicable:
        second.applicable === true,

      percentage:
        candidatePercentage,

      matched:
        Number(second.matched) || 0,

      failed:
        Number(second.failed) || 0,

      unknown:
        Number(second.unknown) || 0,

      totalChecks:
        Number(second.totalChecks) || 0

    }

  };

}

function calculateMutualExpectationCompatibility(
  viewerExpectationResult,
  candidateExpectationResult
) {

  const viewerResult =
    viewerExpectationResult || {};

  const candidateResult =
    candidateExpectationResult || {};


  // ----------------------------------------------------------
  // SAFE VALUES
  // ----------------------------------------------------------

  const viewerApplicable =
    viewerResult.applicable === true;

  const candidateApplicable =
    candidateResult.applicable === true;


  const viewerScore =
    Number(
      viewerResult.score
    ) || 0;


  const viewerMaxScore =
    Number(
      viewerResult.maxScore
    ) || 0;


  const candidateScore =
    Number(
      candidateResult.score
    ) || 0;


  const candidateMaxScore =
    Number(
      candidateResult.maxScore
    ) || 0;


  // ----------------------------------------------------------
  // IMPORTANT MUTUAL RULE
  //
  // Expectation compatibility is meaningful ONLY when
  // BOTH directions have applicable expectation criteria.
  //
  // Generic expectation such as "अनुरूप" gives:
  // applicable = false
  // score = 0
  // maxScore = 0
  //
  // Therefore:
  //
  // GENERIC + GENERIC   = NOT APPLICABLE
  // GENERIC + SPECIFIC  = NOT APPLICABLE
  // SPECIFIC + GENERIC  = NOT APPLICABLE
  // SPECIFIC + SPECIFIC = CALCULATE MUTUAL SCORE
  // ----------------------------------------------------------

  const applicable =
    viewerApplicable &&
    candidateApplicable;


  // ----------------------------------------------------------
  // MUTUAL SCORE
  //
  // Only calculate score when BOTH sides have meaningful
  // expectation compatibility data.
  // ----------------------------------------------------------

  let totalScore =
    0;

  let totalMaxScore =
    0;

  let percentage =
    0;


  if (
    applicable
  ) {

    totalScore =
      viewerScore +
      candidateScore;


    totalMaxScore =
      viewerMaxScore +
      candidateMaxScore;


    percentage =
      totalMaxScore > 0
        ? Number(
            (
              totalScore /
              totalMaxScore *
              100
            ).toFixed(2)
          )
        : 0;

  }


  // ----------------------------------------------------------
  // MATCHED KEYWORDS
  // ----------------------------------------------------------

  const viewerKeywords =
    Array.isArray(
      viewerResult.matchedKeywords
    )
      ? viewerResult.matchedKeywords
      : [];


  const candidateKeywords =
    Array.isArray(
      candidateResult.matchedKeywords
    )
      ? candidateResult.matchedKeywords
      : [];


  const matchedKeywords =
    applicable
      ? Array.from(
          new Set(
            viewerKeywords.concat(
              candidateKeywords
            )
          )
        )
      : [];


  // ----------------------------------------------------------
  // RESULT
  // ----------------------------------------------------------

  return {

    applicable:
      applicable,

    score:
      totalScore,

    maxScore:
      totalMaxScore,

    percentage:
      percentage,

    matchedKeywords:
      matchedKeywords,

    viewerToCandidate: {

      applicable:
        viewerApplicable,

      score:
        viewerScore,

      maxScore:
        viewerMaxScore,

      percentage:
        viewerMaxScore > 0
          ? Number(
              (
                viewerScore /
                viewerMaxScore *
                100
              ).toFixed(2)
            )
          : 0,

      matchedKeywords:
        viewerKeywords

    },

    candidateToViewer: {

      applicable:
        candidateApplicable,

      score:
        candidateScore,

      maxScore:
        candidateMaxScore,

      percentage:
        candidateMaxScore > 0
          ? Number(
              (
                candidateScore /
                candidateMaxScore *
                100
              ).toFixed(2)
            )
          : 0,

      matchedKeywords:
        candidateKeywords

    }

  };

}


/**
 * ==========================================================
 * FUNCTION : getActualProfileMatchesForUI
 * MODULE   : Phase 2 - Matching UI Controller
 *
 * PURPOSE
 *   Provide ranked matching profiles to the UI.
 *
 * SUPPORTED PROFILE TYPES
 *   - bride
 *   - groom
 *   - other
 *
 * IMPORTANT
 *   - UI must NOT calculate scores.
 *   - Existing Phase 2 ranking logic remains authoritative.
 *   - This function is the UI-facing entry point.
 * ==========================================================
 */

function getActualProfileMatchesForUI(
  viewerId,
  viewerType
) {

  // ========================================================
  // NORMALIZE INPUT
  // ========================================================

  const safeViewerId =
    String(
      viewerId || ""
    )
    .trim();


  const safeViewerType =
    String(
      viewerType || ""
    )
    .trim()
    .toLowerCase();


  // ========================================================
  // VALIDATE VIEWER
  // ========================================================

  if (
    !safeViewerId
  ) {

    return {

      success: false,

      message:
        "Viewer ID is required.",

      viewerId:
        "",

      viewerType:
        safeViewerType,

      totalCandidates:
        0,

      topMatches:
        []

    };

  }


  // ========================================================
  // VALIDATE PROFILE TYPE
  // ========================================================

  const allowedTypes = [

    "bride",

    "groom",

    "other"

  ];


  if (
    !allowedTypes.includes(
      safeViewerType
    )
  ) {

    return {

      success: false,

      message:
        "Invalid viewer profile type.",

      viewerId:
        safeViewerId,

      viewerType:
        safeViewerType,

      totalCandidates:
        0,

      topMatches:
        []

    };

  }


  // ========================================================
  // TEMPORARY PHASE 2 BRIDGE
  //
  // IMPORTANT:
  // We are NOT duplicating ranking logic here.
  //
  // The existing test function currently contains the
  // verified Phase 2 ranking pipeline.
  //
  // This bridge is intentionally isolated so that the UI
  // has one stable backend entry point.
  // ========================================================

  try {


    return {

      success: true,

      status:
        "UI_CONTROLLER_READY",

      message:
        "Matching UI controller is ready. Ranking engine connection pending.",

      viewerId:
        safeViewerId,

      viewerType:
        safeViewerType,

      totalCandidates:
        0,

      topMatches:
        []

    };

  }

  catch (error) {

    console.error(
      "getActualProfileMatchesForUI ERROR:",
      error
    );


    return {

      success: false,

      message:
        "Unable to load matching profiles.",

      viewerId:
        safeViewerId,

      viewerType:
        safeViewerType,

      totalCandidates:
        0,

      topMatches:
        []

    };

  }

}
