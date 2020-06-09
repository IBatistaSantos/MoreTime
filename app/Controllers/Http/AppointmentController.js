'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ServiceEmployee = use('App/Models/ServiceEmployee')
const Appointment = use('App/Models/Appointment')
const {format, isToday, parseISO, isBefore} = require('date-fns')

class AppointmentController {

  /**
   * Show a list of all appointments.
   * GET appointments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ auth }) {
    const appointment = await Appointment
    .query()
    .where((builder) => {
          builder
              .where('user_id', auth.user.id)
              .orWhere((employee) => {
                employee.whereHas('serviceEmployee', (builderEmployee) => {
                  builderEmployee.where('user_id', auth.user.id)
                })
              })

  })
    .with('client')
    .with('serviceEmployee')
    .fetch()

    return appointment
  }



  /**
   * Create/save a new appointment.
   * POST appointments
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const {service_employee_id, timetable, date} = request.only(['service_employee_id', 'timetable','date'])

    const serviceEmployee = await ServiceEmployee.findOrFail(service_employee_id)
    if(serviceEmployee.user_id === auth.user.id) {
      return response.status(401).send('Você não pode agendar um serviço para você mesmo ')
    }

    const dataParsed = parseISO(date)

    if (isBefore(dataParsed, new Date()) && !isToday(dataParsed)) {
      return response.status(401).send('Essa data já passou')
    }

    const appointmentExists = await Appointment.findBy({
      'service_employee_id': service_employee_id,
      'date': date,
      'timetable':timetable
    })

    if(appointmentExists) {
      return response.status(401).send('Já tem agendamento para esse dia e horário')
    }

     const appointment = await Appointment.create({
      service_employee_id: service_employee_id,
      date: format(dataParsed, 'dd/MM/yyyy'),
      timetable:timetable,
      user_id: auth.user.id
    })

    return appointment

  }

  /**
   * Display a single appointment.
   * GET appointments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ auth }) {
    const dataParsed = format(new Date(), 'dd/MM/yyyy')

    const appointment = await Appointment
    .query()
    .where((builder) => {
          builder
              .where('user_id', auth.user.id)
              .orWhere((employee) => {
                employee.whereHas('serviceEmployee', (builderEmployee) => {
                  builderEmployee.where('user_id', auth.user.id)
                })
              })

  })
    .where('date', dataParsed)
    .with('client')
    .with('serviceEmployee')
    .fetch()

    return appointment
  }



  /**
   * Update appointment details.
   * PUT or PATCH appointments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
      const {date, timetable, status} = request.only(['date', 'timetable','status'])
      try {
        const appointment = await Appointment.findOrFail(params.id)

        if (appointment.user_id !== auth.user.id) {
          return response.status(401).send('Somente o cliente pode alterar o agendamento')
        }

        appointment.merge({
          date: date,
          timetable: timetable,
          status: status
      })
      await appointment.save()
      await appointment.loadMany(['client', 'serviceEmployee'])

      return appointment
      } catch (error) {
        response.status(404).send('Agendamento não encontrado')
      }

  }

  /**
   * Delete a appointment with id.
   * DELETE appointments/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    try {
      const appointment = await Appointment.findOrFail(params.id)

      if (appointment.user_id !== auth.user.id) {
        return response.status(401).send('Somente o cliente pode cancelar um agendamento')
      }

      await appointment.delete()

    } catch (error) {
      return response.status(404).send('Agendamento não encontrado')
    }
  }
}

module.exports = AppointmentController
