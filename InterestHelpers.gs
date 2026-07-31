// ==========================================
// GET PROFILE INTEREST SHEET
// ==========================================

function getProfileInterestSheet() {

  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();


  const sheet =
    ss.getSheetByName(
      INTEREST_CONFIG.SHEET_NAME
    );


  if (!sheet) {

    throw new Error(
      'Sheet "' +
      INTEREST_CONFIG.SHEET_NAME +
      '" not found.'
    );

  }


  return sheet;

}


// ==========================================
// NORMALIZE INTEREST PROFILE TYPE
// ==========================================

function normalizeInterestProfileType(
  type
) {

  type =
    String(type || "")
      .trim()
      .toLowerCase();


  if (
    type === "bride" ||
    type === "वधू"
  ) {

    return "bride";

  }


  if (
    type === "groom" ||
    type === "वर"
  ) {

    return "groom";

  }


  if (
    type === "other" ||
    type === "इतर"
  ) {

    return "other";

  }


  return "";

}


// ==========================================
// GENERATE INTEREST ID
// ==========================================

function generateInterestId() {

  const sheet =
    getProfileInterestSheet();


  const lastRow =
    sheet.getLastRow();


  const nextNumber =
    Math.max(
      1,
      lastRow
    );


  return (
    "INT" +
    Utilities.formatString(
      "%06d",
      nextNumber
    )
  );

}




// ==========================================
// FIND REGISTERED PROFILE BY MOBILE
// ==========================================

function findInterestUserProfile(userMobile) {

  // ========================================
  // NORMALIZE MOBILE
  // ========================================

  userMobile =
    String(userMobile || "")
      .replace(/\D/g, "")
      .slice(-10);

  if (!userMobile) {

    return null;

  }

  // ========================================
  // CHECK CACHE
  // ========================================

  const cacheKey =
    CACHE_KEYS.USER_PROFILE + userMobile;

  const cachedUser =
    getCache(cacheKey);

  if (cachedUser) {

    console.log(
      "USER PROFILE CACHE HIT:",
      userMobile
    );

    return cachedUser;

  }

  console.log(
    "USER PROFILE CACHE MISS:",
    userMobile
  );


  // ========================================
  // PROFILE SHEETS
  // ========================================

  const profileSheets = [

    {
      type: "bride",
      sheetName: "वधू"
    },

    {
      type: "groom",
      sheetName: "वर"
    },

    {
      type: "other",
      sheetName: "इतर"
    }

  ];

  // ========================================
  // LOOP SHEETS
  // ========================================

  for (let s = 0; s < profileSheets.length; s++) {

    const config =
      profileSheets[s];

    const data =
      getProfileSheetData(
        config.sheetName
      );

      if (
        !data ||
        data.length < 2
      ) {

        continue;

      }

    // ======================================
    // HEADERS
    // ======================================

    const headers =
        getProfileHeaders(
            config.sheetName
        );

      const {
            idIndex,
            nameIndex,
            mobile1Index,
            mobile2Index
        } =
            getProfileHeaderIndexes(
                config.sheetName
            );

    if (

      idIndex === -1 ||

      (
        mobile1Index === -1 &&
        mobile2Index === -1
      )

    ) {

      continue;

    }

    // ======================================
    // SEARCH ROWS
    // ======================================

    for (let i = 1; i < data.length; i++) {

      const row =
        data[i];

      const mobile1 =
        mobile1Index !== -1

          ? String(
              getProfileCell(
                row,
                mobile1Index
              ) || ""
            )
            .replace(/\D/g, "")
            .slice(-10)

          : "";

      const mobile2 =
        mobile2Index !== -1

          ? String(
              getProfileCell(
                row,
                mobile2Index
              ) || ""
            )
            .replace(/\D/g, "")
            .slice(-10)

          : "";

      if (

        mobile1 !== userMobile &&
        mobile2 !== userMobile

      ) {

        continue;

      }

      // ======================================
      // PROFILE FOUND
      // ======================================

      const result = {

        found: true,

        type:
          config.type,

        sheetName:
          config.sheetName,

        id:
          String(
            getProfileCell(
              row,
              idIndex
            ) || ""
          ).trim(),

        name:
          String(
            getProfileCell(
              row,
              nameIndex
            ) || ""
          ).trim(),

        mobile:
          userMobile,

        matchedContact:
          mobile1 === userMobile
            ? "संपर्क क्रमांक १"
            : "संपर्क क्रमांक २"

      };

      // ======================================
      // SAVE CACHE
      // ======================================

      setCache(

        cacheKey,

        result,

        CACHE_TIME.PROFILE

      );

      return result;

    }

  }

  // ========================================
  // PROFILE NOT FOUND
  // ========================================

  return null;

}


// ==========================================
// FIND INTEREST TARGET PROFILE
// BY PROFILE TYPE + PROFILE ID
// ==========================================

