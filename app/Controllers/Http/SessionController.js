'use strict'
const User = use('App/Models/User')
class SessionController {
  async store ({ request, auth }) {
    const { email, password } = request.all()
    const user = await User.findByOrFail('email', email)
    const token = await auth.attempt(email, password)
    return {user, token }
  }
}

module.exports = SessionController
