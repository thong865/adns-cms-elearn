import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import MContentCategory from 'App/Models/MContentCategory'

export default class MContent extends BaseModel {
  public static table = 'sstb_contents'
  @column({ isPrimary: true })
  public id: number
  @column()
  public title: string
  @column()
  public body: string
  @column()
  public slug: string
  @column({ columnName: 'cate_id' })
  public cateId: number
  @column({ columnName: 'stat' })
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => MContentCategory, {
    localKey: 'cateId',
    foreignKey: 'id'
  })
  public category: HasOne<typeof MContentCategory>
}
