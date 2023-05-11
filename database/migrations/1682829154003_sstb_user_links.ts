import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sstb_user_links'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title') 
      table.text('svg_icon')
      table.string('target',50)
      table.integer('parent')
      table.string('slug',200)
      table.integer('order')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
