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
  // FINAL HARD MATCH RESULT
  // ==========================================================

  const matched =
    failedCriteria.length === 0;


  // ==========================================================
  // SOFT PREFERENCE SCORE
  //
  // Only calculate score for candidates
  // that pass hard criteria.
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

    checks:
      []

  };


  // ----------------------------------------------------------
  // Calculate AFTER initialization
  // ----------------------------------------------------------

  if (
    matched === true
  ) {

    softPreferenceScore =
      calculateSoftPreferenceScoreV2(
        candidateProfile,
        expectationCriteria
      );

  }


  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log(
    "FINAL SOFT VALUES:",
    JSON.stringify(
      {

        score:
          softPreferenceScore.score,

        maxScore:
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
      matched
        ? "MATCH"
        : "REJECT",

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
        softPreferenceScore.softMatchPercentage
      ) || 0,

    softDataCoverage:
      Number(
        softPreferenceScore.softDataCoverage
      ) || 0

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

  const checks = [];


  preferenceKeys.forEach(
    function(preference) {

      if (
        preferences[preference] !== true
      ) {

        return;

      }


      maxScore += 10;


      const result =
        evaluateSoftPreference(
          preference,
          candidateProfile
        );


      const matched =
        result &&
        result.status === "MATCH";


      const known =
        result &&
        (
          result.status === "MATCH" ||
          result.status === "CONFLICT"
        );


      if (matched) {

        score += 10;

        matchedPreferences++;

      }


      if (known) {

        knownPreferences++;

      }


      checks.push({

        preference:
          preference,

        required:
          true,

        status:
          result.status,

        matched:
          matched,

        known:
          known,

        score:
          matched ? 10 : 0,

        maxScore:
          10,

        keyword:
          result.keyword || "",

        reason:
          result.reason || ""

      });

    }
  );


  const softMatchPercentage =
    maxScore > 0
      ? (
          score /
          maxScore
        ) * 100
      : 0;


  const softDataCoverage =
    maxScore > 0
      ? (
          knownPreferences /
          (
            maxScore / 10
          )
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
      softMatchPercentage.toFixed(2),

    softMatchPercentage:
      Number(
        softMatchPercentage.toFixed(2)
      ),

    softDataCoverage:
      Number(
        softDataCoverage.toFixed(2)
      ),

    matchedPreferences:
      matchedPreferences,

    knownPreferences:
      knownPreferences,

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
  // PREFERENCE KEYWORDS
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


  const keywords =
    preferenceKeywords[
      preference
    ] || [];


  if (
    keywords.length === 0
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
  // MATCH
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

      keyword:
        matchedKeyword

    };

  }


  // ==========================================================
  // UNKNOWN
  //
  // Do NOT treat absence of a keyword as conflict.
  // ==========================================================

  return {

    status:
      "UNKNOWN",

    matched:
      false,

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


    const viewerExpectation =
      parseExpectationCriteria(
        viewerExpectationText
      );


    const candidateExpectation =
      parseExpectationCriteria(
        candidateExpectationText
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
