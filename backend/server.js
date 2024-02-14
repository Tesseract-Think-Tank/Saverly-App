const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const foodQuestions = require("./chatbot/Food_questions");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/food-question-1', async (req, res) => {
  // console.log("aaa1");
  try {
    const response = await foodQuestions.question_food_1();
    // console.log(response)
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/food-question-2', async (req, res) => {
    try {
      const response = await foodQuestions.question_food_2();
      res.json({ response });
    } catch (error) {
      res.status(500).send(error.message);
    }
});


app.post('/food-question-3', async (req, res) => {
    try {
      const { userInput } = req.body;
      const response = await foodQuestions.question_food_3(userInput);
      res.json({ response });
    } catch (error) {
      res.status(500).send(error.message);
    }
});

app.post('/food-question-4', async (req, res) => {
  try {
    const response = await foodQuestions.question_food_4();
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/food-question-5', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await foodQuestions.question_food_5(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
  

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
