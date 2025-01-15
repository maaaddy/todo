const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Task = require('./models/Task');

dotenv.config();

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
  const{title, desc, dueDate} = req.body;
  const newTask = await Task.create({title,desc,dueDate}); 
  console.log(req);
  res.json(newTask);
});

app.get('/todo', async (_req, res) => {
  try {
      const taskInfo = await Task.find({}, { _id: 1, title: 1, desc: 1, dueDate:1 });
      res.json(taskInfo);
  } catch (err) {
      console.error("Error:", err);
      res.status(500).send("No data here!");
  }
});

app.put('/tasks/update', async (req, res) => {
  try {
    const { title, desc, dueDate, _id } = req.body;
    console.log("Received Update Request:", req.body);

    const task = await Task.findById(_id);
    if (task) {
      task.title = title;
      task.desc = desc;
      task.dueDate = dueDate || null;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).send("No task found");
    }
  } catch (err) {
    console.error("Error in /tasks/update:", err);
    res.status(500).send("Update unsuccessful");
  }
});

app.put('/tasks/delete', async (req, res) => {
  try {
    const { _id } = req.body;
    const task = await Task.findById(_id);
    if (task) {
      Task.deleteOne({_id});
      res.json("Task Deleted");
    } else {
      res.status(404).send("No task found");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Delete unsuccessful");
  }
});

// Port that we're listening on -----------------------------------------
const server = app.listen(5000);