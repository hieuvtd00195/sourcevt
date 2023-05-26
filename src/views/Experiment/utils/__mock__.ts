import { faker } from '@faker-js/faker';
import { Bill } from './types';

const products = [
  faker.commerce.product(),
  faker.commerce.product(),
  faker.commerce.product(),
  faker.commerce.product(),
  faker.commerce.product(),
];

export const generateBill = (): Bill => {
  return {
    id: faker.datatype.uuid(),
    createdBy: faker.name.fullName(),
    store: faker.company.name(),
    customer: faker.name.fullName(),
    products: faker.helpers.arrayElements(products),
    price: faker.commerce.price(),
  };
};
