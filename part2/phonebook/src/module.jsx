import "./index.css";

const Filter = (props) => {
  return (
    <p>
      Filter shown with{" "}
      <input
        value={props.search}
        onChange={(e) => props.setSearch(e.target.value)}
      />
    </p>
  );
};
const PersonForm = (props) => {
  return (
    <form onSubmit={props.submit}>
      <div>
        name:{" "}
        <input
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={props.number}
          onChange={(e) => props.setNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};
const Persons = ({ search, persons, remove }) => {
  let result =
    search != ""
      ? persons.filter((person) => person.name.toLowerCase().includes(search))
      : persons;
  return (
    <ul>
      {result.map((person) => {
        return (
          <li key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => remove(person)}>Delete</button>
          </li>
        );
      })}
    </ul>
  );
};
const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className="error">{message}</div>;
};
export { Filter, PersonForm, Persons, Notification };
