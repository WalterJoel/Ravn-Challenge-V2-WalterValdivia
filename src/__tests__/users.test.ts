import EasyGraphQLTester from 'easygraphql-tester';
import { readFileSync } from 'fs';
import path from 'path';
import { mockDeep } from 'jest-mock-extended';
import type { DeepMockProxy } from 'jest-mock-extended';
import resolvers from '../graphql/resolvers';
import type { ResolverContext, prisma } from '../graphql/context';

import type { PrismaClient, User } from '@prisma/client';

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

interface CreateUserDto {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

const newUser: CreateUserDto = {
	// id:10,
	email: 'User@ravn.com',
	firstName: 'Juan',
	lastName: 'Perez',
	password: 'JPerez'
};

test('Should create a New User Client', async () => {
	mockContext.orm.user.create.mockResolvedValueOnce({
		...newUser,
		id: 11,
		roles: ['CLIENT'],
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const query = gql`
		mutation SignUp($createUserDto: CreateUserDto!) {
			signUp(createUserDto: $createUserDto) {
				id
				firstName
                roles
			}
		}
	`;
	const result = await tester.graphql(query, undefined, context, {
		createUserDto: {
			roles: ['CLIENT'],
			...newUser,
		},
	});

	expect(mockContext.orm.user.create).toHaveBeenCalled();
	expect(result).not.toHaveProperty('errors');
	expect(result).toEqual({
		data: {
			signUp: {
				id: 11,
				firstName: 'Juan',
                roles:['CLIENT']
			},
		},
	});
});
