// ============================================================
// FILE : MatchingCandidateCriteria.gs
// MODULE : Matching
//
// PURPOSE
// Convert a normalized candidate profile into a clean,
// matching-friendly criteria object.
//
// INPUT
// normalized candidate profile
//
// OUTPUT
// {
//   age,
//   height,
//   income,
//   district,
//   education,
//   profession,
//   employmentType,
//   caste,
//   rashi
// }
//
// DOES NOT
// - Read Google Sheets
// - Parse expectation
// - Decide MATCH / NOT MATCH
// - Apply LIKE / DISLIKE
// ============================================================



// ============================================================
// NORMALIZE CANDIDATE CRITERIA
// ============================================================

function normalizeCandidateCriteria(
  profile
) {

  if (!profile) {

    return {

      success: false,

      message:
        "Candidate profile is missing.",

      criteria: null

    };

  }


  const criteria = {

    id:
      profile.id || "",

    name:
      profile.name || "",

    type:
      profile.type || "",

    age:
      parseCandidateAge(
        profile.ageRaw
      ),

    height:
      parseCandidateHeight(
        profile.heightRaw
      ),

    income:
      parseCandidateIncome(
        profile.incomeRaw
      ),

    district:
      normalizeCandidateDistrict(
        profile.district
      ),

    education:
      normalizeCandidateEducation(
        profile.education
      ),

    profession:
      normalizeCandidateProfession(
        profile.profession
      ),

    employmentType:
      normalizeCandidateEmploymentType(
        profile.profession
      ),

    caste:
      normalizeCandidateCaste(
        profile.casteRaw
      ),

    rashi:
      normalizeCandidateRashi(
        profile.rashiRaw
      ),

    expectation:
      normalizeCandidateExpectation(
        profile.expectationRaw || ""
      ),

  };


  return {

    success: true,

    criteria:
      criteria

  };

}



// ============================================================
// AGE
//
// Input example:
//
// "28 years, 8 months, 11 days"
//
// Output:
//
// {
//   enabled: true,
//   years: 28,
//   decimalAge: 28.69
// }
// ============================================================

function parseCandidateAge(
  value
) {

  const result = {

    enabled: false,

    years: null,

    months: null,

    days: null,

    decimalAge: null

  };


  if (!value) {

    return result;

  }


  const text =
    convertMarathiDigits(
      String(value)
        .toLowerCase()
    );


  // ----------------------------------------------------------
  // Years + months + days
  // ----------------------------------------------------------

  let match =
    text.match(
      /(\d+)\s*years?\s*,?\s*(\d+)?\s*months?\s*,?\s*(\d+)?\s*days?/i
    );


  if (match) {

    const years =
      Number(
        match[1]
      );


    const months =
      Number(
        match[2] || 0
      );


    const days =
      Number(
        match[3] || 0
      );


    result.enabled =
      true;

    result.years =
      years;

    result.months =
      months;

    result.days =
      days;

    result.decimalAge =
      years +
      (months / 12) +
      (days / 365);


    return result;

  }


  // ----------------------------------------------------------
  // Simple age
  // ----------------------------------------------------------

  match =
    text.match(
      /(\d{1,3})\s*(?:years?|वर्ष)/i
    );


  if (match) {

    result.enabled =
      true;

    result.years =
      Number(
        match[1]
      );

    result.months =
      0;

    result.days =
      0;

    result.decimalAge =
      result.years;

  }


  return result;

}



// ============================================================
// HEIGHT
//
// Input examples:
//
// "५ फूट २ इंच"
// "5 feet 7 inches"
// "5'7"
//
// Output:
// inches
// ============================================================

