import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import Muser from 'App/Models/Muser'

export default class PagesController {
    public async HomePage({ view }: HttpContextContract) {
        const QAFrequency = await MContent.query().where('slug', 'QAFG')
        const Sections = await MContent.query().where('slug', 'HOME1')
        const blogs = await MContent.query().where('slug', 'BLOG')
        const knowledges = await MContent.query().where('slug', 'KNWL')
        return view.render('welcome',{
            QAFrequency,
            Sections,
            knowledges,
            blogs
        })
    }
    public async knowledgePage({ request, view }: HttpContextContract) {
        const { qkey } = request.all()
        let conents;
        if (qkey) {
            conents = await MContent.query().where('slug', 'KNWL').andWhereRaw(`title like '%${qkey ? qkey : ''}%'`).paginate(1, 50)
        } else {
            conents = await MContent.query().where('slug', 'KNWL').paginate(1, 50)
        }
        return view.render('knowledge/index', {
            conents, qkey: {
                q: qkey ? qkey : ''
            }
        })
    }
    public async faqPage({ view }: HttpContextContract) {
        return view.render('Faq/index')
    }
    public async blogsPage({ view, request, session, response }: HttpContextContract) {
        const { qkey } = request.all()
        let blogs;
        if (qkey) {
            blogs = await MContent.query().where('slug', 'BLOG').andWhereRaw(`title like '%${qkey ? qkey : ''}%'`).paginate(1, 50)
        } else {
            blogs = await MContent.query().where('slug', 'BLOG').paginate(1, 50)
        }
        return view.render('blog/index', {
            blogs,
            qkey: {
                q: qkey ? qkey : ''
            }
        })
    }
    public async blogsDetailPage({ view, params, request }: HttpContextContract) {
        const blogs = await MContent.query().preload('category').firstOrFail()
        return view.render('blog/detail', {
            blogs
        })
    }

    // client profile
    public async userLoginProfile({ view, auth }: HttpContextContract) {
        await auth.use('web').authenticate()
        return view.render('profile/index')
    }

    //adminDashboard
    public async adminDashboard({ view, auth }: HttpContextContract) {
        await auth.use('web').authenticate()
        return view.render('admin/dashboard')
    }

    public async adminBlogs({ view }: HttpContextContract) {
        const Users = await Muser.query().paginate(1, 50)
        return view.render('admin/users/index', {
            users: Users
        })
    }
    public async adminBlogsDetial({ params, view }: HttpContextContract) {
        const contents = await MContent.query().where('id',params.id).first()
        return view.render('admin/contentInfo', {
            contents
        })
    }


    // Content

    public async adminBlogsDelete({ params,response}: HttpContextContract) {
        try {
            (await MContent.findOrFail(params.id)).delete()
            response.status(201)
            return {
                message:'completed'
            }
        } catch (error) {
            
        }
    }
}
