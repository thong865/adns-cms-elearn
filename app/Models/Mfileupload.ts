import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Mfileupload extends BaseModel {
  public static table = 'file_uploads'
  @column({ isPrimary: true })
  public id: number
  @column({columnName:'contentId'})
  public contentId: number
  @column()
  public file_path: string
  @column()
  public file_type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
