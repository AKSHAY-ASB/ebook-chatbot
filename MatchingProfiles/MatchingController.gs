// ============================================================
// FILE : MatchingController.gs
// MODULE : Matching
// PURPOSE : Control / orchestrate Matching Engine
//
// RESPONSIBILITY
//  - Receive viewer profile information
//  - Load candidate profiles from MatchingRepository
//  - Convert raw rows into profile objects
//  - Normalize education
//  - Normalize profession
//  - Prepare profiles for matching
//  - Provide common controller APIs
//
// DOES NOT
//  - Read Google Sheets directly
//  - Modify profile sheets
//  - Apply LIKE / DISLIKE directly
//  - Send Interest
//  - Rank profiles
//
// DEPENDENCIES
//  - MatchingRepository.gs
//  - MatchingProfileNormalizer.gs
//  - MatchingEducationNormalizer.gs
//  - ProfessionNormalizer.gs
//
// IMPORTANT
//  - Existing sheets are NOT modified.
//  - Existing profile/search functions are NOT modified.
// ============================================================



// ============================================================
// MATCHING CONTROLLER VERSION
// ============================================================

const MATCHING_CONTROLLER_VERSION =
  "1.0.0";



// ============================================================
// GET VIEWER PROFILE TYPE
//
// If logged-in user is:
// bride -> candidate should normally be groom
// groom -> candidate should normally be bride
// other -> candidate can be other / configured later
// ============================================================

function getOppositeMatchingProfileType(
  profileType
) {

  profileType =
    String(
      profileType || ""
    )
    .trim()
    .toLowerCase();


  if (
    profileType === "bride"
  ) {

    return "groom";

  }


  if (
    profileType === "groom"
  ) {

    return "bride";

  }


  if (
    profileType === "other"
  ) {

    return "other";

  }


  return "";

}



// ============================================================
// GET PROFILE TYPE FROM RAW SHEET VALUE
// ============================================================

function normalizeMatchingProfileType(
  profileType
) {

  const value =
    String(
      profileType || ""
    )
    .trim()
    .toLowerCase();


  if (
    value === "वधू" ||
    value === "bride"
  ) {

    return "bride";

  }


  if (
    value === "वर" ||
    value === "groom"
  ) {

    return "groom";

  }


  if (
    value === "इतर" ||
    value === "other"
  ) {

    return "other";

  }


  return "";

}



// ============================================================
// FIND HEADER INDEX
// ============================================================

function getMatchingHeaderIndex(
  headers,
  possibleNames
) {

  if (
    !Array.isArray(headers)
  ) {

    return -1;

  }


  if (
    !Array.isArray(possibleNames)
  ) {

    return -1;

  }


  const normalizedHeaders =
    headers.map(
      function(header) {

        return String(
          header || ""
        )
        .trim()
        .toLowerCase();

      }
    );


  for (
    let i = 0;
    i < possibleNames.length;
    i++
  ) {

    const target =
      String(
        possibleNames[i] || ""
      )
      .trim()
      .toLowerCase();


    const index =
      normalizedHeaders.indexOf(
        target
      );


    if (
      index !== -1
    ) {

      return index;

    }

  }


  return -1;

}



// ============================================================
// GET RAW CELL
// ============================================================

function getMatchingRawCell(
  headers,
  row,
  possibleNames
) {

  const index =
    getMatchingHeaderIndex(
      headers,
      possibleNames
    );


  if (
    index === -1 ||
    !Array.isArray(row)
  ) {

    return "";

  }


  return String(
    row[index] || ""
  ).trim();

}



// ============================================================
// CREATE NORMALIZED PROFILE
//
// Converts raw sheet row into a common object.
//
// IMPORTANT:
// This function does NOT decide whether profile matches.
// ============================================================


