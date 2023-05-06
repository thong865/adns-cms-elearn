import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MContentCategory from 'App/Models/MContentCategory'
import ContentsNewFactory from 'Database/factories/ContentsNewFactory'

export default class extends BaseSeeder {
  public async run () {
    // await ContentsNewFactory.createMany(5)

    await MContentCategory.createMany([
      // {
      //   title:'News',
      //   slug:'BLOG'
      // },
      // {
      //   title:'Events',
      //   slug:'BLOG'
      // },
      // {
      //   title:'Network',
      //   slug:'KNWL'
      // },
      // {
      //   title:'Software',
      //   slug:'KNWL'
      // },
      {
        title:'Qeustion Freggaincy',
        slug:'QAFG'
      },
      {
        title:'Home Section 1',
        slug:'HOME1'
      },
      {
        title:'Carousel',
        slug:'CRSEL'
      },
      {
        title:'โปรแกรมเมอร์',
        slug:'KNWL'
      },
      {
        title:'นักวิเคราะห์ระบบ',
        slug:'KNWL'
      },
      {
        title:'วิศวกรระบบ',
        slug:'KNWL'
      },
      {
        title:'ทดสอบระบบ',
        slug:'KNWL'
      },
      {
        title:'ฝ่ายสนับสนุนด้านไอที',
        slug:'KNWL'
      }
    ])
  }
}
