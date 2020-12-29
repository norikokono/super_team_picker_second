
exports.up = function(knex) {
  return knex.schema.createTable("cohorts", table => {
      table.bigIncrements("id")
      table.string("name")
      table.string("logo_url")
      table.string("members")
      table.timestamp("createdAt").defaultTo(knex.fn.now())
      table.timestamp("updatedAt")
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("cohorts") 
};
