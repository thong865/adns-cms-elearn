import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MContent from 'App/Models/MContent'
import MContentCategory from 'App/Models/MContentCategory'
import Muser from 'App/Models/Muser'
import ContentValidator from 'App/Validators/ContentValidator'
import SectionValidator from 'App/Validators/SectionValidator'

export default class AdminBlogsController {
    public async adminBlogsMange({ request, auth, view }: HttpContextContract) {
        const { search, type } = request.all()
        let blogs;
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (search && search != '' || type && type != '') {
            blogs = await MContent.query().preload('category').where('slug', 'BLOG').andWhereRaw(`title like '%${search ? search : ''}%'`).paginate(1, 50)
        } else {
            blogs = await MContent.query().preload('category').where('slug', 'BLOG').paginate(1, 8)
        }
        return view.render('admin/blogs/index', {
            blogs,
            search: search ? search : '',
            dataUser
        })
    }
    public async adminBlogsCategory({ request, view, auth }: HttpContextContract) {
        const { search, type } = request.all()
        let categories;
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (search && search != '' || type && type != '') {
            categories = await MContentCategory.query().where('slug', 'BLOG').andWhereRaw(`title like '%${search ? search : ''}%'`).paginate(1, 50)
        } else {
            categories = await MContentCategory.query().where('slug', 'BLOG').paginate(1, 8)
        }
        return view.render('admin/blogs/category', {
            categories,
            search: search ? search : '',
            dataUser
        })
    }

    public async adminBlogsStore({ request, session, response }: HttpContextContract) {
        try {
            const payload = await request.validate(ContentValidator)
            await MContent.create(payload)
            session.flash('notifySuccess', { message: 'create_success' })
            response.redirect('/admin/blogsManage')
            // return payload
        } catch (error) {
            console.log(error)
            // return response.status(200).json(error)
        }
    }




    public async adminBlogsForm({ request, view, auth }: HttpContextContract) {
        const { typ, id } = request.all()
        let content;
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (typ == 'edit' && id) {
            content = await MContent.query().preload('category').whereIn('slug', ['BLOG']).andWhere('id', id).first()
        }
        const categories = await MContentCategory.query().where('slug', 'BLOG')
        return view.render('admin/blogs/form', {
            categories,
            content,
            type: { method: typ == 'edit' ? 'POST' : 'POST', route: typ == 'edit' ? 'ContentUpdate' : 'ContentCreate' },
            action: typ != 'edit' ? '/v1/content/create' : '/v1/content/update?_method=PUT',
            dataUser
        })
    }


    // 
    public async adminSections({ request, view, auth }: HttpContextContract) {
        const { search } = request.all()
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        let data;
        if (search && search != '') {
            data = await MContent.query().preload('category').whereIn('slug', ['QAFG', 'HOME1']).andWhereRaw(`title like '%${search ? search : ''}%'`).paginate(1, 50)
        } else {
            data = await MContent.query().preload('category').whereIn('slug', ['QAFG', 'HOME1']).paginate(1, 50)
        }
        return view.render('admin/sections/index', {
            data,
            dataUser,
            search: search ? search : ''
        })
    }
    public async adminSectionsForm({ request, view, auth }: HttpContextContract) {
        try {
            const { typ, id } = request.all()
            let content;
            const userAuth = await auth.use('web').authenticate()
            const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
                qr.preload('links')
            }).where('id', userAuth.id).first()
            if (typ == 'edit' && id) {
                content = await MContent.query().preload('category').whereIn('slug', ['QAFG', 'HOME1']).where('id', id).first()
            }
            const categories = await MContentCategory.query().whereIn('slug', ['QAFG', 'HOME1'])
            return view.render('admin/sections/form', {
                categories,
                content,
                type: { method: typ == 'edit' ? 'PUT' : 'POST', route: typ == 'edit' ? 'ContentUpdate' : 'ContentCreate' },
                dataUser
            })
        } catch (error) {

        }

    }


    public async ContentUpdate({ request, response }: HttpContextContract) {
        const { typ, id } = request.all()
        let playload;
        // if(typ){
        playload = await request.validate(ContentValidator)
        // }
        const content = await MContent.query().where('id', id).update(playload)
        response.redirect().back()
    }


    public async adminknowledges({ request, view, auth }: HttpContextContract) {
        const { search } = request.all()
        const userAuth = await auth.use('web').authenticate()
        let data;
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (search && search != '') {
            data = await MContent.query().preload('category').whereIn('slug', ['KNWL']).andWhereRaw(`title like '%${search ? search : ''}%'`).paginate(1, 50)
        } else {
            data = await MContent.query().preload('category').whereIn('slug', ['KNWL']).paginate(1, 8)
        }
        return view.render('admin/knowledge/index', {
            data,
            dataUser,
            search: search ? search : ''
        })
    }
    public async adminknowledgesCategory({ request, view, auth }: HttpContextContract) {
        const { search, type } = request.all()
        let categories;
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (search && search != '' || type && type != '') {
            categories = await MContentCategory.query().where('slug', 'KNWL').andWhereRaw(`title like '%${search ? search : ''}%'`).paginate(1, 50)
        } else {
            categories = await MContentCategory.query().where('slug', 'KNWL').paginate(1, 8)
        }
        return view.render('admin/knowledge/category', {
            categories,
            search: search ? search : '',
            dataUser
        })
    }
    public async adminknowledgesForm({ request, view, auth }: HttpContextContract) {
        try {
            const { typ, id } = request.all()
            let content;
            const userAuth = await auth.use('web').authenticate()
            const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
                qr.preload('links')
            }).where('id', userAuth.id).first()
            if (typ == 'edit' && id) {
                content = await MContent.query().preload('category').whereIn('slug', ['KNWL']).where('id', id).first()
            }
            const categories = await MContentCategory.query().whereIn('slug', ['KNWL'])
            return view.render('admin/knowledge/form', {
                categories,
                content,
                type: { method: typ == 'edit' ? 'PUT' : 'POST', route: typ == 'edit' ? 'ContentUpdate' : 'ContentCreate' },
                dataUser
            })
        } catch (error) {

        }
    }
    public async adminOther({ request, view, auth }: HttpContextContract) {
        const { search } = request.all()
        const userAuth = await auth.use('web').authenticate()
        let data;
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (search && search != '') {
            data = await MContent.query().preload('category').whereIn('slug', ['OTH', 'FAQ']).andWhereRaw(`title like '%${search ? search : ''}%'`).paginate(1, 50)
        } else {
            data = await MContent.query().preload('category').whereIn('slug', ['OTH', 'FAQ']).paginate(1, 8)
        }
        return view.render('admin/pages/view', {
            data,
            dataUser,
            search: search ? search : ''
        })
    }
    public async adminOtherForm({ request, view, auth }: HttpContextContract) {
        try {
            
            const { typ, id } = request.all()
            let content;
            const userAuth = await auth.use('web').authenticate()
            const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
                qr.preload('links')
            }).where('id', userAuth.id).first()
            if (typ == 'edit' && id) {
                content = await MContent.query().preload('category').whereIn('slug', ['OTH','FAQ']).where('id', id).first()
            }
            const categories = await MContentCategory.query().whereIn('slug', ['OTH'])
            return view.render('admin/pages/form', {
                categories,
                content,
                type: { method: typ == 'edit' ? 'PUT' : 'POST', route: typ == 'edit' ? 'ContentUpdate' : 'ContentCreate' },
                dataUser
            })
        } catch (error) {

        }
    }

}
