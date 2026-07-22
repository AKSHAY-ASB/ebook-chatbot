/**
 * Verify whether a mobile number exists
 * in Form responses 1.
 */
function verifyEbookUser(mobile) {

  try {

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sheet = ss.getSheetByName("Form responses 1");

    if (!sheet) {

      return {
        success: false,
        verified: false,
        message: "Registration sheet not found."
      };

    }

    // Normalize entered mobile number
    mobile = normalizeMobileNumber(mobile);

    // Validate mobile
    if (!/^[6-9]\d{9}$/.test(mobile)) {

      return {
        success: true,
        verified: false,
        invalidMobile: true,
        message: "Please enter a valid 10-digit mobile number."
      };

    }


    const data = sheet.getDataRange().getDisplayValues();

    if (data.length < 2) {

      return {
        success: false,
        verified: false,
        message: "No registration data found."
      };

    }


    // First row = headings
    const headers = data[0].map(function(header) {
      return header.toString().trim();
    });


    // Find columns dynamically by heading
    const nameIndex =
      headers.indexOf("नाव :");

    const mobile1Index =
      headers.indexOf("संपर्क क्रमांक १ :");

    const mobile2Index =
      headers.indexOf("संपर्क क्रमांक २ :");


    // Check required columns
    if (nameIndex === -1) {

      return {
        success: false,
        verified: false,
        message: 'Column "नाव :" not found.'
      };

    }


    if (
      mobile1Index === -1 &&
      mobile2Index === -1
    ) {

      return {
        success: false,
        verified: false,
        message: "Mobile number columns not found."
      };

    }


    // Search registration records
    for (let i = 1; i < data.length; i++) {

      let mobile1 = "";

      let mobile2 = "";


      if (mobile1Index !== -1) {

        mobile1 =
          normalizeMobileNumber(
            data[i][mobile1Index]
          );

      }


      if (mobile2Index !== -1) {

        mobile2 =
          normalizeMobileNumber(
            data[i][mobile2Index]
          );

      }


      // Match either mobile number
      if (
        mobile === mobile1 ||
        mobile === mobile2
      ) {

        const name =
          data[i][nameIndex]
            .toString()
            .trim();


        // Save successful access
        saveEbookAccessLog(
          name,
          mobile,
          "Access Granted"
        );


        return {

          success: true,

          verified: true,

          name: name,

          mobile: mobile,

          message:
            "Registration verified successfully."

        };

      }

    }


    // Number not found

    saveEbookAccessLog(
      "",
      mobile,
      "Not Registered"
    );


    return {

      success: true,

      verified: false,

      invalidMobile: false,

      message:
        "This mobile number is not registered."

    };


  } catch (error) {

    console.error(error);

    return {

      success: false,

      verified: false,

      message:
        "Something went wrong while verifying your registration."

    };

  }

}


/**
 * Normalize Indian mobile numbers.
 *
 * Examples:
 *
 * +91 9876543210
 * 919876543210
 * 09876543210
 *
 * becomes:
 *
 * 9876543210
 */
function normalizeMobileNumber(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  let number =
    value
      .toString()
      .trim()
      .replace(/\D/g, "");


  // Remove India country code
  if (
    number.length === 12 &&
    number.startsWith("91")
  ) {

    number =
      number.substring(2);

  }


  // Remove leading zero
  if (
    number.length === 11 &&
    number.startsWith("0")
  ) {

    number =
      number.substring(1);

  }


  return number;

}


/**
 * Save E-book access attempt.
 */
function saveEbookAccessLog(
  name,
  mobile,
  status
) {

  const ss =
    SpreadsheetApp.getActiveSpreadsheet();


  let sheet =
    ss.getSheetByName(
      "Ebook Access Logs"
    );


  // Automatically create log sheet
  if (!sheet) {

    sheet =
      ss.insertSheet(
        "Ebook Access Logs"
      );


    sheet.appendRow([

      "Date & Time",

      "Name",

      "Mobile Number",

      "Status"

    ]);

  }


  sheet.appendRow([

    new Date(),

    name,

    mobile,

    status

  ]);

}


function testEbookVerification() {

  const result =
    verifyEbookUser(
      "YOUR_REGISTERED_MOBILE_NUMBER"
    );

  Logger.log(
    JSON.stringify(result)
  );

}