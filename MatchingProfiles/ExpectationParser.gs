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
    "dream support",
    "supports my dreams",
    "support my dreams"
  ],

  careerSupportive: [
    "करिअरचा आदर",
    "करिअरचा आणि स्वप्नांचा आदर",
    "करिअरला पाठिंबा",
    "करिअरला साथ",
    "career support",
    "career supportive",
    "support my career",
    "supports my career"
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
    function(value) {

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
    function(rule) {

      const matched =
        rule.keywords.some(
          function(keyword) {

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
    function(rule) {

      const matched =
        rule.keywords.some(
          function(keyword) {

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
    function(rule) {

      const matched =
        rule.keywords.some(
          function(keyword) {

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
    function(preference) {

      const keywords =
        EXPECTATION_SOFT_PREFERENCE_RULES[
          preference
        ] || [];

      softPreferences[preference] =
        keywords.some(
          function(keyword) {

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
      function(key) {

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
      function(testCase) {

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
      function(alias) {

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
    function(testCase) {

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
