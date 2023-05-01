import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sstb_user_roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('role_name')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
