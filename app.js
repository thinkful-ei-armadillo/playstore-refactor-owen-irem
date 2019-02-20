'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();

const playstore = require('./playstore');

app.use(morgan('common')); 

app.get('/apps', (req, res) => {
  const { sort, genre } = req.query;
  let results = playstore;
  if (sort) {
    //if sort rating...
    if(sort === 'rating') {
      results = results.sort((a, b) => {
        console.log('rating sorting');
        return a['Rating'] < b['Rating'] ? 1 : a['Rating'] > b['Rating'] ? -1 : 0;
      });
    }    
    //if sort app...
    if(sort === 'app') {
      results = results.sort((a, b) => {
        console.log('app sorting');
        return a['App'] > b['App'] ? 1 : a['App'] < b['App'] ? -1 : 0;
      });
    }
    if (!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of title or rank');
    }
  }
  //if genre, filter
  if(genre) {
    if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre)) {
        return res.status(400).send('Genre must be any of the following: action, arcade, card, casual, puzzle, and/or strategy');
    }
    results = results.filter(play => 
      play.Genres.toLowerCase().includes(genre.toLowerCase()));
  }

  res.send(results);

});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});