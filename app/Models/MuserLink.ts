import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class MuserLink extends BaseModel {
  public static table = 'sstb_user_links';
  @column({ isPrimary: true })
  public id: number;
  @column()
  public title: string;
  @column({columnName:'svg_icon'})
  public icon: string;
  @column()
  public order: number;
  @column()
  public slug: string;
  @column()
  public target: string;
  @column()
  public parent: number;
}
