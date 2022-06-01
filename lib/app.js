const express = require('express');
// const cookieParser = require('cookie-parser');

const app = express();

// Built in middleware
app.use(express.json());
app.use(require('cookie-parser')());
app.use(
  require('cors')({
    origin: [
      'http://localhost:7891',
      'https://neon-marigold-2e2237.netlify.app',
    ],
    credentials: true,
  })
);

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/books', require('./controllers/books'));
app.use('/api/v1/recipes', require('./controllers/recipes'));
app.use('/api/v1/notes', require('./controllers/notes'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
