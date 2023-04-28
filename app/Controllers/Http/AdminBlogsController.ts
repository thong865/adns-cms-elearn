import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import ContentValidator from 'App/Validators/ContentValidator'

export default class AdminBlogsController {
    public async adminBlogsMange({ view }: HttpContextContract) {
        const blogs = await MContent.query().preload('category').where('slug', 'BLOG').paginate(1, 50)
        return view.render('admin/blogs/index', {
            blogs
        })
    }

    public async adminBlogsStore({ request, response }: HttpContextContract) {
        const payload = await request.validate(ContentValidator)
        try {
            //  await MContent.create()

            return payload
        } catch (error) {
            return response.status(200).json(error)
        }
    }


    public async adminBlogsForm({ view }: HttpContextContract) {
        return view.render('admin/blogs/form')
    }
}
