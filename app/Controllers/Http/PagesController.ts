import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import Muser from 'App/Models/Muser'

export default class PagesController {
    public async HomePage({ view }: HttpContextContract) {
        return view.render('welcome')
    }
    public async knowledgePage({ view }: HttpContextContract) {
        return view.render('knowledge/index')
    }
    public async faqPage({ view }: HttpContextContract) {
        return view.render('Faq/index')
    }
    public async blogsPage({ view }: HttpContextContract) {
        const blogs = await MContent.query().paginate(1,50)
        return view.render('blog/index',{
            blogs
        })
    }
    public async blogsDetailPage({ view,params,request }: HttpContextContract) {
        const blogs = await MContent.query().preload('category').firstOrFail()
        return view.render('blog/detail',{
            blogs
        })
    }

    // client profile
    public async userLoginProfile({ view,auth}: HttpContextContract) {
        await auth.use('web').authenticate()
        return view.render('profile/index')
    }

    //adminDashboard
    public async adminDashboard({ view,auth}: HttpContextContract) {
        await auth.use('web').authenticate()
        return view.render('admin/dashboard')
    }
    public async adminUserMange({ view }: HttpContextContract) {
        const Users = await Muser.query().paginate(1, 50)
        return view.render('admin/users/index',{
            users: Users
        })
    }
}
