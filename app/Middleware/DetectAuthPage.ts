import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DetectAuthPage {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    await auth.check()
    if(auth.isLoggedIn){
      response.redirect('/myprf')
    }
    await next()
  }
}
