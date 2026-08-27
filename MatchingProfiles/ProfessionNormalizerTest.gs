// ==========================================================
// FILE : ProfessionNormalizerTest.gs
// MODULE : Matching Profiles
// STEP : 5C-1
//
// PURPOSE
// ----------------------------------------------------------
// Test ProfessionNormalizer independently.
//
// IMPORTANT
// ----------------------------------------------------------
// This file does NOT modify profile data.
// It does NOT access Google Sheets.
// It does NOT affect matching.
// ==========================================================


function testProfessionNormalizerCases() {

  const testCases = [

    // ------------------------------------------------------
    // CASE 1
    // ------------------------------------------------------

    {
      label:
        "Case 1 - Software Engineer",

      input:
        "Software Engineer, Persistent Systems, Pune"
    },


    // ------------------------------------------------------
    // CASE 2
    // ------------------------------------------------------

    {
      label:
        "Case 2 - Web Development Entrepreneur",

      input:
        "Entrepreneur in Web Design & Development, delivering High-end digital solutions for businesses."
    },


    // ------------------------------------------------------
    // CASE 3
    // ------------------------------------------------------

    {
      label:
        "Case 3 - Data Engineer",

      input:
        "Data Engineer, IT Company, Pune"
    },


    // ------------------------------------------------------
    // CASE 4
    // ------------------------------------------------------

    {
      label:
        "Case 4 - Government Engineer",

      input:
        "M.S.E.B. Assistant Engineer"
    },


    // ------------------------------------------------------
    // CASE 5
    // ------------------------------------------------------

    {
      label:
        "Case 5 - Government Job",

      input:
        "सरकारी नोकरी, महाराष्ट्र शासन"
    },


    // ------------------------------------------------------
    // CASE 6
    // ------------------------------------------------------

    {
      label:
        "Case 6 - Doctor",

      input:
        "Doctor, Private Hospital, Pune"
    },


    // ------------------------------------------------------
    // CASE 7
    // ------------------------------------------------------

    {
      label:
        "Case 7 - Medical Representative",

      input:
        "Medical Representative, Pharma Company"
    },


    // ------------------------------------------------------
    // CASE 8
    // ------------------------------------------------------

    {
      label:
        "Case 8 - Bank",

      input:
        "Bank Clerk, HDFC Bank"
    },


    // ------------------------------------------------------
    // CASE 9
    // ------------------------------------------------------

    {
      label:
        "Case 9 - Teacher",

      input:
        "माध्यमिक शिक्षक, जवाहर हायस्कूल"
    },


    // ------------------------------------------------------
    // CASE 10
    // ------------------------------------------------------

    {
      label:
        "Case 10 - Agriculture",

      input:
        "शेती बागायत"
    },


    // ------------------------------------------------------
    // CASE 11
    // ------------------------------------------------------

    {
      label:
        "Case 11 - Construction",

      input:
        "Prathamesh Construction, Ichalkaranji"
    },


    // ------------------------------------------------------
    // CASE 12
    // ------------------------------------------------------

    {
      label:
        "Case 12 - UI UX Designer",

      input:
        "UI/UX Designer at Pandoza Solutions Pvt. Ltd., Pune"
    },


    // ------------------------------------------------------
    // CASE 13
    // ------------------------------------------------------

    {
      label:
        "Case 13 - Retail",

      input:
        "कापड दुकान, बालाजी मेन्स वेअर"
    },


    // ------------------------------------------------------
    // CASE 14
    // ------------------------------------------------------

    {
      label:
        "Case 14 - Architect Business",

      input:
        "आर्किटेक्ट, स्वतःचा व्यवसाय, नाशिक"
    },


    // ------------------------------------------------------
    // CASE 15
    // ------------------------------------------------------

    {
      label:
        "Case 15 - Driver",

      input:
        "Driver"
    },


    // ------------------------------------------------------
    // CASE 16
    // ------------------------------------------------------

    {
      label:
        "Case 16 - Empty",

      input:
        ""
    },


    // ------------------------------------------------------
    // CASE 17
    // ------------------------------------------------------

    {
      label:
        "Case 17 - Your Actual Profile",

      input:
        "Entrepreneur in Web Design & Development, delivering High-end digital solutions for businesses. Also Engaged in new startup initiatives."
    }

  ];


  const results =
    testCases.map(
      function(testCase) {

        const output =
          normalizeProfession(
            testCase.input
          );


        return {

          label:
            testCase.label,

          input:
            testCase.input,

          output:
            output

        };

      }
    );


  // ========================================================
  // LOG COMPLETE RESULT
  // ========================================================

  console.log(
    "=================================================="
  );

  console.log(
    "PROFESSION NORMALIZER TEST RESULTS"
  );

  console.log(
    "=================================================="
  );


  results.forEach(
    function(result) {

      console.log(
        result.label
      );

      console.log(
        JSON.stringify(
          result.output,
          null,
          2
        )
      );

    }
  );


  console.log(
    "=================================================="
  );


  return results;

}


function testEmploymentTypeOnly() {

  console.log(
    "PROFESSION_EMPLOYMENT_TYPES:",
    JSON.stringify(
      PROFESSION_EMPLOYMENT_TYPES,
      null,
      2
    )
  );


  console.log(
    "BUSINESS VALUE:",
    PROFESSION_EMPLOYMENT_TYPES.BUSINESS
  );


  const input =
    "Entrepreneur in Web Design & Development";


  const normalizedText =
    normalizeProfessionText(
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

}