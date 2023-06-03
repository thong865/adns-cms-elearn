import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Muser from './Muser'

export default class McontentComment extends BaseModel {
  public static table = 'sstb_content_comments'
  @column({ isPrimary: true })
  public id: number
  @column()
  public message: string
  @column({columnName:'user_id'})
  public userId: number
  @column({columnName:'content_id'})
  public contentId: number
  @column()
  public parent: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(()=> Muser, {
    localKey:'userId',
    foreignKey:'id'
  })
  public user:HasOne<typeof Muser>
}
