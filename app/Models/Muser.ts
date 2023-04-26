import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

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

  @beforeSave()
  public static async hashPassword(user: Muser) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
