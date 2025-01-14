const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Task = require('./models/Task');

dotenv.config();

console.log("MONGO_URL:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connection successful")
  }).catch((err) => {
    console.log("connection unsuccessful", err)
  });

const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));
// End Set Up -----------------------------------------------------------
app.get('/test', (_req, res) => {
  res.json('test ok');
});

app.post('/tasks', async (req, res) => {
  const{title, desc} = req.body;
  const newTask = await Task.create({title,desc}); 
  console.log(req);
  res.json(newTask);
});

app.get('/todo', async (_req, res) => {
  try {
      const taskInfo = await Task.find({}, { _id: 1, title: 1, desc: 1 });
      res.json(taskInfo);
  } catch (err) {
      console.error("Error:", err);
      res.status(500).send("No data here!");
  }
});


app.get

// Port that we're listening on -----------------------------------------
const server = app.listen(5000);