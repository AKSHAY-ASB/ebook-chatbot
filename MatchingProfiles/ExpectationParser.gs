// ============================================================
// FILE : ExpectationParser.gs
// MODULE : Matching
// PURPOSE : Convert "अपेक्षा" text into matching criteria
//
// FLOW
//
// Expectation Text
//       ↓
// Expectation Parser
//       ↓
// Education Criteria
// Profession Criteria
// Employment Criteria
// District Criteria
//       ↓
// MatchingEngine.gs
//
// IMPORTANT
// - Does NOT read Google Sheets
// - Does NOT decide final MATCH
// - Does NOT apply LIKE / DISLIKE
// - Only extracts criteria
// ============================================================


// ============================================================
// EXPECTATION SOFT PREFERENCE RULES
// ============================================================

const EXPECTATION_SOFT_PREFERENCE_RULES = {

  educated: [
    "सुशिक्षित",
    "शिक्षित",
    "well educated",
    "educated"
  ],

  understanding: [
    "समजूतदार",
    "समजून घेणारी",
    "समजून घेणारा",
    "understanding"
  ],

  cultured: [
    "संस्कारी",
    "संस्कार",
    "cultured"
  ],

  loving: [
    "प्रेमळ",
    "loving",
    "caring"
  ],

  respectful: [
    "आदर",
    "आदर करणारी",
    "आदर करणारा",
    "respectful",
    "respect",
    "mutual respect"
  ],

  honest: [
    "प्रामाणिक",
    "honest"
  ],

  responsible: [
    "जबाबदार",
    "जबाबदारीची जाणीव",
    "responsible"
  ],

  familyOriented: [
    "कुटुंबवत्सल",
    "कुटुंबाला महत्त्व",
    "कुटुंबाला महत्व",
    "family oriented",
    "values family"
  ],

  dreamSupportive: [

    "स्वप्नांचा आदर",
    "स्वप्नांना पाठिंबा",
    "स्वप्नांना साथ",
    "स्वप्नांना समर्थन",

    "स्वप्नांना",
    "स्वप्नांचा",
    "स्वप्नांसाठी",
    "स्वप्न पूर्ण करण्यासाठी",

    "supports my dreams",
    "support my dreams",
    "supportive of dreams",
    "dream supportive",
    "support dreams",
    "supports dreams"

  ],

  careerSupportive: [

    "करिअरचा आदर",
    "करिअरला पाठिंबा",
    "करिअरला साथ",
    "करिअरला समर्थन",

    "करिअरचा",
    "करिअरला",
    "करिअरसाठी",
    "करिअरमध्ये",

    "career supportive",
    "career-supportive",
    "supports career",
    "support my career",
    "supportive of career",
    "career support"

  ],

  communication: [
    "संवाद",
    "चांगला संवाद",
    "communication"
  ]

};

// ============================================================
// EXPECTATION PARSER VERSION
// ============================================================

const EXPECTATION_PARSER_VERSION =
  "1.0.0";



// ============================================================
// NORMALIZE EXPECTATION TEXT
// ============================================================

function normalizeExpectationText(
  value
) {

  if (!value) {

    return "";

  }


  return String(value)

    .toLowerCase()

    .replace(
      /<br\s*\/?>/gi,
      " "
    )

    .replace(
      /[|;:()[\]{}\/\\]+/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim();

}



// ============================================================
// UNIQUE ARRAY
// ============================================================

function expectationUnique(
  array
) {

  if (
    !Array.isArray(array)
  ) {

    return [];

  }


  const result = [];


  array.forEach(
    function (value) {

      if (!value) {

        return;

      }


      const clean =
        String(
          value
        ).trim();


      if (
        clean &&
        !result.includes(
          clean
        )
      ) {

        result.push(
          clean
        );

      }

    }
  );


  return result;

}



// ============================================================
// CHECK EXPECTATION KEYWORD
// ============================================================

function expectationKeywordExists(
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
    normalizeExpectationText(
      text
    );


  const cleanKeyword =
    normalizeExpectationText(
      keyword
    );


  if (
    !cleanKeyword
  ) {

    return false;

  }


  // ========================================================
  // MULTI-WORD KEYWORDS
  // ========================================================

  if (
    cleanKeyword.includes(" ")
  ) {

    return cleanText.includes(
      cleanKeyword
    );

  }


  // ========================================================
  // SINGLE WORD / QUALIFICATION
  //
  // Match when keyword is surrounded by:
  //
  // space
  // comma
  // period
  // slash
  // hyphen
  // beginning / end
  //
  // This fixes:
  //
  // "सुशिक्षित,"
  // "Doctor,"
  // "MBA,"
  // "MD,"
  // ========================================================

  const escapedKeyword =
    cleanKeyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );


  const regex =
    new RegExp(
      "(^|[\\s,.;:/\\-])" +
      escapedKeyword +
      "(?=$|[\\s,.;:/\\-])",
      "iu"
    );


  return regex.test(
    cleanText
  );

}


// ============================================================
// EDUCATION EXPECTATION RULES
// ============================================================

const EXPECTATION_EDUCATION_RULES = [

  // ----------------------------------------------------------
  // MEDICAL
  // ----------------------------------------------------------

  {
    category:
      "Medical & Healthcare",

    keywords: [

      "doctor",
      "medical",
      "mbbs",
      "md",
      "bhms",
      "bams",
      "bds",
      "mch",
      "dm",
      "physician",
      "surgeon",
      "dentist",
      "नोकरी डॉक्टर",
      "डॉक्टर"

    ]

  },


  // ----------------------------------------------------------
  // ENGINEERING
  // ----------------------------------------------------------

  {
    category:
      "Engineering & Technology",

    keywords: [

      "engineer",
      "engineering",
      "engineering graduate",

      "be",
      "b.e",
      "me",
      "m.e",
      "mtech",
      "m tech",

      "computer engineer",
      "civil engineer",
      "mechanical engineer",
      "electrical engineer",
      "electronics engineer",

      "it engineer",
      "software engineer",

      "इंजिनियर",
      "इंजिनीअर",
      "इंजिनिअर",
      "इंजिनियरिंग"

    ]

  },


  // ----------------------------------------------------------
  // COMMERCE / MANAGEMENT
  // ----------------------------------------------------------

  {
    category: "Commerce & Management",

    keywords: [
      "mba",
      "m.b.a",
      "bba",
      "b.com",
      "bcom",
      "m.com",
      "mcom",
      "management",
      "commerce",
      "ca",
      "chartered accountant",
      "accountant",
      "accounting",
      "कॉमर्स",
      "व्यवस्थापन"
    ]
  },


  // ----------------------------------------------------------
  // SCIENCE & AGRICULTURE
  // ----------------------------------------------------------

  {
    category:
      "Science & Agriculture",

    keywords: [

      "b.sc",
      "bsc",
      "m.sc",
      "msc",

      "science",

      "agriculture",
      "agri",
      "b.sc agriculture",

      "कृषी",
      "अग्री",
      "विज्ञान"

    ]

  },


  // ----------------------------------------------------------
  // ARTS & HUMANITIES
  // ----------------------------------------------------------

  {
    category:
      "Arts & Humanities",

    keywords: [

      "b.a",
      "ba",
      "m.a",
      "ma",

      "arts",
      "humanities",

      "कला",
      "मानव्य"

    ]

  },


  // ----------------------------------------------------------
  // LAW
  // ----------------------------------------------------------

  {
    category:
      "Law / Architecture / Design",

    keywords: [

      "lawyer",
      "advocate",
      "law",
      "llb",
      "llm",

      "architecture",
      "architect",

      "design",
      "designer",

      "वकील",
      "कायदा"

    ]

  },


  // ----------------------------------------------------------
  // GENERAL EDUCATION
  // ----------------------------------------------------------

  {
    category:
      "General Education",

    keywords: [

      "graduate",
      "graduation",
      "degree",
      "any graduate",

      "पदवी",
      "पदवीधर",
      "ग्रॅज्युएट",
      "बारावी",
      "12th",
      "hsc",
      "10th",
      "ssc"

    ]

  }

];



// ============================================================
// PROFESSION EXPECTATION RULES
// ============================================================

const EXPECTATION_PROFESSION_RULES = [

  // ----------------------------------------------------------
  // IT
  // ----------------------------------------------------------

  {
    category:
      "IT & Software",

    keywords: [

      "it",
      "it engineer",
      "it field",
      "software",
      "software engineer",
      "software developer",
      "web developer",
      "web design",
      "computer engineer",
      "computer science",
      "technology",

      "आय टी",
      "आयटी",
      "सॉफ्टवेअर"

    ]

  },


  // ----------------------------------------------------------
  // ENGINEERING
  // ----------------------------------------------------------

  {
    category: "Engineering & Technology",

    keywords: [
      "engineer",
      "engineering",
      "b.e",
      "b.e.",
      "be",
      "m.e",
      "m.e.",
      "me",
      "mtech",
      "m tech",
      "computer engineer",
      "civil engineer",
      "mechanical engineer",
      "electrical engineer",
      "electronics engineer",
      "it engineer",
      "software engineer",
      "इंजिनियर",
      "इंजिनीअर",
      "इंजिनिअर",
      "इंजिनियरिंग"
    ]
  },


  // ----------------------------------------------------------
  // MEDICAL
  // ----------------------------------------------------------

  {
    category: "Medical & Healthcare",

    keywords: [
      "doctor",
      "medical",
      "mbbs",
      "m.d",
      "md",
      "bhms",
      "bams",
      "bds",
      "mch",
      "dm",
      "physician",
      "surgeon",
      "dentist",
      "डॉक्टर"
    ]
  },


  // ----------------------------------------------------------
  // BUSINESS
  // ----------------------------------------------------------

  {
    category:
      "Business / Entrepreneurship",

    keywords: [

      "business",
      "businessman",
      "businesswoman",
      "entrepreneur",
      "entrepreneurship",
      "startup",
      "founder",
      "owner",
      "proprietor",

      "व्यवसाय",
      "व्यावसायिक",
      "उद्योजक",
      "उद्योग"

    ]

  },


  // ----------------------------------------------------------
  // GOVERNMENT
  // ----------------------------------------------------------

  {
    category:
      "Government / Public Sector",

    keywords: [

      "government",
      "govt",
      "government job",
      "govt job",
      "government officer",
      "सरकारी",
      "शासकीय",
      "शासकीय नोकरी",
      "सरकारी नोकरी"

    ]

  },


  // ----------------------------------------------------------
  // EDUCATION
  // ----------------------------------------------------------

  {
    category:
      "Education & Teaching",

    keywords: [

      "teacher",
      "teaching",
      "professor",
      "lecturer",
      "education",

      "शिक्षक",
      "शिक्षिका",
      "प्राध्यापक",
      "शिक्षण"

    ]

  }

];



// ============================================================
// EMPLOYMENT EXPECTATION RULES
// ============================================================

const EXPECTATION_EMPLOYMENT_RULES = [

  // BUSINESS
  {
    type:
      "BUSINESS",

    keywords: [

      "business",
      "businessman",
      "businesswoman",
      "entrepreneur",
      "startup",
      "founder",
      "owner",
      "proprietor",
      "व्यवसाय",
      "उद्योजक",
      "उद्योग"

    ]

  },


  // GOVERNMENT
  {
    type: "GOVERNMENT",

    keywords: [
      "government",
      "govt",
      "government job",
      "govt job",
      "government officer",
      "government employee",
      "सरकारी नोकरी",
      "सरकारी",
      "शासकीय नोकरी",
      "शासकीय",
      "शासकीय अधिकारी"
    ]
  },


  // PRIVATE
  {
    type: "PRIVATE",

    keywords: [
      "private job",
      "private company",
      "private sector",
      "pvt job",
      "pvt company",
      "mnc",
      "corporate job"
    ]
  },


  // SELF EMPLOYED
  {
    type:
      "SELF_EMPLOYED",

    keywords: [

      "freelancer",
      "freelance",
      "consultant",
      "self employed",
      "स्वयंरोजगार"

    ]

  }

];



// ============================================================
// PARSE EDUCATION CRITERIA
// ============================================================

function parseExpectationEducation(
  expectationText
) {

  const categories = [];


  EXPECTATION_EDUCATION_RULES.forEach(
    function (rule) {

      const matched =
        rule.keywords.some(
          function (keyword) {

            return expectationQualificationExists(
              expectationText,
              keyword
            );

          }
        );


      if (
        matched
      ) {

        categories.push(
          rule.category
        );

      }

    }
  );


  return expectationUnique(
    categories
  );

}



// ============================================================
// PARSE PROFESSION CRITERIA
// ============================================================

function parseExpectationProfession(
  expectationText
) {

  const categories = [];


  EXPECTATION_PROFESSION_RULES.forEach(
    function (rule) {

      const matched =
        rule.keywords.some(
          function (keyword) {

            return expectationKeywordExists(
              expectationText,
              keyword
            );

          }
        );


      if (
        matched
      ) {

        categories.push(
          rule.category
        );

      }

    }
  );


  return expectationUnique(
    categories
  );

}



