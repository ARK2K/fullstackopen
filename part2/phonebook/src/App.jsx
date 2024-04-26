import { useState, useEffect } from "react";
import { Filter, PersonForm, Persons } from "./module";
import personService from "./services/person";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  let temp = [];
  console.log(persons);
  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);
  const handleDelete = ({ name, id }) => {
    if (window.confirm(`Delete ${name}`)) {
      console.log(`Deleted ${name}`);
      temp = persons
        .filter((person) => person.id != id)
        .map((person, index) => {
          return { ...person, id: `${index + 1}` };
        });
      console.log(temp);
      setPersons([...temp]);
      personService.del(id, [...temp]);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    temp = persons.filter((val) => val.name === newName)[0].id;
    console.log(temp, "update");
    if (persons.find((val) => val.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with new one?`
        )
      ) {
        personService
          .update(temp, {
            name: newName,
            number: newNumber,
            id: `${temp}`,
          })
          .then(() => {
            setPersons(
              persons.map((person) =>
                person.id != temp
                  ? person
                  : { name: newName, number: newNumber, id: `${temp}` }
              )
            );
          });
      }
    } else {
      console.log(persons.length);
      setPersons([
        ...persons,
        { name: newName, number: newNumber, id: `${persons.length + 1}` },
      ]);
      personService
        .create({
          name: newName,
          number: newNumber,
          id: `${persons.length + 1}`,
        })
        .then((res) => console.log(res.data));
    }
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
      <Persons persons={persons} search={search} remove={handleDelete} />
    </div>
  );
};

export default App;
