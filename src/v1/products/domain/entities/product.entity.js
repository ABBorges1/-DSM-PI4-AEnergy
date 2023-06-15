import { randomUUID } from 'crypto';

export class Product {
  constructor({
    id,
    name,
    userId,
    uuid,
  }) {
    this.id = id
    this.name = name
    this.userId = userId
    this.uuid = uuid || randomUUID()
  }

  static create({ name, userId, uuid, id }) {
    return new Product({
      name,
      id,
      userId,
      uuid,
    })
  }
}