// ==========================================================
// FILE : ProfessionNormalizer.gs
// MODULE : Profession Normalizer
// PURPOSE : Normalize profession, categories & employment type
// ==========================================================


// ==========================================================
// PROFESSION CATEGORIES
// ==========================================================

const PROFESSION_CATEGORIES = {

  IT_SOFTWARE:
    "IT & Software",

  ENGINEERING:
    "Engineering & Technology",

  MEDICAL:
    "Medical & Healthcare",

  FINANCE_BANKING:
    "Finance & Banking",

  GOVERNMENT:
    "Government / Public Sector",

  EDUCATION:
    "Education & Teaching",

  BUSINESS:
    "Business / Entrepreneurship",

  SALES_MARKETING:
    "Sales & Marketing",

  AGRICULTURE:
    "Agriculture & Farming",

  CONSTRUCTION_REAL_ESTATE:
    "Construction / Real Estate",

  MANUFACTURING:
    "Manufacturing / Production",

  RETAIL_TRADING:
    "Retail / Trading",

  HOSPITALITY:
    "Hospitality / Hotel / Food",

  TRANSPORT_LOGISTICS:
    "Transport / Logistics",

  MEDIA_DESIGN:
    "Media / Photography / Design",

  LEGAL:
    "Legal",

  PHARMACEUTICAL:
    "Pharmaceutical",

  ELECTRICAL_ELECTRONICS:
    "Electrical / Electronics",

  SKILLED_TRADE:
    "Skilled Trade / Technician",

  DEFENCE_SECURITY:
    "Defence / Police / Security",

  RESEARCH_SCIENCE:
    "Research / Science",

  HR_ADMIN:
    "HR / Administration",

  OTHER:
    "Other / General Job",

  NOT_SPECIFIED:
    "Not Specified"

};


// ==========================================================
// EMPLOYMENT TYPES
// ==========================================================

const PROFESSION_EMPLOYMENT_TYPES = {

  GOVERNMENT:
    "GOVERNMENT",

  PRIVATE:
    "PRIVATE",

  SELF_EMPLOYED:
    "SELF_EMPLOYED",

  BUSINESS:
    "BUSINESS",

  STUDENT:
    "STUDENT",

  NOT_SPECIFIED:
    "NOT_SPECIFIED"

};


// ==========================================================
// NORMALIZE PROFESSION TEXT
// ==========================================================

