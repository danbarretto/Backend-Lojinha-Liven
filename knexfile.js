// Update with your config settings.

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
    },
    migrations:{
      tableName:'user',
      directory:`${__dirname}/src/database/migrations`
    }                   
  },
}

