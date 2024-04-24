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
const Persons = ({ search, persons }) => {
  return (
    <ul>
      {search != ""
        ? persons
            .filter((person) => person.name.toLowerCase().includes(search))
            .map((person) => {
              return (
                <li key={person.id}>
                  {person.name} {person.number}
                </li>
              );
            })
        : persons.map((person) => {
            return (
              <li key={person.id}>
                {person.name} {person.number}
              </li>
            );
          })}
    </ul>
  );
};
export { Filter, PersonForm, Persons };
