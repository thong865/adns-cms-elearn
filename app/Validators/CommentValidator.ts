import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CommentValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    message:schema.string(),
    contentId:schema.number()
  })
  public messages: CustomMessages = {}
}
