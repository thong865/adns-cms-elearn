import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import MContentCategory from 'App/Models/MContentCategory'
import ContentValidator from 'App/Validators/ContentValidator'
import SectionValidator from 'App/Validators/SectionValidator'

export default class AdminBlogsController {
    public async adminBlogsMange({ view }: HttpContextContract) {
        const blogs = await MContent.query().preload('category').where('slug', 'BLOG').paginate(1, 50)
        return view.render('admin/blogs/index', {
            blogs
        })
    }

    public async adminBlogsStore({ request, session, response }: HttpContextContract) {
        try {
            const payload = await request.validate(ContentValidator)
            console.log(payload)
            await MContent.create(payload)
            session.flash('notifySuccess', { message: 'create_success' })
            response.redirect('/admin/blogsManage')
            // return payload
        } catch (error) {
            console.log(error)
            // return response.status(200).json(error)
        }
    }




    public async adminBlogsForm({ view }: HttpContextContract) {
        const categories = await MContentCategory.query().where('slug', 'BLOG')
        return view.render('admin/blogs/form', {
            categories
        })
    }


    // 
    public async adminSections({ view }: HttpContextContract) {
        const data = await MContent.query().preload('category').whereIn('slug', ['QAFG', 'HOME1']).paginate(1, 50)
        return view.render('admin/sections/index', {
            data
        })
    }
    public async adminSectionsForm({ request, view }: HttpContextContract) {
        try {
            const { typ, id } = request.all()
            let content;
            if (typ == 'edit' && id) {
                content = await MContent.query().preload('category').whereIn('slug', ['QAFG', 'HOME1']).where('id', id).first()
            }
            const categories = await MContentCategory.query().whereIn('slug', ['QAFG', 'HOME1'])
            return view.render('admin/sections/form', {
                categories,
                content,
                type: { method: typ == 'edit' ? 'PUT' : 'POST', route: typ == 'edit' ? 'ContentUpdate' : 'ContentCreate' }
            })
        } catch (error) {

        }

    }


    public async ContentUpdate({ request, response }: HttpContextContract) {
        const { typ,id} = request.all()
        let playload;
        // if(typ){
            playload = await request.validate(SectionValidator)
        // }
        const content = await MContent.query().where('id', id).update(playload)
        response.redirect('/admin/sections')
    }


    public async adminknowledges({view}:HttpContextContract){
        const data = await MContent.query().preload('category').whereIn('slug', ['KNWL']).paginate(1, 50)
        return view.render('admin/knowledge/index', {
            data
        })
    }
    public async adminknowledgesForm({request,view}:HttpContextContract){
        try {
            const { typ, id } = request.all()
            let content;
            if (typ == 'edit' && id) {
                content = await MContent.query().preload('category').whereIn('slug', ['KNWL']).where('id', id).first()
            }
            const categories = await MContentCategory.query().whereIn('slug', ['KNWL'])
            return view.render('admin/knowledge/form', {
                categories,
                content,
                type: { method: typ == 'edit' ? 'PUT' : 'POST', route: typ == 'edit' ? 'ContentUpdate' : 'ContentCreate' }
            })
        } catch (error) {

        }
    }
}
