import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import MContentCategory from 'App/Models/MContentCategory'
import ContentValidator from 'App/Validators/ContentValidator'

export default class AdminBlogsController {
    public async adminBlogsMange({ view }: HttpContextContract) {
        const blogs = await MContent.query().preload('category').where('slug', 'BLOG').paginate(1, 50)
        return view.render('admin/blogs/index', {
            blogs
        })
    }

    public async adminBlogsStore({ request, response }: HttpContextContract) {
        try {
            
            const payload = await request.validate(ContentValidator)
             await MContent.create(payload)
            response.redirect().back()
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
}
