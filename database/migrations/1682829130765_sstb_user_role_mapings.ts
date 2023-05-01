import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sstb_user_role_mapings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id')
      table.integer('link_id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
