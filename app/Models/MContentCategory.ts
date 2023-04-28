import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MContentCategory extends BaseModel {
  public static table = 'sstb_content_categories'
  @column({ isPrimary: true })
  public id: number
  @column()
  public title:string
  @column()
  public slug:string
}
