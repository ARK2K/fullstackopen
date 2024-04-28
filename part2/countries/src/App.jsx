import { useState, useEffect } from "react";
import countryService from "./services/countries";
import { Collapsible, SingleCountry } from "./module";

function App() {
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    countryService.getAll().then((response) => {
      setList(response.data);
    });
  }, []);
  if (list.length == 0) {
    return null;
  }
  let result =
    search != ""
      ? [
          ...list.filter((item) =>
            item.name.common.toLowerCase().includes(search)
          ),
        ]
      : [...list];

  return (
    <>
      <p>
        Find Countries{" "}
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </p>
      <p>{result.length}</p>
      {result.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : result.length == 1 ? (
        <SingleCountry list={list} setList={setList} search={search} />
      ) : (
        <ul>
          {result.map((item) => (
            <li key={item.name.common}>
              {item.name.common} <Collapsible item={item} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