function normalizeMatchingCandidateProfile(
  headers,
  row,
  profileType
) {

  // ==========================================================
  // DEBUG
  // ==========================================================

  console.log(
    "AVAILABLE HEADERS:",
    JSON.stringify(
      headers,
      null,
      2
    )
  );

  console.log(
    "CANDIDATE RAW ROW:",
    JSON.stringify(
      row,
      null,
      2
    )
  );


  // ==========================================================
  // NORMALIZE PROFILE TYPE
  // ==========================================================

  profileType =
    normalizeMatchingProfileType(
      profileType
    );


  // ==========================================================
  // VALIDATION
  // ==========================================================

  if (
    !Array.isArray(headers) ||
    !Array.isArray(row)
  ) {

    return null;

  }


  // ==========================================================
  // BASIC PROFILE DATA
  // ==========================================================

  const id =
    getMatchingRawCell(
      headers,
      row,
      [
        "ID"
      ]
    );


  const name =
    getMatchingRawCell(
      headers,
      row,
      [
        "नाव :",
        "नाव",
        "Name",
        "name"
      ]
    );


  const mobile1 =
    getMatchingRawCell(
      headers,
      row,
      [
        "संपर्क क्रमांक १ :",
        "संपर्क क्रमांक १",
        "Contact Number 1",
        "Mobile",
        "Mobile Number"
      ]
    );


  const mobile2 =
    getMatchingRawCell(
      headers,
      row,
      [
        "संपर्क क्रमांक २ :",
        "संपर्क क्रमांक २",
        "Contact Number 2"
      ]
    );


      // ==========================================================
      // PROFILE PHOTO
      // ==========================================================
      //
      // IMPORTANT:
      // Use the SAME photo header names already used in the project.
      // Do NOT rename the Google Sheet photo column.
      // ==========================================================

      const photoRaw =
        getMatchingRawCell(
          headers,
          row,
          [
            "फोटो : (फोटो हा पासपोर्ट स्वरूपाचा असावा)",
            "फोटो :",
            "फोटो",
            "Photo :",
            "Photo",
            "Profile Photo",
            "Profile photo",
            "Photo URL",
            "Photo Url",
            "photo"
          ]
        );


      // ==========================================================
      // CONVERT PROFILE PHOTO URL
      // ==========================================================

      let photo =
        String(
          photoRaw || ""
        ).trim();


      if (
        photo &&
        typeof convertProfilePhotoUrl === "function"
      ) {

        try {

          const convertedPhoto =
            convertProfilePhotoUrl(
              photo
            );

          if (
            convertedPhoto &&
            String(
              convertedPhoto
            ).trim()
          ) {

            photo =
              String(
                convertedPhoto
              ).trim();

          }

        }
        catch (error) {

          console.warn(
            "Matching profile photo conversion failed:",
            error
          );

        }

      }


      // ==========================================================
      // PHOTO DEBUG
      // ==========================================================

      console.log(
        "MATCHING PHOTO:",
        JSON.stringify(
          {
            id:
              id,

            name:
              name,

            photoRaw:
              photoRaw,

            photo:
              photo
          },
          null,
          2
        )
      );


  // ==========================================================
  // DISTRICT
  // ==========================================================

  const districtRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "जिल्हा निवडा",
        "District",
        "district"
      ]
    );


  // ==========================================================
  // ADDRESS
  // ==========================================================

  const address =
    getMatchingRawCell(
      headers,
      row,
      [
        "कायमचा  पत्ता  :",
        "कायमचा पत्ता :",
        "कायमचा पत्ता",
        "Address"
      ]
    );


  // ==========================================================
  // EDUCATION
  // ==========================================================

  const educationRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "शिक्षण :",
        "शिक्षण",
        "Education",
        "education"
      ]
    );


  // ==========================================================
  // PROFESSION
  // ==========================================================

  const professionRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "नोकरी / व्यवसाय व ठिकाण",
        "Profession",
        "profession",
        "Occupation"
      ]
    );


  // ==========================================================
  // EXPECTATION
  // ==========================================================

  const expectationRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "अपेक्षा               (आपल्या अपेक्षा थोडक्यात नोंदवा)",
        "अपेक्षा (आपल्या अपेक्षा थोडक्यात नोंदवा)",
        "अपेक्षा",
        "Expectations"
      ]
    );


  // ==========================================================
  // AGE
  // ==========================================================

  const ageRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "वय :",
        "वय",
        "Age"
      ]
    );


  // ==========================================================
  // HEIGHT
  // ==========================================================

  const heightRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "ऊंची  :",
        "ऊंची :",
        "ऊंची",
        "Height"
      ]
    );


  // ==========================================================
  // INCOME
  // ==========================================================

  const incomeRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "मासिक उत्पन्न :",
        "मासिक उत्पन्न",
        "Monthly Income"
      ]
    );


  // ==========================================================
  // CASTE
  // ==========================================================

  const casteRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "पोट जात :",
        "पोट जात",
        "Caste",
        "Sub Caste"
      ]
    );


  // ==========================================================
  // RASHI
  // ==========================================================

  const rashiRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "रास  :",
        "रास :",
        "रास",
        "Rashi"
      ]
    );


  // ==========================================================
  // GENDER
  // ==========================================================

  const genderRaw =
    getMatchingRawCell(
      headers,
      row,
      [
        "वधू / वर",
        "Profile Type",
        "Gender"
      ]
    );




    // ==========================================================
    // PHOTO DEBUG
    // ==========================================================

    console.log(
        "MATCHING PHOTO:",
        JSON.stringify({
            id: id,
            name: name,
            photoRaw: photoRaw,
            photo: photo
        })
    );


  // ==========================================================
  // EDUCATION NORMALIZATION
  // ==========================================================

  let normalizedEducation = null;


  try {

    if (
      typeof normalizeMatchingEducation ===
      "function"
    ) {

      normalizedEducation =
        normalizeMatchingEducation(
          educationRaw
        );

    }

  }
  catch (error) {

    console.error(
      "Education normalization error:",
      error
    );

  }


  // ==========================================================
  // PROFESSION NORMALIZATION
  // ==========================================================

  let normalizedProfession = null;


  try {

    if (
      typeof normalizeProfession ===
      "function"
    ) {

      normalizedProfession =
        normalizeProfession(
          professionRaw
        );

    }

  }
  catch (error) {

    console.error(
      "Profession normalization error:",
      error
    );

  }


  // ==========================================================
  // AGE NORMALIZATION
  // ==========================================================

  let normalizedAge = null;


  try {

    if (
      typeof parseAge ===
      "function"
    ) {

      normalizedAge =
        parseAge(
          ageRaw
        );

    }
    else if (
      typeof normalizeAge ===
      "function"
    ) {

      normalizedAge =
        normalizeAge(
          ageRaw
        );

    }

  }
  catch (error) {

    console.error(
      "Age normalization error:",
      error
    );

  }


  // ==========================================================
  // HEIGHT NORMALIZATION
  // ==========================================================

  let normalizedHeight = null;


  try {

    if (
      typeof parseHeight ===
      "function"
    ) {

      normalizedHeight =
        parseHeight(
          heightRaw
        );

    }
    else if (
      typeof normalizeHeight ===
      "function"
    ) {

      normalizedHeight =
        normalizeHeight(
          heightRaw
        );

    }

  }
  catch (error) {

    console.error(
      "Height normalization error:",
      error
    );

  }


  // ==========================================================
  // INCOME NORMALIZATION
  // ==========================================================

  let normalizedIncome = null;


  try {

    if (
      typeof parseIncome ===
      "function"
    ) {

      normalizedIncome =
        parseIncome(
          incomeRaw
        );

    }

    else if (
      typeof normalizeIncome ===
      "function"
    ) {

      normalizedIncome =
        normalizeIncome(
          incomeRaw
        );

    }

  }
  catch (error) {

    console.error(
      "Income normalization error:",
      error
    );

  }


  // ==========================================================
  // STRUCTURED INCOME FOR MATCHING
  // ==========================================================

  const matchingIncome =
    parseMatchingIncomeRange(
      normalizedIncome
    );


  // ==========================================================
  // DISTRICT NORMALIZATION
  // ==========================================================

  let normalizedDistrict = null;


  try {

    const rawDistrict =
      String(
        districtRaw || ""
      ).trim();


    normalizedDistrict = {

      enabled:
        rawDistrict.length > 0,

      raw:
        rawDistrict,

      normalized:
        rawDistrict
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim()

    };

  }
  catch (error) {

    console.error(
      "District normalization error:",
      error
    );

  }


  // ==========================================================
  // CASTE NORMALIZATION
  // ==========================================================

  let normalizedCaste = null;


  try {

    const rawCaste =
      String(
        casteRaw || ""
      ).trim();


    normalizedCaste = {

      enabled:
        rawCaste.length > 0,

      raw:
        rawCaste,

      normalized:
        rawCaste
          .toLowerCase()
          .replace(/[-–—]/g, " ")
          .replace(/\s+/g, " ")
          .trim()

    };

  }
  catch (error) {

    console.error(
      "Caste normalization error:",
      error
    );

  }


  // ==========================================================
  // RASHI NORMALIZATION
  // ==========================================================

  let normalizedRashi = null;


  try {

    const rawRashi =
      String(
        rashiRaw || ""
      ).trim();


    normalizedRashi = {

      enabled:
        rawRashi.length > 0,

      raw:
        rawRashi,

      normalized:
        rawRashi
          .toLowerCase()
          .replace(/\s+/g, " ")
          .trim()

    };

  }
  catch (error) {

    console.error(
      "Rashi normalization error:",
      error
    );

  }


  // ==========================================================
  // EMPLOYMENT TYPE
  // ==========================================================

  let employmentType =
    "NOT_SPECIFIED";


  try {

    if (
      normalizedProfession &&
      normalizedProfession.employmentType
    ) {

      employmentType =
        normalizedProfession.employmentType;

    }

  }
  catch (error) {

    console.error(
      "Employment type error:",
      error
    );

  }


  // ==========================================================
  // BUILD ACTUAL PROFILE CRITERIA
  //
  // IMPORTANT:
  // These are the candidate's ACTUAL profile values.
  // They are NOT expectation criteria.
  // ==========================================================

    const actualProfileCriteria = {

      district:
        districtRaw || "",

      education:
        educationRaw || "",

      profession:
        professionRaw || "",

      employmentType:
        employmentType,

      caste:
        casteRaw || "",

      rashi:
        rashiRaw || "",

      age:
        normalizedAge,

      height:
        normalizedHeight,

      // Keep existing normalized income
      income:
        normalizedIncome,

      // Structured income for compatibility matching
      minIncome:
        matchingIncome.min,

      maxIncome:
        matchingIncome.max

    };


  // ==========================================================
  // DEBUG ACTUAL PROFILE CRITERIA
  // ==========================================================

  console.log(
    "🔴 ACTUAL PROFILE CRITERIA:",
    JSON.stringify(
      actualProfileCriteria,
      null,
      2
    )
  );


  // ==========================================================
  // PARSE EXPECTATION
  // ==========================================================

  let parsedExpectation = null;


  try {

    parsedExpectation =
      parseExpectationCriteria(
        expectationRaw
      );

  }
  catch (error) {

    console.error(
      "Expectation parsing error:",
      error
    );

  }


  // ==========================================================
  // FINAL NORMALIZED PROFILE
  // ==========================================================

  return {

    // ========================================================
    // BASIC
    // ========================================================

    id:
        id,

    type:
        profileType,

    rawType:
        genderRaw,

    name:
        name,

    mobile1:
        mobile1,

    mobile2:
        mobile2,


    // ========================================================
    // LOCATION
    // ========================================================

    district:
         normalizedDistrict,

    address:
        address,


    // ========================================================
    // BASIC DETAILS
    // ========================================================

    ageRaw:
        ageRaw,

    heightRaw:
        heightRaw,

    incomeRaw:
        incomeRaw,

    casteRaw:
        casteRaw,

    rashiRaw:
        rashiRaw,



    // ========================================================
    // ACTUAL PROFILE CRITERIA
    // ========================================================

    actualProfileCriteria:
        actualProfileCriteria,

    // ========================================================
    // EDUCATION / PROFESSION
    // ========================================================

    educationRaw:
        educationRaw,

    professionRaw:
        professionRaw,

    expectationRaw:
        expectationRaw,

    education:
        normalizedEducation,

    profession:
        normalizedProfession,




    // ========================================================
    // ⭐ PROFILE PHOTO
    // ========================================================

    photoRaw:
        photoRaw,

    photo:
        photo,


    // ========================================================
    // SOURCE ROW
    // ========================================================

    sourceRow:
        row

  };

}


