function getFAQ(userQuestion) {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("FAQs");

  if (!sheet) {
    return {
      found: false,
      answer: "FAQs sheet not found.",
      action: "none"
    };
  }

  const data = sheet.getDataRange().getValues();

  userQuestion = userQuestion
    .toString()
    .toLowerCase()
    .trim();

  // Start from row 2
  for (let i = 1; i < data.length; i++) {

    const intent = data[i][0]
      .toString()
      .trim();

    const keywordsCell = data[i][1]
      .toString()
      .toLowerCase()
      .trim();

    const question = data[i][2]
      .toString()
      .trim();

    const answer = data[i][3]
      .toString()
      .trim();

    const action = data[i][4]
      .toString()
      .toLowerCase()
      .trim();

    if (!keywordsCell) {
      continue;
    }

    const keywords = keywordsCell.split(",");

    for (let keyword of keywords) {

      keyword = keyword.trim();

      if (!keyword) {
        continue;
      }

      if (
        userQuestion.includes(keyword) ||
        keyword.includes(userQuestion)
      ) {

        return {
          found: true,
          intent: intent,
          question: question,
          answer: answer,
          action: action || "none"
        };

      }

    }

  }

  return {
    found: false,
    intent: "UNKNOWN",
    question: "",
    answer: "Sorry, I couldn't find an answer.",
    action: "none"
  };

}