// ============================================================
// PARSE EMPLOYMENT TYPES
// ============================================================

function parseExpectationEmploymentTypes(
  expectationText
) {

  const types = [];


  EXPECTATION_EMPLOYMENT_RULES.forEach(
    function (rule) {

      const matched =
        rule.keywords.some(
          function (keyword) {

            return expectationKeywordExists(
              expectationText,
              keyword
            );

          }
        );


      if (
        matched
      ) {

        types.push(
          rule.type
        );

      }

    }
  );


  return expectationUnique(
    types
  );

}



// ============================================================
// MAIN EXPECTATION PARSER
// ============================================================

function parseExpectations(
  expectationText
) {

  const raw =
    String(
      expectationText || ""
    ).trim();


  const normalizedText =
    normalizeExpectationText(
      raw
    );


  if (!normalizedText) {

    return {

      raw:
        raw,

      normalizedText:
        "",

      educationCategories: [],

      professionCategories: [],

      employmentTypes: [],

      educationRequired:
        false,

      employmentRequired:
        false,

      softPreferences: {

        educated:
          false,

        understanding:
          false,

        cultured:
          false,

        loving:
          false,

        careerSupportive:
          false,

        dreamSupportive:
          false,

        familyOriented:
          false,

        goodNature:
          false

      },

      hasHardCriteria:
        false,

      hasSoftPreferences:
        false,

      hasExpectationData:
        false

    };

  }


  // ==========================================================
  // HARD CRITERIA
  // ==========================================================

  const educationCategories =
    parseExpectationEducation(
      normalizedText
    );


  const professionCategories =
    parseExpectationProfession(
      normalizedText
    );


  const employmentTypes =
    parseExpectationEmploymentTypes(
      normalizedText
    );


  // ==========================================================
  // EDUCATION REQUIRED
  //
  // "सुशिक्षित" does NOT mean a specific category.
  // It only means education should be available.
  // ==========================================================

  const educationRequired =

    educationCategories.length > 0 ||

    expectationKeywordExists(
      normalizedText,
      "सुशिक्षित"
    ) ||

    expectationKeywordExists(
      normalizedText,
      "शिक्षित"
    ) ||

    expectationKeywordExists(
      normalizedText,
      "पदवीधर"
    ) ||

    expectationKeywordExists(
      normalizedText,
      "graduate"
    );


  // ==========================================================
  // EMPLOYMENT REQUIRED
  //
  // Generic "नोकरी" does NOT mean PRIVATE.
  // ==========================================================

  const employmentRequired =
    expectationKeywordExists(
      normalizedText,
      "नोकरी"
    ) ||
    expectationKeywordExists(
      normalizedText,
      "job"
    ) ||
    expectationKeywordExists(
      normalizedText,
      "नोकरी करणारी"
    ) ||
    expectationKeywordExists(
      normalizedText,
      "नोकरी करणारा"
    );






  // ==========================================================
  // SOFT PREFERENCES
  // ==========================================================

  const softPreferences =
    parseExpectationSoftPreferences(
      normalizedText
    );


  // ==========================================================
  // HARD CRITERIA AVAILABLE?
  // ==========================================================

  const hasHardCriteria =
    educationCategories.length > 0 ||
    professionCategories.length > 0 ||
    employmentTypes.length > 0 ||
    educationRequired ||
    employmentRequired;


  // ==========================================================
  // SOFT PREFERENCES AVAILABLE?
  // ==========================================================

  const hasSoftPreferences =
    Object.keys(
      softPreferences
    ).some(
      function (key) {

        return (
          softPreferences[key] === true
        );

      }
    );


  // ==========================================================
  // FINAL RESULT
  // ==========================================================

  return {

    raw:
      raw,

    normalizedText:
      normalizedText,

    educationCategories:
      educationCategories,

    professionCategories:
      professionCategories,

    employmentTypes:
      employmentTypes,

    educationRequired:
      educationRequired,

    employmentRequired:
      employmentRequired,

    softPreferences:
      softPreferences,

    hasHardCriteria:
      hasHardCriteria,

    hasSoftPreferences:
      hasSoftPreferences,

    hasExpectationData:
      true

  };

}




// ============================================================
// PARSE SOFT PREFERENCES
// ============================================================

function parseExpectationSoftPreferences(
  expectationText
) {

  const normalizedText =
    normalizeExpectationText(
      expectationText
    );

  const softPreferences = {};

  Object.keys(
    EXPECTATION_SOFT_PREFERENCE_RULES
  ).forEach(
    function (preference) {

      const keywords =
        EXPECTATION_SOFT_PREFERENCE_RULES[
        preference
        ] || [];

      softPreferences[preference] =
        keywords.some(
          function (keyword) {

            return expectationKeywordExists(
              normalizedText,
              keyword
            );

          }
        );

    }
  );

  return softPreferences;

}



// ============================================================
// TEST CASES
// ============================================================

function testExpectationParser() {

  const testCases = [

    {
      label:
        "Case 1 - Doctor MD ME MTech MBA",

      input:
        "Doctor, MD, ME, MTech, MBA"

    },


    {
      label:
        "Case 2 - IT Engineer",

      input:
        "आय टी इंजिनिअर , दिसायला अनुरुप"

    },


    {
      label:
        "Case 3 - Government Job",

      input:
        "सरकारी नोकरी किंवा Engineer"

    },


    {
      label:
        "Case 4 - Business",

      input:
        "Businessman / Entrepreneur"

    },


    {
      label:
        "Case 5 - Graduate",

      input:
        "Graduate and job"

    },


    {
      label:
        "Case 6 - Engineer Doctor Graduate",

      input:
        "इंजिनियर/ डॉक्टर/ पदवीधर"

    }

  ];


  const results =
    testCases.map(
      function (testCase) {

        return {

          label:
            testCase.label,

          input:
            testCase.input,

          output:
            parseExpectations(
              testCase.input
            )

        };

      }
    );


  console.log(
    JSON.stringify(
      results,
      null,
      2
    )
  );


  return results;

}


function expectationQualificationExists(
  text,
  keyword
) {

  if (!text || !keyword) {
    return false;
  }

  const cleanText =
    normalizeExpectationText(text);

  const cleanKeyword =
    String(keyword || "")
      .toLowerCase()
      .trim();

  // --------------------------------------------
  // Qualification aliases
  // --------------------------------------------

  const aliases = {

    "md": [
      "md",
      "m.d",
      "m d"
    ],

    "me": [
      "me",
      "m.e",
      "m e"
    ],

    "mtech": [
      "mtech",
      "m tech",
      "m.tech"
    ],

    "mba": [
      "mba",
      "m.b.a",
      "m b a"
    ],

    "be": [
      "be",
      "b.e",
      "b e"
    ],

    "ba": [
      "ba",
      "b.a",
      "b a"
    ],

    "ma": [
      "ma",
      "m.a",
      "m a"
    ]

  };


  const keywordAliases =
    aliases[cleanKeyword];


  // --------------------------------------------
  // If keyword has aliases
  // --------------------------------------------

  if (
    keywordAliases &&
    keywordAliases.length > 0
  ) {

    return keywordAliases.some(
      function (alias) {

        const escaped =
          alias.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

        const regex =
          new RegExp(
            "(^|\\s|,|/)" +
            escaped +
            "(?=\\s|,|/|$)",
            "i"
          );

        return regex.test(
          cleanText
        );

      }
    );

  }


  // --------------------------------------------
  // Normal keyword
  // --------------------------------------------

  return expectationKeywordExists(
    cleanText,
    cleanKeyword
  );

}
// ============================================================
// TEST USER'S OWN EXPECTATION
// ============================================================

