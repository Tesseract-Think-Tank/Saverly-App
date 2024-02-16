const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const foodQuestions = require("./chatbot/Food_questions");
<<<<<<< HEAD
=======
const rentQuestions = require("./chatbot/Rent_questions");
const travelQuestions = require("./chatbot/Travel_questions");
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451
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
<<<<<<< HEAD
  

// Define other endpoints for each food question function
// ...
=======

app.post('/rent-question-1', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await rentQuestions.question_rent_1(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-2', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await rentQuestions.question_rent_2(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-3', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await rentQuestions.question_rent_3(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-4', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await rentQuestions.question_rent_4(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/rent-question-5', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await rentQuestions.question_rent_5(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
  
app.post('/travel-question-1', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await travelQuestions.question_travel_1(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-2', async (req, res) => {
  try {
    const response = await travelQuestions.question_travel_2();
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-3', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await travelQuestions.question_travel_3(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-4', async (req, res) => {
  try {
    const { userInput } = req.body;
    const response = await travelQuestions.question_travel_4(userInput);
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/travel-question-5', async (req, res) => {
  try {
    const response = await travelQuestions.question_travel_5();
    res.json({ response });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
>>>>>>> 076827a61f6dbde7581cac15074ee6ee52dce451

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
