require("dotenv").config();
const express = require("express");
const app = express();

const persons = require("./models/mongo");

app.use(express.static("dist"));

const cors = require("cors");

app.use(cors());

app.use(express.json());

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

app.get("/api/persons/:id", (request, response) => {
  persons.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const { name, number } = request.body;
  const person = persons.find((person) => person.id === id);

  persons = persons.map((person) =>
    person.id === id ? { name: name, number: number, id: id } : person
  );

  if (person) {
    response.json(persons);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const morgan = require("morgan");

function nameExists(name) {
  //return persons.some((entry) => entry.name === name);
}

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

  if (nameExists(name)) {
    return response.status(409).send({ error: "Name already exists" });
  }
  const person = new persons({ name: name, number: number });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
