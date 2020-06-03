'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppointmentSchema extends Schema {
  up () {
    this.create('appointments', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('service_employee_id').unsigned().references('id').inTable('service_employees')
      table.string('timetable').notNullable()
      table.string('date').notNullable()
      table.string('date_start').notNullable()
      table.string('date_end').notNullable()
      table.enu('status', ['toDo', 'concluded'])
      table.timestamps()
    })
  }

  down () {
    this.drop('appointments')
  }
}

module.exports = AppointmentSchema
