import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};
const del = (id, newObject) => {
  axios.delete(`${baseUrl}/${id}`, newObject).then((response) => {
    console.log("User deleted successfully:", response.data);
  });
};

export default { getAll, create, update, del };
