import { useState, useEffect } from "react";
import { Filter, Notification, PersonForm, Persons } from "./module";
import personService from "./services/person";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [info, setInfo] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [error, setError] = useState({ state: false, message: "" });
  let temp = [];
  const Timeout = () => {
    setIsOn(true);
    setTimeout(() => {
      setIsOn(false);
      console.log("complete");
    }, 5000);
  };
  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);
  const handleDelete = ({ name, id }) => {
    setInfo(`Deleted ${name}`);
    if (window.confirm(`Delete ${name}`)) {
      console.log(`Deleted ${name}`);
      temp = persons
        .filter((person) => person.id != id)
        .map((person, index) => {
          return { ...person, id: `${index + 1}` };
        });
      console.log(temp);
      setPersons([...temp]);
      Timeout();
      personService.del(id, [...temp]);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    temp = persons.filter((val) => val.name === newName)[0];
    if (persons.find((val) => val.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with new one?`
        )
      ) {
        personService
          .update(temp.id, {
            name: newName,
            number: newNumber,
            id: `${temp.id}`,
          })
          .then(() => {
            setPersons(
              persons.map((person) =>
                person.id != temp.id
                  ? person
                  : { name: newName, number: newNumber, id: `${temp.id}` }
              )
            );
          })
          .then(() => Timeout())
          .catch((er) => {
            console.log(er);
            setIsOn(false);
            setError({
              state: true,
              message: `Informaton of ${temp.name} has already been removed from server`,
            });
            setTimeout(() => {
              setError({ state: false, message: "" });
              console.log("complete");
            }, 5000);
          });
        setInfo(`Updated ${temp.name}`);
      }
    } else {
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
        .then(() => Timeout());
      setInfo(`Added ${newName}`);
    }
    setNewName("");
    setNewNumber("");
  };
  return (
    <div>
      <h2>Phonebook</h2>
      {error.state ? (
        <Notification message={error.message} good={false} />
      ) : (
        isOn && <Notification message={info} good={true} />
      )}
      <Filter search={search} setSearch={setSearch} />
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
