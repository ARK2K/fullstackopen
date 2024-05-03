require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const persons = require("./models/mongo");

app.use(express.static("dist"));

const cors = require("cors");

app.use(cors());

app.get("/api/persons", (request, response) => {
  persons.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/info", (request, response) => {
  const now = new Date().toLocaleString();
  const entryCount = persons.length;
  const message = `<p>Phonebook has info for ${entryCount} people</p><p>${now}</p>`;
  response.send(message);
});

app.get("/api/persons/:id", (request, response, next) => {
  persons
    .findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  const person = { name: name, number: number };
  persons
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  persons
    .findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const morgan = require("morgan");

morgan.token("body", (req, res) => {
  if (req.body) {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length]  - :response-time ms :body")
);

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).send({ error: "Missing name or number" });
  }

  const person = new persons({ name: name, number: number });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
