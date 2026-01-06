const express = require("express");
// const cors = require("cors");
const app = express();

app.use(express.json());
// app.use(cors());



app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} 
    people</p>
    <p>${new Date()}</p>
    `
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons.filter((person) => person.id != id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    const missing = !body.name ? "name" : "number";
    return response.status(400).json({
      error: `${missing} is missing`,
    });
  }

  const nameExists = persons.find((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: String(Math.floor(Math.random() * 1000000)),
    name: body.name,
    number: body.number,
  };

  persons.push(person);
  response.json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
