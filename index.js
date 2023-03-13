require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(cors());
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("build"));

let people = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => Math.floor(Math.random() * 1000);

app.get("/info", (request, response) => {
  response.send(`
        <div>
            <p>Phonebook has info for ${people.length} people</p>
            <p>${new Date()}</p>
        </div>
    `);
});

app.get("/api/people", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/people/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/people", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "Number missing",
    });
  }

  // const alreadyExist = !!people.find((person) => person.name === body.name);

  // if (alreadyExist) {
  //   return response.status(400).json({
  //     error: "Person already exist",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
});

const errorHandler = (
  error,
  request,
  response,
  next
) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