function testAkshayExpectation() {

  const input =
    "आयुष्यभराची विश्वासू मैत्रीण, सुशिक्षित ,समजूतदार, संस्कारी आणि प्रेमळ व करिअरचा आणि स्वप्नांचा आदर करणारी जीवनसाथी असावी.";


  const result =
    parseExpectations(
      input
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




function testMatchingExpectationParser() {

  const testCases = [

    {
      label: "ID001 Expectation",

      input:
        "आयुष्यभराची विश्वासू मैत्रीण, सुशिक्षित, समजूतदार, संस्कारी आणि प्रेमळ व करिअरचा आणि स्वप्नांचा आदर करणारी जीवनसाथी असावी."
    },

    {
      label: "Simple Education",

      input:
        "सुशिक्षित मुलगी हवी."
    },

    {
      label: "Government Job",

      input:
        "सुशिक्षित आणि सरकारी नोकरी करणारी मुलगी हवी."
    },

    {
      label: "English",

      input:
        "Looking for an honest, caring, respectful and family-oriented partner."
    }

  ];


  const results = testCases.map(
    function (testCase) {

      const result =
        parseExpectationCriteria(
          testCase.input
        );

      return {

        label:
          testCase.label,

        input:
          testCase.input,

        output:
          result

      };

    }
  );


  console.log(
    JSON.stringify(
      results,
      null,
      2
    )
  );


  return results;

}



function testEducationRequiredFix() {

  const testCases = [

    "सुशिक्षित मुलगी हवी.",

    "MBA केलेली मुलगी हवी.",

    "Engineering केलेली मुलगी हवी.",

    "MBA किंवा Engineering केलेली मुलगी हवी.",

    "Doctor मुलगी हवी.",

    "समजूतदार आणि प्रेमळ मुलगी हवी."

  ];


  testCases.forEach(
    function (input) {

      const result =
        parseExpectationCriteria(
          input
        );


      console.log(
        "INPUT:",
        input
      );


      console.log(
        JSON.stringify(
          {
            educationRequired:
              result.educationRequired,

            educationCategories:
              result.educationCategories,

            hasHardCriteria:
              result.hasHardCriteria

          },
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




function testEducationCategoryMatching() {

  console.log(
    "=================================================="
  );

  console.log(
    "EDUCATION CATEGORY MATCHING TEST"
  );

  console.log(
    "=================================================="
  );


  // ----------------------------------------------------------
  // EXPECTATION
  // ----------------------------------------------------------

  const expectationText =
    "MBA किंवा Engineering केलेली मुलगी हवी.";


  const expectationCriteria =
    parseExpectationCriteria(
      expectationText
    );


  console.log(
    "EXPECTATION:"
  );

  console.log(
    JSON.stringify(
      expectationCriteria,
      null,
      2
    )
  );


  // ----------------------------------------------------------
  // CONTROLLED CANDIDATES
  // ----------------------------------------------------------

  const candidates = [

    {
      id: "TEST-B-COM",

      name: "Test Candidate - B.Com",

      education: {
        raw: "B.Com",
        normalizedText: "b.com",
        qualifications: [
          "B.Com"
        ],
        categories: [
          "Commerce & Management"
        ],
        matchedKeywords: [
          "b.com"
        ],
        hasEducationData: true
      },

      expectedMatch: false
    },


    {
      id: "TEST-MBA",

      name: "Test Candidate - MBA",

      education: {
        raw: "MBA",
        normalizedText: "mba",
        qualifications: [
          "MBA"
        ],
        categories: [
          "Commerce & Management"
        ],
        matchedKeywords: [
          "mba"
        ],
        hasEducationData: true
      },

      expectedMatch: true
    },


    {
      id: "TEST-BE",

      name: "Test Candidate - BE",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      expectedMatch: true
    },


    {
      id: "TEST-MBBS",

      name: "Test Candidate - MBBS",

      education: {
        raw: "MBBS",
        normalizedText: "mbbs",
        qualifications: [
          "MBBS"
        ],
        categories: [
          "Medical & Healthcare"
        ],
        matchedKeywords: [
          "mbbs"
        ],
        hasEducationData: true
      },

      expectedMatch: false
    }

  ];


  // ----------------------------------------------------------
  // RUN TESTS
  // ----------------------------------------------------------

  const results = [];


  candidates.forEach(
    function (candidate) {

      let actualMatch = false;

      let result = null;

      let error = null;


      try {

        result =
          evaluateEducationMatch(
            candidate,
            expectationCriteria
          );


        actualMatch =
          result &&
          result.matched === true;

      }

      catch (e) {

        error =
          e.message ||
          String(e);

      }


      const passed =
        !error &&
        actualMatch ===
        candidate.expectedMatch;


      const testResult = {

        id:
          candidate.id,

        name:
          candidate.name,

        candidateCategories:
          candidate.education.categories,

        expectedMatch:
          candidate.expectedMatch,

        actualMatch:
          actualMatch,

        passed:
          passed,

        error:
          error,

        result:
          result

      };


      results.push(
        testResult
      );


      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "CANDIDATE:",
        candidate.name
      );

      console.log(
        JSON.stringify(
          testResult,
          null,
          2
        )
      );

    }
  );


  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------

  const passedCount =
    results.filter(
      function (item) {

        return item.passed === true;

      }
    ).length;


  const failedCount =
    results.length -
    passedCount;


  const allPassed =
    failedCount === 0;


  console.log(
    "=================================================="
  );

  console.log(
    "TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {
        totalTests:
          results.length,

        passed:
          passedCount,

        failed:
          failedCount,

        allPassed:
          allPassed
      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );


  return {

    success:
      allPassed,

    totalTests:
      results.length,

    passed:
      passedCount,

    failed:
      failedCount,

    results:
      results

  };

}



function testEducationEngineeringOnly() {

  console.log(
    "=================================================="
  );

  console.log(
    "ENGINEERING EDUCATION MATCHING TEST"
  );

  console.log(
    "=================================================="
  );


  // ----------------------------------------------------------
  // EXPECTATION
  // ----------------------------------------------------------

  const expectationText =
    "Engineering केलेली मुलगी हवी.";


  const expectationCriteria =
    parseExpectationCriteria(
      expectationText
    );


  console.log(
    "EXPECTATION:"
  );

  console.log(
    JSON.stringify(
      {
        educationCategories:
          expectationCriteria.educationCategories,

        educationRequired:
          expectationCriteria.educationRequired

      },
      null,
      2
    )
  );


  // ----------------------------------------------------------
  // TEST CANDIDATES
  // ----------------------------------------------------------

  const candidates = [

    {
      id: "TEST-B-COM",

      name: "Test Candidate - B.Com",

      education: {
        raw: "B.Com",
        normalizedText: "b.com",
        qualifications: [
          "B.Com"
        ],
        categories: [
          "Commerce & Management"
        ],
        matchedKeywords: [
          "b.com"
        ],
        hasEducationData: true
      },

      expectedMatch: false
    },


    {
      id: "TEST-MBA",

      name: "Test Candidate - MBA",

      education: {
        raw: "MBA",
        normalizedText: "mba",
        qualifications: [
          "MBA"
        ],
        categories: [
          "Commerce & Management"
        ],
        matchedKeywords: [
          "mba"
        ],
        hasEducationData: true
      },

      expectedMatch: false
    },


    {
      id: "TEST-BE",

      name: "Test Candidate - BE",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      expectedMatch: true
    },


    {
      id: "TEST-BTECH",

      name: "Test Candidate - B.Tech",

      education: {
        raw: "B.Tech Computer Engineering",
        normalizedText:
          "b.tech computer engineering",
        qualifications: [
          "B.Tech Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.tech",
          "engineering"
        ],
        hasEducationData: true
      },

      expectedMatch: true
    },


    {
      id: "TEST-MBBS",

      name: "Test Candidate - MBBS",

      education: {
        raw: "MBBS",
        normalizedText: "mbbs",
        qualifications: [
          "MBBS"
        ],
        categories: [
          "Medical & Healthcare"
        ],
        matchedKeywords: [
          "mbbs"
        ],
        hasEducationData: true
      },

      expectedMatch: false
    }

  ];


  // ----------------------------------------------------------
  // RUN TESTS
  // ----------------------------------------------------------

  const results = [];


  candidates.forEach(
    function (candidate) {

      let actualMatch =
        false;

      let result =
        null;

      let error =
        null;


      try {

        result =
          evaluateEducationMatch(
            candidate,
            expectationCriteria
          );


        actualMatch =
          result &&
          result.matched === true;

      }

      catch (e) {

        error =
          e.message ||
          String(e);

      }


      const passed =
        !error &&
        actualMatch ===
        candidate.expectedMatch;


      const testResult = {

        id:
          candidate.id,

        name:
          candidate.name,

        candidateCategories:
          candidate.education.categories,

        expectedMatch:
          candidate.expectedMatch,

        actualMatch:
          actualMatch,

        passed:
          passed,

        error:
          error,

        result:
          result

      };


      results.push(
        testResult
      );


      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "CANDIDATE:",
        candidate.name
      );

      console.log(
        JSON.stringify(
          testResult,
          null,
          2
        )
      );

    }
  );


  // ----------------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------------

  const passedCount =
    results.filter(
      function (item) {

        return item.passed === true;

      }
    ).length;


  const failedCount =
    results.length -
    passedCount;


  const allPassed =
    failedCount === 0;


  console.log(
    "=================================================="
  );

  console.log(
    "TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {
        totalTests:
          results.length,

        passed:
          passedCount,

        failed:
          failedCount,

        allPassed:
          allPassed
      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );


  return {

    success:
      allPassed,

    totalTests:
      results.length,

    passed:
      passedCount,

    failed:
      failedCount,

    results:
      results

  };

}



function testMultiCriteriaHardMatching() {

  console.log(
    "=================================================="
  );

  console.log(
    "MULTI-CRITERIA HARD MATCHING TEST"
  );

  console.log(
    "=================================================="
  );


  // ==========================================================
  // EXPECTATION
  // ==========================================================

  const expectationText =
    "Engineering केलेली, पुणे जिल्ह्यातील, " +
    "वय 25 ते 30 वर्षे, उंची 5 फूट 3 इंच किंवा त्यापेक्षा जास्त, " +
    "मासिक उत्पन्न 50000 पेक्षा जास्त आणि सरकारी नोकरी करणारी मुलगी हवी.";


  const expectationCriteria =
    parseExpectationCriteria(
      expectationText
    );


  console.log(
    "EXPECTATION:"
  );

  console.log(
    JSON.stringify(
      expectationCriteria,
      null,
      2
    )
  );


  // ==========================================================
  // CONTROLLED CANDIDATES
  // ==========================================================

  const candidates = [

    // --------------------------------------------------------
    // 1. PERFECT MATCH
    // --------------------------------------------------------

    {
      id: "TEST-001",

      name: "Perfect Match",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      ageRaw:
        "27 years",

      heightRaw:
        "5 feet 5 inches",

      incomeRaw:
        "Rs. 65000",

      district:
        "पुणे (Pune)",

      professionRaw:
        "Government Officer",

      profession: {
        categories: [
          "Government / Public Sector"
        ],
        employmentTypes: [
          "GOVERNMENT"
        ]
      },

      expectedMatch:
        true
    },


    // --------------------------------------------------------
    // 2. WRONG EDUCATION
    // --------------------------------------------------------

    {
      id: "TEST-002",

      name: "Wrong Education",

      education: {
        raw: "B.Com",
        normalizedText:
          "b.com",
        qualifications: [
          "B.Com"
        ],
        categories: [
          "Commerce & Management"
        ],
        matchedKeywords: [
          "b.com"
        ],
        hasEducationData: true
      },

      ageRaw:
        "27 years",

      heightRaw:
        "5 feet 5 inches",

      incomeRaw:
        "Rs. 65000",

      district:
        "पुणे (Pune)",

      professionRaw:
        "Government Officer",

      profession: {
        categories: [
          "Government / Public Sector"
        ],
        employmentTypes: [
          "GOVERNMENT"
        ]
      },

      expectedMatch:
        false
    },


    // --------------------------------------------------------
    // 3. WRONG AGE
    // --------------------------------------------------------

    {
      id: "TEST-003",

      name: "Wrong Age",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      ageRaw:
        "32 years",

      heightRaw:
        "5 feet 5 inches",

      incomeRaw:
        "Rs. 65000",

      district:
        "पुणे (Pune)",

      professionRaw:
        "Government Officer",

      profession: {
        categories: [
          "Government / Public Sector"
        ],
        employmentTypes: [
          "GOVERNMENT"
        ]
      },

      expectedMatch:
        false
    },


    // --------------------------------------------------------
    // 4. WRONG HEIGHT
    // --------------------------------------------------------

    {
      id: "TEST-004",

      name: "Wrong Height",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      ageRaw:
        "27 years",

      heightRaw:
        "5 feet 1 inches",

      incomeRaw:
        "Rs. 65000",

      district:
        "पुणे (Pune)",

      professionRaw:
        "Government Officer",

      profession: {
        categories: [
          "Government / Public Sector"
        ],
        employmentTypes: [
          "GOVERNMENT"
        ]
      },

      expectedMatch:
        false
    },


    // --------------------------------------------------------
    // 5. WRONG INCOME
    // --------------------------------------------------------

    {
      id: "TEST-005",

      name: "Wrong Income",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      ageRaw:
        "27 years",

      heightRaw:
        "5 feet 5 inches",

      incomeRaw:
        "Rs. 35000",

      district:
        "पुणे (Pune)",

      professionRaw:
        "Government Officer",

      profession: {
        categories: [
          "Government / Public Sector"
        ],
        employmentTypes: [
          "GOVERNMENT"
        ]
      },

      expectedMatch:
        false
    },


    // --------------------------------------------------------
    // 6. WRONG DISTRICT
    // --------------------------------------------------------

    {
      id: "TEST-006",

      name: "Wrong District",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      ageRaw:
        "27 years",

      heightRaw:
        "5 feet 5 inches",

      incomeRaw:
        "Rs. 65000",

      district:
        "मुंबई (Mumbai)",

      professionRaw:
        "Government Officer",

      profession: {
        categories: [
          "Government / Public Sector"
        ],
        employmentTypes: [
          "GOVERNMENT"
        ]
      },

      expectedMatch:
        false
    },


    // --------------------------------------------------------
    // 7. WRONG EMPLOYMENT
    // --------------------------------------------------------

    {
      id: "TEST-007",

      name: "Wrong Employment",

      education: {
        raw: "B.E. Computer Engineering",
        normalizedText:
          "b.e. computer engineering",
        qualifications: [
          "B.E. Computer Engineering"
        ],
        categories: [
          "Engineering & Technology"
        ],
        matchedKeywords: [
          "b.e",
          "engineering"
        ],
        hasEducationData: true
      },

      ageRaw:
        "27 years",

      heightRaw:
        "5 feet 5 inches",

      incomeRaw:
        "Rs. 65000",

      district:
        "पुणे (Pune)",

      professionRaw:
        "Software Engineer",

      profession: {
        categories: [
          "Engineering & Technology"
        ],
        employmentTypes: [
          "PRIVATE"
        ]
      },

      expectedMatch:
        false
    }

  ];


  // ==========================================================
  // RUN TESTS
  // ==========================================================

  const results = [];


  candidates.forEach(
    function (candidate) {

      let actualMatch =
        false;

      let matchingResult =
        null;

      let error =
        null;


      try {

        matchingResult =
          evaluateCandidateMatch(
            candidate,
            expectationCriteria
          );


        actualMatch =
          matchingResult &&
          matchingResult.matched === true;

      }

      catch (e) {

        error =
          e.message ||
          String(e);

      }


      const passed =
        !error &&
        actualMatch ===
        candidate.expectedMatch;


      const failedCriteria =
        matchingResult &&
          Array.isArray(
            matchingResult.failedCriteria
          )
          ? matchingResult.failedCriteria
          : [];


      const testResult = {

        id:
          candidate.id,

        name:
          candidate.name,

        expectedMatch:
          candidate.expectedMatch,

        actualMatch:
          actualMatch,

        passed:
          passed,

        failedCriteria:
          failedCriteria,

        error:
          error,

        matchingResult:
          matchingResult

      };


      results.push(
        testResult
      );


      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "CANDIDATE:",
        candidate.name
      );

      console.log(
        JSON.stringify(
          testResult,
          null,
          2
        )
      );

    }
  );


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const passedCount =
    results.filter(
      function (item) {

        return item.passed === true;

      }
    ).length;


  const failedCount =
    results.length -
    passedCount;


  const allPassed =
    failedCount === 0;


  console.log(
    "=================================================="
  );

  console.log(
    "MULTI-CRITERIA TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {
        totalTests:
          results.length,

        passed:
          passedCount,

        failed:
          failedCount,

        allPassed:
          allPassed
      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );


  return {

    success:
      allPassed,

    totalTests:
      results.length,

    passed:
      passedCount,

    failed:
      failedCount,

    results:
      results

  };

}


function testProfileEvidenceAnalysis() {

  console.log(
    "=================================================="
  );

  console.log(
    "PROFILE EVIDENCE ANALYSIS TEST"
  );

  console.log(
    "=================================================="
  );


  const testCases = [

    // ========================================================
    // 1. UNDERSTANDING - MATCH
    // ========================================================

    {
      id:
        "TEST-EVIDENCE-001",

      name:
        "Understanding - Match",

      preference:
        "understanding",

      expectedStatus:
        "MATCH",

      candidate: {

        name:
          "Candidate Understanding",

        aboutMe:
          "मी समजूतदार आणि शांत स्वभावाचा आहे.",

        educationRaw:
          "B.Com",

        professionRaw:
          "Private Company"

      }

    },


    // ========================================================
    // 2. UNDERSTANDING - UNKNOWN
    // ========================================================

    {
      id:
        "TEST-EVIDENCE-002",

      name:
        "Understanding - Unknown",

      preference:
        "understanding",

      expectedStatus:
        "UNKNOWN",

      candidate: {

        name:
          "Candidate No Evidence",

        aboutMe:
          "",

        educationRaw:
          "B.Com",

        professionRaw:
          "Private Company"

      }

    },


    // ========================================================
    // 3. LOVING - MATCH
    // ========================================================

    {
      id:
        "TEST-EVIDENCE-003",

      name:
        "Loving - Match",

      preference:
        "loving",

      expectedStatus:
        "MATCH",

      candidate: {

        name:
          "Candidate Loving",

        selfDescription:
          "मी प्रेमळ आणि काळजी घेणारा स्वभावाचा आहे.",

        educationRaw:
          "MBA",

        professionRaw:
          "Business"

      }

    },


    // ========================================================
    // 4. RESPECTFUL - MATCH
    // ========================================================

    {
      id:
        "TEST-EVIDENCE-004",

      name:
        "Respectful - Match",

      preference:
        "respectful",

      expectedStatus:
        "MATCH",

      candidate: {

        name:
          "Candidate Respectful",

        personality:
          "मी इतरांचा आदर करणारा आणि शांत स्वभावाचा आहे.",

        educationRaw:
          "BE",

        professionRaw:
          "Engineer"

      }

    },


    // ========================================================
    // 5. CAREER SUPPORTIVE - MATCH
    // ========================================================

    {
      id:
        "TEST-EVIDENCE-005",

      name:
        "Career Supportive - Match",

      preference:
        "careerSupportive",

      expectedStatus:
        "MATCH",

      candidate: {

        name:
          "Candidate Career Supportive",

        about:
          "मी माझ्या जोडीदाराच्या करिअरला पाठिंबा देतो.",

        educationRaw:
          "MBA",

        professionRaw:
          "IT Professional"

      }

    },


    // ========================================================
    // 6. DREAM SUPPORTIVE - MATCH
    // ========================================================

    {
      id:
        "TEST-EVIDENCE-006",

      name:
        "Dream Supportive - Match",

      preference:
        "dreamSupportive",

      expectedStatus:
        "MATCH",

      candidate: {

        name:
          "Candidate Dream Supportive",

        aboutMe:
          "मी माझ्या जोडीदाराच्या स्वप्नांना साथ देतो.",

        educationRaw:
          "M.Tech",

        professionRaw:
          "Software Engineer"

      }

    }

  ];


  let passed =
    0;

  let failed =
    0;


  testCases.forEach(
    function (testCase) {

      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "TEST:",
        testCase.name
      );


      let actualStatus =
        "ERROR";

      let result =
        null;

      let error =
        null;


      try {

        const candidateProfile = {

          name:
            testCase.candidate.name,

          about:
            testCase.candidate.about || "",

          aboutMe:
            testCase.candidate.aboutMe || "",

          selfDescription:
            testCase.candidate.selfDescription || "",

          personality:
            testCase.candidate.personality || "",

          educationRaw:
            testCase.candidate.educationRaw || "",

          professionRaw:
            testCase.candidate.professionRaw || ""

        };


        result =
          evaluateSoftPreference(
            testCase.preference,
            candidateProfile
          );


        actualStatus =
          result &&
            result.status
            ? result.status
            : "UNKNOWN";

      }

      catch (errorObject) {

        error =
          errorObject &&
            errorObject.message
            ? errorObject.message
            : String(errorObject);

      }


      const testPassed =
        error === null &&
        actualStatus ===
        testCase.expectedStatus;


      if (testPassed) {

        passed++;

      }
      else {

        failed++;

      }


      console.log(
        JSON.stringify(
          {

            id:
              testCase.id,

            name:
              testCase.name,

            preference:
              testCase.preference,

            expectedStatus:
              testCase.expectedStatus,

            actualStatus:
              actualStatus,

            passed:
              testPassed,

            result:
              result,

            error:
              error

          },
          null,
          2
        )
      );

    }
  );


  console.log(
    "=================================================="
  );

  console.log(
    "PROFILE EVIDENCE TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {

        totalTests:
          testCases.length,

        passed:
          passed,

        failed:
          failed,

        allPassed:
          failed === 0

      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );

}


function testSoftPreferenceConflictDetection() {

  console.log(
    "=================================================="
  );

  console.log(
    "SOFT PREFERENCE CONFLICT TEST"
  );

  console.log(
    "=================================================="
  );


  const testCases = [

    // ========================================================
    // 1. UNDERSTANDING - CONFLICT
    // ========================================================

    {
      id:
        "TEST-CONFLICT-001",

      name:
        "Understanding - Conflict",

      preference:
        "understanding",

      expectedStatus:
        "CONFLICT",

      candidate: {

        aboutMe:
          "मी इतरांच्या भावना समजून घेत नाही आणि समजूतदारपणा माझ्या स्वभावात नाही."

      }

    },


    // ========================================================
    // 2. LOVING - CONFLICT
    // ========================================================

    {
      id:
        "TEST-CONFLICT-002",

      name:
        "Loving - Conflict",

      preference:
        "loving",

      expectedStatus:
        "CONFLICT",

      candidate: {

        aboutMe:
          "मी फार प्रेमळ किंवा काळजी घेणारा स्वभावाचा नाही."

      }

    },


    // ========================================================
    // 3. RESPECTFUL - CONFLICT
    // ========================================================

    {
      id:
        "TEST-CONFLICT-003",

      name:
        "Respectful - Conflict",

      preference:
        "respectful",

      expectedStatus:
        "CONFLICT",

      candidate: {

        selfDescription:
          "मी इतरांच्या मतांचा आदर करत नाही."

      }

    },


    // ========================================================
    // 4. CAREER SUPPORTIVE - CONFLICT
    // ========================================================

    {
      id:
        "TEST-CONFLICT-004",

      name:
        "Career Supportive - Conflict",

      preference:
        "careerSupportive",

      expectedStatus:
        "CONFLICT",

      candidate: {

        about:
          "मी माझ्या जोडीदाराच्या करिअरला पाठिंबा देत नाही."

      }

    },


    // ========================================================
    // 5. DREAM SUPPORTIVE - CONFLICT
    // ========================================================

    {
      id:
        "TEST-CONFLICT-005",

      name:
        "Dream Supportive - Conflict",

      preference:
        "dreamSupportive",

      expectedStatus:
        "CONFLICT",

      candidate: {

        aboutMe:
          "मी माझ्या जोडीदाराच्या स्वप्नांना साथ देत नाही."

      }

    },


    // ========================================================
    // 6. NO EVIDENCE - UNKNOWN
    // ========================================================

    {
      id:
        "TEST-CONFLICT-006",

      name:
        "No Evidence - Unknown",

      preference:
        "respectful",

      expectedStatus:
        "UNKNOWN",

      candidate: {

        aboutMe:
          "",

        selfDescription:
          "",

        about:
          ""

      }

    }

  ];


  let passed =
    0;

  let failed =
    0;


  testCases.forEach(
    function (testCase) {

      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "TEST:",
        testCase.name
      );


      let actualStatus =
        "ERROR";

      let result =
        null;

      let error =
        null;


      try {

        const candidateProfile = {

          about:
            testCase.candidate.about || "",

          aboutMe:
            testCase.candidate.aboutMe || "",

          selfDescription:
            testCase.candidate.selfDescription || "",

          personality:
            testCase.candidate.personality || "",

          educationRaw:
            testCase.candidate.educationRaw || "",

          professionRaw:
            testCase.candidate.professionRaw || ""

        };


        result =
          evaluateSoftPreference(
            testCase.preference,
            candidateProfile
          );


        actualStatus =
          result &&
            result.status
            ? result.status
            : "UNKNOWN";

      }

      catch (errorObject) {

        error =
          errorObject &&
            errorObject.message
            ? errorObject.message
            : String(errorObject);

      }


      const testPassed =
        error === null &&
        actualStatus ===
        testCase.expectedStatus;


      if (testPassed) {

        passed++;

      }
      else {

        failed++;

      }


      console.log(
        JSON.stringify(
          {

            id:
              testCase.id,

            name:
              testCase.name,

            preference:
              testCase.preference,

            expectedStatus:
              testCase.expectedStatus,

            actualStatus:
              actualStatus,

            passed:
              testPassed,

            result:
              result,

            error:
              error

          },
          null,
          2
        )
      );

    }
  );


  console.log(
    "=================================================="
  );

  console.log(
    "CONFLICT TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {

        totalTests:
          testCases.length,

        passed:
          passed,

        failed:
          failed,

        allPassed:
          failed === 0

      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );

}


function testSoftPreferenceScoring() {

  console.log(
    "=================================================="
  );

  console.log(
    "SOFT PREFERENCE SCORING TEST"
  );

  console.log(
    "=================================================="
  );


  const testCases = [

    // ========================================================
    // 1. ALL 7 MATCH
    // ========================================================

    {
      id:
        "TEST-SCORE-001",

      name:
        "All Preferences Match",

      expectationCriteria: {

        softPreferences: {

          educated: true,
          understanding: true,
          cultured: true,
          loving: true,
          respectful: true,
          dreamSupportive: true,
          careerSupportive: true

        }

      },

      candidate: {

        education: {
          enabled: true
        },

        aboutMe:
          "मी समजूतदार आणि संस्कारी स्वभावाचा आहे.",

        selfDescription:
          "मी प्रेमळ आणि इतरांचा आदर करणारा आहे.",

        about:
          "मी माझ्या जोडीदाराच्या स्वप्नांना साथ देतो आणि तिच्या करिअरला पाठिंबा देतो."

      },

      expected: {

        score:
          70,

        maxScore:
          70,

        softMatchPercentage:
          100,

        softDataCoverage:
          100,

        verifiedCompatibility:
          100

      }

    },


    // ========================================================
    // 2. ONE MATCH + SIX UNKNOWN
    // ========================================================

    {
      id:
        "TEST-SCORE-002",

      name:
        "One Match - Six Unknown",

      expectationCriteria: {

        softPreferences: {

          educated: true,
          understanding: true,
          cultured: true,
          loving: true,
          respectful: true,
          dreamSupportive: true,
          careerSupportive: true

        }

      },

      candidate: {

        education: {
          enabled: true
        },

        aboutMe:
          "",

        selfDescription:
          "",

        about:
          ""

      },

      expected: {

        score:
          10,

        maxScore:
          70,

        softMatchPercentage:
          14.29,

        softDataCoverage:
          14.29,

        verifiedCompatibility:
          100

      }

    },


    // ========================================================
    // 3. NO EVIDENCE
    // ========================================================

    {
      id:
        "TEST-SCORE-003",

      name:
        "No Evidence",

      expectationCriteria: {

        softPreferences: {

          understanding: true,
          loving: true,
          respectful: true

        }

      },

      candidate: {

        education: {
          enabled: false
        },

        aboutMe:
          "",

        selfDescription:
          "",

        about:
          ""

      },

      expected: {

        score:
          0,

        maxScore:
          30,

        softMatchPercentage:
          0,

        softDataCoverage:
          0,

        verifiedCompatibility:
          0

      }

    },


    // ========================================================
    // 4. MATCH + CONFLICT + UNKNOWN
    // ========================================================

    {
      id:
        "TEST-SCORE-004",

      name:
        "Match Conflict Unknown",

      expectationCriteria: {

        softPreferences: {

          understanding: true,
          loving: true,
          respectful: true

        }

      },

      candidate: {

        education: {
          enabled: false
        },

        aboutMe:
          "मी समजूतदार स्वभावाचा आहे.",

        selfDescription:
          "मी प्रेमळ नाही.",

        about:
          ""

      },

      expected: {

        score:
          10,

        maxScore:
          30,

        softMatchPercentage:
          33.33,

        softDataCoverage:
          66.67,

        verifiedCompatibility:
          50

      }

    },


    // ========================================================
    // 5. EDUCATION + SOFT MATCH
    // ========================================================

    {
      id:
        "TEST-SCORE-005",

      name:
        "Education Plus Soft Match",

      expectationCriteria: {

        softPreferences: {

          educated: true,
          understanding: true

        }

      },

      candidate: {

        education: {
          enabled: true
        },

        aboutMe:
          "मी समजूतदार स्वभावाचा आहे."

      },

      expected: {

        score:
          20,

        maxScore:
          20,

        softMatchPercentage:
          100,

        softDataCoverage:
          100,

        verifiedCompatibility:
          100

      }

    }

  ];


  let passed =
    0;

  let failed =
    0;


  // ==========================================================
  // RUN TESTS
  // ==========================================================

  testCases.forEach(
    function (testCase) {

      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "TEST:",
        testCase.name
      );


      let result =
        null;

      let error =
        null;


      try {

        result =
          calculateSoftPreferenceScoreV2(
            testCase.candidate,
            testCase.expectationCriteria
          );

      }

      catch (errorObject) {

        error =
          errorObject &&
            errorObject.message
            ? errorObject.message
            : String(errorObject);

      }


      const actual = {

        score:
          result
            ? result.score
            : null,

        maxScore:
          result
            ? result.maxScore
            : null,

        softMatchPercentage:
          result
            ? result.softMatchPercentage
            : null,

        softDataCoverage:
          result
            ? result.softDataCoverage
            : null,

        verifiedCompatibility:
          result &&
            result.verifiedCompatibility !== undefined
            ? result.verifiedCompatibility
            : null

      };


      const expected =
        testCase.expected;


      const testPassed =
        error === null &&

        actual.score ===
        expected.score &&

        actual.maxScore ===
        expected.maxScore &&

        actual.softMatchPercentage ===
        expected.softMatchPercentage &&

        actual.softDataCoverage ===
        expected.softDataCoverage &&

        actual.verifiedCompatibility ===
        expected.verifiedCompatibility;


      if (testPassed) {

        passed++;

      }
      else {

        failed++;

      }


      console.log(
        JSON.stringify(
          {

            id:
              testCase.id,

            name:
              testCase.name,

            expected:
              expected,

            actual:
              actual,

            passed:
              testPassed,

            error:
              error

          },
          null,
          2
        )
      );

    }
  );


  // ==========================================================
  // SUMMARY
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "SOFT SCORING TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {

        totalTests:
          testCases.length,

        passed:
          passed,

        failed:
          failed,

        allPassed:
          failed === 0

      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );

}