function normalizeProfessionText(
  text
) {

  if (!text) {

    return "";

  }


  return String(text)

    .toLowerCase()

    .replace(
      /<br\s*\/?>/gi,
      " "
    )

    .replace(
      /[|,;:()[\]{}\/\\]+/g,
      " "
    )

    .replace(
      /[-_]+/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim();

}


// ==========================================================
// PROFESSION RULES
// ==========================================================

const PROFESSION_RULES = [

  // ========================================================
  // IT & SOFTWARE
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.IT_SOFTWARE,

    keywords: [

      "software engineer",
      "software developer",
      "software development",

      "web developer",
      "web development",
      "web design",
      "web designer",

      "digital solutions",
      "digital development",

      "application development",
      "app development",

      "developer",
      "programmer",

      "frontend",
      "front end",

      "backend",
      "back end",

      "full stack",
      "fullstack",

      "react",
      "react native",

      "angular",
      "vue",
      "node js",
      "nodejs",

      "javascript",
      "typescript",

      "python",
      "java",
      "dot net",
      ".net",

      "data engineer",
      "data analyst",
      "data scientist",

      "business analyst",

      "technical lead",
      "technology lead",

      "software architect",
      "solution architect",
      "system architect",
      "technical architect",

      "sap consultant",
      "sap",

      "information technology",
      "it company",
      "technology",

      "infosys",
      "tcs",
      "persistent systems",
      "kpit",
      "qualcomm"

    ]

  },


  // ========================================================
  // ENGINEERING
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.ENGINEERING,

    keywords: [

      "engineer",
      "engineering",

      "civil engineer",
      "mechanical engineer",
      "electrical engineer",
      "electronics engineer",

      "design engineer",
      "assistant engineer",
      "senior engineer",
      "project engineer",
      "production engineer",
      "maintenance engineer",
      "planning engineer",
      "automobile engineer",
      "chemical engineer",

      "civil",
      "mechanical",
      "electrical",
      "electronics",
      "chemical",
      "automobile"

    ]

  },


  // ========================================================
  // MEDICAL
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.MEDICAL,

    keywords: [

      "doctor",
      "medical officer",
      "medical",
      "hospital",
      "physician",
      "surgeon",
      "dentist",
      "nurse",
      "nursing",
      "therapist",
      "therapy",
      "clinic",
      "healthcare",
      "health care",

      "bhms",
      "mbbs",
      "bams",
      "bds",
      "md",
      "ms",
      "mch",
      "dm"

    ]

  },


  // ========================================================
  // FINANCE & BANKING
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.FINANCE_BANKING,

    keywords: [

      "bank",
      "banking",
      "bank clerk",

      "finance",
      "financial",

      "accountant",
      "accounting",
      "accounts",

      "auditor",
      "tax",
      "tax consultant",

      "credit officer",
      "investment",
      "mutual fund",

      "chartered accountant",
      "ca",

      "hdfc bank",
      "hdfc life"

    ]

  },


  // ========================================================
  // GOVERNMENT
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.GOVERNMENT,

    keywords: [

      "government",
      "govt",
      "govt employee",
      "government employee",

      "सरकारी",
      "शासकीय",
      "शासन",

      "महानगरपालिका",
      "नगरपरिषद",

      "municipal corporation",

      "mseb",
      "msedcl",
      "mahatransco",

      "mpsc",
      "z p",
      "zilla parishad",

      "district court",
      "central government",
      "state government",

      "government college",
      "government school",

      "government hospital"

    ]

  },


  // ========================================================
  // EDUCATION
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.EDUCATION,

    keywords: [

      "teacher",
      "lecturer",
      "professor",
      "principal",

      "school",
      "college",

      "education",
      "teaching",
      "faculty",

      "lab assistant",

      "शिक्षक",
      "प्राध्यापक",
      "मुख्याध्यापक",
      "शिक्षण",
      "महाविद्यालय",
      "शाळा"

    ]

  },


  // ========================================================
  // BUSINESS / ENTREPRENEURSHIP
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.BUSINESS,

    keywords: [

      "business",
      "businessman",
      "businesswoman",

      "entrepreneur",

      "own business",
      "own practice",
      "self business",

      "startup",
      "start up",
      "startup founder",

      "founder",
      "co founder",
      "co-founder",

      "proprietor",
      "proprietorship",

      "director",
      "owner",

      "स्वतःचा व्यवसाय",
      "व्यवसाय",
      "उद्योजक",
      "उद्योग",
      "मालक"

    ]

  },


  // ========================================================
  // SALES & MARKETING
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.SALES_MARKETING,

    keywords: [

      "sales",
      "sales executive",
      "sales manager",

      "marketing",
      "marketing executive",
      "marketing manager",

      "business development",
      "business development executive",

      "medical representative"

    ]

  },


  // ========================================================
  // AGRICULTURE
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.AGRICULTURE,

    keywords: [

      "agriculture",
      "agricultural",
      "farmer",
      "farming",
      "farm",
      "agri",

      "कृषी",
      "शेती",
      "शेतकरी",
      "बागायत"

    ]

  },


  // ========================================================
  // CONSTRUCTION / REAL ESTATE
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.CONSTRUCTION_REAL_ESTATE,

    keywords: [

      "construction",
      "contractor",
      "builder",
      "civil construction",
      "real estate",
      "property",
      "plotting",
      "construction business",

      "बांधकाम",
      "कंत्राटदार",
      "बिल्डर"

    ]

  },


  // ========================================================
  // MANUFACTURING
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.MANUFACTURING,

    keywords: [

      "manufacturing",
      "production",
      "factory",
      "plant",
      "operator",
      "machine operator",
      "manufacturing engineer",

      "मॅन्युफॅक्चरिंग",
      "कारखाना",
      "उत्पादन"

    ]

  },


  // ========================================================
  // RETAIL / TRADING
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.RETAIL_TRADING,

    keywords: [

      "shop",
      "shop owner",
      "store",
      "retail",
      "trader",
      "trading",
      "wholesale",
      "wholesaler",

      "किराणा",
      "दुकान",
      "व्यापारी",
      "कापड दुकान",
      "मेडिकल दुकान"

    ]

  },


  // ========================================================
  // HOSPITALITY
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.HOSPITALITY,

    keywords: [

      "hotel",
      "restaurant",
      "food",
      "food and beverage",
      "hospitality",
      "catering",
      "chef",
      "hotel manager",
      "restaurant manager",
      "catering service",

      "केटरिंग",
      "हॉटेल",
      "रेस्टॉरंट"

    ]

  },


  // ========================================================
  // TRANSPORT / LOGISTICS
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.TRANSPORT_LOGISTICS,

    keywords: [

      "transport",
      "transportation",
      "logistics",
      "driver",
      "trucking",
      "delivery",
      "import export",
      "import & export",

      "ट्रान्सपोर्ट",
      "ड्रायव्हर",
      "वाहतूक"

    ]

  },


  // ========================================================
  // MEDIA / DESIGN
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.MEDIA_DESIGN,

    keywords: [

      "photographer",
      "photography",

      "graphic designer",
      "graphic design",

      "ui ux",
      "ui ux designer",

      "designer",
      "design",

      "media",
      "printing",
      "printing press",

      "फोटोग्राफी",
      "फोटोग्राफर",
      "डिझायनर",
      "प्रिंटिंग"

    ]

  },


  // ========================================================
  // LEGAL
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.LEGAL,

    keywords: [

      "lawyer",
      "advocate",
      "legal",
      "law",

      "वकील",
      "अॅडव्होकेट",
      "कायदा"

    ]

  },


  // ========================================================
  // PHARMACEUTICAL
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.PHARMACEUTICAL,

    keywords: [

      "pharma",
      "pharmaceutical",
      "pharmaceutical company",
      "pharmacist",
      "medical representative",

      "फार्मा",
      "फार्मासिस्ट"

    ]

  },


  // ========================================================
  // ELECTRICAL / ELECTRONICS
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.ELECTRICAL_ELECTRONICS,

    keywords: [

      "electrical",
      "electronics",
      "electrician",
      "electrical engineer",
      "electronic engineer",

      "इलेक्ट्रिकल",
      "इलेक्ट्रॉनिक्स",
      "इलेक्ट्रीशियन"

    ]

  },


  // ========================================================
  // SKILLED TRADE
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.SKILLED_TRADE,

    keywords: [

      "technician",
      "mechanic",
      "workshop",
      "welder",
      "operator",
      "maintenance",
      "foundry",

      "मेकॅनिक",
      "वर्कशॉप",
      "फॉन्ड्री",
      "तंत्रज्ञ"

    ]

  },


  // ========================================================
  // DEFENCE / POLICE / SECURITY
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.DEFENCE_SECURITY,

    keywords: [

      "military",
      "defence",
      "defense",
      "army",
      "navy",
      "air force",
      "police",
      "security",
      "defence services",

      "लष्कर",
      "सैन्य",
      "पोलीस",
      "संरक्षण"

    ]

  },


  // ========================================================
  // RESEARCH / SCIENCE
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.RESEARCH_SCIENCE,

    keywords: [

      "research",
      "researcher",
      "scientist",
      "r&d",
      "r & d",
      "research and development",

      "संशोधन",
      "वैज्ञानिक"

    ]

  },


  // ========================================================
  // HR / ADMINISTRATION
  // ========================================================

  {
    category:
      PROFESSION_CATEGORIES.HR_ADMIN,

    keywords: [

      "human resources",
      "hr manager",
      "administrator",
      "administration",
      "admin",
      "office assistant",
      "clerk",

      "लिपिक",
      "प्रशासन"

    ]

  }

];


