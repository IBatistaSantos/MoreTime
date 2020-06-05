'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const User = use('App/Models/User')
const Mail = use('Mail')

const crypto = require('crypto')
const moment = require('moment')
class ForgotPasswordController {


  /**
   * Send token from email user.
   * POST forgotPassword
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({request, response}) {
    const email = request.input('email')
    try {
      const user = await User.findByOrFail('email', email)

      if (!user) {
        response.status(404).send('Não foi encontrado o usúario, verifique suas credenciais')
      }

    user.token_password = crypto.randomBytes(4).toString('hex'),
    user.token_created_at = new Date()

    await user.save()

    await Mail.send(
      ['emails.forgot_password'],
      {
        email,
        token : user.token_password,
        link: `${request.input('redirect_url')} `
      },
      message => {
        message
        .to(user.email)
        .from('suporte@more.com', 'Israel Batista | More Time')
        .subject('Recuperação de Senha')
      }
    )

    return response.status(200).send('Token enviado com sucesso')
    } catch (error) {
      return response.status(400).send('Ocorreu um erro no envio do token ')
    }
  }

  /**
   * Resete password user.
   * PUT resetepassword
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({request, response}) {
    try {
       const {token, password} = request.all()

       const user = await User.findByOrFail('token_password', token)
       const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

       if (tokenExpired) {
          return response.status(401).send('Token expirado')
       }

       user.token_password = null,
       user.token_created_at = null,
       user.password = password

       await user.save()
    } catch (error) {
      return response.status(400).send('Ocorreu um erro na resete de sua senha')
    }
  }
}

module.exports = ForgotPasswordController
