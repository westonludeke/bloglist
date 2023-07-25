import axios from 'axios';

const baseUrl = 'http://localhost:3003/api/blogs'; // Replace with your backend URL

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newBlog) => {
  return axios.post(baseUrl, newBlog).then((response) => response.data);
};

export default { getAll, create };
