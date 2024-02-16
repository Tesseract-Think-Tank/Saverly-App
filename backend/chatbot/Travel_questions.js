const OpenAI = require("openai");
const dotenv = require('dotenv');
const readlineSync = require('readline-sync');

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function create_respond(prompt1){
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
    console.log("", response.choices[0].message.content);
}

async function question_travel_1(userInput){
    const prompt1 =  `What are the must-visit places in ${userInput}
            1. a
            2. c
            3. e
            4. g
            5. i
        where a,c,e,g,i are the places
        the answer you give should be in romanian and if these places have an enter fee say how much 
    `
    await create_respond(prompt1);
}
async function question_travel_2(){
    const prompt2 =  `What is the most cost-effective way to travel?
        the answer should be in romanian and maximum 100 words.
    `
    await create_respond(prompt2);
}

async function question_travel_3(userInput){
    const prompt3 =  `What are some affordable or free activities to do in ${userInput}.
    i want 5 examples like that:
    1.
    2.
    3.
    4.
    5.
    Please provide an answer in romanian .Maximum 100 words
    `
    await create_respond(prompt3);
}

async function question_travel_4(userInput){
    const prompt2 =  `When is the perfect time to visit ${userInput}.
    Please provide an answer in romanian.Maximum 100 words
    `
    await create_respond(prompt2);
}
async function question_travel_5(){
    const prompt2 =  `What are some cheap cities in Europe that i can visit?.
    Please provide an answer in romanian.Maximum 100 words and give 3 examples
    `
    await create_respond(prompt2);
}
async function menu_Travel(){
    userInput = readlineSync.question("Enter a city: ");
    while(true){
        console.log("1.What are the must-visit places?")
        console.log("2.What is the most cost-effective way to travel?")
        console.log("3.What are some affordable or free activities to do?")
        console.log("4.When is the perfect time to visit?")
        console.log("5.What are some cheap cities in Europe that i can visit?")
        console.log("6.Back.")
        userInput_question = readlineSync.question("Enter what question do you want to ask: ")
        if(userInput_question=='1'){
            await question_travel_1(userInput);
        }
        if(userInput_question=='2'){
            await question_travel_2();
        }
        if(userInput_question=='3'){
        await question_travel_3(userInput);
        }
        if(userInput_question=='4'){
            await question_travel_4(userInput);
        }
        if(userInput_question=='5'){
            await question_travel_5();
        }
        if(userInput_question=='6'){
            break;
        }
    }
}
module.exports = {
    menu_Travel
};