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

      reason:
        "Candidate profile missing.",

      applicableCriteria: 0,

      matchedCriteria: 0,

      failedCriteria: [],

      checks: []

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

      reason:
        "Expectation criteria missing.",

      applicableCriteria: 0,

      matchedCriteria: 0,

      failedCriteria: [],

      checks: []

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

      reason:
        "Unable to normalize candidate.",

      applicableCriteria: 0,

      matchedCriteria: 0,

      failedCriteria: [],

      checks: []

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
  // FINAL RESULT
  // ==========================================================

  const matched =
    failedCriteria.length === 0;


    // ==========================================================
    // SOFT PREFERENCE SCORE
    //
    // Only calculate score for candidates that pass hard criteria.
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

      checks:
        []

    };


    if (
      matched === true
    ) {

      softPreferenceScore =
        calculateSoftPreferenceScoreV2(
          candidateProfile,
          expectationCriteria
        );

    }


    return {

      result:
        matched
          ? "MATCH"
          : "NOT_MATCH",

      matched:
        matched,

      hardMatch:
        matched,

      applicableCriteria:
        applicableCriteria,

      matchedCriteria:
        matchedCriteria,

      failedCriteria:
        failedCriteria,

      checks:
        checks,

      softPreferenceScore:
        softPreferenceScore,

      softScore:
        softPreferenceScore.score,

      maxSoftScore:
        softPreferenceScore.maxScore,

      softMatchPercentage:
        Number(
          softPreferenceScore.matchPercentage
        ),

      softDataCoverage:
        Number(
          softPreferenceScore.dataCoverage
        )

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
// DISTRICT MATCH
// ============================================================

function evaluateDistrictMatch(
  candidate,
  criteria
) {

  const expectedDistricts =
    Array.isArray(
      criteria.districts
    )
      ? criteria.districts
      : [];


  if (
    expectedDistricts.length === 0
  ) {

    return {

      criterion:
        "district",

      applicable:
        false,

      matched:
        true,

      district:
        ""

    };

  }


  const candidateDistrict =
    candidate.district &&
    candidate.district.normalized
      ? candidate.district.normalized
      : "";


  if (!candidateDistrict) {

    return {

      criterion:
        "district",

      applicable:
        true,

      matched:
        false,

      district:
        ""

    };

  }


  const matchedDistrict =
    expectedDistricts.some(
      function(district) {

        const normalizedExpected =
          normalizeMatchingText(
            district
          );


        return (
          candidateDistrict ===
          normalizedExpected
        );

      }
    );


  return {

    criterion:
      "district",

    applicable:
      true,

    matched:
      matchedDistrict,

    expectedDistricts:
      expectedDistricts,

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

function buildCandidateSoftPreferenceText(
  candidateProfile
) {

  const parts = [];


  if (
    candidateProfile.profession &&
    candidateProfile.profession.raw
  ) {

    parts.push(
      candidateProfile.profession.raw
    );

  }


  if (
    candidateProfile.education &&
    candidateProfile.education.raw
  ) {

    parts.push(
      candidateProfile.education.raw
    );

  }


  if (
    candidateProfile.expectationRaw
  ) {

    parts.push(
      candidateProfile.expectationRaw
    );

  }


  return normalizeMatchingText(
    parts.join(" ")
  );

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

  const result = {

    applicable: false,

    matchedPreferences: 0,

    knownPreferences: 0,

    totalRequestedPreferences: 0,

    score: 0,

    maxScore: 0,

    matchPercentage: 0,

    dataCoverage: 0,

    checks: []

  };


  if (
    !candidateProfile ||
    !expectationCriteria ||
    !expectationCriteria.softPreferences
  ) {

    return result;

  }


  const preferences =
    expectationCriteria.softPreferences;


  const requested = [];


  Object.keys(preferences).forEach(
    function(key) {

      if (
        preferences[key] === true
      ) {

        requested.push(key);

      }

    }
  );


  if (
    requested.length === 0
  ) {

    return result;

  }


  result.applicable = true;

  result.totalRequestedPreferences =
    requested.length;


  // ----------------------------------------------------------
  // Candidate information
  // ----------------------------------------------------------

  const candidateText =
    buildCandidateSoftPreferenceText(
      candidateProfile
    );


  requested.forEach(
    function(preference) {

      const evaluation =
        evaluateSoftPreference(
          preference,
          candidateProfile,
          candidateText
        );


      result.checks.push(
        evaluation
      );


      // ------------------------------------------------------
      // MATCH
      // ------------------------------------------------------

      if (
        evaluation.status ===
        "MATCH"
      ) {

        result.matchedPreferences++;

        result.knownPreferences++;

        result.score += 10;

        result.maxScore += 10;

      }


      // ------------------------------------------------------
      // CONFLICT
      // ------------------------------------------------------

      else if (
        evaluation.status ===
        "CONFLICT"
      ) {

        result.knownPreferences++;

        result.maxScore += 10;

      }


      // ------------------------------------------------------
      // UNKNOWN
      // ------------------------------------------------------

      else {

        // Unknown is NOT counted as failure.
        // No score and no max score.

      }

    }
  );


  // ----------------------------------------------------------
  // Match percentage
  //
  // Only known preferences are considered.
  // ----------------------------------------------------------

  if (
    result.maxScore > 0
  ) {

    result.matchPercentage =
      Number(
        (
          result.score /
          result.maxScore
        ) * 100
      ).toFixed(2);

  }


  // ----------------------------------------------------------
  // Data coverage
  // ----------------------------------------------------------

  if (
    result.totalRequestedPreferences > 0
  ) {

    result.dataCoverage =
      Number(
        (
          result.knownPreferences /
          result.totalRequestedPreferences
        ) * 100
      ).toFixed(2);

  }


  return result;

}



// ============================================================
// EVALUATE ONE SOFT PREFERENCE
// ============================================================

function evaluateSoftPreference(
  preference,
  candidateProfile,
  candidateText
) {

  // ==========================================================
  // EDUCATED
  // ==========================================================

  if (
    preference ===
    "educated"
  ) {

    const educated =
      isCandidateEducated(
        candidateProfile
      );


    return {

      preference:
        preference,

      status:
        educated
          ? "MATCH"
          : "UNKNOWN",

      reason:
        educated
          ? "Education data is available."
          : "Education data unavailable."

    };

  }


  // ==========================================================
  // UNDERSTANDING
  // ==========================================================

  if (
    preference ===
    "understanding"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "समजूतदार",
        "समजूतदारपणा",
        "understanding",
        "mature",
        "maturity"
      ]
    );

  }


  // ==========================================================
  // CULTURED
  // ==========================================================

  if (
    preference ===
    "cultured"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "संस्कारी",
        "संस्कार",
        "cultured",
        "traditional"
      ]
    );

  }


  // ==========================================================
  // LOVING
  // ==========================================================

  if (
    preference ===
    "loving"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "प्रेमळ",
        "प्रेम",
        "loving",
        "caring",
        "affectionate"
      ]
    );

  }


  // ==========================================================
  // CAREER SUPPORTIVE
  // ==========================================================

  if (
    preference ===
    "careerSupportive"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "करिअर",
        "career",
        "नोकरी",
        "job",
        "professional"
      ]
    );

  }


  // ==========================================================
  // DREAM SUPPORTIVE
  // ==========================================================

  if (
    preference ===
    "dreamSupportive"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "स्वप्न",
        "स्वप्नांचा",
        "dream",
        "dreams",
        "ambition",
        "aspiration"
      ]
    );

  }


  // ==========================================================
  // FAMILY ORIENTED
  // ==========================================================

  if (
    preference ===
    "familyOriented"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "कुटुंब",
        "कुटुंबवत्सल",
        "family",
        "family oriented",
        "family-oriented"
      ]
    );

  }


  // ==========================================================
  // GOOD NATURE
  // ==========================================================

  if (
    preference ===
    "goodNature"
  ) {

    return evaluateKeywordPreference(
      preference,
      candidateText,
      [
        "चांगला स्वभाव",
        "चांगल्या स्वभावाची",
        "good nature",
        "kind",
        "kind-hearted"
      ]
    );

  }


  return {

    preference:
      preference,

    status:
      "UNKNOWN",

    reason:
      "Preference evaluator not configured."

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