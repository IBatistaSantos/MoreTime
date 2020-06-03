'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Service = use('App/Models/Service')
class ServiceController {
  async index () {
    const services = await Service.query()
    .where('status', true)
    .fetch()
    return services
  }

  async store ({ request }) {
    const data = request.only(['name', 'description'])
    const user = await  Service.create(data)
    return user
  }

  async show ({ params, request, response }) {

  }

  /**
   * Update service details.
   * PUT or PATCH services/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const data = request.only(['name', 'description'])
    const service = await Service.findOrFail(params.id)
    service.merge(data)
    await service.save()
    return service
  }

  /**
   * Delete a service with id.
   * DELETE services/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const service = await Service.findOrFail(params.id)
    service.status =false
    await service.save()

    return response.status(200).send('Serviço deletado com sucesso')
  }
}

module.exports = ServiceController