// ==========================================================
// PROFESSION KEYWORD CHECK
// ==========================================================

function professionKeywordExists(
  text,
  keyword
) {

  if (!text || !keyword) {

    return false;

  }


  const cleanText =
    String(text)
      .toLowerCase()
      .trim();


  const cleanKeyword =
    String(keyword)
      .toLowerCase()
      .trim();


  if (!cleanKeyword) {

    return false;

  }


  // ========================================================
  // MULTI-WORD KEYWORD
  // ========================================================

  if (
    cleanKeyword.includes(" ")
  ) {

    return cleanText.includes(
      cleanKeyword
    );

  }


  // ========================================================
  // SINGLE-WORD KEYWORD
  // ========================================================

  const escapedKeyword =
    cleanKeyword.replace(
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
    cleanText
  );

}


// ==========================================================
// DETECT EMPLOYMENT TYPE
// ==========================================================

function detectProfessionEmploymentType(
  normalizedText
) {

  // ========================================================
  // EMPTY
  // ========================================================

  if (!normalizedText) {

    return PROFESSION_EMPLOYMENT_TYPES.NOT_SPECIFIED;

  }


  // ========================================================
  // GOVERNMENT
  // ========================================================

  const governmentSignals = [

    "government",
    "govt",
    "govt employee",
    "government employee",

    "सरकारी",
    "शासकीय",
    "शासन",

    "central government",
    "state government",

    "mseb",
    "msedcl",
    "mahatransco",
    "mpsc",

    "municipal corporation",
    "नगरपरिषद",
    "महानगरपालिका",

    "government college",
    "government school",
    "government hospital"

  ];


  for (
    let i = 0;
    i < governmentSignals.length;
    i++
  ) {

    if (
      professionKeywordExists(
        normalizedText,
        governmentSignals[i]
      )
    ) {

      return PROFESSION_EMPLOYMENT_TYPES.GOVERNMENT;

    }

  }


  // ========================================================
  // BUSINESS
  // ========================================================

  const businessSignals = [

    "businessman",
    "businesswoman",

    "entrepreneur",

    "own business",
    "own practice",
    "self business",

    "startup",
    "start up",
    "startup founder",

    "founder",
    "co founder",
    "co-founder",

    "proprietor",
    "proprietorship",

    "director",
    "owner",

    "स्वतःचा व्यवसाय",
    "व्यवसाय",
    "उद्योजक",
    "उद्योग",
    "मालक"

  ];


  for (
    let i = 0;
    i < businessSignals.length;
    i++
  ) {

    if (
      professionKeywordExists(
        normalizedText,
        businessSignals[i]
      )
    ) {

      return PROFESSION_EMPLOYMENT_TYPES.BUSINESS;

    }

  }


  // ========================================================
  // STUDENT
  // ========================================================

  const studentSignals = [

    "student",
    "studying",
    "pursuing",

    "शिक्षण चालू",
    "विद्यार्थी"

  ];


  for (
    let i = 0;
    i < studentSignals.length;
    i++
  ) {

    if (
      professionKeywordExists(
        normalizedText,
        studentSignals[i]
      )
    ) {

      return PROFESSION_EMPLOYMENT_TYPES.STUDENT;

    }

  }


  // ========================================================
  // PRIVATE
  // ========================================================

  const privateSignals = [

    "private",
    "pvt",
    "private limited",
    "pvt ltd",
    "mnc"

  ];


  for (
    let i = 0;
    i < privateSignals.length;
    i++
  ) {

    if (
      professionKeywordExists(
        normalizedText,
        privateSignals[i]
      )
    ) {

      return PROFESSION_EMPLOYMENT_TYPES.PRIVATE;

    }

  }


  // ========================================================
  // SELF EMPLOYED
  // ========================================================

  const selfEmployedSignals = [

    "freelancer",
    "freelance",
    "consultant",
    "independent consultant",
    "self employed",
    "self-employed",

    "फ्रीलान्स",
    "स्वयंरोजगार"

  ];


  for (
    let i = 0;
    i < selfEmployedSignals.length;
    i++
  ) {

    if (
      professionKeywordExists(
        normalizedText,
        selfEmployedSignals[i]
      )
    ) {

      return PROFESSION_EMPLOYMENT_TYPES.SELF_EMPLOYED;

    }

  }


  // ========================================================
  // DEFAULT
  // ========================================================

  return PROFESSION_EMPLOYMENT_TYPES.NOT_SPECIFIED;

}


