import EasyGraphQLTester from 'easygraphql-tester';

import { readFileSync } from 'fs';
import path from 'path';
import { mockDeep } from 'jest-mock-extended';
import type { DeepMockProxy } from 'jest-mock-extended';
import resolvers from '../graphql/resolvers';
import type { ResolverContext } from '../graphql/context';
import { prisma } from '../graphql/context';

import type { PrismaClient, Product, User } from '@prisma/client';

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
		user: mockDeep<User>(),
	};
};

let mockContext: MockResolverContext;
let context: ResolverContext;

// Before each like initial setup
beforeEach(() => {
	mockContext = createMockContext();
	context = mockContext as unknown as ResolverContext;
});

const productsDB: Product[] = [
	{
		id: 9,
		name: 'product 1',
		description: 'product 1 description',
		category: 'ZAPATILLAS',
		price: 10,
		stock: 10,
		isVisible: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

test('should return a list of avos', async () => {
	mockContext.orm.product.findMany.mockResolvedValue(productsDB);
	// Query to database using graphql
	const query = gql`
		{
			seeProducts {
				id
				name
			}
		}
	`;

	const result = await tester.graphql(query, undefined, context);
	expect(mockContext.orm.product.findMany).toHaveBeenCalledTimes(1);

	console.log('result datas ', result.data);
	//  expect(context.orm.product.findMany).toHaveBeenCalled();

	expect(result.data).toEqual({
		seeProducts: [
			{
				id: 9,
				name: 'product 1',
			},
		],
	});
});
