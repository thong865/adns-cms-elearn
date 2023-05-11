import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MuserRoleMap extends BaseModel {
  public static table = 'sstb_user_role_mapings';
  @column({ isPrimary: true })
  public id: number
  @column({columnName:'role_id'})
  public roleId:number
  @column({columnName:'link_id'})
  public linkId:number
}
