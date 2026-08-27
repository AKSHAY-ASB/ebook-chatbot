function saveAPIKey(){

PropertiesService
.getScriptProperties()
.setProperty(
"OPENAI_KEY",
"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"
);

}


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


// =====================================================
// SEC-03.6
// PROTECTED CHATBOT API
// =====================================================

function askBotProtected(sessionId, question) {

  // ---------------------------------------------------
  // STEP 1:
  // Validate authenticated session
  // ---------------------------------------------------

  const access =
    requireAuthSession(
      sessionId
    );


  if (
    !access ||
    access.authorized !== true
  ) {

    return {

      success: false,

      authorized: false,

      code:
        access &&
        access.code
          ? access.code
          : "ACCESS_DENIED",

      message:
        "Authentication required."

    };

  }


  // ---------------------------------------------------
  // STEP 2:
  // Validate question
  // ---------------------------------------------------

  if (
    !question ||
    String(question).trim() === ""
  ) {

    return {

      success: false,

      authorized: true,

      code:
        "EMPTY_MESSAGE",

      message:
        "कृपया तुमचा प्रश्न टाका."

    };

  }


  // ---------------------------------------------------
  // STEP 3:
  // SERVER-SIDE IDENTITY
  // ---------------------------------------------------

  const authenticatedUser =
    access.user;


  // ---------------------------------------------------
  // STEP 4:
  // Existing chatbot logic
  // ---------------------------------------------------

  const chatbotResult =
    askBot(
      String(
        question
      ).trim()
    );


  // ---------------------------------------------------
  // STEP 5:
  // Return protected response
  // ---------------------------------------------------

  return {

    success: true,

    authorized: true,

    source:
      chatbotResult.source,

    found:
      chatbotResult.found,

    intent:
      chatbotResult.intent,

    answer:
      chatbotResult.answer,

    action:
      chatbotResult.action,

    // Server-validated identity
    profileId:
      authenticatedUser.profileId,

    profileType:
      authenticatedUser.profileType

  };

}

function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}