import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Muser from 'App/Models/Muser'

export default class UsersController {
    public async adminUserMange({ view }: HttpContextContract) {
        const Users = await Muser.query().paginate(1, 50)
        return view.render('admin/users/index', {
            users: Users
        })
    }
    public async findOne({view}:HttpContextContract){}
    public async store({view}:HttpContextContract){}
    public async udpate({view}:HttpContextContract){}
    public async destroy({view}:HttpContextContract){}
}
