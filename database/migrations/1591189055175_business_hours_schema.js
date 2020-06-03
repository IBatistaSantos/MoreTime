'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BusinessHoursSchema extends Schema {
  up () {
    this.create('business_hours', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('weekday').notNullable()
      table.time('open_time').notNullable()
      table.time('close_time').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('business_hours')
  }
}

module.exports = BusinessHoursSchema