// ============================================================
// LOAD NORMALIZED CANDIDATES
//
// Repository -> Controller -> Normalized Profiles
// ============================================================

function getNormalizedMatchingCandidates(
  candidateType
) {

  try {

    candidateType =
      normalizeMatchingProfileType(
        candidateType
      );


    if (!candidateType) {

      return {

        success: false,

        code:
          "INVALID_CANDIDATE_TYPE",

        message:
          "Invalid candidate profile type.",

        profiles: []

      };

    }


    // --------------------------------------------------------
    // LOAD RAW DATA FROM REPOSITORY
    // --------------------------------------------------------

    const repositoryResult =
      getMatchingRawProfileData(
        candidateType
      );


    if (
      !repositoryResult ||
      !repositoryResult.success
    ) {

      return {

        success: false,

        code:
          "CANDIDATE_DATA_LOAD_FAILED",

        message:
          "Unable to load candidate profiles.",

        profiles: []

      };

    }


    const headers =
      repositoryResult.headers || [];


    const rows =
      repositoryResult.rows || [];


    const profiles = [];


    // --------------------------------------------------------
    // NORMALIZE EVERY PROFILE
    // --------------------------------------------------------

    rows.forEach(
      function(row) {

        const profile =
          normalizeMatchingCandidateProfile(
            headers,
            row,
            candidateType
          );


        if (
          profile
        ) {

          profiles.push(
            profile
          );

        }

      }
    );


    return {

      success: true,

      profileType:
        candidateType,

      sheetName:
        repositoryResult.sheetName,

      count:
        profiles.length,

      profiles:
        profiles

    };

  }


  catch (error) {

    console.error(
      "getNormalizedMatchingCandidates Error:",
      error
    );


    return {

      success: false,

      code:
        "MATCHING_CONTROLLER_ERROR",

      message:
        "Unable to prepare matching candidates.",

      profiles: [],

      error:
        error.message || ""

    };

  }

}



