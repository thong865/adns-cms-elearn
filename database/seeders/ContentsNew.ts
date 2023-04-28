import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ContentsNewFactory from 'Database/factories/ContentsNewFactory'

export default class extends BaseSeeder {
  public async run () {
    await ContentsNewFactory.createMany(5)
  }
}
