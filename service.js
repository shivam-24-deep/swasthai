const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tips = require('./data/tips.json');
const feedback = require('./data/feedback.json');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Search tips
app.get('/api/search', (req, res) => {
  const keyword = req.query.q?.toLowerCase() || '';
  const result = tips.filter(t => t.text.toLowerCase().includes(keyword));
  res.json(result);
});

// Tips by category
app.get('/api/categories', (req, res) => {
  const categories = {};
  tips.forEach(tip => {
    if (!categories[tip.category]) categories[tip.category] = [];
    categories[tip.category].push(tip);
  });
  res.json(categories);
});

// Tips by language
app.get('/api/language/:lang', (req, res) => {
  const lang = req.params.lang;
  const result = tips.map(t => ({
    text: t[lang] || t.text,
    category: t.category
  }));
  res.json(result);
});

// Gallery
app.get('/api/gallery', (req, res) => {
  const media = tips.map(t => t.media).filter(Boolean);
  res.json(media);
});

// Daily tip
app.get('/api/daily', (req, res) => {
  const index = new Date().getDate() % tips.length;
  res.json(tips[index]);
});

// Feedback
app.post('/api/feedback', (req, res) => {
  const entry = { ...req.body, date: new Date().toISOString() };
  feedback.push(entry);
  fs.writeFileSync('./data/feedback.json', JSON.stringify(feedback, null, 2));
  res.json({ message: 'Feedback saved!' });
});

// Bookmark tips
app.post('/api/bookmark', (req, res) => {
  const userId = req.body.user || 'guest';
  const file = `./data/bookmarks_${userId}.json`;
  const saved = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
  saved.push(req.body.tip);
  fs.writeFileSync(file, JSON.stringify(saved, null, 2));
  res.json({ message: 'Bookmarked!' });
});

app.get('/api/bookmark/:user', (req, res) => {
  const file = `./data/bookmarks_${req.params.user}.json`;
  if (fs.existsSync(file)) {
    const saved = JSON.parse(fs.readFileSync(file));
    res.json(saved);
  } else {
    res.json([]);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
