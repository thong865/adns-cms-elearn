import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) { }
  public schema = schema.create({
    firstname: schema.string(),
    lastname: schema.string(),
    mobile: schema.string(),
    email: schema.string(),
    sex:schema.string()
  })
  public messages: CustomMessages = {
    'firstname.required': 'form.enter_required',
    'lastname.required': 'form.enter_required',
    'email.required': 'form.enter_required',
    'mobile.required': 'form.enter_required',
  }
}