function testFinalMatchingAndRanking() {

  console.log(
    "=================================================="
  );

  console.log(
    "FINAL MATCHING + RANKING TEST"
  );

  console.log(
    "=================================================="
  );


  // ==========================================================
  // EXPECTATION
  // ==========================================================

  const expectation = {

    educationCategories: [
      "Engineering & Technology"
    ],

    educationRequired:
      true,

    professionCategories: [
      "Engineering & Technology",
      "Government / Public Sector"
    ],

    employmentTypes: [
      "GOVERNMENT"
    ],

    age: {

      enabled:
        true,

      min:
        25,

      max:
        30

    },

    height: {

      enabled:
        true,

      minInches:
        63,

      maxInches:
        null

    },

    income: {

      enabled:
        true,

      min:
        50000,

      max:
        9007199254740991

    },

    districts: [
      "पुणे"
    ],

    caste: {

      enabled:
        false,

      values:
        []

    },

    rashi: {

      enabled:
        false,

      values:
        []

    },

    softPreferences: {

      educated:
        true,

      understanding:
        true,

      cultured:
        true,

      loving:
        true,

      respectful:
        true,

      dreamSupportive:
        true,

      careerSupportive:
        true

    }

  };


  // ==========================================================
  // TEST CANDIDATES
  // ==========================================================

  const testCandidates = [

    // ========================================================
    // 1. PERFECT MATCH
    // ========================================================

    {

      id:
        "TEST-RANK-001",

      name:
        "Perfect Match",


      ageRaw:
        "27 years",

      heightRaw:
        "5 फूट 5 इंच",

      incomeRaw:
        "₹65000",

      district:
        "पुणे",


      education: {

        hasEducationData:
          true,

        raw:
          "BE Computer Engineering",

        categories: [
          "Engineering & Technology"
        ],

        matchedKeywords: [
          "BE"
        ]

      },


      profession: {

        hasProfessionData:
          true,

        raw:
          "Government Software Engineer",

        categories: [
          "Engineering & Technology",
          "Government / Public Sector"
        ],

        matchedKeywords: [
          "Software Engineer"
        ],

        employmentType:
          "GOVERNMENT"

      },


      casteRaw:
        "",

      rashiRaw:
        "",


      aboutMe:
        "मी समजूतदार आणि संस्कारी स्वभावाचा आहे.",

      selfDescription:
        "मी प्रेमळ आणि इतरांचा आदर करणारा आहे.",

      about:
        "मी माझ्या जोडीदाराच्या स्वप्नांना साथ देतो आणि तिच्या करिअरला पाठिंबा देतो."

    },


    // ========================================================
    // 2. HARD MATCH + PARTIAL SOFT
    // ========================================================

    {

      id:
        "TEST-RANK-002",

      name:
        "Partial Soft Match",


      ageRaw:
        "28 years",

      heightRaw:
        "5 फूट 4 इंच",

      incomeRaw:
        "₹60000",

      district:
        "पुणे",


      education: {

        hasEducationData:
          true,

        raw:
          "BE Computer Engineering",

        categories: [
          "Engineering & Technology"
        ],

        matchedKeywords: [
          "BE"
        ]

      },


      profession: {

        hasProfessionData:
          true,

        raw:
          "Government Software Engineer",

        categories: [
          "Engineering & Technology",
          "Government / Public Sector"
        ],

        matchedKeywords: [
          "Software Engineer"
        ],

        employmentType:
          "GOVERNMENT"

      },


      casteRaw:
        "",

      rashiRaw:
        "",


      aboutMe:
        "मी समजूतदार स्वभावाचा आहे.",

      selfDescription:
        "मी प्रेमळ आहे.",

      about:
        ""

    },


    // ========================================================
    // 3. HARD MATCH + UNKNOWN SOFT
    // ========================================================

    {

      id:
        "TEST-RANK-003",

      name:
        "Unknown Soft Evidence",

      ageRaw:
        "26 years",

      heightRaw:
        "5 फूट 6 इंच",

      incomeRaw:
        "₹70000",

      district:
        "पुणे",


      education: {

        hasEducationData:
          true,

        raw:
          "BE Computer Engineering",

        categories: [
          "Engineering & Technology"
        ],

        matchedKeywords: [
          "BE"
        ]

      },


      profession: {

        hasProfessionData:
          true,

        raw:
          "Government Software Engineer",

        categories: [
          "Engineering & Technology",
          "Government / Public Sector"
        ],

        matchedKeywords: [
          "Software Engineer"
        ],

        employmentType:
          "GOVERNMENT"

      },


      casteRaw:
        "",

      rashiRaw:
        "",


      aboutMe:
        "",

      selfDescription:
        "",

      about:
        ""

    },


    // ========================================================
    // 4. HARD MATCH + SOFT CONFLICT
    // ========================================================

    {

      id:
        "TEST-RANK-004",

      name:
        "Soft Conflict",


      ageRaw:
        "29 years",

      heightRaw:
        "5 फूट 5 इंच",

      incomeRaw:
        "₹55000",

      district:
        "पुणे",


      education: {

        hasEducationData:
          true,

        raw:
          "BE Computer Engineering",

        categories: [
          "Engineering & Technology"
        ],

        matchedKeywords: [
          "BE"
        ]

      },


      profession: {

        hasProfessionData:
          true,

        raw:
          "Government Software Engineer",

        categories: [
          "Engineering & Technology",
          "Government / Public Sector"
        ],

        matchedKeywords: [
          "Software Engineer"
        ],

        employmentType:
          "GOVERNMENT"

      },


      casteRaw:
        "",

      rashiRaw:
        "",


      aboutMe:
        "मी समजूतदार आहे.",

      selfDescription:
        "मी प्रेमळ नाही आणि इतरांचा आदर करत नाही.",

      about:
        "मी माझ्या जोडीदाराच्या करिअरला पाठिंबा देत नाही."

    },


    // ========================================================
    // 5. HARD REJECT
    // ========================================================

    {

      id:
        "TEST-RANK-005",

      name:
        "Hard Reject",


      ageRaw:
        "35 years",

      heightRaw:
        "5 फूट",

      incomeRaw:
        "₹30000",

      district:
        "मुंबई",


      education: {

        hasEducationData:
          true,

        raw:
          "MBBS",

        categories: [
          "Medical & Healthcare"
        ],

        matchedKeywords: [
          "MBBS"
        ]

      },


      profession: {

        hasProfessionData:
          true,

        raw:
          "Private Doctor",

        categories: [
          "Medical & Healthcare"
        ],

        matchedKeywords: [
          "Doctor"
        ],

        employmentType:
          "PRIVATE"

      },


      casteRaw:
        "",

      rashiRaw:
        "",


      aboutMe:
        "मी समजूतदार आणि प्रेमळ आहे.",

      selfDescription:
        "",

      about:
        ""

    }

  ];


  // ==========================================================
  // EVALUATE
  // ==========================================================

  const results = [];


  testCandidates.forEach(
    function (candidate) {

      console.log(
        "--------------------------------------------------"
      );

      console.log(
        "CANDIDATE:",
        candidate.name
      );


      let matchingResult =
        null;

      let error =
        null;


      try {

        matchingResult =
          evaluateCandidateMatch(
            candidate,
            expectation
          );

      }
      catch (errorObject) {

        error =
          errorObject &&
            errorObject.message
            ? errorObject.message
            : String(errorObject);

      }


      const hardMatch =
        matchingResult &&
        matchingResult.hardMatch === true;


      const softPreferenceScore =
        matchingResult &&
          matchingResult.softPreferenceScore
          ? matchingResult.softPreferenceScore
          : null;


      const softScore =
        matchingResult
          ? Number(
            matchingResult.softScore || 0
          )
          : 0;


      const maxSoftScore =
        matchingResult
          ? Number(
            matchingResult.maxSoftScore || 0
          )
          : 0;


      const softMatchPercentage =
        matchingResult
          ? Number(
            matchingResult.softMatchPercentage || 0
          )
          : 0;


      const softDataCoverage =
        matchingResult
          ? Number(
            matchingResult.softDataCoverage || 0
          )
          : 0;


      // --------------------------------------------------------
      // PROFILE COMPLETENESS
      //
      // Used only as a fallback when soft evidence is unavailable.
      // --------------------------------------------------------

      if (
        a.profileCompleteness !==
        b.profileCompleteness
      ) {

        return (
          b.profileCompleteness -
          a.profileCompleteness
        );

      }


      const verifiedCompatibility =
        softPreferenceScore &&
          softPreferenceScore
            .verifiedCompatibility !== undefined

          ? Number(
            softPreferenceScore
              .verifiedCompatibility
          )

          : null;


      const failedCriteria =
        matchingResult &&
          Array.isArray(
            matchingResult.failedCriteria
          )
          ? matchingResult.failedCriteria
          : [];


      const item = {

        id:
          candidate.id,

        name:
          candidate.name,

        hardMatch:
          hardMatch,

        softScore:
          softScore,

        maxSoftScore:
          maxSoftScore,

        softMatchPercentage:
          softMatchPercentage,

        softDataCoverage:
          softDataCoverage,

        verifiedCompatibility:
          verifiedCompatibility,

        failedCriteria:
          failedCriteria,

        error:
          error

      };


      results.push(
        item
      );


      console.log(
        JSON.stringify(
          item,
          null,
          2
        )
      );

    }
  );


  // ==========================================================
  // RANKING
  // ==========================================================

  const ranking =
    results
      .slice()
      .sort(
        function (a, b) {

          // ----------------------------------------------------
          // HARD MATCH FIRST
          // ----------------------------------------------------

          if (
            a.hardMatch !==
            b.hardMatch
          ) {

            return a.hardMatch
              ? -1
              : 1;

          }


          // ----------------------------------------------------
          // SOFT SCORE
          // ----------------------------------------------------

          if (
            a.softScore !==
            b.softScore
          ) {

            return (
              b.softScore -
              a.softScore
            );

          }


          // ----------------------------------------------------
          // SOFT MATCH PERCENTAGE
          // ----------------------------------------------------

          if (
            a.softMatchPercentage !==
            b.softMatchPercentage
          ) {

            return (
              b.softMatchPercentage -
              a.softMatchPercentage
            );

          }


          // ----------------------------------------------------
          // DATA COVERAGE
          // ----------------------------------------------------

          if (
            a.softDataCoverage !==
            b.softDataCoverage
          ) {

            return (
              b.softDataCoverage -
              a.softDataCoverage
            );

          }


          return 0;

        }
      );


  // ==========================================================
  // ASSIGN RANK
  // ==========================================================

  ranking.forEach(
    function (candidate, index) {

      candidate.rank =
        index + 1;

    }
  );


  // ==========================================================
  // PRINT RANKING
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "FINAL RANKING"
  );

  console.log(
    JSON.stringify(
      ranking,
      null,
      2
    )
  );


  // ==========================================================
  // VALIDATION
  // ==========================================================

  let passed =
    0;

  let failed =
    0;


  // ==========================================================
  // TEST 1
  // Perfect Match must be Hard Match
  // ==========================================================

  const perfect =
    ranking.find(
      function (item) {

        return item.id ===
          "TEST-RANK-001";

      }
    );


  const test1Passed =
    !!perfect &&
    perfect.hardMatch === true;


  if (
    test1Passed
  ) {

    passed++;

  }
  else {

    failed++;

  }


  console.log(
    "TEST 1 - Perfect Match:",
    test1Passed
  );


  // ==========================================================
  // TEST 2
  // Hard Reject must be rejected
  // ==========================================================

  const hardReject =
    ranking.find(
      function (item) {

        return item.id ===
          "TEST-RANK-005";

      }
    );


  const test2Passed =
    !!hardReject &&
    hardReject.hardMatch === false;


  if (
    test2Passed
  ) {

    passed++;

  }
  else {

    failed++;

  }


  console.log(
    "TEST 2 - Hard Reject:",
    test2Passed
  );


  // ==========================================================
  // TEST 3
  // Partial Soft > Unknown Soft
  // ==========================================================

  const partial =
    ranking.find(
      function (item) {

        return item.id ===
          "TEST-RANK-002";

      }
    );


  const unknown =
    ranking.find(
      function (item) {

        return item.id ===
          "TEST-RANK-003";

      }
    );


  const test3Passed =
    !!partial &&
    !!unknown &&
    partial.hardMatch === true &&
    unknown.hardMatch === true &&
    partial.softScore >
    unknown.softScore;


  if (
    test3Passed
  ) {

    passed++;

  }
  else {

    failed++;

  }


  console.log(
    "TEST 3 - Partial Soft > Unknown:",
    test3Passed
  );


  // ==========================================================
  // TEST 4
  // Conflict should not gain positive points
  // ==========================================================

  const conflict =
    ranking.find(
      function (item) {

        return item.id ===
          "TEST-RANK-004";

      }
    );


  const test4Passed =
    !!conflict &&
    conflict.hardMatch === true &&
    conflict.softScore >= 0;


  if (
    test4Passed
  ) {

    passed++;

  }
  else {

    failed++;

  }


  console.log(
    "TEST 4 - Conflict Handling:",
    test4Passed
  );


  // ==========================================================
  // TEST 5
  // All candidates must appear
  // ==========================================================

  const test5Passed =
    ranking.length ===
    testCandidates.length;


  if (
    test5Passed
  ) {

    passed++;

  }
  else {

    failed++;

  }


  console.log(
    "TEST 5 - Candidate Count:",
    test5Passed
  );


  // ==========================================================
  // SUMMARY
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "FINAL MATCHING + RANKING TEST SUMMARY"
  );

  console.log(
    JSON.stringify(
      {

        totalTests:
          5,

        passed:
          passed,

        failed:
          failed,

        allPassed:
          failed === 0

      },
      null,
      2
    )
  );

  console.log(
    "=================================================="
  );


  return {

    success:
      failed === 0,

    totalTests:
      5,

    passed:
      passed,

    failed:
      failed,

    ranking:
      ranking

  };

}





