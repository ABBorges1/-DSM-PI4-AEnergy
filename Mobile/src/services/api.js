import axios from 'axios';

const api = axios.create({
  baseURL: "https://aenergy-api.azurewebsites.net",
});


export default api;