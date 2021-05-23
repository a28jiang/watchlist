// import { auth, db } from "../firebase";
// import firebase from "firebase/app";

const API_URL = process.env.REACT_APP_movieURL;
const IMG_URL = process.env.REACT_APP_movieIMGURL;
const API_KEY = process.env.REACT_APP_movieKEY;

const axios = require("axios");

const movieAPI = axios.create({
  baseURL: API_URL,
  params: {
    api_key: API_KEY,
  },
});

const getTrending = async () => {
  try {
    const response = await movieAPI.get("tv/popular");
    return response.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};
const searchMovie = async (query) => {
  if (query && query.length) {
    const params = { query };
    let resObj;
    try {
      const response = await movieAPI.get("search/movie", { params });
      resObj = response.data.results;
      if (resObj) return resObj;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
};

const searchMedia = async (query, type) => {
  if (query && query.length) {
    const params = { query };
    let resObj;
    try {
      const response = await movieAPI.get(`search/${type}`, { params });
      resObj = response.data.results;
      if (resObj) return resObj;
    } catch (error) {
      console.error(error);
    }
  }
  return [];
};

const getImg = (path) => {
  return `${IMG_URL}${path}`;
};

export { getTrending, searchMedia, getImg };