// ============================================================
// GET ALL NORMALIZED CANDIDATES
// ============================================================

function getAllNormalizedMatchingCandidates(
  profileTypes
) {

  try {

    if (
      !Array.isArray(
        profileTypes
      ) ||
      profileTypes.length === 0
    ) {

      profileTypes = [

        "bride",

        "groom",

        "other"

      ];

    }


    const allProfiles = [];


    profileTypes.forEach(
      function(profileType) {

        const result =
          getNormalizedMatchingCandidates(
            profileType
          );


        if (
          result &&
          result.success &&
          Array.isArray(
            result.profiles
          )
        ) {

          result.profiles.forEach(
            function(profile) {

              allProfiles.push(
                profile
              );

            }
          );

        }

      }
    );


    return {

      success: true,

      count:
        allProfiles.length,

      profiles:
        allProfiles

    };

  }


  catch (error) {

    console.error(
      "getAllNormalizedMatchingCandidates Error:",
      error
    );


    return {

      success: false,

      count: 0,

      profiles: [],

      error:
        error.message || ""

    };

  }

}



// ============================================================
// GET MATCHING CANDIDATES FOR VIEWER
//
// This is the main controller entry point.
//
// Example:
//
// getMatchingCandidatesForViewer(
//   "groom"
// )
//
// returns bride profiles.
//
// NOTE:
// This function currently prepares normalized candidates.
// Actual matching criteria are applied separately.
// ============================================================

