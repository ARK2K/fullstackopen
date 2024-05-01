const express = require("express");
const app = express();

let persons = [
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

app.use(express.static("dist"));

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const now = new Date().toLocaleString();
  const entryCount = persons.length;
  const message = `<p>Phonebook has info for ${entryCount} people</p><p>${now}</p>`;
  response.send(message);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
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
  return persons.some((entry) => entry.name === name);
}

morgan.token("body", (req, res) => {
  // Check if request has a body (avoids errors with requests without body)
  if (req.body) {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length]  - :response-time ms :body")
);

app.post("/api/persons", (request, response) => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;

  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).send({ error: "Missing name or number" });
  }

  if (nameExists(name)) {
    return response.status(409).send({ error: "Name already exists" });
  }

  persons = [...persons, { name: name, number: number, id: maxId + 1 }];

  response.status(200).send({ message: "Entry created successfully" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
