'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('bio')
      table.string('token_password')
      table.string('token_created_at')
      table.boolean('status').defaultTo(true)
      table.integer('file_id').unsigned().references('id').inTable('files')
      table.boolean('is_provider').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
