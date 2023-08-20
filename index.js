const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3009;

const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://kshitijghss:55WeUTu77AyG7khj@cluster0.k8d3ahd.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Blog Schema and Model
const blogSchema = new mongoose.Schema({
  header: String,
  description: String,
});
const Blog = mongoose.model('Blog', blogSchema);

// API endpoints
app.post('/api/blogs', async (req, res) => {
  try {
    console.log('POST request received');
    const { header, description } = req.body;
    const newBlog = new Blog({ header, description });
    await newBlog.save();
    console.log('New blog saved:', newBlog); 
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blogs/g', async (req, res) => {
    try {
      const blogs = await Blog.find();
      console.log(blogs)
      res.status(200).json(blogs);
      
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (deletedBlog) {
      res.json({ message: 'Blog deleted successfully' });
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const { header, description } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { header, description },
      { new: true }
    );
    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


