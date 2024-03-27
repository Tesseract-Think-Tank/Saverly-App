const {create_response} = require('./open-ai')

async function question_travel_1(userInput, history){
    const prompt1 =  `What are the must-visit places in ${userInput}
            1. a
            2. c
            3. e
            4. g
            5. i
        where a,c,e,g,i are the places
        the answer you give should be in romanian and if these places have an enter fee say how much 
    `
    const updatedHistory = history.concat([
        { role: "user", content: prompt1 }
    ]);

    return await create_response(prompt1, updatedHistory);
}
async function question_travel_2(history){
    const prompt2 =  `What is the most cost-effective way to travel?
        the answer should be in romanian and maximum 100 words.
    `
    const updatedHistory = history.concat([
        { role: "user", content: prompt2 }
    ]);
    return await create_response(prompt2, updatedHistory);
}

async function question_travel_3(userInput, history){
    const prompt3 =  `What are some affordable or free activities to do in ${userInput}.
    i want 5 examples like that:
    1.
    2.
    3.
    4.
    5.
    Please provide an answer in romanian .Maximum 100 words
    `
    const updatedHistory = history.concat([
        { role: "user", content: prompt3 }
    ]);
    return await create_response(prompt3, updatedHistory);
}

async function question_travel_4(userInput, history){
    const prompt4 =  `When is the perfect time to visit ${userInput}.
    Please provide an answer in romanian.Maximum 100 words
    `
    const updatedHistory = history.concat([
        { role: "user", content: prompt4 }
    ]);
    return await create_response(prompt4, updatedHistory);
}
async function question_travel_5(history){
    const prompt5 =  `What are some cheap cities in Europe that i can visit?.
    Please provide an answer in romanian.Maximum 100 words and give 3 examples
    `
    const updatedHistory = history.concat([
        { role: "user", content: prompt5 }
    ]);
    return await create_response(prompt5, updatedHistory);
}

module.exports = {
    question_travel_1,
    question_travel_2,
    question_travel_3,
    question_travel_4,
    question_travel_5
};