function findInterestTargetProfile(
  profileType,
  profileId
) {

  profileType =
    normalizeInterestProfileType(
      profileType
    );


  profileId =
    String(profileId || "")
      .trim();


  if (
    !profileType ||
    !profileId
  ) {

    return null;

  }


      const sheetName =
          INTEREST_CONFIG
            .PROFILE_SHEETS[
              profileType
            ];

      if (!sheetName) {

          return null;

      }

      const data =
          getProfileSheetData(
              sheetName
          );

      if (
          !data ||
          data.length < 2
      ) {

          return null;

      }


  // ========================================
  // HEADERS
  // ========================================

  const headers =
      getProfileHeaders(
          sheetName
      );


    const {
            idIndex,
            nameIndex,
            mobile1Index,
            mobile2Index
        } =
            getProfileHeaderIndexes(
                sheetName
            );



          if (
            idIndex === -1
          ) {

            return null;

          }


  // ========================================
  // FIND PROFILE
  // ========================================

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row =
      data[i];


    const rowId =
      String(
        getProfileCell(
          row,
          idIndex
        ) || ""
      ).trim();


    if (
      rowId !== profileId
    ) {

      continue;

    }


    // ======================================
    // CONTACT NUMBERS
    // ======================================

    const mobile1 =
      mobile1Index !== -1

        ? String(
            getProfileCell(
              row,
              mobile1Index
            ) || ""
          )
          .replace(/\D/g, "")
          .slice(-10)

        : "";


    const mobile2 =
      mobile2Index !== -1

        ? String(
            getProfileCell(
              row,
              mobile2Index
            ) || ""
          )
          .replace(/\D/g, "")
          .slice(-10)

        : "";


    // Prefer Contact Number 1
    const receiverMobile =
      mobile1 || mobile2;


    return {

      found:
        true,

      type:
        profileType,

      sheetName:
        sheetName,

      id:
        rowId,

      name:
        String(
          getProfileCell(
            row,
            nameIndex
          ) || ""
        ).trim(),

      mobile:
        receiverMobile

    };

  }


  return null;

}



// ==========================================
// GET INTEREST RELATIONSHIP
// ==========================================

function getInterestRelationship(
  userMobile,
  targetProfileType,
  targetProfileId
) {

  try {

    // ========================================
    // NORMALIZE INPUT
    // ========================================

    userMobile =
      String(userMobile || "")
        .replace(/\D/g, "")
        .slice(-10);


    targetProfileType =
      String(targetProfileType || "")
        .trim()
        .toLowerCase();


    targetProfileId =
      String(targetProfileId || "")
        .trim();


    // ========================================
    // DEFAULT RESPONSE
    // ========================================

    const noRelationship = {

      exists: false,

      status: "NONE",

      direction: "NONE",

      interestId: "",

      canSendInterest: true,

      canViewContact: false

    };


    if (
      !userMobile ||
      !targetProfileType ||
      !targetProfileId
    ) {

      return noRelationship;

    }


    // ========================================
    // GET INTEREST SHEET
    // ========================================

    const sheet =
      getProfileInterestSheet();


    if (!sheet) {

      return noRelationship;

    }


    const data =
      sheet
        .getDataRange()
        .getDisplayValues();


    // ========================================
    // FIND RELATIONSHIP
    // ========================================

    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      // Sender
      const senderMobile =
        String(
          data[i][2] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      const senderType =
        String(
          data[i][5] || ""
        )
        .trim()
        .toLowerCase();


      const senderId =
        String(
          data[i][6] || ""
        ).trim();


      // Receiver
      const receiverMobile =
        String(
          data[i][7] || ""
        )
        .replace(/\D/g, "")
        .slice(-10);


      const receiverType =
        String(
          data[i][10] || ""
        )
        .trim()
        .toLowerCase();


      const receiverId =
        String(
          data[i][11] || ""
        ).trim();


      // Status
      const status =
        String(
          data[i][12] || ""
        )
        .trim()
        .toUpperCase();


      const interestId =
        String(
          data[i][1] || ""
        ).trim();


      // ======================================
      // CURRENT USER SENT TO TARGET
      // ======================================

      if (
        senderMobile === userMobile &&
        receiverType === targetProfileType &&
        receiverId === targetProfileId
      ) {

        if (status === "PENDING") {

          return {

            exists: true,

            status: "PENDING_SENT",

            direction: "SENT",

            interestId:
              interestId,

            canSendInterest: false,

            canViewContact: false

          };

        }


        if (status === "ACCEPTED") {

          return {

            exists: true,

            status: "ACCEPTED",

            direction: "SENT",

            interestId:
              interestId,

            canSendInterest: false,

            canViewContact: true

          };

        }


        if (status === "DECLINED") {

          return {

            exists: true,

            status: "DECLINED",

            direction: "SENT",

            interestId:
              interestId,

            canSendInterest: false,

            canViewContact: false

          };

        }

      }


      // ======================================
      // TARGET SENT TO CURRENT USER
      // ======================================

      if (
        receiverMobile === userMobile &&
        senderType === targetProfileType &&
        senderId === targetProfileId
      ) {

        if (status === "PENDING") {

          return {

            exists: true,

            status: "PENDING_RECEIVED",

            direction: "RECEIVED",

            interestId:
              interestId,

            canSendInterest: false,

            canViewContact: false

          };

        }


        if (status === "ACCEPTED") {

          return {

            exists: true,

            status: "ACCEPTED",

            direction: "RECEIVED",

            interestId:
              interestId,

            canSendInterest: false,

            canViewContact: true

          };

        }


        if (status === "DECLINED") {

          return {

            exists: true,

            status: "DECLINED",

            direction: "RECEIVED",

            interestId:
              interestId,

            canSendInterest: false,

            canViewContact: false

          };

        }

      }

    }


    return noRelationship;

  }


  catch (error) {

    console.error(
      "getInterestRelationship Error:",
      error
    );


    return {

      exists: false,

      status: "NONE",

      direction: "NONE",

      interestId: "",

      canSendInterest: true,

      canViewContact: false

    };

  }

}
