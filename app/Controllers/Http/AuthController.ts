import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Muser from 'App/Models/Muser'
import RegisterValidator from 'App/Validators/RegisterValidator'
import UserLoginValidator from 'App/Validators/UserLoginValidator'

export default class AuthController {
    public async loginIndex({ view, auth }: HttpContextContract) {
        await auth.check()
        return view.render('login/index')
    }
    public async registerIndex({ view }: HttpContextContract) {
        return view.render('register/index')
    }


    public async storeRegister({ request, session, response }: HttpContextContract) {
        // try {
        const payload = await request.validate(RegisterValidator)
        response.status(201)
        await Muser.create(payload)
        return response.redirect().back()
        // } catch (error) {
        //     response.badRequest(error).r
        // }
    }

    public async UserLogin({ request, auth,session, response }: HttpContextContract) {
        const payload = await request.validate(UserLoginValidator)

        try {
            await auth.use('web').attempt(payload.username, payload.password)
            response.redirect('/')
        } catch {
            session.flash('notifyError','Login Failer')
            return response.redirect().back()
        }
    }

    public async userLogout({ auth, response,session }: HttpContextContract) {
        try {
            await auth.logout()
            session.flash('notifySuccess','Logout')
            response.redirect('/')
        } catch (error) {
            session.flash('notifyError','Logout')
        }
    }
}
