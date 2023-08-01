import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject);
  return request.then(response => response.data);
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
}

const remove = async (id) => {
  try {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the Bearer token in the Authorization header
    },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
  } catch (error){
    console.log('blogService Error deleting blog: ', error)
  } 
};

export default { getAll, create, update, remove }