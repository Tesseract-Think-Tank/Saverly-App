const OpenAI = require("openai");
const dotenv = require('dotenv');
const readlineSync = require('readline-sync');

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function create_response(prompt, history=[]) {
    // The prompt from the user is already included in the history received
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: history, // Use the history as is
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    // Append only the assistant's response to the history
    const newHistory = history.concat([
        {
            "role": "assistant",
            "content": response.choices[0].message.content
        }
    ]);

    return {
        response: response.choices[0].message.content,
        history: newHistory
    };
}


module.exports = {
    create_response
};