/**
 * =========================================================
 * FILE : ProfilePhotoFaceDetectionBackend.gs
 * MODULE : Profile Components
 * PURPOSE : Server-side profile photo preparation
 *
 * RESPONSIBILITY
 * - Fetch Google Drive profile images server-side
 * - Convert image to Base64 Data URL
 * - Remove browser CORS problem for face detection
 * - Batch process profile photos
 *
 * IMPORTANT
 * - Does NOT modify Google Drive files
 * - Does NOT modify profile sheet data
 * - Does NOT modify searchProfiles()
 * - Does NOT modify stored photo URLs
 * =========================================================
 */


/**
 * =========================================================
 * EXTRACT GOOGLE DRIVE FILE ID
 * =========================================================
 */
function extractProfilePhotoDriveFileId(photoUrl) {

  if (!photoUrl) {
    return "";
  }

  const url =
    String(photoUrl).trim();

  if (!url) {
    return "";
  }


  /*
   * /file/d/FILE_ID
   */
  let match =
    url.match(
      /\/file\/d\/([a-zA-Z0-9_-]+)/i
    );

  if (match && match[1]) {
    return match[1];
  }


  /*
   * /d/FILE_ID
   */
  match =
    url.match(
      /\/d\/([a-zA-Z0-9_-]+)/i
    );

  if (match && match[1]) {
    return match[1];
  }


  /*
   * ?id=FILE_ID
   */
  match =
    url.match(
      /[?&]id=([a-zA-Z0-9_-]+)/i
    );

  if (match && match[1]) {
    return match[1];
  }


  /*
   * Direct Drive file ID fallback.
   */
  if (
    /^[a-zA-Z0-9_-]{25,}$/.test(url)
  ) {
    return url;
  }


  return "";
}


/**
 * =========================================================
 * CREATE IMAGE DATA URL
 * =========================================================
 */
function createProfilePhotoDataUrl_(blob) {

  if (!blob) {
    return "";
  }


  const contentType =
    blob.getContentType() ||
    "image/jpeg";


  /*
   * Only allow image MIME types.
   */
  if (
    String(contentType)
      .toLowerCase()
      .indexOf("image/") !== 0
  ) {

    return "";

  }


  const bytes =
    blob.getBytes();


  const base64 =
    Utilities.base64Encode(
      bytes
    );


  return (
    "data:" +
    contentType +
    ";base64," +
    base64
  );

}


/**
 * =========================================================
 * GET ONE PROFILE PHOTO DATA URL
 * =========================================================
 */


/**
 * =========================================================
 * FILE : ProfilePhotoFaceDetection.gs
 * FUNCTION : getProfilePhotoDataUrl
 *
 * PURPOSE
 * Fetch existing profile image URL server-side
 * without DriveApp permission.
 *
 * IMPORTANT
 * - Does NOT use DriveApp
 * - Does NOT require Drive readonly scope
 * - Uses existing Google Drive thumbnail URL
 * - Does NOT modify Drive file
 * - Does NOT modify profile data
 * =========================================================
 */