function testActualBrideRanking(
  expectationCriteria,
  brideProfiles
) {

  console.log(
    "=================================================="
  );

  console.log(
    "ACTUAL BRIDE PROFILE RANKING TEST"
  );

  console.log(
    "=================================================="
  );


  if (
    !expectationCriteria
  ) {

    throw new Error(
      "Expectation criteria is required."
    );

  }


  if (
    !Array.isArray(brideProfiles)
  ) {

    throw new Error(
      "brideProfiles must be an array."
    );

  }


  console.log(
    "TOTAL BRIDE PROFILES:",
    brideProfiles.length
  );


  const results = [];

  let hardMatched = 0;
  let rejected = 0;


  // ==========================================================
  // EVALUATE ALL CANDIDATES
  // ==========================================================

  brideProfiles.forEach(
    function (candidate) {

      try {

        const result =
          evaluateCandidateMatch(
            candidate,
            expectationCriteria
          );


        const hardMatch =
          result &&
          result.hardMatch === true;


        if (hardMatch) {

          hardMatched++;

        }
        else {

          rejected++;

        }


        const softScore =
          Number(
            result &&
            result.softScore || 0
          );


        const maxSoftScore =
          Number(
            result &&
            result.maxSoftScore || 0
          );


        const softMatchPercentage =
          Number(
            result &&
            result.softMatchPercentage || 0
          );


        const softDataCoverage =
          Number(
            result &&
            result.softDataCoverage || 0
          );


        const soft =
          result &&
            result.softPreferenceScore
            ? result.softPreferenceScore
            : {};


        results.push({

          id:
            candidate.id || "",

          name:
            candidate.name || "",

          hardMatch:
            hardMatch,

          softScore:
            softScore,

          maxSoftScore:
            maxSoftScore,

          softMatchPercentage:
            softMatchPercentage,

          softDataCoverage:
            softDataCoverage,

          matchedPreferences:
            Number(
              soft.matchedPreferences || 0
            ),

          knownPreferences:
            Number(
              soft.knownPreferences || 0
            ),

          unknownPreferences:
            Number(
              soft.unknownPreferences || 0
            ),

          conflictPreferences:
            Number(
              soft.conflictPreferences || 0
            ),

          failedCriteria:
            Array.isArray(
              result &&
              result.failedCriteria
            )
              ? result.failedCriteria
              : []

        });

      }
      catch (error) {

        console.log(
          "ERROR:",
          candidate.id,
          error.message
        );

        rejected++;

      }

    }
  );


  // ==========================================================
  // RANKING
  // ==========================================================

  results.sort(
    function (a, b) {

      // 1. HARD MATCH FIRST

      if (
        a.hardMatch !==
        b.hardMatch
      ) {

        return a.hardMatch
          ? -1
          : 1;

      }


      // 2. SOFT SCORE

      if (
        a.softScore !==
        b.softScore
      ) {

        return (
          b.softScore -
          a.softScore
        );

      }


      // 3. SOFT MATCH %

      if (
        a.softMatchPercentage !==
        b.softMatchPercentage
      ) {

        return (
          b.softMatchPercentage -
          a.softMatchPercentage
        );

      }


      // 4. DATA COVERAGE

      if (
        a.softDataCoverage !==
        b.softDataCoverage
      ) {

        return (
          b.softDataCoverage -
          a.softDataCoverage
        );

      }


      return 0;

    }
  );


  // ==========================================================
  // ASSIGN RANK
  // ==========================================================

  results.forEach(
    function (candidate, index) {

      candidate.rank =
        index + 1;

    }
  );


  // ==========================================================
  // HARD MATCHES ONLY
  // ==========================================================

  const hardMatches =
    results.filter(
      function (candidate) {

        return candidate.hardMatch === true;

      }
    );


  // ==========================================================
  // TOP 20
  // ==========================================================

  const top20 =
    hardMatches.slice(
      0,
      20
    );


  // ==========================================================
  // TOP 10
  // ==========================================================

  const top10 =
    hardMatches.slice(
      0,
      10
    );


  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary = {

    totalProfiles:
      brideProfiles.length,

    hardMatched:
      hardMatched,

    rejected:
      rejected,

    hardMatchPercentage:
      brideProfiles.length > 0
        ? Number(
          (
            hardMatched /
            brideProfiles.length *
            100
          ).toFixed(2)
        )
        : 0,

    rejectionPercentage:
      brideProfiles.length > 0
        ? Number(
          (
            rejected /
            brideProfiles.length *
            100
          ).toFixed(2)
        )
        : 0,

    rankedCandidates:
      hardMatches.length

  };


  // ==========================================================
  // LOG SUMMARY
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "ACTUAL BRIDE RANKING SUMMARY"
  );

  console.log(
    JSON.stringify(
      summary,
      null,
      2
    )
  );


  // ==========================================================
  // TOP 20
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "TOP 20 BRIDE MATCHES"
  );

  console.log(
    JSON.stringify(
      top20,
      null,
      2
    )
  );


  // ==========================================================
  // TOP 10
  // ==========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "TOP 10 BRIDE MATCHES"
  );

  console.log(
    JSON.stringify(
      top10,
      null,
      2
    )
  );


  return {

    summary:
      summary,

    top10:
      top10,

    top20:
      top20,

    ranking:
      results

  };

}



