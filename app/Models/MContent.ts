import { DateTime } from 'luxon'
const moment = require('moment')
import { BaseModel, HasMany, HasOne, beforeSave, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import MContentCategory from 'App/Models/MContentCategory'
import McontentComment from 'App/Models/McontentComment'
import Muser from 'App/Models/Muser'
import Mfileupload from 'App/Models/Mfileupload'

export default class MContent extends BaseModel {
  public static table = 'sstb_contents'
  @column({ isPrimary: true })
  public id: number
  @column()
  public background: string
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

  @column()
  public maker: number

  @column.dateTime({ autoCreate: true ,consume:((val)=> {
    return moment(val).format('MM/DD/YYYY')
  })})
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => MContentCategory, {
    localKey: 'cateId',
    foreignKey: 'id'
  })
  public category: HasOne<typeof MContentCategory>

  @hasOne(() => Muser, {
    localKey: 'maker',
    foreignKey: 'id'
  })
  public owner: HasOne<typeof Muser>


  @beforeSave()
  public static async categorySlug(con: MContent) {
    if (con.$dirty.cateId) {
      const slug = await MContentCategory.findOrFail(con.cateId)
      con.slug = slug.slug
    }
  }

  @hasMany(()=> McontentComment,{
    localKey:'id',
    foreignKey:'contentId'
  })
  public comments: HasMany<typeof McontentComment>

  @hasMany(()=> Mfileupload,{
    localKey:'id',
    foreignKey:'contentId'
  })
  public files: HasMany<typeof Mfileupload>
}
