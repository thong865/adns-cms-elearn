import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, HasOne, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import MuserRole from './MuserRole'

export default class Muser extends BaseModel {
  public static table = 'sstb_user'
  @column({ isPrimary: true })
  public id: number
  @column()
  public firstname: string
  @column()
  public lastname: string
  @column()
  public dob: DateTime
  @column()
  public village: string
  @column()
  public avatar: string
  @column()
  public role: number
  @column()
  public sex: string
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

  @hasOne(()=> MuserRole,{
    localKey:'role',
    foreignKey:'id'
  })
  public hasRole:HasOne<typeof MuserRole>
}
