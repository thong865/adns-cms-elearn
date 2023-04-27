/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view,auth }) => {
  return view.render('welcome')
}).middleware(['slient'])


Route.get('/login', 'AuthController.loginIndex').as('loginPage').middleware(['checkMe'])
Route.get('/register', 'AuthController.registerIndex').as('registerPage').middleware(['checkMe'])
// Navbar Page
Route.get('/blogs', 'PagesController.blogsPage').as('blogPage').middleware(['slient'])
Route.get('/blogs/:id', 'PagesController.blogsDetailPage').as('blogDetailPage').middleware(['slient'])
Route.get('/faq', 'PagesController.faqPage').as('faqPage').middleware(['slient'])
Route.get('/knowledge', 'PagesController.knowledgePage').as('knowledgePage').middleware(['slient'])

Route.group(() => {
  Route.get('', 'PagesController.adminDashboard').as('adminDashboard')
  Route.get('/usersManage', 'PagesController.adminUserMange').as('adminUserMange')
}).prefix('admin').middleware('auth')


Route.group(()=> {
  Route.get('/','PagesController.userLoginProfile').as('userProfilePage')
}).prefix('myprf').middleware(['auth'])



Route.group(() => {
  Route.post('register', 'AuthController.storeRegister').as('ClientRegister')
  Route.post('signin', 'AuthController.UserLogin').as('ClientLogin')
  Route.post('logout', 'AuthController.userLogout').as('ClientLogout')
}).prefix('v1')
