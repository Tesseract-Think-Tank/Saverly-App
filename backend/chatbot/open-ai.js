const OpenAI = require("openai");
const dotenv = require('dotenv');
const readlineSync = require('readline-sync');

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function create_response(prompt1){
    // console.log("ccc1")
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
        {
            "role": "user",
            "content": prompt1
        }
        ],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })
    // console.log("", response.choices[0].message.content);
    return response.choices[0].message.content;
}

module.exports = {
    create_response
};