const knex = require("knex")({
  client: "pg",
  connection: {
    host: "ec2-52-23-131-232.compute-1.amazonaws.com",
    user: "rhgqpwevyuiwou",
    password:
      "6798328a0fa2a4bc1ae6e6341c54c8b8443097cb8b26df0ddff81bb4b8f7a0ce",
    database: "dcq9fp5883onj3",
    port: 5432,
    ssl: { rejectUnauthorized: false },
  },
});

module.exports = knex;
