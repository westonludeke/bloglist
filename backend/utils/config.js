require('dotenv').config()

const PORT = process.env.PORT || 3003;
const MONGO_DB_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGO_DB_URL

module.exports = {
  MONGO_DB_URL,
  PORT
}