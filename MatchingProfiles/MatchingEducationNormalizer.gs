// ============================================================
// FILE : MatchingEducationNormalizer.gs
// MODULE : Matching
// STEP : 5B
//
// PURPOSE
//  Normalize education information for matching.
//
// RESPONSIBILITY
//  - Clean education text
//  - Detect known qualification keywords
//  - Detect one or more education categories
//  - Preserve original/raw education
//  - Preserve multiple qualifications
//
// DOES NOT
//  - Calculate matching score
//  - Decide whether education matches expectation
//  - Parse profession
//  - Parse income
//  - Parse expectations
//  - Apply LIKE / DISLIKE / Interest logic
//
// IMPORTANT
//  Education matching logic will be implemented separately.
// ============================================================


// ============================================================
// EDUCATION CATEGORY DEFINITIONS
// ============================================================

const MATCHING_EDUCATION_CATEGORIES = {

  ENGINEERING_TECHNOLOGY:
    "Engineering & Technology",

  MEDICAL_HEALTHCARE:
    "Medical & Healthcare",

  COMMERCE_MANAGEMENT:
    "Commerce & Management",

  ARTS_HUMANITIES:
    "Arts & Humanities",

  SCIENCE_AGRICULTURE:
    "Science & Agriculture",

  DIPLOMA_ITI_TECHNICAL:
    "Diploma / ITI / Technical",

  LAW_ARCHITECTURE_DESIGN:
    "Law / Architecture / Design",

  GENERAL_EDUCATION:
    "General Education"

};


// ============================================================
// EDUCATION KEYWORD RULES
//
// IMPORTANT:
// These are classification rules only.
// They do NOT mean that two qualifications are equivalent.
// ============================================================

const MATCHING_EDUCATION_RULES = [

  // ==========================================================
  // ENGINEERING & TECHNOLOGY
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .ENGINEERING_TECHNOLOGY,

    keywords: [

      // English
      "engineering",
      "engineer",
      "b.e",
      "be",
      "btech",
      "b.tech",
      "m.e",
      "me",
      "mtech",
      "m.tech",

      "computer engineering",
      "computer science",
      "mechanical engineering",
      "civil engineering",
      "electrical engineering",
      "electronics engineering",
      "electronics and telecommunication",
      "it engineering",
      "information technology",
      "software engineering",

      // Marathi
      "इंजिनियरिंग",
      "इंजिनिअरिंग",
      "इंजिनीअरिंग",
      "इंजिनियर",
      "इंजिनीअर",
      "अभियांत्रिकी"

    ]

  },


  // ==========================================================
  // MEDICAL & HEALTHCARE
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .MEDICAL_HEALTHCARE,

    keywords: [

      "medical",
      "doctor",
      "mbbs",
      "md",
      "ms",
      "bhms",
      "bams",
      "bums",
      "bds",
      "m.d",
      "m.s",
      "pharmacy",
      "b.pharm",
      "b pharm",
      "mpharm",
      "m.pharm",
      "nursing",
      "b.sc nursing",
      "gnm",
      "physiotherapy",
      "bpt",
      "healthcare",

      // Marathi
      "डॉक्टर",
      "वैद्यकीय",
      "वैद्यक"

    ]

  },


  // ==========================================================
  // COMMERCE & MANAGEMENT
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .COMMERCE_MANAGEMENT,

    keywords: [

      "mba",
      "m.b.a",
      "bba",
      "b.b.a",
      "mcom",
      "m.com",
      "bcom",
      "b.com",
      "commerce",
      "management",
      "ca",
      "chartered accountant",
      "cma",
      "company secretary",
      "finance",
      "accounting",

      // Marathi
      "वाणिज्य",
      "व्यवस्थापन"

    ]

  },


  // ==========================================================
  // ARTS & HUMANITIES
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .ARTS_HUMANITIES,

    keywords: [

      "arts",
      "b.a",
      "ba",
      "m.a",
      "ma",
      "humanities",
      "social science",
      "psychology",
      "sociology",
      "history",
      "political science",
      "literature",
      "english literature",
      "marathi literature",

      // Marathi
      "कला",
      "मानवविद्या"

    ]

  },


  // ==========================================================
  // SCIENCE & AGRICULTURE
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .SCIENCE_AGRICULTURE,

    keywords: [

      // Science qualifications
      "b.sc",
      "bsc",
      "m.sc",
      "msc",

      "physics",
      "chemistry",
      "biology",
      "mathematics",

      // Agriculture
      "agriculture",
      "agricultural",
      "b.sc agri",
      "bsc agri",
      "m.sc agriculture",

      // Marathi
      "बी. एस्सी",
      "बीएस्सी",
      "बी.एस्सी",
      "एम. एस्सी",
      "एमएस्सी",
      "एम.एस्सी",

      "अग्री",
      "अ‍ॅग्री",
      "कृषी",
      "कृषीशास्त्र"

    ]

  },


  // ==========================================================
  // DIPLOMA / ITI / TECHNICAL
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .DIPLOMA_ITI_TECHNICAL,

    keywords: [

      "diploma",
      "polytechnic",
      "iti",
      "i.t.i",
      "technical",
      "vocational",
      "certificate course",

      // Marathi
      "डिप्लोमा",
      "पॉलिटेक्निक",
      "आयटीआय",
      "तांत्रिक"

    ]

  },


  // ==========================================================
  // LAW / ARCHITECTURE / DESIGN
  // ==========================================================

  {
    category:
      MATCHING_EDUCATION_CATEGORIES
        .LAW_ARCHITECTURE_DESIGN,

    keywords: [

      "law",
      "llb",
      "ll.m",
      "llm",
      "advocate",
      "legal",
      "architecture",
      "architect",
      "b.arch",
      "m.arch",
      "design",
      "fashion design",
      "interior design",
      "graphic design",

      // Marathi
      "कायदा",
      "वास्तुकला",
      "डिझाईन",
      "डिझाइन"

    ]

  }

];