function getMatchingCandidatesForViewer(
  viewerProfileType
) {

  try {

    viewerProfileType =
      normalizeMatchingProfileType(
        viewerProfileType
      );


    if (!viewerProfileType) {

      return {

        success: false,

        code:
          "INVALID_VIEWER_PROFILE_TYPE",

        message:
          "Invalid viewer profile type.",

        profiles: []

      };

    }


    const candidateType =
      getOppositeMatchingProfileType(
        viewerProfileType
      );


    if (!candidateType) {

      return {

        success: false,

        code:
          "CANDIDATE_TYPE_NOT_RESOLVED",

        message:
          "Unable to resolve candidate profile type.",

        profiles: []

      };

    }


    const result =
      getNormalizedMatchingCandidates(
        candidateType
      );


    if (
      !result ||
      !result.success
    ) {

      return {

        success: false,

        code:
          "MATCHING_CANDIDATE_LOAD_FAILED",

        message:
          "Unable to load matching candidates.",

        profiles: []

      };

    }


    return {

      success: true,

      viewerProfileType:
        viewerProfileType,

      candidateProfileType:
        candidateType,

      count:
        result.profiles.length,

      profiles:
        result.profiles

    };

  }


  catch (error) {

    console.error(
      "getMatchingCandidatesForViewer Error:",
      error
    );


    return {

      success: false,

      code:
        "MATCHING_CONTROLLER_ERROR",

      message:
        "Unable to get matching candidates.",

      profiles: [],

      error:
        error.message || ""

    };

  }

}



// ============================================================
// DEBUG PROFILE
// ============================================================

function getMatchingProfileDebugInfo(
  profileType,
  index
) {

  const result =
    getNormalizedMatchingCandidates(
      profileType
    );


  if (
    !result ||
    !result.success
  ) {

    return result;

  }


  index =
    Number(index);


  if (
    isNaN(index) ||
    index < 0 ||
    index >= result.profiles.length
  ) {

    index = 0;

  }


  const profile =
    result.profiles[index];


  return {

    success: true,

    index:
      index,

    profile:
      profile

  };

}



// ============================================================
// TEST CONTROLLER
// ============================================================