function getProfilePhotoDataUrl(photoUrl) {

  try {

    if (!photoUrl) {

      return {
        success: false,
        dataUrl: "",
        reason: "EMPTY_URL"
      };

    }


    const sourceUrl =
      String(photoUrl).trim();


    if (!sourceUrl) {

      return {
        success: false,
        dataUrl: "",
        reason: "EMPTY_URL"
      };

    }


    /*
     * -----------------------------------------------------
     * Use the existing browser-displayable URL.
     *
     * Do NOT use DriveApp.getFileById().
     * -----------------------------------------------------
     */

    const response =
      UrlFetchApp.fetch(

        sourceUrl,

        {
          method: "get",

          followRedirects: true,

          muteHttpExceptions: true,

          headers: {

            "User-Agent":
              "Mozilla/5.0"

          }

        }

      );


    const responseCode =
      response.getResponseCode();


    console.log(
      "[ProfilePhotoServer] HTTP:",
      responseCode
    );


    if (
      responseCode < 200 ||
      responseCode >= 300
    ) {

      return {

        success: false,

        dataUrl: "",

        reason:
          "HTTP_" +
          responseCode

      };

    }


    const blob =
      response.getBlob();


    if (!blob) {

      return {

        success: false,

        dataUrl: "",

        reason:
          "EMPTY_BLOB"

      };

    }


    /*
     * -----------------------------------------------------
     * Validate content type.
     * -----------------------------------------------------
     */

    let contentType =
      String(
        blob.getContentType() ||
        ""
      ).toLowerCase();


    /*
     * Google sometimes returns
     * application/octet-stream.
     *
     * Since the source is our known
     * Drive thumbnail URL, allow it
     * and use JPEG fallback.
     */

    if (
      contentType.indexOf(
        "image/"
      ) !== 0
    ) {

      contentType =
        "image/jpeg";

    }


    /*
     * -----------------------------------------------------
     * Protect chatbot performance.
     * -----------------------------------------------------
     */

    const bytes =
      blob.getBytes();


    const sizeBytes =
      bytes.length;


    const maxBytes =
      6 * 1024 * 1024;


    if (
      sizeBytes >
      maxBytes
    ) {

      return {

        success: false,

        dataUrl: "",

        reason:
          "IMAGE_TOO_LARGE",

        sizeBytes:
          sizeBytes

      };

    }


    /*
     * -----------------------------------------------------
     * Convert image to Base64.
     * -----------------------------------------------------
     */

    const base64 =
      Utilities.base64Encode(
        bytes
      );


    const dataUrl =
      "data:" +
      contentType +
      ";base64," +
      base64;


    return {

      success: true,

      dataUrl: dataUrl,

      sourceUrl: sourceUrl,

      mimeType: contentType,

      sizeBytes: sizeBytes

    };

  }

  catch (error) {

    console.error(
      "[ProfilePhotoServer] URL fetch failed:",
      error
    );


    return {

      success: false,

      dataUrl: "",

      reason:
        "URL_FETCH_FAILED",

      error:
        String(error)

    };

  }

}


/**
 * =========================================================
 * BATCH PROFILE PHOTO DATA
 * =========================================================
 */
function getProfilePhotoDataUrls(photoUrls) {

  try {

    if (
      !Array.isArray(photoUrls)
    ) {

      return {

        success: false,

        results: []

      };

    }


    /*
     * Protect server workload.
     */
    const urls =
      photoUrls
        .slice(0, 10);


    const results =
      urls.map(

        function(photoUrl) {

          return {
            sourceUrl:
              String(photoUrl || ""),

            result:
              getProfilePhotoDataUrl(
                photoUrl
              )
          };

        }

      );


    return {

      success: true,

      results: results

    };

  }

  catch (error) {

    console.error(
      "[ProfilePhotoServer] Batch failed:",
      error
    );


    return {

      success: false,

      results: [],

      error:
        String(error)

    };

  }

}


/**
 * =========================================================
 * SERVER TEST
 * =========================================================
 */

function testProfilePhotoFaceDetectionServer() {

  const testUrl =
    "https://drive.google.com/thumbnail?id=1lmnajrjx3DdRphH2K6A0rn_f3J5oCK-S&sz=w1000";


  console.log(
    "=========================================="
  );

  console.log(
    "PROFILE PHOTO SERVER TEST START"
  );

  console.log(
    "=========================================="
  );


  console.log(
    "Testing URL:",
    testUrl
  );


  const result =
    getProfilePhotoDataUrl(
      testUrl
    );


  console.log(
    "Success:",
    result.success
  );


  console.log(
    "Reason:",
    result.reason || "NONE"
  );


  console.log(
    "HTTP / MIME:",
    result.mimeType || "NONE"
  );


  console.log(
    "Size:",
    result.sizeBytes || 0
  );


  console.log(
    "Data URL Available:",
    Boolean(
      result.dataUrl
    )
  );


  if (result.error) {

    console.error(
      "Error:",
      result.error
    );

  }


  console.log(
    "=========================================="
  );

  console.log(
    "PROFILE PHOTO SERVER TEST END"
  );

  console.log(
    "=========================================="
  );


  return {

    success:
      result.success,

    reason:
      result.reason || "",

    mimeType:
      result.mimeType || "",

    sizeBytes:
      result.sizeBytes || 0,

    dataUrlAvailable:
      Boolean(
        result.dataUrl
      )

  };

}
