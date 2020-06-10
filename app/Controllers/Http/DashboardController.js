'use strict'
const Appointment = use('App/Models/Appointment')
const Database = use('Database')
class DashboardController {

  async countToDo({auth}) {
    const countToDO = await Appointment.query().where((builder) => {
      builder
          .where('user_id', auth.user.id)
          .orWhere((employee) => {
            employee.whereHas('serviceEmployee', (builderEmployee) => {
              builderEmployee.where('user_id', auth.user.id)
            })
          })

      }).where('status', 'toDo').count('* as total')
        const totalToDo = countToDO[0].total

     return totalToDo
  }

  async countConcluded ({auth}) {
    const countConcluded = await Appointment.query().where((builder) => {
      builder
          .where('user_id', auth.user.id)
          .orWhere((employee) => {
            employee.whereHas('serviceEmployee', (builderEmployee) => {
              builderEmployee.where('user_id', auth.user.id)
            })
          })

      }).where('status', 'concluded').count('* as total')
        const totalConcluded = countConcluded[0].total
        return totalConcluded
  }
}


module.exports = DashboardController
