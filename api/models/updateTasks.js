//This was used to update my database when I added the due dates for the to-do. 
const mongoose = require('mongoose');
const Task = require('./Task');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

(async () => {
  try {
    await Task.updateMany({ dueDate: { $exists: false } }, { $set: { dueDate: null } });
    console.log('Updated existing documents with default dueDate.');
  } catch (err) {
    console.error('Error updating documents:', err);
  } finally {
    mongoose.disconnect();
  }
})();