// ============================================================
// CLEAN EDUCATION TEXT
// ============================================================

function cleanMatchingEducationText(
  value
) {

  return String(
    value || ""
  )
    .toLowerCase()
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/[|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}


// ============================================================
// GET DISPLAY EDUCATION
//
// Keeps the original user-entered value.
// ============================================================

function normalizeMatchingEducationText(
  value
) {

  return String(
    value || ""
  )
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

}


// ============================================================
// CHECK KEYWORD
//
// Uses word-ish boundary logic where possible.
// ============================================================

function educationKeywordExists(
  text,
  keyword
) {

  if (
    !text ||
    !keyword
  ) {

    return false;

  }


  const cleanText =
    String(
      text
    )
    .toLowerCase()
    .trim();


  const cleanKeyword =
    String(
      keyword
    )
    .toLowerCase()
    .trim();


  if (!cleanKeyword) {

    return false;

  }


  // ==========================================================
  // STEP 1
  // NORMALIZE QUALIFICATION TEXT
  //
  // Keep qualification boundaries while removing
  // unnecessary punctuation.
  //
  // Examples:
  //
  // B.E (Mechanical)
  // BE(Mechanical)
  // B.E. Mechanical
  //
  // should all be understood as BE.
  // ==========================================================

const normalizedText =
  cleanText
    .replace(
      /b\s*\.\s*e\b/gi,
      "be"
    )
    .replace(
      /m\s*\.\s*e\b/gi,
      "me"
    )
    .replace(
      /b\s*\.\s*tech\b/gi,
      "btech"
    )
    .replace(
      /m\s*\.\s*tech\b/gi,
      "mtech"
    )
    .replace(
      /b\s*\.\s*sc\b/gi,
      "bsc"
    )
    .replace(
      /m\s*\.\s*sc\b/gi,
      "msc"
    )
    .replace(
      /b\s*\.\s*a\b/gi,
      "ba"
    )
    .replace(
      /m\s*\.\s*a\b/gi,
      "ma"
    )
    .replace(
      /b\s*\.\s*com\b/gi,
      "bcom"
    )
    .replace(
      /m\s*\.\s*com\b/gi,
      "mcom"
    )
    .replace(
      /b\s*\.\s*b\s*\.\s*a\b/gi,
      "bba"
    )
    .replace(
      /m\s*\.\s*b\s*\.\s*a\b/gi,
      "mba"
    )
    .replace(
      /[().,\-_/]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();


const normalizedKeyword =
  cleanKeyword
    .replace(
      /b\s*\.\s*e\b/gi,
      "be"
    )
    .replace(
      /m\s*\.\s*e\b/gi,
      "me"
    )
    .replace(
      /b\s*\.\s*tech\b/gi,
      "btech"
    )
    .replace(
      /m\s*\.\s*tech\b/gi,
      "mtech"
    )
    .replace(
      /b\s*\.\s*sc\b/gi,
      "bsc"
    )
    .replace(
      /m\s*\.\s*sc\b/gi,
      "msc"
    )
    .replace(
      /b\s*\.\s*a\b/gi,
      "ba"
    )
    .replace(
      /m\s*\.\s*a\b/gi,
      "ma"
    )
    .replace(
      /b\s*\.\s*com\b/gi,
      "bcom"
    )
    .replace(
      /m\s*\.\s*com\b/gi,
      "mcom"
    )
    .replace(
      /[().,\-_/]/g,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();


  if (!normalizedKeyword) {

    return false;

  }


  // ==========================================================
  // STEP 2
  // SPECIAL HANDLING FOR SHORT QUALIFICATION CODES
  //
  // VERY IMPORTANT:
  //
  // "ba" must NOT match "mba"
  // "ma" must NOT match "mba"
  // "me" must NOT match "medical"
  // "ms" must NOT match "scholar"
  //
  // But:
  //
  // "be" SHOULD match:
  // "BE Mechanical"
  // "BE(Mechanical)"
  // "B.E Mechanical"
  //
  // ==========================================================

  const shortQualificationKeywords = [

    "ba",
    "ma",
    "be",
    "me",
    "bs",
    "ms",
    "bca",
    "mca",
    "bba",
    "mba",
    "bcom",
    "mcom",
    "bsc",
    "msc",
    "btech",
    "mtech",
    "mbbs",
    "bhms",
    "bams",
    "bums",
    "bds",
    "llb",
    "llm",
    "ca"

  ];


  const compactKeyword =
    normalizedKeyword
      .replace(/\s+/g, "");


  const compactText =
    normalizedText
      .replace(/\s+/g, " ");


  // ==========================================================
  // STEP 3
  // QUALIFICATION TOKEN MATCH
  //
  // For short qualification codes we require
  // an actual token / qualification boundary.
  // ==========================================================

  if (
    shortQualificationKeywords.includes(
      compactKeyword
    )
  ) {

    const qualificationRegex =
      new RegExp(
        "(^|\\s)" +
        compactKeyword
          .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          ) +
        "(?=\\s|$)",
        "i"
      );


    return qualificationRegex.test(
      compactText
    );

  }


  // ==========================================================
  // STEP 4
  // MULTI-WORD / NORMAL KEYWORDS
  //
  // Examples:
  //
  // computer science
  // mechanical engineering
  // engineering
  // agriculture
  // medical
  // management
  //
  // These can safely use word-boundary matching.
  // ==========================================================

  const escapedKeyword =
    normalizedKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );


  const regex =
    new RegExp(
      "(^|\\s)" +
      escapedKeyword +
      "(?=\\s|$)",
      "i"
    );


  return regex.test(
    normalizedText
  );

}


// ============================================================
// DETECT EDUCATION CATEGORIES
// ============================================================

function detectMatchingEducationCategories(
  educationText
) {

  const text =
    cleanMatchingEducationText(
      educationText
    );


  const categories = [];

  const matchedKeywords = [];


  if (!text) {

    return {

      categories: [],

      matchedKeywords: []

    };

  }


  MATCHING_EDUCATION_RULES.forEach(
    function(rule) {

      let categoryMatched =
        false;


      rule.keywords.forEach(
        function(keyword) {

          if (
            educationKeywordExists(
              text,
              keyword
            )
          ) {

            categoryMatched =
              true;


            if (
              !matchedKeywords.includes(
                keyword
              )
            ) {

              matchedKeywords.push(
                keyword
              );

            }

          }

        }
      );


      if (
        categoryMatched &&
        !categories.includes(
          rule.category
        )
      ) {

        categories.push(
          rule.category
        );

      }

    }
  );


  return {

    categories:
      categories,

    matchedKeywords:
      matchedKeywords

  };

}


// ============================================================
// DETECT QUALIFICATION TOKENS
//
// This intentionally does NOT claim equivalence.
// It simply preserves recognizable qualification strings.
//
// Example:
// "MBA, BE(Mechanical)"
//
// → ["MBA", "BE(Mechanical)"]
// ============================================================

function extractMatchingEducationQualifications(
  educationText
) {

  const raw =
    normalizeMatchingEducationText(
      educationText
    );


  if (!raw) {

    return [];

  }


  const parts =
    raw
      .split(
        /[,;|]+/
      )
      .map(
        function(value) {

          return value
            .trim();

        }
      )
      .filter(
        function(value) {

          return Boolean(
            value
          );

        }
      );


  // ----------------------------------------------------------
  // Remove exact duplicates
  // ----------------------------------------------------------

  const result = [];

  const seen = new Set();


  parts.forEach(
    function(part) {

      const key =
        part.toLowerCase();


      if (
        !seen.has(key)
      ) {

        seen.add(key);

        result.push(
          part
        );

      }

    }
  );


  return result;

}


// ============================================================
// BUILD STANDARD EDUCATION OBJECT
// ============================================================

function normalizeMatchingEducation(
  educationValue
) {

  const raw =
    normalizeMatchingEducationText(
      educationValue
    );


  if (!raw) {

    return {

      raw: "",

      normalizedText: "",

      qualifications: [],

      categories: [],

      matchedKeywords: [],

      hasEducationData: false

    };

  }


  const classification =
    detectMatchingEducationCategories(
      raw
    );


  const qualifications =
    extractMatchingEducationQualifications(
      raw
    );


  let categories =
    classification.categories;


  // ==========================================================
  // GENERAL EDUCATION
  //
  // Used only when education information exists
  // but no specialized category was identified.
  //
  // Examples:
  //
  // पदवी
  // Graduate
  // Graduation
  // Any Graduate
  // कोणतीही पदवीधर
  // ==========================================================

  if (
    categories.length === 0
  ) {

    const generalEducationText =
      cleanMatchingEducationText(
        raw
      );


    const generalEducationKeywords = [

      "पदवी",
      "पदवीधर",
      "graduation",
      "graduate",
      "any graduate",
      "general education"

    ];


    const isGeneralEducation =
      generalEducationKeywords.some(
        function(keyword) {

          return educationKeywordExists(
            generalEducationText,
            keyword
          );

        }
      );


    if (
      isGeneralEducation
    ) {

      categories = [

        MATCHING_EDUCATION_CATEGORIES
          .GENERAL_EDUCATION

      ];

    }

  }


  return {

    raw:
      raw,

    normalizedText:
      cleanMatchingEducationText(
        raw
      ),

    qualifications:
      qualifications,

    categories:
      categories,

    matchedKeywords:
      classification.matchedKeywords,

    hasEducationData:
      true

  };

}


// ============================================================
// ADD EDUCATION TO NORMALIZED PROFILE
//
// This function extends the STEP 5A profile.
// ============================================================

function addMatchingEducationToProfile(
  normalizedProfile,
  educationValue
) {

  normalizedProfile =
    normalizedProfile || {};


  const education =
    normalizeMatchingEducation(
      educationValue
    );


  return {

    ...normalizedProfile,

    education:
      education

  };

}



function testMatchingEducationNormalizer() {

  const repositoryResult =
    getMatchingRawProfileData(
      "groom"
    );


  if (
    !repositoryResult ||
    !repositoryResult.success
  ) {

    console.log(
      "Repository failed:",
      repositoryResult
    );

    return;

  }


  const firstRow =
    repositoryResult.rows[0];


  const headers =
    repositoryResult.headers;


  const educationIndex =
    headers.findIndex(
      function(header) {

        return String(
          header || ""
        ).trim()
        ===
        "शिक्षण :";

      }
    );


  if (
    educationIndex === -1
  ) {

    console.log(
      "Education column not found."
    );

    return;

  }


  const educationValue =
    firstRow[
      educationIndex
    ] || "";


  const result =
    normalizeMatchingEducation(
      educationValue
    );


  console.log(
    JSON.stringify(
      {

        rawEducation:
          educationValue,

        normalizedEducation:
          result

      },
      null,
      2
    )
  );

}



// ============================================================
// TEST : EDUCATION NORMALIZER
// STEP 5B VALIDATION
// ============================================================

function testMatchingEducationNormalizerCases() {

  const testCases = [

    {
      label: "Case 1 - BE Computer Science",
      education:
        "BE computer science & engineering"
    },

    {
      label: "Case 2 - Medical",
      education:
        "BHMS, MD (SCHOLAR)"
    },

    {
      label: "Case 3 - MBA + Engineering",
      education:
        "MBA, BE(Mechanical)"
    },

    {
      label: "Case 4 - B.E IT",
      education:
        "B.E ( IT)"
    },

    {
      label: "Case 5 - Marathi B.Sc Agriculture",
      education:
        "बी. एस्सी अग्री"
    },

    {
      label: "Case 6 - Generic Degree",
      education:
        "पदवी"
    }

  ];


  const results = [];


  testCases.forEach(
    function(testCase) {

      const result =
        normalizeMatchingEducation(
          testCase.education
        );


      results.push({

        label:
          testCase.label,

        input:
          testCase.education,

        output:
          result

      });

    }
  );


  console.log(
    JSON.stringify(
      results,
      null,
      2
    )
  );

}