function testMatchingController() {

  const result =
    getMatchingCandidatesForViewer(
      "groom"
    );


  console.log(
    JSON.stringify(
      {

        success:
          result.success,

        viewerProfileType:
          result.viewerProfileType,

        candidateProfileType:
          result.candidateProfileType,

        count:
          result.count,

        firstProfile:
          result.profiles &&
          result.profiles.length > 0
            ? result.profiles[0]
            : null

      },
      null,
      2
    )
  );


  return result;

}




function testMatchingPhoto() {

  const result =
    getNormalizedMatchingCandidates(
      "bride"
    );


  if (
    !result ||
    !result.success
  ) {

    console.log(
      "Matching candidates failed:",
      result
    );

    return;

  }


  const profiles =
    result.profiles || [];


  console.log(
    "======================================"
  );

  console.log(
    "MATCHING PHOTO TEST"
  );

  console.log(
    "======================================"
  );


  profiles
    .slice(0, 10)
    .forEach(
      function(profile) {

        console.log(
          JSON.stringify(
            {
              id:
                profile.id,

              name:
                profile.name,

              photoRaw:
                profile.photoRaw,

              photo:
                profile.photo
            },
            null,
            2
          )
        );

      }
    );


  return profiles.slice(
    0,
    10
  );

}


// ============================================================
// TEST PROFESSION IN CONTROLLER
// ============================================================

