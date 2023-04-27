import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Mfavo extends BaseModel {
  public static table = 'sstb_user_favos'
  @column({ isPrimary: true })
  public id: number
  @column({columnName:'user_id'})
  public userId: number
  @column({columnName:'content_id'})
  public contId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
