'use strict'
const User = use('App/Models/User')
class UserController {

  async index() {
    const users = await User.query()
     .where('is_provider', true)
     .where('status', true)
     .fetch()

    return users
  }

  async show ({params, response }) {
    const user = await User.findOrFail(params.id)

    if (user.is_provider === false) {
      return response.status(401)
      .send('Esse usuário não é funcionário autônomo')
    }

    return user
  }

  async store ({request}) {
    const data = request.only(['name', 'email', 'password', 'bio', 'is_provider'])
    const user = await  User.create(data)
    return user
  }

  async update ({request, auth }) {
    const data = request.only(['name', 'email', 'password', 'bio', 'is_provider'])
    const user = await User.findOrFail(auth.user.id)
    user.merge(data)
    await user.save()
    return user
  }

  async destroy ({auth}) {
    const user = await User.findOrFail(auth.user.id)
    user.status = false
    await user.save()
    return response.status(200).send('Usuário deletado com sucesso')
  }
}

module.exports = UserController