function testMatchingControllerProfession() {

  const result =
    getNormalizedMatchingCandidates(
      "groom"
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


  const profiles =
    result.profiles || [];


  const output =
    profiles
      .slice(0, 10)
      .map(
        function(profile) {

          return {

            id:
              profile.id,

            name:
              profile.name,

            professionRaw:
              profile.professionRaw,

            profession:
              profile.profession

          };

        }
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


// ============================================================
// GET VIEWER PROFILE BY ID
// ============================================================

function getMatchingViewerProfile(
  viewerId,
  viewerType
) {

  try {

    viewerId =
      String(
        viewerId || ""
      ).trim();

    viewerType =
      normalizeMatchingProfileType(
        viewerType
      );


    if (!viewerId) {

      return {

        success: false,

        code:
          "VIEWER_ID_REQUIRED",

        message:
          "Viewer ID is required."

      };

    }


    if (!viewerType) {

      return {

        success: false,

        code:
          "INVALID_VIEWER_TYPE",

        message:
          "Invalid viewer profile type."

      };

    }


    // ----------------------------------------------------------
    // LOAD VIEWER SHEET
    // ----------------------------------------------------------

    const repositoryResult =
      getMatchingRawProfileData(
        viewerType
      );


    if (
      !repositoryResult ||
      !repositoryResult.success
    ) {

      return {

        success: false,

        code:
          "VIEWER_DATA_LOAD_FAILED",

        message:
          "Unable to load viewer profile."

      };

    }


    const headers =
      repositoryResult.headers || [];

    const rows =
      repositoryResult.rows || [];


    // ----------------------------------------------------------
    // FIND VIEWER
    // ----------------------------------------------------------

    let viewerProfile =
      null;


    for (
      let i = 0;
      i < rows.length;
      i++
    ) {

      const row =
        rows[i];


      const id =
        getMatchingRawCell(
          headers,
          row,
          [
            "ID"
          ]
        );


      if (
        String(id).trim() ===
        viewerId
      ) {

        viewerProfile =
          normalizeMatchingCandidateProfile(
            headers,
            row,
            viewerType
          );

        break;

      }

    }


    // ----------------------------------------------------------
    // VIEWER NOT FOUND
    // ----------------------------------------------------------

    if (!viewerProfile) {

      return {

        success: false,

        code:
          "VIEWER_NOT_FOUND",

        message:
          "Viewer profile not found.",

        id:
          viewerId,

        type:
          viewerType

      };

    }


    // ----------------------------------------------------------
    // RETURN VIEWER
    // ----------------------------------------------------------

      return {

        success: true,

        id:
          viewerProfile.id,

        name:
          viewerProfile.name,

        type:
          viewerProfile.type,

        expectation:
          viewerProfile.expectationRaw || "",

        profile:
          viewerProfile,

        actualProfileCriteria:
          viewerProfile.actualProfileCriteria || {}

      };

  }


  catch (error) {

    console.error(
      "getMatchingViewerProfile Error:",
      error
    );


    return {

      success: false,

      code:
        "VIEWER_PROFILE_ERROR",

      message:
        "Unable to load viewer profile.",

      error:
        error.message || ""

    };

  }

}


// ============================================================
// TEST REAL MATCHING V3
//
// VIEWER:
//   ID001
//   groom
//
// CANDIDATES:
//   groom -> bride
//   bride -> groom
//   other -> other
//
// FLOW:
//   Viewer
//      ↓
//   Expectation
//      ↓
//   ExpectationCriteriaParser
//      ↓
//   Opposite Candidate Type
//      ↓
//   MatchingController
//      ↓
//   MatchingEngine
//      ↓
//   MATCH / NOT_MATCH
// ============================================================

function testRealProfileMatchingV3() {

  const viewerId = "ID628";

  const viewerType = "bride";


  // ==========================================================
  // 1. LOAD VIEWER
  // ==========================================================

  const viewer =
    getMatchingViewerProfile(
      viewerId,
      viewerType
    );


  if (
    !viewer ||
    !viewer.success
  ) {

    console.log(
      JSON.stringify(
        viewer,
        null,
        2
      )
    );

    return viewer;

  }


  // ==========================================================
  // 2. GET EXPECTATION
  // ==========================================================

  const expectation =
    viewer.expectation || "";


  // ==========================================================
  // 3. PARSE EXPECTATION
  // ==========================================================

  const criteria =
    parseExpectationCriteria(
      expectation
    );


  if (!criteria) {

    return {

      success:
        false,

      code:
        "EXPECTATION_CRITERIA_FAILED",

      message:
        "Unable to parse expectation criteria."

    };

  }


  // ==========================================================
  // 4. RESOLVE CANDIDATE TYPE
  //
  // groom -> bride
  // bride -> groom
  // other -> other
  // ==========================================================

  const candidateType =
    getOppositeMatchingProfileType(
      viewerType
    );


  if (!candidateType) {

    return {

      success:
        false,

      code:
        "CANDIDATE_TYPE_NOT_RESOLVED",

      message:
        "Unable to resolve candidate profile type.",

      viewerType:
        viewerType

    };

  }


  // ==========================================================
  // 5. LOAD CORRECT CANDIDATES
  // ==========================================================

  const candidateResult =
    getNormalizedMatchingCandidates(
      candidateType
    );


  if (
    !candidateResult ||
    !candidateResult.success
  ) {

    console.log(
      JSON.stringify(
        candidateResult,
        null,
        2
      )
    );

    return candidateResult;

  }


  const profiles =
    candidateResult.profiles || [];


  // ==========================================================
  // 6. MATCH EVERY CANDIDATE
  // ==========================================================

  const matchedProfiles = [];

  const rejectedProfiles = [];


  profiles.forEach(
    function(profile) {

      try {

        const result =
          evaluateCandidateMatch(
            profile,
            criteria
          );


        const item = {

          id:
            profile.id || "",

          name:
            profile.name || "",

          type:
            profile.type || "",

          district:
            profile.district || "",

          ageRaw:
            profile.ageRaw || "",

          heightRaw:
            profile.heightRaw || "",

          incomeRaw:
            profile.incomeRaw || "",

          educationRaw:
            profile.educationRaw || "",

          professionRaw:
            profile.professionRaw || "",

          education:
            profile.education || null,

          profession:
            profile.profession || null,

          matchingResult:
            result

        };


        // ------------------------------------------------------
        // MATCH
        // ------------------------------------------------------

        if (
          result &&
          result.matched === true
        ) {

          matchedProfiles.push(
            item
          );

        }


        // ------------------------------------------------------
        // NOT MATCH
        // ------------------------------------------------------

        else {

          rejectedProfiles.push(
            item
          );

        }

      }


      catch (error) {

        rejectedProfiles.push({

          id:
            profile.id || "",

          name:
            profile.name || "",

          type:
            profile.type || "",

          matchingResult: {

            result:
              "NOT_MATCH",

            matched:
              false,

            failedCriteria: [

              "ENGINE_ERROR"

            ],

            error:
              error.message || ""

          }

        });

      }

    }
  );



      // ============================================================
      // FINAL RANKING
      // ============================================================

      matchedProfiles.sort(
        function(a, b) {

          const aResult =
            a.matchingResult || {};

          const bResult =
            b.matchingResult || {};


          // --------------------------------------------------------
          // 1. Soft match percentage
          // --------------------------------------------------------

          const aPercentage =
            Number(
              aResult.softMatchPercentage || 0
            );

          const bPercentage =
            Number(
              bResult.softMatchPercentage || 0
            );


          if (
            bPercentage !==
            aPercentage
          ) {

            return (
              bPercentage -
              aPercentage
            );

          }


          // --------------------------------------------------------
          // 2. Data coverage
          // --------------------------------------------------------

          const aCoverage =
            Number(
              aResult.softDataCoverage || 0
            );

          const bCoverage =
            Number(
              bResult.softDataCoverage || 0
            );


          if (
            bCoverage !==
            aCoverage
          ) {

            return (
              bCoverage -
              aCoverage
            );

          }


          // --------------------------------------------------------
          // 3. Number of matched preferences
          // --------------------------------------------------------

          const aMatched =
            Number(
              aResult
                .softPreferenceScore
                ?.matchedPreferences || 0
            );

          const bMatched =
            Number(
              bResult
                .softPreferenceScore
                ?.matchedPreferences || 0
            );


          return (
            bMatched -
            aMatched
          );

        }
      );


  // ==========================================================
  // 7. FINAL OUTPUT
  // ==========================================================

  const output = {

    success:
      true,


    viewer: {

      id:
        viewer.id || viewerId,

      name:
        viewer.name || "",

      type:
        viewer.type || viewerType,

      expectation:
        expectation

    },


    expectationCriteria:
      criteria,


    candidateProfileType:
      candidateType,


    candidatesLoaded:
      profiles.length,


    matchingResult: {

      total:
        profiles.length,

      matched:
        matchedProfiles.length,

      rejected:
        rejectedProfiles.length

    },


    matchedProfiles:
      matchedProfiles,


    rejectedProfiles:
      rejectedProfiles

  };


  // ==========================================================
  // 8. SAFE LOG
  //
  // DO NOT PRINT ALL 241 PROFILES.
  // Apps Script has log-size limits.
  // ==========================================================

  console.log(
    JSON.stringify(
      {

        success:
          output.success,


        viewer:
          output.viewer,


        candidateProfileType:
          output.candidateProfileType,


        expectationCriteria:
          output.expectationCriteria,


        candidatesLoaded:
          output.candidatesLoaded,


        matchingResult:
          output.matchingResult,


        // ----------------------------------------------
        // First 3 MATCHES
        // ----------------------------------------------

            firstMatchedProfiles:
            matchedProfiles
              .slice(0, 10)
              .map(function(profile, index) {

                return {

                  rank:
                    index + 1,

                  id:
                    profile.id,

                  name:
                    profile.name,

                  hardMatch:
                    profile.matchingResult.matched,

                  softScore:
                    profile.matchingResult.softScore,

                  maxSoftScore:
                    profile.matchingResult.maxSoftScore,

                  softMatchPercentage:
                    profile.matchingResult.softMatchPercentage,

                  softDataCoverage:
                    profile.matchingResult.softDataCoverage,

                  matchedPreferences:
                    profile.matchingResult
                      .softPreferenceScore
                      .matchedPreferences,

                  knownPreferences:
                    profile.matchingResult
                      .softPreferenceScore
                      .knownPreferences

                };

              }),

        firstRejectedProfiles:
          rejectedProfiles
            .slice(0, 3)
            .map(function(profile) {

              return {

                id:
                  profile.id,

                name:
                  profile.name,

                matched:
                  profile.matchingResult.matched,

                applicableCriteria:
                  profile.matchingResult.applicableCriteria,

                matchedCriteria:
                  profile.matchingResult.matchedCriteria,

                failedCriteria:
                  profile.matchingResult.failedCriteria

              };

            })

      },
      null,
      2
    )
  );

      // ============================================================
      // RANK MATCHED PROFILES
      // ============================================================

      matchedProfiles.sort(
        function(a, b) {

          const aResult =
            a.matchingResult || {};

          const bResult =
            b.matchingResult || {};


          const aScore =
            Number(
              aResult.softMatchPercentage || 0
            );

          const bScore =
            Number(
              bResult.softMatchPercentage || 0
            );


          // First: Match percentage
          if (
            bScore !== aScore
          ) {

            return bScore - aScore;

          }


          // Second: Data coverage
          const aCoverage =
            Number(
              aResult.softDataCoverage || 0
            );

          const bCoverage =
            Number(
              bResult.softDataCoverage || 0
            );


          return bCoverage - aCoverage;

        }
      );


  return output;

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