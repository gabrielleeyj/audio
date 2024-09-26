import axios from "axios";

// create base URL to make the requests to the API
const instance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

export default instance;