function runActualBrideRankingTest() {

  // ==========================================================
  // IMPORTANT:
  // Replace these two lines with your existing variables /
  // functions that generate the actual expectation and
  // 241 bride profiles.
  // ==========================================================

  const expectationCriteria =
    getExpectationCriteriaForTest();

  const brideProfiles =
    getActualBrideProfilesForTest();


  // ==========================================================
  // RUN RANKING
  // ==========================================================

  return testActualBrideRanking(
    expectationCriteria,
    brideProfiles
  );

}




function calculateProfileCompleteness(
  candidateProfile
) {

  candidateProfile =
    candidateProfile || {};


  // ==========================================================
  // OBJECTIVE PROFILE FIELDS
  //
  // These are actual profile fields available in the Sheet.
  // We DO NOT use expectation as personality evidence.
  // ==========================================================

  const fields = [

    {
      key: "ageRaw",
      weight: 1
    },

    {
      key: "heightRaw",
      weight: 1
    },

    {
      key: "incomeRaw",
      weight: 1
    },

    {
      key: "district",
      weight: 1
    },

    {
      key: "education",
      weight: 1
    },

    {
      key: "profession",
      weight: 1
    },

    {
      key: "casteRaw",
      weight: 1
    },

    {
      key: "rashiRaw",
      weight: 1
    }

  ];


  let availableWeight = 0;

  let totalWeight = 0;

  const availableFields = [];

  const missingFields = [];


  // ==========================================================
  // CHECK EACH FIELD
  // ==========================================================

  fields.forEach(
    function (field) {

      const key =
        field.key;

      const weight =
        Number(
          field.weight || 1
        );


      totalWeight +=
        weight;


      let hasValue =
        false;


      const value =
        candidateProfile[key];


      // --------------------------------------------------------
      // Normal object
      // --------------------------------------------------------

      if (
        value &&
        typeof value === "object"
      ) {

        // Education / Profession normalized object
        if (
          value.enabled === true
        ) {

          hasValue =
            true;

        }

        else if (
          value.hasEducationData === true
        ) {

          hasValue =
            true;

        }

        else if (
          value.hasProfessionData === true
        ) {

          hasValue =
            true;

        }

        else if (
          value.raw &&
          String(
            value.raw
          ).trim()
        ) {

          hasValue =
            true;

        }

        else if (
          value.normalized &&
          String(
            value.normalized
          ).trim()
        ) {

          hasValue =
            true;

        }

      }


      // --------------------------------------------------------
      // Primitive value
      // --------------------------------------------------------

      else if (
        value !== undefined &&
        value !== null &&
        String(
          value
        ).trim()
      ) {

        hasValue =
          true;

      }


      // --------------------------------------------------------
      // RESULT
      // --------------------------------------------------------

      if (
        hasValue
      ) {

        availableWeight +=
          weight;

        availableFields.push(
          key
        );

      }
      else {

        missingFields.push(
          key
        );

      }

    }
  );


  const percentage =
    totalWeight > 0
      ? (
        availableWeight /
        totalWeight *
        100
      )
      : 0;


  return {

    score:
      availableWeight,

    maxScore:
      totalWeight,

    percentage:
      Number(
        percentage.toFixed(2)
      ),

    availableFields:
      availableFields,

    missingFields:
      missingFields

  };

}


// ==========================================================
// WHAT THIS FUNCTION DOES
// ==========================================================
//
// 1. Load VIEWER
// 2. Read VIEWER expectation
// 3. Convert expectation into HARD criteria
// 4. Get VIEWER actual profile criteria
// 5. Load opposite-gender candidates
// 6. Normalize each candidate
// 7. Calculate HARD MATCH
// 8. Calculate EXPECTATION compatibility
// 9. Calculate ACTUAL PROFILE compatibility
// 10. Calculate final weighted score
// 11. Sort candidates
// 12. Return TOP 10
// ==========================================================

