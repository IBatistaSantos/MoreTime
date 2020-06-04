'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Service extends Model {
  static get hidden () {
    return ['created_at', 'updated_at', 'status', 'description']
  }
}

module.exports = Service
