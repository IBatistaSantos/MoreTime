'use strict'


/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('sessions', 'SessionController.store')

Route.resource('users', 'UserController').except(['update']).middleware(new Map([
  [['destroy'], ['auth']]
])).apiOnly()

Route.put('users', 'UserController.update').middleware('auth')
Route.post('file/avatar', 'FileController.store').middleware('auth')
Route.get('file/:name', 'FileController.show')


Route.resource('services', 'ServiceController').apiOnly()
Route.resource('serviceEmployee', 'ServiceEmployeeController').middleware('auth').apiOnly()
Route.resource('businessHours', 'BusinessHourController').middleware('auth').apiOnly()

Route.post('forgotpassword', 'ForgotPasswordController.store')
Route.put('resetepassword', 'ForgotPasswordController.update')

Route.resource('scheduling', 'AppointmentController').except(['show']).middleware('auth').apiOnly()
Route.get('appointment/today', 'AppointmentController.show').middleware('auth')


Route.get('countToDo', 'DashboardController.countToDo').middleware(['auth'])
Route.get('countConcluded', 'DashboardController.countConcluded').middleware('auth')
Route.get('countPrice', 'DashboardController.countPrice').middleware('auth')
