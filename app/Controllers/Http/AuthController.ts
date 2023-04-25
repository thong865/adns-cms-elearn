// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    public async loginIndex({view}){
        return view.render('login/index')
    }
    public async registerIndex({view}){
        return view.render('register/index')
    }
}
