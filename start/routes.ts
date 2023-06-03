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
import Application from '@ioc:Adonis/Core/Application'
Route.get('/', 'PagesController.HomePage').middleware(['slient'])


Route.get('/login', 'AuthController.loginIndex').as('loginPage').middleware(['checkMe'])
Route.get('/register', 'AuthController.registerIndex').as('registerPage').middleware(['checkMe'])
// Navbar Page
Route.get('/blogs', 'PagesController.blogsPage').as('blogPage').middleware(['slient'])
// Route.get('/blogs/:id', 'PagesController.blogsDetailPage').as('blogDetailPage').middleware(['slient'])
Route.get('/faq', 'PagesController.faqPage').as('faqPage').middleware(['slient'])
Route.get('/other', 'PagesController.otherPage').as('otherPage').middleware(['slient'])
Route.get('/knowledge', 'PagesController.knowledgePage').as('knowledgePage').middleware(['slient'])
Route.get('/content/:id', 'PagesController.ContentDetail').as('ContentDetail').middleware(['slient'])



Route.post('/content/comment', 'AuthController.userComment').as('ContentComment').middleware(['auth'])
Route.post('/content/comment/replie', 'AuthController.ContentCommentReplie').as('ContentCommentReplie').middleware(['auth'])
Route.group(() => {
  Route.get('', 'PagesController.adminDashboard').as('adminDashboard')
  Route.get('/users', 'UsersController.adminUserMange').as('adminUserMange')
  Route.get('/users/frm', 'UsersController.adminUserForm').as('adminUserForm')
  Route.get('/users/password/:id', 'UsersController.adminUserFormResetPassword').as('adminUserFormResetPassword')

  // this for blogs and content
  Route.get('/blogs', 'AdminBlogsController.adminBlogsMange').as('adminBlogsMange')
  Route.get('/blogs/form', 'AdminBlogsController.adminBlogsForm').as('adminBlogsform')
  Route.get('/blogs/categories', 'AdminBlogsController.adminBlogsCategory').as('adminBlogsCategories')
  Route.get('/blogs/categories/form', 'AdminBlogsController.adminBlogsCategoryForm').as('adminBlogsCategoriesForm')
  Route.post('/blogs/categories', 'AdminBlogsController.adminBlogsCategoryCreate').as('adminBlogsCategoriesCreate')
  Route.post('/blogs/categories/update', 'AdminBlogsController.adminBlogsCategoryUpdate').as('adminBlogsCategoriesUpdate')
  Route.post('/blogs/categories/delete', 'AdminBlogsController.adminBlogsCategoryDelete').as('adminBlogsCategoriesDelete')

  //form to create
  Route.get('/content/:id', 'PagesController.adminBlogsDetial').as('adminContentDetail')

  // knowledge
  Route.get('/knowledges', 'AdminBlogsController.adminknowledges').as('adminknowledges')
  Route.get('/knowledges/category', 'AdminBlogsController.adminknowledgesCategory').as('adminknowledgesCategory')
  Route.post('/knowledges/category', 'AdminBlogsController.adminknowledgesCategoryCreate').as('adminknowledgesCategoryCreate')
  Route.get('/knowledges/category/form', 'AdminBlogsController.adminknowledgesCategoryForm').as('adminknowledgesCategoryForm')
  Route.post('/knowledges/category/update', 'AdminBlogsController.adminknowledgesCategoryUpdate').as('adminknowledgesCategoryUpdate')
  Route.post('/knowledges/category/delete', 'AdminBlogsController.adminknowledgesCategoryDelete').as('adminknowledgesCategoryDelete')
  Route.get('/knowledges/form', 'AdminBlogsController.adminknowledgesForm').as('adminknowledgesForm')


  // section part
  Route.get('/sections/', 'AdminBlogsController.adminSections').as('adminSection')
  Route.get('/sections/form', 'AdminBlogsController.adminSectionsForm').as('adminSectionForm')

  Route.get('/other/', 'AdminBlogsController.adminOther').as('adminOther')
  Route.get('/other/form', 'AdminBlogsController.adminOtherForm').as('adminOtherForm')

   // section part
   Route.get('/carousel/', 'AdminBlogsController.adminCarousel').as('adminCarousel')
   Route.get('/carousel/form', 'AdminBlogsController.adminCarouselForm').as('adminCarouselForm')
  
}).prefix('admin').middleware('auth')


Route.group(() => {
  Route.get('/', 'PagesController.userLoginProfile').as('userProfilePage')
  Route.get('/blogs', 'AdminBlogsController.clientBlogsMange').as('myblogPage')
  Route.get('/blogs/frm', 'AdminBlogsController.clientBlogsForm').as('myblogFormPage')
  Route.get('/knowledges', 'AdminBlogsController.clientknowledges').as('myKnowledgePage')
  Route.get('/knowledges/frm', 'AdminBlogsController.clientknowledgesForm').as('myKnowledgeFormPage')
  Route.get('/account', 'AuthController.myAccount').as('userProfileAccount')
  Route.put('account', 'AuthController.UpdateProfile').as('UpdateProfile')
}).prefix('myprf').middleware(['auth'])



Route.group(() => {
  Route.post('register', 'AuthController.storeRegister').as('ClientRegister')
  Route.post('users/create', 'AuthController.storeUser').as('userCreation')
  Route.delete('users/:id', 'AuthController.userDelete').as('userDelete')
  Route.put('users/:id', 'AuthController.UdpateUser').as('UdpateUser')
  Route.put('rset-password/users', 'UsersController.adminUserReset').as('adminResetPassword')
  Route.post('signin', 'AuthController.UserLogin').as('ClientLogin')
  Route.post('logout', 'AuthController.userLogout').as('ClientLogout')


  Route.group(() => {

    Route.post('create', 'AdminBlogsController.adminBlogsStore').as('ContentCreate')
    Route.put('update', 'AdminBlogsController.ContentUpdate').as('ContentUpdate')
    Route.delete(':id', 'PagesController.adminBlogsDelete').as('ContentDelete')
  }).prefix('content')

  Route.post('fileuploadCk', async ({ request, response }) => {
    const  files  = request.files('upload')
    let resFile = [];

    for (let image of files) {
    await image.move(Application.tmpPath('uploads'))
      resFile.push({ file_path: `/v1/filestream?fileUrl=${image.fileName}`,file_type:image.extname+'|'+image.fileName})
    }
    return  response.json(resFile)
  })
  Route.get('filestream', async ({ request, response }) => {
    const { fileUrl } = request.all()
    const filePath = Application.tmpPath(`uploads/${fileUrl}`)
    response.download(filePath, true)
  })

  Route.post('uploadCk', async ({ request, response }) => {
    const files = request.files('upload')
    await files[0].move(Application.tmpPath('uploads'))
    return { uploaded: true, url: `/v1/filestream?fileUrl=${files[0].fileName}` }
  })
}).prefix('v1')

