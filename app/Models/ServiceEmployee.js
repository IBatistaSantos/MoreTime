'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServiceEmployee extends Model {
  static boot () {
    super.boot()
    this.addGlobalScope(builder => builder.with('service'))
    this.addGlobalScope(builder => builder.with('employee'))
  }
  static get hidden () {
    return ['created_at', 'updated_at']
  }

  service (){
    return this.belongsTo('App/Models/Service')
  }

  employee () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = ServiceEmployee
