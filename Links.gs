function getLinks() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Links");

  const data = sheet.getDataRange().getValues();

  let result = {};

  for (let i = 1; i < data.length; i++) {

    result[data[i][0]] = {
      title: data[i][1],
      url: data[i][2]
    };

  }

  return result;
}