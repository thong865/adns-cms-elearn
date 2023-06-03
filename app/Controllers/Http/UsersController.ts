import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Muser from 'App/Models/Muser'
import MuserRole from 'App/Models/MuserRole'
import PasswordResetValidator from 'App/Validators/PasswordResetValidator'
import Hash from '@ioc:Adonis/Core/Hash'
export default class UsersController {
    public async adminUserMange({ view, auth }: HttpContextContract) {
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        const Users = await Muser.query().whereIn('status', ['O', 'C']).preload('hasRole').paginate(1, 50)
        return view.render('admin/users/index', {
            users: Users,
            dataUser
        })
    }

    public async adminUserForm({ request, view, auth }: HttpContextContract) {
        const { typ, id } = request.all();
        const userAuth = await auth.use('web').authenticate()
        let user;
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        if (typ == "edit" && id) {
            user = await Muser.query()
                .preload('hasRole')
                .where('id', id)
                .andWhereIn('status', ['O', 'C'])
                .first();
        }
        const useRole = await MuserRole.all()
        return view.render('admin/users/form', {
            dataUser,
            user: user || '',
            useRole,
            typ
        })
    }

    public async adminUserFormResetPassword({ params, view, auth }: HttpContextContract) {
        const userAuth = await auth.use('web').authenticate()
        let user;
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()

        user = await Muser.query()
            .preload('hasRole')
            .where('id', params.id)
            .andWhereIn('status', ['O', 'C'])
            .first();
        return view.render('admin/users/resetpassword', { dataUser, user })
    }

    public async adminUserReset({ request, response, auth }: HttpContextContract) {
        try {
            // const payload = await request.validate(PasswordResetValidator)
            // const userAuth = await auth.use('web').authenticate()
            // let password = await Hash.make(payload.password)
            // await Muser.query().where('id', payload.id).update({ password: password })
            // console.log('asdkfjasld')
            response.redirect().back()
        } catch (error) {
            // session.flash('errors', error)
            // console.log(error)
            response.redirect().back()
        }
    }
}
