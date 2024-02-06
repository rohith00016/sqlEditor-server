require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection/dbConnect');
const questionsRoutes = require('./routes/questionsRoutes');

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(cors());

app.use('/questions', questionsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
