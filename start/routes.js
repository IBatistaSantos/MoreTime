'use strict'


/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.store')

Route.resource('users', 'UserController').except(['update']).middleware(new Map([
  [['destroy'], ['auth']]
])).apiOnly()

Route.put('users', 'UserController.update').middleware('auth')

Route.resource('services', 'ServiceController').apiOnly()
Route.resource('serviceEmployee', 'ServiceEmployeeController').middleware('auth').apiOnly()
Route.resource('businessHours', 'BusinessHourController').middleware('auth').apiOnly()

Route.post('forgotpassword', 'ForgotPasswordController.store')
Route.put('resetepassword', 'ForgotPasswordController.update')
