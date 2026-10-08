// ==========================================================
// FILE : PhotoDebug.gs
// PURPOSE : Debug profile photo URLs returned by Search
//
// IMPORTANT:
// - Does NOT modify searchProfiles()
// - Does NOT modify profile data
// - Does NOT write to any Sheet
// - Debug only
// ==========================================================

function debugSearchPhotoUrls() {

  try {

    const result =
      searchProfiles(
        "bride",
        "all",
        "all",
        "all",
        1,
        ""
      );

    console.log(
      "========== PHOTO DEBUG START =========="
    );

    console.log(
      "Search success:",
      result && result.success
    );

    console.log(
      "Total profiles:",
      result && result.totalCount
    );

    if (
      !result ||
      !result.profiles ||
      !result.profiles.length
    ) {

      console.warn(
        "No profiles returned from search."
      );

      return result;
    }

    result.profiles.forEach(
      function(profile, index) {

        console.log(
          "PROFILE #" + (index + 1),
          {
            id: profile.id,
            name: profile.name,
            type: profile.type,
            ownerMobile: profile.ownerMobile,
            photo: profile.photo
          }
        );

      }
    );

    console.log(
      "========== PHOTO DEBUG END =========="
    );

    return result;

  } catch (error) {

    console.error(
      "PHOTO DEBUG ERROR:",
      error
    );

    return {
      success: false,
      error: String(error)
    };

  }

}