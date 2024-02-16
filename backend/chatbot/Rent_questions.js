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
<<<<<<< HEAD
    console.log("", response.choices[0].message.content);
=======
    // console.log("", response.choices[0].message.content);
    return response.choices[0].message.content;
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
}

async function question_rent_1(userInput){
    const prompt1 =  `Estimate the average monthly rent in euros for the following types of properties in ${userInput}. 
    Please provide a separate estimate for each type and:
            1. A 1-bedroom apartment.
            2. A 2-bedroom apartment.
            3. A 3-bedroom apartment.
            4. Average apartmenet.
            5. Cheapest rent avalible.
        use this format there shouldnt be anything besides these integers in the response:
            1. a-b
            2. c-d
            3. e-f
            4. g-h
            5. i-j
        where a,b,c,d,e,f,g,h,i,j are integers an are the bounds of the intervals
<<<<<<< HEAD
        the answer you give should be in romanian
    `
    await create_respond(prompt1);
=======
    `
    return await create_respond(prompt1);
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
}
async function question_rent_2(userInput){
    const prompt2 =  `Estimate the average monthly rent in euros for the following types of properties in ${userInput}. 
    Please provide a separate estimate for each type and:
            1. Lowest cost areas in the city.
            2. Medium cost areas in the city.
            3. Highest cost areas in the city.
        use this format there shouldnt be anything more than just the name of the area.
    `
<<<<<<< HEAD
    await create_respond(prompt2);
=======
    return await create_respond(prompt2);
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
}

async function question_rent_3(userInput){
    const prompt3 =  `Tell me how is public transportation in the city, and does it impact housing choices?${userInput}.
    Please provide an answer in romanian with a cost of the ticket on every transportation for students.Maximum 100 words
    `
<<<<<<< HEAD
    await create_respond(prompt3);
=======
    return await create_respond(prompt3);
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
}

async function question_rent_4(userInput){
    const prompt2 =  `What is the average cost of living in the city for students?${userInput}.
    Please provide an answer in romanian.Maximum 100 words
    `
<<<<<<< HEAD
    await create_respond(prompt2);
=======
    return await create_respond(prompt2);
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
}
async function question_rent_5(userInput){
    const prompt2 =  `How does the overall cost of living compare to other cities?${userInput}.
    Please provide an answer in romanian.Maximum 100 words
    `
<<<<<<< HEAD
    await create_respond(prompt2);
=======
    return await create_respond(prompt2);
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
}
async function menu_Rent(){
    userInput = readlineSync.question("Enter a city: ");
    while(true){
        console.log("1.What is the average rent in this city?")
        console.log("2.What is the average rent cost in city areas?")
        console.log("3.What is the situation about public transportation in this city?")
        console.log("4.What is the average cost of living in the city for students?")
        console.log("5.How does the overall cost of living compare to other cities?")
        console.log("6.Back.")
        userInput_question = readlineSync.question("Enter what question do you want to ask: ")
        if(userInput_question=='1'){
            await question_rent_1(userInput);
        }
        if(userInput_question=='2'){
            await question_rent_2(userInput);
        }
        if(userInput_question=='3'){
        await question_rent_3(userInput);
        }
        if(userInput_question=='4'){
            await question_rent_4(userInput);
        }
        if(userInput_question=='5'){
            await question_rent_5(userInput);
        }
        if(userInput_question=='6'){
            break;
        }
    }
}
module.exports = {
<<<<<<< HEAD
    menu_Rent
=======
    menu_Rent,
    question_rent_1,
    question_rent_2,
    question_rent_3,
    question_rent_4,
    question_rent_5
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
};