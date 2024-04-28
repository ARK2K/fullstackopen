import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/",
  apiUrl = "http://api.openweathermap.org/data/2.5/";
const api_key = "f8c86b598df76e70e66ccdfabd08cbeb";

const getAll = () => {
  return axios.get(`${baseUrl}/api/all`);
};

const getName = (name) => {
  return axios.get(`${baseUrl}/api/name/${name}`);
};

const getWeather = (city) => {
  return axios.get(`${apiUrl}weather?q=${city}&units=metric&APPID=${api_key}`);
};

export default { getName, getAll, getWeather };
