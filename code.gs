function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Devang Chatbot")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getChatLinks() {
  return getLinks();
}

function askBot(question) {

  // STEP 1:
  // Check Google Sheet FAQ first

  const faqResult =
    getFAQ(question);


  if (faqResult.found) {

    return {
      source: "faq",

      found: true,

      intent:
        faqResult.intent,

      answer:
        faqResult.answer,

      action:
        faqResult.action
    };

  }


  // STEP 2:
  // FAQ not found
  // Ask OpenAI

  const aiResult =
    askOpenAI(question);


  if (aiResult.success) {

    return {
      source: "ai",

      found: true,

      intent: "AI",

      answer:
        aiResult.answer,

      action: "none"
    };

  }


  // STEP 3:
  // Both failed

  return {

    source: "error",

    found: false,

    intent: "UNKNOWN",

    answer:
      "Sorry, I couldn't answer that question right now.",

    action: "none"

  };

}