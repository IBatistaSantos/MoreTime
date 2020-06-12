'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with businesshours
 */
const BusinessHour = use('App/Models/BusinessHour')
const User = use('App/Models/User')
class BusinessHourController {
  /**
   * Show a list of all businesshours.
   * GET businesshours
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */

  async index ({auth}) {
    const businesshours = await BusinessHour.query()
      .where('user_id', auth.user.id)
      .fetch()

    return businesshours
  }

  async store ({ request, response, auth }) {
    const {weekday, open_time, close_time} = request.all()
    const user = await User.findOrFail(auth.user.id)
    if(user.is_provider === false) {
      return response.status(401).send('Você não é um funcionário')
    }

    try {
      const businesshourExists = await BusinessHour.findBy({
      "user_id": auth.user.id,
      "weekday": weekday
    })

      if (businesshourExists) {
        return response.status(401).send('Esse dia já tem horário definido')
      }

      const businesshour= await BusinessHour.create({
        weekday: weekday,
        open_time: open_time,
        close_time: close_time,
        user_id: auth.user.id
      })

      return businesshour

    } catch (error) {
      response.status(401)
      .send('Ocorreu um problema criação de horário de funcionamento, verifique as credencias')
    }


  }

  /**
   * Display a single businesshour.
   * GET businesshours/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }


  /**
   * Update businesshour details.
   * PUT or PATCH businesshours/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const {open_time, close_time} = request.all()
    const user = await User.findOrFail(auth.user.id)
    if(user.is_provider === false) {
      return response.status(401).send('Você não é um funcionário')
    }

    try {
      const businesshour = await BusinessHour.findOrFail(params.id)

      businesshour.merge({
      open_time: open_time,
      close_time: close_time,
    })

     await businesshour.save()
      return businesshour

    } catch (error) {
      response.status(401)
      .send('Ocorreu uma atualização no horário de funcionamento, verique as suas credencias')
    }

  }

  /**
   * Delete a businesshour with id.
   * DELETE businesshours/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    try {
      const businesshour = await BusinessHour.findOrFail(params.id)

      if (businesshour.user_id !== auth.user.id) {
        return response.status(401)
      .send('Você não pode alterar esse horário de funcionamento')
      }

     await businesshour.delete()
      return response.status(200).send('Exclusão feita com sucesso')

    } catch (error) {
      response.status(401)
      .send('Ocorreu uma exclusão do horário de funcionamento, verique as suas credencias')
    }

  }
}

module.exports = BusinessHourController