function testActualBrideRankingV2() {

  console.log(
    "=============================================="
  );

  console.log(
    "🧪 ACTUAL BRIDE RANKING V2 — PHASE 2"
  );

  console.log(
    "=============================================="
  );


  // ==========================================================
  // CONFIG
  // ==========================================================

  // const viewerId = "ID003";
  // const viewerType = "bride";

  const viewerId = "ID001";
  const viewerType = "groom";

  const DEBUG_PROFILE_ID = null;


  // ==========================================================
  // LOAD VIEWER
  // ==========================================================

  const viewer =
    getMatchingViewerProfile(
      viewerId,
      viewerType
    );


  if (
    !viewer ||
    viewer.success !== true ||
    !viewer.profile
  ) {

    throw new Error(
      "Unable to load viewer profile."
    );

  }


  const viewerProfile =
    viewer.profile;


  // ==========================================================
  // VIEWER EXPECTATION
  // ==========================================================

  const viewerExpectation =
    String(
      viewer.expectation ||
      viewer.expectationRaw ||
      viewerProfile.expectationRaw ||
      ""
    ).trim();


  if (!viewerExpectation) {

    throw new Error(
      "Viewer expectation is required."
    );

  }


  // ==========================================================
  // VIEWER EXPECTATION CRITERIA
  // ==========================================================

  const expectationCriteria =
    parseExpectationCriteria(
      viewerExpectation
    );


  if (
    !expectationCriteria ||
    typeof expectationCriteria !== "object"
  ) {

    throw new Error(
      "Unable to parse expectation criteria."
    );

  }


  // ==========================================================
  // VIEWER ACTUAL PROFILE CRITERIA
  // ==========================================================

  let actualProfileCriteria = null;


  if (
    viewerProfile.actualProfileCriteria &&
    typeof viewerProfile.actualProfileCriteria === "object"
  ) {

    actualProfileCriteria =
      viewerProfile.actualProfileCriteria;

  }


  // ----------------------------------------------------------
  // FALLBACK
  // ----------------------------------------------------------

  if (!actualProfileCriteria) {

    actualProfileCriteria = {

      district:
        viewerProfile.district &&
        typeof viewerProfile.district === "object"
          ? viewerProfile.district.raw || ""
          : viewerProfile.district || "",


      education:
        viewerProfile.education &&
        typeof viewerProfile.education === "object"
          ? viewerProfile.education.raw || ""
          : viewerProfile.education || "",


      profession:
        viewerProfile.profession &&
        typeof viewerProfile.profession === "object"
          ? viewerProfile.profession.raw || ""
          : viewerProfile.profession || "",


      employmentType:
        viewerProfile.employmentType ||
        (
          viewerProfile.profession &&
          viewerProfile.profession.employmentType
        ) ||
        "NOT_SPECIFIED",


      caste:
        viewerProfile.caste &&
        typeof viewerProfile.caste === "object"
          ? viewerProfile.caste.raw || ""
          : viewerProfile.caste || "",


      rashi:
        viewerProfile.rashi &&
        typeof viewerProfile.rashi === "object"
          ? viewerProfile.rashi.raw || ""
          : viewerProfile.rashi || "",


      age:
        viewerProfile.age &&
        viewerProfile.age.decimalAge != null
          ? viewerProfile.age.decimalAge
          : null,


      height:
        viewerProfile.height &&
        viewerProfile.height.totalInches != null
          ? viewerProfile.height.totalInches
          : null,


      income:
        viewerProfile.income &&
        typeof viewerProfile.income === "object"

          ? (
              viewerProfile.income.min != null &&
              viewerProfile.income.max != null

                ? {
                    min:
                      viewerProfile.income.min,

                    max:
                      viewerProfile.income.max
                  }

                : viewerProfile.income.value != null

                  ? viewerProfile.income.value

                  : ""
            )

          : viewerProfile.income || ""

    };

  }


  // ==========================================================
  // LOAD CANDIDATES
  // ==========================================================

  const candidateType =
    getOppositeMatchingProfileType(
      viewerType
    );


  const candidateResult =
    getNormalizedMatchingCandidates(
      candidateType
    );


  if (
    !candidateResult ||
    candidateResult.success !== true
  ) {

    throw new Error(
      "Unable to load candidate profiles."
    );

  }


  const profiles =
    Array.isArray(
      candidateResult.profiles
    )
      ? candidateResult.profiles
      : [];


  if (
    profiles.length === 0
  ) {

    throw new Error(
      "No candidate profiles found."
    );

  }


  console.log(
    "🔵 TOTAL CANDIDATES:",
    profiles.length
  );


  // ==========================================================
  // RESULTS
  // ==========================================================

  const results = [];

  let diagnostic = {
    loaded: profiles.length,
    invalidProfile: 0,
    mutualHardFail: 0,
    profileGateFail: 0,
    accepted: 0
  };
  // ==========================================================
  // PROCESS EVERY CANDIDATE
  // ==========================================================

    console.log(
    "🔵 RAW CANDIDATES LOADED:",
      profiles.length
    );


  profiles.forEach(
    function(profile) {

      try {

        // ------------------------------------------------------
        // BASIC VALIDATION
        // ------------------------------------------------------

        if (
          !profile ||
          !profile.id ||
          !profile.name
        ) {

          return;

        }


        // ------------------------------------------------------
        // SKIP SAME PROFILE
        // ------------------------------------------------------

        if (
          String(profile.id).trim() ===
          String(viewerId).trim()
        ) {

          return;

        }


        // ------------------------------------------------------
        // NORMALIZE CANDIDATE
        // ------------------------------------------------------

        const normalizedResult =
          normalizeCandidateCriteria(
            profile
          );


        if (
          !normalizedResult ||
          normalizedResult.success !== true ||
          !normalizedResult.criteria
        ) {

          return;

        }


        const compatibilityCandidate =
          normalizedResult.criteria || {};


        // ----------------------------------------------------------
        // PRESERVE ORIGINAL ACTUAL PROFILE CRITERIA
        // ----------------------------------------------------------

          compatibilityCandidate.actualProfileCriteria =
          (
            profile &&
            profile.actualProfileCriteria
          )
            ? profile.actualProfileCriteria
            : {};

        if (
              String(profile.id).trim() === "ID801"
            ) {

              console.log(
                "🔎 ID801 NORMALIZED CRITERIA:",
                JSON.stringify(
                  compatibilityCandidate,
                  null,
                  2
                )
              );

              console.log(
                "🔎 ID801 ACTUAL PROFILE CRITERIA:",
                JSON.stringify(
                  compatibilityCandidate.actualProfileCriteria ||
                  {},
                  null,
                  2
                )
              );

            }


        // ------------------------------------------------------
        // PRESERVE CANDIDATE ACTUAL PROFILE CRITERIA
        // ------------------------------------------------------

        if (
          !compatibilityCandidate.actualProfileCriteria
        ) {

          compatibilityCandidate.actualProfileCriteria =
            profile.actualProfileCriteria ||
            {};

        }


        // ------------------------------------------------------
        // CANDIDATE EXPECTATION
        // ------------------------------------------------------

        const candidateExpectation =
          String(
            compatibilityCandidate.expectationRaw ||
            profile.expectationRaw ||
            profile.expectation ||
            ""
          ).trim();


        const hasExpectation =
          candidateExpectation.length > 0;


        // ------------------------------------------------------
        // MEANINGFUL EXPECTATION
        // ------------------------------------------------------

        let hasMeaningfulExpectation =
          false;


        if (
          typeof hasMeaningfulMatchingExpectation ===
          "function"
        ) {

          hasMeaningfulExpectation =
            hasMeaningfulMatchingExpectation(
              candidateExpectation
            ) === true;

        }
        else {

          hasMeaningfulExpectation =
            hasExpectation;

        }


        // ======================================================
        // PHASE 1 — VIEWER → CANDIDATE HARD
        // ======================================================

        let viewerToCandidateHard = {

          hardMatch:
            false,

          matchStatus:
            "NO_HARD_CRITERIA",

          applicableCriteria:
            0,

          matchedCriteria:
            0,

          failedCriteria:
            []

        };


        try {

          if (
            typeof evaluateCandidateMatch ===
            "function"
          ) {

            viewerToCandidateHard =
              evaluateCandidateMatch(
                profile,
                expectationCriteria
              ) ||
              viewerToCandidateHard;

          }

        }
        catch (error) {

          // Keep candidate processing alive.

        }


        // ======================================================
        // VIEWER → CANDIDATE EXPECTATION
        // ======================================================

        let viewerToCandidateExpectation = {

          applicable:
            false,

          score:
            0,

          maxScore:
            0,

          percentage:
            0,

          matchedKeywords:
            []

        };


        if (
          hasMeaningfulExpectation &&
          typeof calculateWeightedExpectationCompatibility ===
          "function"
        ) {

          try {

            viewerToCandidateExpectation =
              calculateWeightedExpectationCompatibility(
                viewerExpectation,
                candidateExpectation
              ) ||
              viewerToCandidateExpectation;

          }
          catch (error) {

            // Keep candidate processing alive.

          }

        }


        // ======================================================
        // VIEWER → CANDIDATE PROFILE
        // ======================================================

        let viewerToCandidateProfile = {

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

          matchedCriteria:
            [],

          failedCriteria:
            [],

          unknownCriteria:
            []

        };


        if (
          actualProfileCriteria &&
          typeof calculateActualProfileCompatibility ===
          "function"
        ) {

          try {

            viewerToCandidateProfile =
              calculateActualProfileCompatibility(
                actualProfileCriteria,
                compatibilityCandidate
              ) ||
              viewerToCandidateProfile;

          }
          catch (error) {

            // Keep candidate processing alive.

          }

        }


        // ======================================================
        // PHASE 2 — CANDIDATE ACTUAL PROFILE CRITERIA
        // ======================================================

        const candidateActualProfileCriteria =
          compatibilityCandidate.actualProfileCriteria &&
          typeof compatibilityCandidate.actualProfileCriteria ===
          "object"

            ? compatibilityCandidate.actualProfileCriteria

            : null;


        // ======================================================
        // PHASE 2 — CANDIDATE → VIEWER HARD
        // ======================================================

        let candidateToViewerHard = {

          hardMatch:
            false,

          matchStatus:
            "NO_HARD_CRITERIA",

          applicableCriteria:
            0,

          matchedCriteria:
            0,

          failedCriteria:
            []

        };


        if (
          candidateActualProfileCriteria
        ) {

          try {

            candidateToViewerHard =
              evaluateCandidateMatch(
                viewerProfile,
                parseExpectationCriteria(
                  candidateExpectation
                )
              ) ||
              candidateToViewerHard;

          }
          catch (error) {

            // Keep candidate processing alive.

          }

        }


        // ======================================================
        // PHASE 2 — MUTUAL HARD
        // ======================================================
        //
        // NO_HARD_CRITERIA = neutral.
        //
        // Actual hard failure = false.
        //
        // HARD_MATCH + NO_HARD_CRITERIA = true.
        // ======================================================

        const viewerHardFailed =
          viewerToCandidateHard &&
          viewerToCandidateHard.matchStatus !==
            "HARD_MATCH" &&
          viewerToCandidateHard.matchStatus !==
            "NO_HARD_CRITERIA";


        const candidateHardFailed =
          candidateToViewerHard &&
          candidateToViewerHard.matchStatus !==
            "HARD_MATCH" &&
          candidateToViewerHard.matchStatus !==
            "NO_HARD_CRITERIA";


        const mutualHardMatch =
          !viewerHardFailed &&
          !candidateHardFailed;


        // ======================================================
        // PHASE 2 — MUTUAL PROFILE
        // ======================================================

        let mutualProfile = {

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


        try {

          if (
            typeof calculateMutualProfileCompatibility ===
            "function"
          ) {

            mutualProfile =
              calculateMutualProfileCompatibility(
                viewerProfile,
                compatibilityCandidate
              ) ||
              mutualProfile;


              if (
                  String(profile.id).trim() === "ID801"
                ) {

                  console.log(
                    "🔎 RANKING MUTUAL PROFILE ID801:",
                    JSON.stringify(
                      mutualProfile,
                      null,
                      2
                    )
                  );

                }

          }

        }
        catch (error) {

          // Keep candidate processing alive.

        }


        // ======================================================
        // PHASE 2 — MUTUAL EXPECTATION
        // ======================================================

        let mutualExpectation = {

          applicable:
            false,

          score:
            0,

          maxScore:
            0,

          percentage:
            0,

          matchedKeywords:
            []

        };


        try {

          const candidateToViewerExpectation =
            calculateWeightedExpectationCompatibility(
              candidateExpectation,
              viewerExpectation
            );


          mutualExpectation =
            calculateMutualExpectationCompatibility(
              viewerToCandidateExpectation,
              candidateToViewerExpectation
            ) ||
            mutualExpectation;

        }
        catch (error) {

          // Keep candidate processing alive.

        }


        // ======================================================
        // PHASE 2 — FINAL MUTUAL SCORE
        // ======================================================

        let finalMutual = {

          finalScore:
            0,

          finalPercentage:
            0,

          hardScore:
            0,

          expectationScore:
            0,

          profileScore:
            0

        };


        try {

          finalMutual =
            calculateFinalMutualCompatibilityScore(
              mutualHardMatch,
              mutualExpectation,
              mutualProfile
            ) ||
            finalMutual;

        }
        catch (error) {

          // Keep candidate processing alive.

        }


        // ======================================================
        // PHASE 2 FINAL GATE
        // ======================================================

        if (
          mutualHardMatch !== true
        ) {
          diagnostic.mutualHardFail++;
          return;

        }


        // ------------------------------------------------------
        // PROFILE GATE
        // ------------------------------------------------------

        const profileApplicable =
          mutualProfile &&
          mutualProfile.applicable === true;


        const profileMatched =
          Number(
            mutualProfile &&
            mutualProfile.matched
          ) || 0;



        // ======================================================
        // SAVE RESULT
        // ======================================================

        console.log(
          "🟢 CANDIDATE ACCEPTED:",
          profile.id,
          profile.name
        );

        diagnostic.accepted++;

        results.push({

          id:
            profile.id,

          name:
            profile.name,

          type:
            profile.type,


          hasExpectation:
            hasExpectation,

          hasMeaningfulExpectation:
            hasMeaningfulExpectation,


          // ----------------------------------------------------
          // MUTUAL HARD
          // ----------------------------------------------------

          hardMatch:
            mutualHardMatch,

          matchStatus:
            mutualHardMatch
              ? "MUTUAL_HARD_MATCH"
              : "MUTUAL_HARD_FAILURE",


          // ----------------------------------------------------
          // MUTUAL HARD SCORE
          // ----------------------------------------------------

          hardScore:
            Number(
              finalMutual.hardScore
            ) || 0,


          // ----------------------------------------------------
          // MUTUAL EXPECTATION
          // ----------------------------------------------------

          expectationCompatibilityScore:
            Number(
              mutualExpectation.score
            ) || 0,

          expectationCompatibilityMaxScore:
            Number(
              mutualExpectation.maxScore
            ) || 0,

          expectationCompatibilityPercentage:
            Number(
              mutualExpectation.percentage
            ) || 0,

          matchedExpectationKeywords:
            Array.isArray(
              mutualExpectation.matchedKeywords
            )
              ? mutualExpectation.matchedKeywords
              : [],


          // ----------------------------------------------------
          // MUTUAL PROFILE
          // ----------------------------------------------------

          profileCompatibilityApplicable:
            profileApplicable,

          profileCompatibilityPercentage:
            Number(
              mutualProfile.percentage
            ) || 0,

          profileMatched:
            profileMatched,

          profileFailed:
            Number(
              mutualProfile.failed
            ) || 0,

          profileUnknown:
            Number(
              mutualProfile.unknown
            ) || 0,

          profileTotalChecks:
            Number(
              mutualProfile.totalChecks
            ) || 0,


          // ----------------------------------------------------
          // FINAL MUTUAL SCORE
          // ----------------------------------------------------

          finalScore:
            Number(
              finalMutual.finalScore
            ) || 0,

          finalPercentage:
            Number(
              finalMutual.finalPercentage
            ) || 0,

          rankingScore:
            Number(
              finalMutual.finalScore
            ) || 0,

          rankingPercentage:
            Number(
              finalMutual.finalPercentage
            ) || 0,


          rankingMode:
            "FINAL_MUTUAL_COMPATIBILITY"

        });

      }

      catch (error) {
          if (
            !profile ||
            !profile.id ||
            !profile.name
          ) {
            diagnostic.invalidProfile++;
            return;
          }
        // Never stop the complete ranking because of
        // one candidate.

      }

    }
  );


  // ==========================================================
  // REMOVE DUPLICATES
  // ==========================================================

  const uniqueResultsMap =
    new Map();


  results.forEach(
    function(item) {

      const key =
        String(
          item.id || ""
        )
          .trim()
          .toUpperCase();


      if (!key) {

        return;

      }


      const existing =
        uniqueResultsMap.get(
          key
        );


      if (
        !existing ||
        item.rankingScore >
        existing.rankingScore
      ) {

        uniqueResultsMap.set(
          key,
          item
        );

      }

    }
  );


  const uniqueResults =
    Array.from(
      uniqueResultsMap.values()
    );


  // ==========================================================
  // SORT — FINAL MUTUAL RANKING
  // ==========================================================

  uniqueResults.sort(
    function(a, b) {

      // 1. Mutual hard match

      if (
        a.hardMatch !==
        b.hardMatch
      ) {

        return a.hardMatch
          ? -1
          : 1;

      }


      // 2. Final mutual score

      if (
        a.rankingScore !==
        b.rankingScore
      ) {

        return (
          b.rankingScore -
          a.rankingScore
        );

      }


      // 3. Mutual profile

      if (
        a.profileCompatibilityPercentage !==
        b.profileCompatibilityPercentage
      ) {

        return (
          b.profileCompatibilityPercentage -
          a.profileCompatibilityPercentage
        );

      }


      // 4. Mutual expectation

      if (
        a.expectationCompatibilityPercentage !==
        b.expectationCompatibilityPercentage
      ) {

        return (
          b.expectationCompatibilityPercentage -
          a.expectationCompatibilityPercentage
        );

      }


      // 5. Matched keywords

      if (
        a.matchedExpectationKeywords.length !==
        b.matchedExpectationKeywords.length
      ) {

        return (
          b.matchedExpectationKeywords.length -
          a.matchedExpectationKeywords.length
        );

      }


      // 6. Name

      return String(
        a.name || ""
      ).localeCompare(
        String(
          b.name || ""
        )
      );

    }
  );


  // ==========================================================
  // RANK
  // ==========================================================

  uniqueResults.forEach(
    function(candidate, index) {

      candidate.rank =
        index + 1;

    }
  );


  // ==========================================================
  // TOP 10
  // ==========================================================

  const top10 =
    uniqueResults.slice(
      0,
      10
    );

    console.log(
      "🔎 PHASE 2 CANDIDATE PIPELINE:",
      JSON.stringify(
        diagnostic,
        null,
        2
      )
    );
    
  // ==========================================================
  // SUMMARY
  // ==========================================================

  const summary = {

    viewerId:
      viewerId,

    viewerType:
      viewerType,

    viewerName:
      viewer.name || "",

    rankingMode:
      "FINAL_MUTUAL_COMPATIBILITY_RANKING",

    totalCandidates:
      uniqueResults.length,

    mutualHardMatched:
      uniqueResults.filter(
        function(item) {

          return (
            item.hardMatch === true
          );

        }
      ).length,

    finalMutualCompatibilityCandidates:
      uniqueResults.filter(
        function(item) {

          return (
            item.rankingMode ===
            "FINAL_MUTUAL_COMPATIBILITY"
          );

        }
      ).length,

    meaningfulExpectationCandidates:
      uniqueResults.filter(
        function(item) {

          return (
            item.hasMeaningfulExpectation ===
            true
          );

        }
      ).length,

    topMatches:
      top10.length

  };


  // ==========================================================
  // MINIMAL OUTPUT
  // ==========================================================

  console.log(
    "=============================================="
  );

  console.log(
    "ACTUAL BRIDE RANKING SUMMARY"
  );

  console.log(
    JSON.stringify(
      summary,
      null,
      2
    )
  );


  console.log(
    "=============================================="
  );

  console.log(
    "TOP 10 BRIDE MATCHES"
  );

  console.log(
    JSON.stringify(
      top10,
      null,
      2
    )
  );


  console.log(
    "=============================================="
  );


  // ==========================================================
  // RETURN
  // ==========================================================

  return {

    success:
      true,

    viewerId:
      viewerId,

    viewerType:
      viewerType,

    viewerName:
      viewer.name || "",

    actualProfileCriteria:
      actualProfileCriteria,

    summary:
      summary,

    top10:
      top10,

    allResults:
      uniqueResults

  };

}



function testID628ExpectationCriteria() {

  const viewerId = "ID628";
  const viewerType = "bride";

  const viewer =
    getMatchingViewerProfile(
      viewerId,
      viewerType
    );

  if (!viewer || !viewer.success) {
    console.log(
      JSON.stringify(viewer, null, 2)
    );
    return;
  }

  const expectation =
    viewer.expectation || "";

  const criteria =
    parseExpectationCriteria(
      expectation
    );

  console.log(
    "=================================================="
  );

  console.log(
    "ID628 EXPECTATION"
  );

  console.log(
    expectation
  );

  console.log(
    "=================================================="
  );

  console.log(
    "FINAL EXPECTATION CRITERIA"
  );

  console.log(
    JSON.stringify(
      criteria,
      null,
      2
    )
  );

  return criteria;
}



// ==========================================================
// EXPECTATION RANGE PARSER
// ==========================================================

function parseExpectationNumberRange(text) {

  const value = String(text || "").trim();

  let match =
    value.match(
      /(\d+(?:\.\d+)?)\s*(?:to|-|–|—)\s*(\d+(?:\.\d+)?)/i
    );

  if (!match) {
    return {
      enabled: false,
      min: null,
      max: null
    };
  }

  return {
    enabled: true,
    min: Number(match[1]),
    max: Number(match[2])
  };

}


// ==========================================================
// HEIGHT PARSER
// Supports:
// 5'5 to 5'8
// 5'5"-5'8"
// 5 ft 5 in to 5 ft 8 in
// 5 feet 5 inches to 5 feet 8 inches
// ==========================================================

function parseExpectationHeightRange(text) {

  const value =
    String(text || "")
      .toLowerCase()
      .replace(/″|”/g, '"')
      .replace(/′|’/g, "'")
      .trim();


  let match =
    value.match(
      /(\d+)\s*[' ]\s*(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)?\s*(?:to|-|–|—)\s*(\d+)\s*[' ]\s*(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)?/i
    );


  if (!match) {

    match =
      value.match(
        /(\d+)\s*(?:ft|feet)\s*(\d+)?\s*(?:in|inch|inches)?\s*(?:to|-|–|—)\s*(\d+)\s*(?:ft|feet)\s*(\d+)?\s*(?:in|inch|inches)?/i
      );

  }


  if (!match) {

    return {

      enabled: false,

      minInches: null,

      maxInches: null

    };

  }


  const minFeet =
    Number(match[1]);

  const minInches =
    Number(match[2] || 0);

  const maxFeet =
    Number(match[3]);

  const maxInches =
    Number(match[4] || 0);


  return {

    enabled: true,

    minInches:
      minFeet * 12 +
      minInches,

    maxInches:
      maxFeet * 12 +
      maxInches

  };

}


// ==========================================================
// DISTRICT PARSER
// ==========================================================

function parseExpectationDistricts(text) {

  const value =
    String(text || "").trim();


  const districts = [];


  const knownDistricts = [

    "Pune",
    "Kolhapur",
    "Mumbai",
    "Thane",
    "Nashik",
    "Nagpur",
    "Satara",
    "Sangli",
    "Solapur",
    "Ratnagiri",
    "Sindhudurg",
    "Raigad",
    "Palghar",
    "Ahmednagar",
    "Ahilyanagar",
    "Aurangabad",
    "Chhatrapati Sambhajinagar",
    "Beed",
    "Latur",
    "Nanded",
    "Osmanabad",
    "Dharashiv",
    "Jalgaon",
    "Dhule",
    "Nandurbar",
    "Akola",
    "Amravati",
    "Buldhana",
    "Washim",
    "Yavatmal",
    "Wardha",
    "Bhandara",
    "Gondia",
    "Chandrapur",
    "Gadchiroli"
  ];


  knownDistricts.forEach(
    function (district) {

      const normalizedDistrict =
        normalizeMatchingText(
          district
        );


      const normalizedText =
        normalizeMatchingText(
          value
        );


      if (
        normalizedText.indexOf(
          normalizedDistrict
        ) !== -1
      ) {

        districts.push(
          district
        );

      }

    }
  );


  return [
    ...new Set(
      districts
    )
  ];

}


// ==========================================================
// CASTE PARSER
// ==========================================================

function parseExpectationCaste(text) {

  const value =
    String(text || "").trim();


  const values = [];


  const normalized =
    normalizeMatchingText(
      value
    );


  if (
    normalized.indexOf(
      "devang koshti"
    ) !== -1 ||
    normalized.indexOf(
      "देवांग कोष्टी"
    ) !== -1
  ) {

    values.push(
      "देवांग कोष्टी"
    );

  }


  if (
    normalized.indexOf(
      "koshti"
    ) !== -1 ||
    normalized.indexOf(
      "कोष्टी"
    ) !== -1
  ) {

    values.push(
      "कोष्टी"
    );

  }


  if (
    normalized.indexOf(
      "hindu"
    ) !== -1 ||
    normalized.indexOf(
      "हindu"
    ) !== -1
  ) {

    values.push(
      "हिंदू"
    );

  }


  return [
    ...new Set(
      values
    )
  ];

}


// ==========================================================
// RASHI PARSER
// ==========================================================

function parseExpectationRashi(text) {

  const value =
    normalizeMatchingText(
      text
    );


  const rashiMap = {

    mesh: "मेष",
    aries: "मेष",
    मेष: "मेष",

    vrushabh: "वृषभ",
    vrishabh: "वृषभ",
    taurus: "वृषभ",
    वृषभ: "वृषभ",

    mithun: "मिथुन",
    gemini: "मिथुन",
    मिथुन: "मिथुन",

    kark: "कर्क",
    cancer: "कर्क",
    कर्क: "कर्क",

    simha: "सिंह",
    leo: "सिंह",
    सिंह: "सिंह",

    kanya: "कन्या",
    virgo: "कन्या",
    कन्या: "कन्या",

    tula: "तुळ",
    libra: "तुळ",
    तुळ: "तुळ",

    vrushchik: "वृश्चिक",
    scorpio: "वृश्चिक",
    वृश्चिक: "वृश्चिक",

    dhanu: "धनु",
    sagittarius: "धनु",
    धनु: "धनु",

    makar: "मकर",
    capricorn: "मकर",
    मकर: "मकर",

    kumbh: "कुंभ",
    aquarius: "कुंभ",
    कुंभ: "कुंभ",

    meen: "मीन",
    pisces: "मीन",
    मीन: "मीन"

  };


  const result = [];


  Object.keys(
    rashiMap
  ).forEach(
    function (key) {

      if (
        value.indexOf(
          key
        ) !== -1
      ) {

        result.push(
          rashiMap[key]
        );

      }

    }
  );


  return [
    ...new Set(
      result
    )
  ];

}