const Filter = (props) => {
  return (
    <p>
      <input
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
      />
    </p>
  );
};
const PersonForm = (props) => {
  return (
    <form>
      <div>
        name:{" "}
        <input
          value={props.newName}
          onChange={(e) => props.setNewName(e.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={props.newNumber}
          onChange={(e) => props.setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit" onClick={props.handleSubmit}>
          Add
        </button>
      </div>
    </form>
  );
};
const Persons = ({ search, persons }) => {
  return (
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
  );
};
export { Filter, PersonForm, Persons };
