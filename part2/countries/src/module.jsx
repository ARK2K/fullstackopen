import { useState, useEffect } from "react";
import countryService from "./services/countries";

const SingleCountry = ({ search, setList, list }) => {
  const [weather, setWeather] = useState([]);
  useEffect(() => {
    let result =
      search != ""
        ? list.filter((item) =>
            item.name.common.toLowerCase().includes(search.toLowerCase())
          )
        : list;
    countryService
      .getName(result[0].name.common.toLowerCase())
      .then((response) => {
        if (response.data != null) {
          setList([response.data]);
        }
      });
    countryService.getWeather(list[0].capital[0]).then((res) => {
      console.log(res.data);
      setWeather(res.data);
    });
  }, []);
  let lang = list[0].languages,
    flag = list[0].flags;

  console.log(weather, "weather");
  return (
    <div>
      <h1>{list[0].name.common}</h1>
      <p>Capital: {list[0].capital}</p>
      <p>Area: {list[0].area}</p>
      <p>
        <b>Languages:</b>
      </p>
      <ul>
        {Object.keys(lang).map((key) => (
          <li key={key}>{lang[key]}</li>
        ))}
      </ul>
      <img src={flag.png} alt={flag.alt} />
      <h2>Weather in {list[0].capital}</h2>
      <p>Temperature: {weather.length != 0 ? weather.main.temp : null} °C</p>
      <p>Wind: {weather.length != 0 ? weather.wind.speed : null} m/s</p>
    </div>
  );
};

const Collapsible = ({ item }) => {
  const [val, setVal] = useState(false);
  let lang = item.languages,
    flag = item.flags;
  return (
    <div>
      <button type="button" onClick={() => setVal(!val)}>
        {val ? "Hide" : "Show"}
      </button>
      {val && (
        <div>
          <h1>{item.name.common}</h1>
          <p>Capital: {item.capital}</p>
          <p>Area: {item.area}</p>
          <p>
            <b>Languages:</b>
          </p>
          <ul>
            {Object.keys(lang).map((key) => (
              <li key={key}>{lang[key]}</li>
            ))}
          </ul>
          <img src={flag.png} alt={flag.alt} />
        </div>
      )}
    </div>
  );
};

export { SingleCountry, Collapsible };
