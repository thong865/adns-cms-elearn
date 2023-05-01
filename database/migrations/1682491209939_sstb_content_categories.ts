import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sstb_content_categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 100)
      table.string('slug', 50)
      table.text('description')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
