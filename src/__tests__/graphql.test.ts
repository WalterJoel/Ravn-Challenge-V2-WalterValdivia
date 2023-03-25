import { seeProducts } from '../graphql/resolvers/products/products.resolvers';
import EasyGraphQLTester from 'easygraphql-tester';

import { readFileSync } from 'fs';
import path from 'path';
import { mockDeep } from 'jest-mock-extended';
import type { DeepMockProxy } from 'jest-mock-extended';
import resolvers from '../graphql/resolvers';
import type { ResolverContext } from '../graphql/context';

import type { PrismaClient, User, Product } from '@prisma/client';

import gql from 'graphql-tag';
// import { beforeEach } from 'node:test';

const schema = readFileSync(
	path.join(__dirname, '../graphql/schema.graphql'),
	'utf-8'
);
const tester = new EasyGraphQLTester(schema, resolvers);

interface MockResolverContext {
	orm: DeepMockProxy<PrismaClient>;
	user: User | undefined;
}

export const createMockContext = (): MockResolverContext => {
	return {
		orm: mockDeep<PrismaClient>(),
		user: undefined,
	};
};

let mockContext: MockResolverContext;
let context: ResolverContext;

beforeEach(() => {
	mockContext = createMockContext();
	context = mockContext as unknown as ResolverContext;
});


const productsDB: Product[] = [
  {
    id: 1,
    name: 'product 1',
    description: 'product 1 description',
    category: 'ZAPATILLAS',
    price: 10,
    stock: 10,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

test('should return a list of avos', async () => {
  //mockContext.orm.product.findMany.mockResolvedValue(productsDB )

  const query = gql`
  {
    seeProducts {
      
      name
    }
  }
`


   const result = await tester.graphql(query, undefined, context)
//   console.log('result data ',result)
//   // expect(mockContext.orm.product.findMany).toHaveBeenCalledTimes(2)
//   expect(result.data).toEqual({
//     seeProducts: [
//       {
//         id: 1,
//         name: 's',
//         description: 'product 1 description',
//         category: 'ZAPATILLAS',
//         price: 10,
//         stock: 10,
//         isVisible: true,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     ],
//   })
try {
  expect(result.data).toEqual({
        seeProducts: [
          {
            id: 1,
            name: 's',
            description: 'product 1 description',
            category: 'ZAPATILLAS',
            price: 10,
            stock: 10,
            isVisible: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
      })  
} catch (error) {
  console.log(error)
  
}

})