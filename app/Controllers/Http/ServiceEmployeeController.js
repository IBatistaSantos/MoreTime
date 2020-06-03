'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with serviceemployees
 */

 const ServiceEmployee = use('App/Models/ServiceEmployee')
 const Service = use('App/Models/Service')
const User = use('App/Models/User')

 class ServiceEmployeeController {
  /**
   * Show a list of all serviceemployees.
   * GET serviceemployees
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({auth}) {
    const serviceEmployees = await ServiceEmployee.query()
      .where('user_id', auth.user.id)
      .fetch()

    return serviceEmployees
  }


  /**
   * Create/save a new serviceemployee.
   * POST serviceemployees
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const {service_id, price, info} = request.all()

    const user = await User.findOrFail(auth.user.id)

    if(user.is_provider === false) {
      return response.status(401).send('Você não é um funcionário')
    }

    try {
      const service = await Service.findOrFail(service_id)

      if (service.status === false ) {
        response.status(401).send('Esse serviço está desativado')
      }
    } catch (error) {
      return response.status(401)
      .send('Ocorreu um problema na procura do serviço, verifique as credencias')
    }

    const serviceEmployee = await ServiceEmployee.findBy({
      user_id: auth.user.id,
      service_id: service_id
    })

    if (serviceEmployee) {
      return response.status(401).send('Esse serviço já foi cadastrado pelo funcionário')
    }

    try {
    const service = await ServiceEmployee.create({
      user_id: auth.user.id,
      service_id: service_id,
      price,
      info
    })
    return service
    } catch (error) {
      return response.status(401).send('Ocorreu um problema na criação da prestação de serviço')
    }
  }


  async show ({ params, request, response, view }) {
  }

async update ({ params, request, response, auth }) {
    const {price, info} = request.all()

    const user = await User.findOrFail(auth.user.id)

    if(user.is_provider === false) {
      return response.status(401).send('Você não é um funcionário')
    }
    try {
    const serviceEmployee = await ServiceEmployee.findOrFail(params.id)

    if (serviceEmployee.user_id !== auth.user.id) {
      return response.status(401).send('Você não pode alterar essa prestação de serviço')
    }
    serviceEmployee.merge({price: price, info: info})
    await serviceEmployee.save()
    return serviceEmployee
    } catch (error) {
      return response.status(401).send('Não encontramos a prestação de serviço')
    }
  }

  /**
   * Delete a serviceemployee with id.
   * DELETE serviceemployees/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    const user = await User.findOrFail(auth.user.id)

    if(user.is_provider === false) {
      return response.status(401).send('Você não é um funcionário')
    }

    try {
    const serviceEmployee = await ServiceEmployee.findOrFail(params.id)

    if (serviceEmployee.user_id !== auth.user.id) {
      return response.status(401).send('Você não pode deletar essa prestação de serviço')
    }
    await serviceEmployee.delete()
    return response.status(200).send('Prestação de serviço alterado com sucesso')
    } catch (error) {
      return response.status(401).send('Não encontramos a prestação de serviço')
    }
  }
}

module.exports = ServiceEmployeeController
