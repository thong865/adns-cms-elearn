import Factory from '@ioc:Adonis/Lucid/Factory'
import MContent from 'App/Models/MContent'

export default Factory.define(MContent, ({ faker }) => {
  return {
    title: faker.lorem.sentence(),
    body:faker.lorem.paragraphs(20),
    slug:'BLOG',
    cateId:1,
    status:'P'
  }
}).build()
