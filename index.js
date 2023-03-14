require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(cors());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);
app.use(express.static('build'));

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(`
          <div>
              <p>Phonebook has info for ${count} people</p>
              <p>${new Date()}</p>
          </div>
      `);
  });
});

app.get('/api/people', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put('/api/people/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post('/api/people', (request, response, next) => {
  const { name, number } = request.body;

  if (!name) {
    return response.status(400).json({
      error: 'Name missing',
    });
  }

  if (!number) {
    return response.status(400).json({
      error: 'Number missing',
    });
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
  return false;
};

app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
