import { useState, useEffect } from "react";
import { Filter, PersonForm, Persons } from "./module";
import personService from "./services/person";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);
  console.log(persons);
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
      <Filter searchprop={search} setprop={setSearch} />
      <h2>Add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        setName={setNewName}
        setNumber={setNewNumber}
        submit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} />
    </div>
  );
};

export default App;
