import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    persons.find((val) => val.name === newName)
      ? alert(`${newName} is already added to phonebook`)
      : persons.find((val) => val.number === newNumber)
      ? alert(`${newNumber} is already added to phonebook`)
      : setPersons([...persons, { name: newName, number: newNumber }]);
    setNewName("");
    setNewNumber("");
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <p>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </p>
      <h2>Add a new</h2>
      <form>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {search != ""
          ? persons
              .filter((person) => person.name.toLowerCase().includes(search))
              .map((person) => {
                return (
                  <li key={person.name}>
                    {person.name} {person.number}
                  </li>
                );
              })
          : persons.map((person) => {
              return (
                <li key={person.name}>
                  {person.name} {person.number}
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default App;
