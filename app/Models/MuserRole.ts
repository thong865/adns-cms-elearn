import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import MuserRoleMap from 'App/Models/MuserRoleMap';
import MuserLink from 'App/Models/MuserLink';

export default class MuserRole extends BaseModel {
  public static table = 'sstb_user_roles';
  @column({ isPrimary: true })
  public id: number
  @column({columnName:'role_name'})
  public title:string

  @manyToMany(()=> MuserLink,{
    localKey: 'id',
    relatedKey:'id',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'link_id',
    serializeAs:'linksrole',
    pivotTable: 'sstb_user_role_mapings',
  })
  public links:ManyToMany<typeof MuserLink>
}
