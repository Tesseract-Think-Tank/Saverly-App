const { create_response } = require('./open-ai');

// Estimates the average monthly rent for different types of properties in a specified location.
async function question_rent_1(userInput, history) {
    const prompt1 = `Estimate the average monthly rent in euros for the following types of properties in ${userInput}. 
    Please provide a separate estimate for each type and:
            1. A 1-bedroom apartment.
            2. A 2-bedroom apartment.
            3. A 3-bedroom apartment.
            4. Average apartment.
            5. Cheapest rent available.
    use this format, specify the apartment type.
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt1 }
    ]);
    return await create_response(prompt1, updatedHistory);
}

// Estimates the average monthly rent and specifies the cost by different areas within a city.
async function question_rent_2(userInput, history) {
    const prompt2 = `Estimate the average monthly rent in euros for the following types of properties in ${userInput}.
    A 1-bedroom apartment.
            2. A 2-bedroom apartment.
            3. A 3-bedroom apartment.
            4. Average apartment.
            5. Cheapest rent available. 
    Please provide a separate estimate for each type and:
            1. Lowest cost areas in the city.
            2. Medium cost areas in the city.
            3. Highest cost areas in the city.
        use this format, specify the area type and the name of the area.
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt2 }
    ]);
    return await create_response(prompt2, updatedHistory);
}

// Provides information about public transportation in a city and its impact on housing choices.
async function question_rent_3(userInput, history) {
    const prompt3 = `Tell me how is public transportation in the city, and does it impact housing choices?${userInput}.
    Please provide an answer with a cost of the ticket on every transportation for students. Maximum 100 words
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt3 }
    ]);
    return await create_response(prompt3, updatedHistory);
}

// Provides the average cost of living in a city for students.
async function question_rent_4(userInput, history) {
    const prompt4 = `What is the average cost of living in the city for students?${userInput}.
    Maximum 100 words
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt4 }
    ]);
    return await create_response(prompt4, updatedHistory);
}

// Compares the overall cost of living in a specified city to other cities.
async function question_rent_5(userInput, history) {
    const prompt5 = `How does the overall cost of living compare to other cities?${userInput}.
    Maximum 100 words
    `;
    const updatedHistory = history.concat([
        { role: "user", content: prompt5 }
    ]);
    return await create_response(prompt5, updatedHistory);
}

module.exports = {
    question_rent_1,
    question_rent_2,
    question_rent_3,
    question_rent_4,
    question_rent_5
};
