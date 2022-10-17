const knex = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-44-209-57-4.compute-1.amazonaws.com",
    user: "jpiwkmskpbwhgt",
    password:
      "a487a20e22874af6652482c95e81535459ae19477e1aa92672c9e71afc3768cc",
    database: "d5t659el6n6c2e",
    port: 5432,
    ssl: { rejectUnauthorized: false },
  },
});

module.exports = knex;
