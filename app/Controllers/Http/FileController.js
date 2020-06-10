'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const File = use('App/Models/File')
const User = use('App/Models/User')

const Helpers = use('Helpers')
const Env = use('Env')
class FileController {

async show ({params, response}) {
  const file = await File.findByOrFail('file', params.name)
    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  /**
   * Create/save avatar do cliente.
   * POST avatar
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({request, response, auth}) {
    try {
      if(!request.file('file')) return
      const user = await User.findOrFail(auth.user.id)

      const upload = request.file('file', { size: '2mb' })
      const filename = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: filename
      })

      if(!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: filename,
        name: `${upload.clientName}-${Date.now()}`,
        type: upload.type,
        url: `${Env.get('APP_URL')}/file/${filename}`,
        subtype: upload.subtype
      })

      user.merge({
        file_id: file.id
      })

      await user.save()

      return user

    } catch (error) {
      return response.status(400).send(error)
    }
  }
}

module.exports = FileController
