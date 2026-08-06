function getLikedProfileIds(userMobile) {

  userMobile =
    String(userMobile || "")
      .trim();

  if (!userMobile) {
    return [];
  }


  const ss =
    SpreadsheetApp
      .getActiveSpreadsheet();

  const sheet =
    ss.getSheetByName(
      "Profile Reactions"
    );

  if (!sheet) {
    return [];
  }


  const data =
    sheet
      .getDataRange()
      .getDisplayValues();


  const liked = [];

  const validTypes = [
    "bride",
    "groom",
    "other"
  ];

  const seen =
    new Set();


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const rowMobile =
      String(
        data[i][1] || ""
      ).trim();


    const profileType =
        String(data[i][6] || "")
            .trim()
            .toLowerCase();

    const profileId =
        String(data[i][7] || "")
            .trim();

    const reaction =
        String(data[i][9] || "")
            .trim()
            .toUpperCase();


    // Different user
    if (
      rowMobile !== userMobile
    ) {
      continue;
    }


    // Only LIKE
    if (
      reaction !== "LIKE"
    ) {
      continue;
    }


    // Ignore old invalid rows
    if (
      !validTypes.includes(
        profileType
      )
    ) {
      continue;
    }


    if (!profileId) {
      continue;
    }


    // Prevent duplicate profiles
    const key =
      profileType +
      "_" +
      profileId;


    if (seen.has(key)) {
      continue;
    }


    seen.add(key);


    liked.push({

      type:
        profileType,

      id:
        profileId

    });

  }


  return liked;

}


function testLikedIds() {

  Logger.log(

    JSON.stringify(

      getLikedProfileIds(

        "8975593689"

      ),

      null,

      2

    )

  );

}


function getLikedProfiles(userMobile) {

  currentProfileScreen = "LIKED";

  try {

    userMobile = normalizeMobile(userMobile);

    if (!userMobile) {

      return {
        success: false,
        message: "Mobile number is required.",
        totalCount: 0,
        profiles: []
      };

    }

    const likedItems = getLikedProfileIds(userMobile);

    if (!likedItems.length) {

      return {
        success: true,
        totalCount: 0,
        profiles: []
      };

    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sheetMap = {
      bride: "वधू",
      groom: "वर",
      other: "इतर"
    };

    const profiles = [];

    likedItems.forEach(function(item) {

      const profileType =
        String(item.type || "")
          .trim()
          .toLowerCase();

      const profileId =
        String(item.id || "")
          .trim();

      const sheetName =
        sheetMap[profileType];

      if (!sheetName || !profileId) {
        return;
      }

      const sheet =
        ss.getSheetByName(sheetName);

      if (!sheet) {
        return;
      }

      const data =
        sheet.getDataRange().getDisplayValues();

      if (data.length < 2) {
        return;
      }

      const headers =
        data[0].map(function(h) {
          return normalizeHeader(h);
        });

      const idIndex =
        findProfileHeader(headers, "ID");

      const nameIndex =
        findProfileHeader(headers, "नाव :");

      const districtIndex =
        findProfileHeader(headers, "जिल्हा निवडा");

      const educationIndex =
        findProfileHeader(headers, "शिक्षण :");

      const ageIndex =
        findProfileHeader(headers, "वय :");

      const heightIndex =
        findProfileHeader(headers, "ऊंची :");

      const casteIndex =
        findProfileHeader(headers, "पोट जात :");

      const jobIndex =
        findProfileHeader(headers, "नोकरी / व्यवसाय व ठिकाण");

      const incomeIndex =
        findProfileHeader(headers, "मासिक उत्पन्न :");

      const photoIndex =
        findProfileHeader(
          headers,
          "फोटो : (फोटो हा पासपोर्ट स्वरूपाचा असावा)"
        );

      const mobileIndex =
        findProfileHeader(
          headers,
          "संपर्क क्रमांक १ : "
        );

      if (idIndex === -1) {
        return;
      }

      for (let i = 1; i < data.length; i++) {

        const row = data[i];

        const rowId =
          String(
            getProfileCell(
              row,
              idIndex
            ) || ""
          ).trim();

        if (rowId !== profileId) {
          continue;
        }

        const ownerMobile =
          normalizeMobile(
            getProfileCell(
              row,
              mobileIndex
            )
          );

        const relationship =
          getRelationshipStatus(
            userMobile,
            ownerMobile
          );

        profiles.push({

          type: profileType,

          id: rowId,

          name:
            getProfileCell(row, nameIndex),

          district:
            getProfileCell(row, districtIndex),

          education:
            getProfileCell(row, educationIndex),

          age:
            getProfileCell(row, ageIndex),

          height:
            getProfileCell(row, heightIndex),

          caste:
            getProfileCell(row, casteIndex),

          job:
            getProfileCell(row, jobIndex),

          income:
            getProfileCell(row, incomeIndex),

          photo:
            convertProfilePhotoUrl(
              getProfileCell(row, photoIndex)
            ),

          ownerMobile:
            ownerMobile,

          relationship:
            relationship,

          reaction:
            "LIKE"

        });

        break;

      }

    });

    return {

      success: true,

      totalCount: profiles.length,

      profiles: profiles

    };

  }

  catch (error) {

    console.error(
      "getLikedProfiles Error:",
      error
    );

    return {

      success: false,

      message: error.message,

      totalCount: 0,

      profiles: []

    };

  }

}