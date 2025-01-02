module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  define: {
    timespamps: true,
    underscored: true,
    underscoredAll: true,
  },
}

// const dotenv = require('dotenv')
// const pg = require('pg')
// dotenv.config()

// module.exports = {
//   dialect: 'postgres',
//   dialectModule: pg,
//   host: process.env.DB_HOST,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   define: {
//     timespamps: true,
//     underscored: true,
//     underscoredAll: true,
//   },
// }