function parseCandidateHeight(
  value
) {

  const result = {

    enabled: false,

    feet: null,

    inches: null,

    totalInches: null

  };


  if (!value) {

    return result;

  }


  const text =
    convertMarathiDigits(
      String(value)
        .toLowerCase()
    );


  // ----------------------------------------------------------
  // Feet + inches
  // ----------------------------------------------------------

  let match =
    text.match(
      /(\d{1,2})\s*(?:feet|foot|ft|फूट|फु)\s*(\d{1,2})?\s*(?:inches|inch|in|इंच)?/i
    );


  if (match) {

    const feet =
      Number(
        match[1]
      );


    const inches =
      Number(
        match[2] || 0
      );


    result.enabled =
      true;

    result.feet =
      feet;

    result.inches =
      inches;

    result.totalInches =
      feet * 12 +
      inches;


    return result;

  }


  // ----------------------------------------------------------
  // 5'7"
  // ----------------------------------------------------------

  match =
    text.match(
      /(\d{1,2})\s*['′]\s*(\d{1,2})?\s*["″]?/i
    );


  if (match) {

    const feet =
      Number(
        match[1]
      );


    const inches =
      Number(
        match[2] || 0
      );


    result.enabled =
      true;

    result.feet =
      feet;

    result.inches =
      inches;

    result.totalInches =
      feet * 12 +
      inches;

  }


  return result;

}



// ============================================================
// INCOME
//
// Input examples:
//
// "मासिक उत्पन्न रु. १०,००० पेक्षा कमी"
// "मासिक उत्पन्न रु. १५,००० ते २०,०००"
// "₹50000"
// ============================================================

function parseCandidateIncome(
  value
) {

  const result = {

    enabled: false,

    min: null,

    max: null,

    value: null

  };


  if (!value) {

    return result;

  }


  let text =
    convertMarathiDigits(
      String(value)
        .toLowerCase()
    );


  text =
    text.replace(
      /,/g,
      ""
    );


  // ----------------------------------------------------------
  // "पेक्षा कमी" / below / under
  // ----------------------------------------------------------

  let match =
    text.match(
      /(?:below|under|less than|पेक्षा कमी|कमाल)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;

    result.max =
      Number(
        match[1]
      );

    return result;

  }


  // ----------------------------------------------------------
  // "पेक्षा जास्त" / above / over
  // ----------------------------------------------------------

  match =
    text.match(
      /(?:above|over|more than|पेक्षा जास्त|किमान)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;

    result.min =
      Number(
        match[1]
      );

    return result;

  }


  // ----------------------------------------------------------
  // Income range
  // ----------------------------------------------------------

  match =
    text.match(
      /(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})\s*(?:to|ते|-|–)\s*(?:rs\.?|रु\.?|₹)?\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;

    result.min =
      Number(
        match[1]
      );

    result.max =
      Number(
        match[2]
      );

    return result;

  }


  // ----------------------------------------------------------
  // Exact amount
  // ----------------------------------------------------------

  match =
    text.match(
      /(?:rs\.?|रु\.?|₹)\s*(\d{4,8})/i
    );


  if (match) {

    result.enabled =
      true;

    result.value =
      Number(
        match[1]
      );

    result.min =
      result.value;

    result.max =
      result.value;

  }


  return result;

}



// ============================================================
// DISTRICT
// ============================================================

function normalizeCandidateDistrict(
  value
) {

  const raw =
    String(
      value || ""
    ).trim();


  return {

    enabled:
      raw.length > 0,

    raw:
      raw,

    normalized:
      normalizeMatchingText(
        raw
      )

  };

}



// ============================================================
// EDUCATION
//
// Uses existing MatchingEducationNormalizer output.
// ============================================================

function normalizeCandidateEducation(
  education
) {

  if (!education) {

    return {

      enabled: false,

      raw: "",

      categories: [],

      matchedKeywords: []

    };

  }


  return {

    enabled:
      education.hasEducationData === true,

    raw:
      education.raw || "",

    categories:
      Array.isArray(
        education.categories
      )
        ? education.categories
        : [],

    matchedKeywords:
      Array.isArray(
        education.matchedKeywords
      )
        ? education.matchedKeywords
        : []

  };

}



// ============================================================
// PROFESSION
//
// Uses existing ProfessionNormalizer output.
// ============================================================

