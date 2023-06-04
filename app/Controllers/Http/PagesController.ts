import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import MContentCategory from 'App/Models/MContentCategory'
import McontentComment from 'App/Models/McontentComment'
import Muser from 'App/Models/Muser'
import CommentValidator from 'App/Validators/CommentValidator'

export default class PagesController {
    public async HomePage({ view }: HttpContextContract) {
        const QAFrequency = await MContent.query().where('slug', 'QAFG')
        const Carousels = await MContent.query().where('slug', 'CRSEL')
        const Sections = await MContent.query().where('slug', 'HOME1')
        const blogs = await MContent.query().preload('owner',(q)=> {
            q.select('maker','avatar','firstname','lastname')
          }).where('slug', 'BLOG').paginate(1, 8)
        const knowledges = await MContent.query().preload('owner',(q)=> {
            q.select('maker','avatar','firstname','lastname')
          }).preload('category').where('slug', 'KNWL').orderBy('createdAt','desc').paginate(1, 8)
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
        return view.render('welcome', {
            QAFrequency,
            Sections,
            knowledges,
            blogs,
            category,
            Carousels,
            otherItem
        })
    }
    public async knowledgePage({ request, view }: HttpContextContract) {
        const { qkey, cat } = request.all()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
        let conents;
        if (qkey || cat) {
            conents = await MContent.query().preload('owner',(q)=> {
                q.select('maker','avatar','firstname','lastname')
            }).where('slug', 'KNWL').preload('category').andWhereRaw(`title like '%${qkey ? qkey : ''}%' ${cat ? 'and cate_id=' + cat : ''}`).orderBy('createdAt','desc').paginate(1, 50)
        } else {
            conents = await MContent.query().where('slug', 'KNWL').preload('owner',(q)=> {
                q.select('maker','avatar','firstname','lastname')
            }).preload('category').orderBy('createdAt','desc').paginate(1, 50)
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
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
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
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
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
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
        if (qkey) {
            blogs = await MContent.query().where('slug', 'BLOG').andWhereRaw(`title like '%${qkey ? qkey : ''}%'`).orderBy('createdAt','desc').paginate(1, 50)
        } else {
            blogs = await MContent.query().where('slug', 'BLOG').orderBy('createdAt','desc').paginate(1, 50)
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
        const blogs = await MContent.query().where('id', params.id).preload('category').preload('owner',(q)=> {
            q.select('maker','avatar','firstname','lastname')
          }).preload('files').first()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('stat', 'P')
        const comments = await McontentComment.query().where('contentId',blogs?.$attributes.id || '').preload('user')
        return view.render('content-detail', {
            blogs,
            comments,
            category,
            otherItem,
        })
    }

    // client profile
    public async userLoginProfile({ view, auth }: HttpContextContract) {

        await auth.use('web').authenticate()
        return view.render('profile/index')
    }

    //adminDashboard
    public async adminDashboard({ view, auth }: HttpContextContract) {
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        return view.render('admin/dashboard', {
            dataUser
        })
    }

    public async adminBlogs({ view }: HttpContextContract) {
        const Users = await Muser.query().paginate(1, 50)
        return view.render('admin/users/index', {
            users: Users
        })
    }

    public async adminBlogsDetial({ params, auth, view }: HttpContextContract) {
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        const contents = await MContent.query().where('id', params.id).preload('category').preload('files').preload('comments').first()
        return view.render('admin/contentInfo', {
            contents,
            dataUser
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

    public async ContentComment({ request,response, auth }: HttpContextContract) {
        const payload = await request.validate(CommentValidator)
        const content = await MContent.query().where('id',payload.contentId)
        content.preload('comments').create(payload)
    }
}
