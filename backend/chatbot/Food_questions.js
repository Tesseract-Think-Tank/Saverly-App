const {create_response} = require('./open-ai')

async function question_food_1(){
    // console.log("bbb1")
    const prompt1 =  `What are some ideas of dish that are easy to make?. 
    Please provide 5 examples,    
    the answer you give should be in romanian and i want to see the cost in ron
    `
    return await create_response(prompt1);
}
async function question_food_2(){
    const prompt2 =  `What are the type of dish that are low budget?Give me some delicious examples,i need 5 examples
    the answer you give should be in romanian and i want to see the cost in ron
    `
    return await create_response(prompt2);
}

async function question_food_3(userInput){
    const prompt3 =  `I have this amount of money ${userInput}, give me 5 examples of dishes the i could cook.
    Please provide an answer in romanian.
    `
    return await create_response(prompt3);
}

async function question_food_4(){
    const prompt2 =  `How can I plan meals for the week to save time and money?.
    Please provide an answer in romanian.Maximum 100 words and then give 5 examples.
    `
    return await create_response(prompt2);
}
async function question_food_5(userInput){
    const prompt2 =  `Can you recommend substitutes for certain ingredients if I don't have them?
    I dont't have this ingredient ${userInput}.
    Please provide an answer in romanian.Maximum 100 words
    `
    return await create_response(prompt2);
}
async function menu_Food(){
    while(true){
        console.log("1.What are some ideas of dish that are easy to make?")
        console.log("2.What are the type of dish that are low budget?")
        console.log("3.What dish should i do with an amount of money?")
        console.log("4.How can I plan meals for the week to save time and money?")
        console.log("5.Can you recommend substitutes for certain ingredients if I don't have them?")
        console.log("6.Back.")
        userInput_question = readlineSync.question("Enter what question do you want to ask: ")
        if(userInput_question=='1'){
            await question_food_1();
        }
        if(userInput_question=='2'){
            await question_food_2();
        }
        if(userInput_question=='3'){
            userInput = readlineSync.question("Enter the amount of money: ")
            await question_food_3(userInput);
        }
        if(userInput_question=='4'){
            await question_food_4();
        }
        if(userInput_question=='5'){
            userInput = readlineSync.question("What ingredient you don't have?")
            await question_food_5(userInput);
        }
        if(userInput_question=='6'){
            break;
        }
    }
}
module.exports = {
    create_respond: create_response,
    question_food_1,
    question_food_2,
    question_food_3,
    question_food_4,
    question_food_5
};