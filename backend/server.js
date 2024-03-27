const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const foodQuestions = require("./chatbot/Food_questions");
const rentQuestions = require("./chatbot/Rent_questions");
const travelQuestions = require("./chatbot/Travel_questions");
const {create_response} = require('./chatbot/open-ai')
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/default-question', async (req, res) => {
  try {
    const { question, history } = req.body; // Now also extracting the history from the request body

    // Passing both the question and the history to the create_response function
    const { response, history: updatedHistory } = await create_response(question, history);

    // Sending back both the response and the updated history
    res.json({ response, history: updatedHistory });
  } catch (error) {
    console.error("Error in /default-question route:", error);
    res.status(500).send(error.message);
  }
});

app.post('/food-question-1', async (req, res) => {
  try {
    const { history } = req.body; // Extracting history from the request body
    const { response, history: updatedHistory } = await foodQuestions.question_food_1(history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/food-question-2', async (req, res) => {
  try {
    const { history } = req.body;
    const { response, history: updatedHistory } = await foodQuestions.question_food_2(history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/food-question-3', async (req, res) => {
    try {
      // Extract both userInput and history from the request body
      const { userInput, history } = req.body;

      // Pass both userInput and the current history to the question handler
      const { response, history: updatedHistory } = await foodQuestions.question_food_3(userInput, history);

      // Return both the response and the updated history to the frontend
      res.json({ response, history: updatedHistory });
    } catch (error) {
      console.error("Error in /food-question-3 route:", error);
      res.status(500).send(error.message);
    }
});


app.post('/food-question-4', async (req, res) => {
  try {
    const { history } = req.body;
    const { response, history: updatedHistory } = await foodQuestions.question_food_4(history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/food-question-5', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const { response, history: updatedHistory } = await foodQuestions.question_food_5(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/rent-question-1', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const { response, history: updatedHistory } = await rentQuestions.question_rent_1(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-2', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const {response, history: updatedHistory} = await rentQuestions.question_rent_2(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-3', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const { response, history: updatedHistory } = await rentQuestions.question_rent_3(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-4', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const { response, history: updatedHistory } = await rentQuestions.question_rent_4(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.post('/rent-question-5', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const { response, history: updatedHistory } = await rentQuestions.question_rent_5(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
  
app.post('/travel-question-1', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const {response, history: updatedHistory} = await travelQuestions.question_travel_1(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-2', async (req, res) => {
  try {
    const { history } = req.body;
    const {response, history: updatedHistory} = await travelQuestions.question_travel_2(history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-3', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const {response, history: updatedHistory} = await travelQuestions.question_travel_3(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-4', async (req, res) => {
  try {
    const { userInput, history } = req.body;
    const {response, history: updatedHistory} = await travelQuestions.question_travel_4(userInput, history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-5', async (req, res) => {
  try {
    const { history } = req.body;
    const {response, history: updatedHistory} = await travelQuestions.question_travel_5(history);
    res.json({ response, history: updatedHistory });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
