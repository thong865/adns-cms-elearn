import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Muser extends BaseModel {
  public static table = 'sstb_user'
  @column({ isPrimary: true })
  public id: number
  @column()
  public firstname: string
  @column()
  public lastname: string
  @column()
  public email: string
  @column()
  public mobile: string
  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
