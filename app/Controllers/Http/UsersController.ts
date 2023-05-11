import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Muser from 'App/Models/Muser'

export default class UsersController {
    public async adminUserMange({ view,auth }: HttpContextContract) {
        const userAuth = await auth.use('web').authenticate()
        const dataUser = await Muser.query().select('id', 'firstname', 'lastname', 'email', 'mobile', 'role').preload('hasRole', (qr) => {
            qr.preload('links')
        }).where('id', userAuth.id).first()
        const Users = await Muser.query().paginate(1, 50)
        return view.render('admin/users/index', {
            users: Users,
            dataUser
        })
    }
}
