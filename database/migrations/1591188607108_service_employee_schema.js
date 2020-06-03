'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceEmployeeSchema extends Schema {
  up () {
    this.create('service_employees', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('service_id').unsigned().references('id').inTable('services')
      table.float('price').notNullable()
      table.string('info')
      table.timestamps()
    })
  }

  down () {
    this.drop('service_employees')
  }
}

module.exports = ServiceEmployeeSchema
