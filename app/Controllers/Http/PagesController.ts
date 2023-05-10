import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import MContentCategory from 'App/Models/MContentCategory'
import Muser from 'App/Models/Muser'

export default class PagesController {
    public async HomePage({ view }: HttpContextContract) {
        const QAFrequency = await MContent.query().where('slug', 'QAFG')
        const Sections = await MContent.query().where('slug', 'HOME1')
        const blogs = await MContent.query().where('slug', 'BLOG').paginate(1, 8)
        const knowledges = await MContent.query().where('slug', 'KNWL').paginate(1, 8)
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title','id').where('slug', 'OTH').andWhere('status','P')
        return view.render('welcome', {
            QAFrequency,
            Sections,
            knowledges,
            blogs,
            category,
            otherItem
        })
    }
    public async knowledgePage({ request, view }: HttpContextContract) {
        const { qkey,cat } = request.all()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title','id').where('slug', 'OTH').andWhere('status','P')
        let conents;
        if (qkey || cat) {
            conents = await MContent.query().where('slug', 'KNWL').andWhereRaw(`title like '%${qkey ? qkey : ''}%' ${cat ? 'and cate_id='+cat:''}`).paginate(1, 50)
        } else {
            conents = await MContent.query().where('slug', 'KNWL').paginate(1, 50)
        }
        return view.render('knowledge/index', {
            conents, qkey: {
                q: qkey ? qkey : ''
            },
            category,
            otherItem
        })
    }
    public async faqPage({ view }: HttpContextContract) {
        const content = await MContent.query().where('slug', 'FAQ').first()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title','id').where('slug', 'OTH').andWhere('status','P')
        return view.render('Faq/index', {
            content,
            otherItem,
            category
        })
    }
    public async otherPage({ request, view }: HttpContextContract) {
        const { pageId } = request.all()
        const content = await MContent.query().where('slug', 'OTH').where('id', pageId).first()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title','id').where('slug', 'OTH').andWhere('status','P')
        return view.render('Other/index', {
            content,
            otherItem,
            category
        })
    }
    public async blogsPage({ view, request, session, response }: HttpContextContract) {
        const { qkey } = request.all()
        let blogs;
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title','id').where('slug', 'OTH').andWhere('status','P')
        if (qkey) {
            blogs = await MContent.query().where('slug', 'BLOG').andWhereRaw(`title like '%${qkey ? qkey : ''}%'`).paginate(1, 50)
        } else {
            blogs = await MContent.query().where('slug', 'BLOG').paginate(1, 50)
        }
        return view.render('blog/index', {
            blogs,
            qkey: {
                q: qkey ? qkey : ''
            },
            category,
            otherItem
        })
    }
    public async ContentDetail({ view, params, request }: HttpContextContract) {
        const blogs = await MContent.query().where('id', params.id).preload('category').first()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title','id').where('slug', 'OTH').andWhere('stat','P')
        return view.render('content-detail', {
            blogs,
            category,
            otherItem
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
        const contents = await MContent.query().where('id', params.id).first()
        return view.render('admin/contentInfo', {
            contents
        })
    }


    // Content

    public async adminBlogsDelete({ params, response }: HttpContextContract) {
        try {
            (await MContent.findOrFail(params.id)).delete()
            response.status(201)
            return {
                message: 'completed'
            }
        } catch (error) {

        }
    }
}
