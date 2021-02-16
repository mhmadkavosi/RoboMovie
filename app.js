const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// scrapers
const scrapers = require('./src/server/scrapers/imdb');

dotenv.config({ path: './config.env' });
const app = express();

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// connect to the database
const db = process.env.DATABASE_LOCAL;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database Connected !'));

app.use(morgan('dev'));
app.use(express.json());

// TODO we don't send and save any image!!!

app.get('/:movieName', async (req, res) => {
  // const movies = new Promise((resolve, reject) => {
  //   scrapers
  //     .scrapMovies(req.params.movieName)
  //     .then((data) => {
  //       resolve(data);
  //     })
  //     .catch((err) => console.log(err));
  // });

  // Promise.all([movies])
  //   .then((data) => {
  //     res.json(data);
  //   })
  //   .catch((err) => console.log(err));
  try {
    const movie = await scrapers.scrapMovies(req.params.movieName);
    res.json(movie);
  } catch (error) {
    console.log(error);
  }
});

app.get('/movie/:imdbId', async (req, res) => {
  // const movie = new Promise((resolve, reject) => {
  //   scrapers
  //     .scrapMovie(req.params.imdbId)
  //     .then((data) => {
  //       resolve(data);
  //     })
  //     .catch((err) => console.log(err));
  // });

  // Promise.all([movie])
  //   .then((data) => {
  //     res.json(data);
  //   })
  //   .catch((err) => console.log(err));
  try {
    const movie = await scrapers.scrapMovie(req.params.imdbId);
    res.json(movie);
  } catch (error) {
    console.log(error);
  }
});

// TODO : send back 304 htpp status code not data
app.get('/top250Movie', async (req, res) => {
  try {
    const movie = await scrapers.top250Movie();

    res.json(movie);
  } catch (error) {
    console.log(error);
  }
});

// TODO : send back 304 htpp status code not data
app.get('/top250Tv', async (req, res) => {
  try {
    const tv = await scrapers.top250Tv();

    res.json(tv);
  } catch (error) {
    console.log(error);
  }
});
