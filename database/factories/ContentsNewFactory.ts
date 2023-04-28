import Factory from '@ioc:Adonis/Lucid/Factory'
import MContent from 'App/Models/MContent'

export default Factory.define(MContent, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    body:faker.lorem.paragraphs(20),
    background:faker.image.imageUrl.toString(),
    slug:'KNWL',
    cateId:6,
    status:'P'
  }
}).build()
