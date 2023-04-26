import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Muser from 'App/Models/Muser'
import RegisterValidator from 'App/Validators/RegisterValidator'
import UserLoginValidator from 'App/Validators/UserLoginValidator'

export default class AuthController {
    public async loginIndex({ view }) {
        return view.render('login/index')
    }
    public async registerIndex({ view }) {
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

    public async UserLogin({ request, auth, response }: HttpContextContract) {
        // try {
        const payload = await request.validate(UserLoginValidator)
        response.status(201)
        await Muser.create(payload)
        return response.redirect().back()
        // } catch (error) {
        //     response.badRequest(error).r
        // }
    }
}
