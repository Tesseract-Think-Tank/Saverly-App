const { create_response } = require('./open-ai');

// Provides ideas for easy-to-make dishes, including their cost in RON.
async function question_food_1(history) {
    const prompt1 = `What are some ideas of dish that are easy to make?. 
    Please provide 5 examples,    
    the answer you give should have the cost in ron
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt1 }
    ]);

    return await create_response(prompt1, updatedHistory);
}

// Suggests low-budget yet delicious dishes.
async function question_food_2(history) {
    const prompt2 = `What are the type of dish that are low budget? Give me some delicious examples, I need 5 examples.`;
    const updatedHistory = history.concat([
        { role: "user", content: prompt2 }
    ]);

    return await create_response(prompt2, updatedHistory);
}

// Recommends dishes based on a specified budget.
async function question_food_3(userInput, history) {
    const prompt3 = `I have this amount of money ${userInput}, give me 5 examples of dishes that I could cook.`;
    const updatedHistory = history.concat([
        { role: "user", content: prompt3 }
    ]);
    
    return await create_response(prompt3, updatedHistory);
}

// Offers advice on meal planning for saving time and money, with examples.
async function question_food_4(history) {
    const prompt4 = `How can I plan meals for the week to save time and money? 
    Maximum 100 words and then give 5 examples.
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt4 }
    ]);

    return await create_response(prompt4, updatedHistory);
}

// Suggests ingredient substitutes if a specified ingredient is unavailable.
async function question_food_5(userInput, history) {
    const prompt5 = `Can you recommend substitutes for certain ingredients if I don't have them? 
    I don't have this ingredient ${userInput}. 
    Maximum 100 words
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt5 }
    ]);
    return await create_response(prompt5, updatedHistory);
}

module.exports = {
    create_respond: create_response,
    question_food_1,
    question_food_2,
    question_food_3,
    question_food_4,
    question_food_5
};
