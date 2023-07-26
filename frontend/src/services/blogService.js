import axios from 'axios';

const baseUrl = '/api/blogs';

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newBlog) => {
  return axios.post(baseUrl, newBlog).then((response) => response.data);
};

export default { getAll, create };