function normalizeCandidateProfession(
  profession
) {

  if (!profession) {

    return {

      enabled: false,

      raw: "",

      categories: [],

      matchedKeywords: [],

      employmentType:
        "NOT_SPECIFIED"

    };

  }


  return {

    enabled:
      profession.hasProfessionData === true,

    raw:
      profession.raw || "",

    categories:
      Array.isArray(
        profession.categories
      )
        ? profession.categories
        : [],

    matchedKeywords:
      Array.isArray(
        profession.matchedKeywords
      )
        ? profession.matchedKeywords
        : [],

    employmentType:
      profession.employmentType ||
      "NOT_SPECIFIED"

  };

}



// ============================================================
// EMPLOYMENT TYPE
// ============================================================

function normalizeCandidateEmploymentType(
  profession
) {

  if (!profession) {

    return "NOT_SPECIFIED";

  }


  const value =
    String(
      profession.employmentType ||
      "NOT_SPECIFIED"
    )
    .trim()
    .toUpperCase();


  const allowed = [

    "GOVERNMENT",

    "PRIVATE",

    "SELF_EMPLOYED",

    "BUSINESS",

    "STUDENT",

    "NOT_SPECIFIED"

  ];


  if (
    allowed.includes(
      value
    )
  ) {

    return value;

  }


  return "NOT_SPECIFIED";

}



// ============================================================
// CASTE
// ============================================================

function normalizeCandidateCaste(
  value
) {

  const raw =
    String(
      value || ""
    ).trim();


  return {

    enabled:
      raw.length > 0,

    raw:
      raw,

    normalized:
      normalizeMatchingText(
        raw
      )

  };

}



// ============================================================
// RASHI
// ============================================================

function normalizeCandidateRashi(
  value
) {

  const raw =
    String(
      value || ""
    ).trim();


  return {

    enabled:
      raw.length > 0,

    raw:
      raw,

    normalized:
      normalizeMatchingText(
        raw
      )

  };

}


// ============================================================
// EXPECTATION
//
// Purpose:
// Normalize candidate's free-text expectation.
//
// IMPORTANT:
// - Keeps original expectation text.
// - Does NOT decide match.
// - Does NOT score.
// - Does NOT reject candidate.
// - Soft preference parsing is handled separately.
// ============================================================

function normalizeCandidateExpectation(
  value
) {

  const raw =
    String(
      value || ""
    )
    .replace(
      /<br\s*\/?>/gi,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();


  return {

    enabled:
      raw.length > 0,

    raw:
      raw,

    normalizedText:
      normalizeMatchingText(
        raw
      )

  };

}

// ============================================================
// NORMALIZE ALL CANDIDATES
// ============================================================

function normalizeAllCandidateCriteria(
  profiles
) {

  if (
    !Array.isArray(
      profiles
    )
  ) {

    return {

      success: false,

      candidates: [],

      totalCount: 0

    };

  }


  const candidates = [];


  profiles.forEach(
    function(profile) {

      const result =
        normalizeCandidateCriteria(
          profile
        );


      if (
        result.success
      ) {

        candidates.push(
          result.criteria
        );

      }

    }
  );


  return {

    success: true,

    candidates:
      candidates,

    totalCount:
      candidates.length

  };

}



// ============================================================
// TEST SINGLE CANDIDATE
// ============================================================

function testMatchingCandidateCriteria() {

  const candidate = {

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


  const result =
    normalizeCandidateCriteria(
      candidate
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
// TEST ALL CANDIDATES FROM CONTROLLER
//
// This test uses your existing normalized candidate loader.
//
// groom → bride
// bride → groom
// other → all applicable candidates
// ============================================================

function testAllMatchingCandidateCriteria() {

  const result =
    getNormalizedMatchingCandidates(
      "bride"
    );


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

    return result;

  }


  const normalized =
    normalizeAllCandidateCriteria(
      result.profiles
    );


  const output = {

    success:
      normalized.success,

    candidateProfileType:
      result.candidateProfileType,

    loaded:
      result.profiles.length,

    normalized:
      normalized.totalCount,

    firstCandidate:
      normalized.candidates.length > 0
        ? normalized.candidates[0]
        : null

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
