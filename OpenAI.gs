function askOpenAI(userMessage) {

  const apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("OPENAI_API_KEY");

  if (!apiKey) {

    return {
      success: false,
      answer: "OpenAI API key is not configured."
    };

  }

  const url = "https://api.openai.com/v1/responses";

  const systemPrompt = `
You are the official AI assistant for the Devang Pustika social matrimonial E-book project.

Your role is to help users understand the Devang Pustika project and guide them clearly.

You may help with:
- General information about the E-book project
- Registration guidance
- How the E-book works
- How users can use the platform
- General questions related to the project
- Marathi and English questions

IMPORTANT RULES:

1. Reply in the same language as the user whenever possible.

2. If the user asks in Marathi, answer in Marathi.

3. If the user asks in English, answer in English.

4. Keep answers short, clear and helpful.

5. Never invent:
   - Registration dates
   - Registration fees
   - Phone numbers
   - WhatsApp numbers
   - E-book links
   - Google Form links
   - Profile information
   - Bride/Groom information

6. If you do not have verified information, tell the user to use the appropriate menu option or contact the Devang Pustika team.

7. Do not claim that a bride or groom profile exists unless profile-search data has actually been provided to you.

8. Do not provide private contact information or personal matrimonial profile details.

9. The Devang Pustika project is a social matrimonial E-book initiative. Be respectful and professional.

10. Do not make promises about marriage matches or guarantee results.
`;

  const payload = {

    model: "gpt-4.1-mini",

    instructions: systemPrompt,

    input: userMessage,

    max_output_tokens: 300

  };

  const options = {

    method: "post",

    contentType: "application/json",

    headers: {
      Authorization: "Bearer " + apiKey
    },

    payload: JSON.stringify(payload),

    muteHttpExceptions: true

  };

  try {

    const response = UrlFetchApp.fetch(
      url,
      options
    );

    const statusCode =
      response.getResponseCode();

    const responseText =
      response.getContentText();

    if (
      statusCode < 200 ||
      statusCode >= 300
    ) {

      console.error(
        "OpenAI Error:",
        responseText
      );

      return {
        success: false,
        answer:
          "AI service is currently unavailable. Please try again later."
      };

    }

    const data =
      JSON.parse(responseText);

    let answer = "";

    if (
      data.output &&
      data.output.length > 0
    ) {

      for (
        let i = 0;
        i < data.output.length;
        i++
      ) {

        const outputItem =
          data.output[i];

        if (
          outputItem.content
        ) {

          for (
            let j = 0;
            j < outputItem.content.length;
            j++
          ) {

            const contentItem =
              outputItem.content[j];

            if (
              contentItem.type === "output_text"
            ) {

              answer +=
                contentItem.text;

            }

          }

        }

      }

    }

    if (!answer) {

      return {
        success: false,
        answer:
          "I couldn't generate a response right now."
      };

    }

    return {
      success: true,
      answer: answer.trim()
    };

  }

  catch (error) {

    console.error(error);

    return {
      success: false,
      answer:
        "Something went wrong while connecting to the AI service."
    };

  }

}

function testOpenAI() {

  const result = askOpenAI(
    "What is Devang Pustika?"
  );

  Logger.log(
    JSON.stringify(result)
  );

}