import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Muser from 'App/Models/Muser'
import RegisterValidator from 'App/Validators/RegisterValidator'
import UserLoginValidator from 'App/Validators/UserLoginValidator'
import Env from '@ioc:Adonis/Core/Env'
import CommentValidator from 'App/Validators/CommentValidator'
import McontentComment from 'App/Models/McontentComment'
import UpdateProfileValidator from 'App/Validators/UpdateProfileValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'
import MContentCategory from 'App/Models/MContentCategory'
import MContent from 'App/Models/MContent'
export default class AuthController {
    public async loginIndex({ view, auth }: HttpContextContract) {
        await auth.check()
        return view.render('login/index', {
            background: Env.get('URLASSETS') + '/images/bg/bg-line-connect.jpg'
        })
    }
    public async registerIndex({ view }: HttpContextContract) {
        return view.render('register/index', {
            background: Env.get('URLASSETS') + '/images/bg/bg-line-connect.jpg'
        })
    }
    public async myAccount({ view, auth }: HttpContextContract) {
        const user = await auth.user
        const userDetail = await Muser.query().where('id', user?.id).first()
        const category = await MContentCategory.query().where('slug', 'KNWL')
        const otherItem = await MContent.query().select('title', 'id').where('slug', 'OTH').andWhere('status', 'P')
        return view.render('profile/account', {
            userDetail,
            otherItem,
            category
        })
    }


    public async storeRegister({ request, session, response }: HttpContextContract) {
        try {
            const payload = await request.validate(RegisterValidator)
            await Muser.create(payload)
            return response.redirect('/')
        } catch (error) {
            console.log(error)
            session.flash('errors', error)
            return response.redirect().back()
        }
    }
    public async storeUser({ request, session, response }: HttpContextContract) {
        const { dob, avatar, province, district,sex,village } = request.all()
        try {
            const payload = await request.validate(RegisterValidator)
            await Muser.create(Object.assign(payload,{dob,avatar,province,district,sex,village}))
            return response.redirect('/admin/users')
        } catch (error) {
            console.log(error)
            session.flash('errors', error)
            return response.redirect().back()
        }
    }
    

    public async userDelete({ params, session, response }: HttpContextContract) {
        try {
            await Muser.query().where('id',params.id).update({status:'D'})
            return {message:'completed'}
        } catch (error) {
            console.log(error)
            session.flash('errors', error)
            return response.redirect().back()
        }
    }

    public async UpdateProfile({ request, session, auth, response }: HttpContextContract) {
        try {
            const payload = await request.validate(UpdateProfileValidator)
            await Muser.query().where('id', auth.user?.id).update(payload)
            return response.redirect().back()
        } catch (error) {
            console.log(error)
            session.flash('errors', error)
            return response.redirect().back()
        }
    }

    public async UdpateUser({params, request, session, auth, response }: HttpContextContract) {
        try {
            const { dob, avatar, province, district,sex,village } = request.all()
            const payload = await request.validate(UpdateUserValidator)
            await Muser.query().where('id', params.id).update(Object.assign(payload,{dob,avatar,province,district,sex,village}))
            return response.redirect('/admin/users')
        } catch (error) {
            session.flash('errors', error)
            return response.redirect().back()
        }
    }

    public async UserLogin({ request, auth, session, response }: HttpContextContract) {
        const payload = await request.validate(UserLoginValidator)

        try {
            await auth.use('web').attempt(payload.username, payload.password)
            response.redirect('/')
        } catch (e) {
            if (e.responseText.split(':')[0] == 'E_INVALID_AUTH_UID') {
                session.flash(Object.assign({}, { notifyError: 'message.user_not_found' }))
            }
            // session.flash(Object.assign(e,{notifyError:'Login Failer'}))
            return response.redirect().back()
        }
    }

    public async userLogout({ auth, response, session }: HttpContextContract) {
        try {
            await auth.logout()
            session.flash('notifySuccess', 'Logout')
            response.redirect('/')
        } catch (error) {
            session.flash('notifyError', 'Logout')
        }
    }


    public async userComment({ auth, request, response, session }: HttpContextContract) {
        try {
            const user = await auth.user
            const payload = await request.validate(CommentValidator)
            await McontentComment.create(Object.assign(payload, { userId: user?.id }))
            return response.redirect().back()
        } catch (error) {
            console.log(error)
            session.flash('notifyError', 'Logout')
        }
    }

    public async ContentCommentReplie({ auth, request, response, session }: HttpContextContract) {
        try {
            const { parent } = await request.all()
            const user = await auth.user
            const payload = await request.validate(CommentValidator)
            await McontentComment.create(Object.assign(payload, { userId: user?.id, parent: parent }))
            return response.redirect().back()
        } catch (error) {
            console.log(error)
            session.flash('notifyError', 'Logout')
        }
    }


}