// ==========================================================
// NORMALIZE PROFESSION
// ==========================================================

function normalizeProfession(
  rawProfession
) {

  // ========================================================
  // RAW VALUE
  // ========================================================

  const raw =
    String(
      rawProfession || ""
    ).trim();


  // ========================================================
  // EMPTY
  // ========================================================

  if (!raw) {

    return {

      raw: "",

      normalizedText: "",

      categories: [],

      matchedKeywords: [],

      employmentType:
        PROFESSION_EMPLOYMENT_TYPES.NOT_SPECIFIED,

      hasProfessionData: false

    };

  }


  // ========================================================
  // NORMALIZE TEXT
  // ========================================================

  const normalizedText =
    normalizeProfessionText(
      raw
    );


  // ========================================================
  // RESULT ARRAYS
  // ========================================================

  const categories = [];

  const matchedKeywords = [];


  // ========================================================
  // CATEGORY DETECTION
  // ========================================================

  PROFESSION_RULES.forEach(
    function(rule) {

      let categoryMatched =
        false;


      rule.keywords.forEach(
        function(keyword) {

          if (
            professionKeywordExists(
              normalizedText,
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


  // ========================================================
  // EMPLOYMENT TYPE
  // ========================================================

  const employmentType =
    detectProfessionEmploymentType(
      normalizedText
    );


  // ========================================================
  // DEBUG LOG
  // ========================================================

  console.log(
    "PROFESSION EMPLOYMENT TYPE:",
    employmentType
  );


  // ========================================================
  // FINAL RESULT
  // ========================================================

  return {

    raw:
      raw,

    normalizedText:
      normalizedText,

    categories:
      categories,

    matchedKeywords:
      matchedKeywords,

    employmentType:
      employmentType,

    hasProfessionData:
      normalizedText.length > 0

  };

}


// ==========================================================
// TEST SINGLE PROFESSION
// ==========================================================

function testSingleProfession() {

  const input =
    "Entrepreneur in Web Design & Development, delivering High-end digital solutions for businesses. Also Engaged in new startup initiatives.";


  const result =
    normalizeProfession(
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


// ==========================================================
// TEST EMPLOYMENT TYPE
// ==========================================================

function testEmploymentTypeOnly() {

  const input =
    "Entrepreneur in Web Design & Development";


  const normalizedText =
    normalizeProfessionText(
      input
    );


  console.log(
    "INPUT:",
    input
  );


  console.log(
    "NORMALIZED TEXT:",
    normalizedText
  );


  console.log(
    "ENTREPRENEUR MATCH:",
    professionKeywordExists(
      normalizedText,
      "entrepreneur"
    )
  );


  const employmentType =
    detectProfessionEmploymentType(
      normalizedText
    );


  console.log(
    "DETECTED EMPLOYMENT TYPE:",
    employmentType
  );


  return {

    input:
      input,

    normalizedText:
      normalizedText,

    entrepreneurMatched:
      professionKeywordExists(
        normalizedText,
        "entrepreneur"
      ),

    employmentType:
      employmentType

  };

}