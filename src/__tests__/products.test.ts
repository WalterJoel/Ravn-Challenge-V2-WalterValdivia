import EasyGraphQLTester from 'easygraphql-tester';
import { readFileSync } from 'fs';
import path from 'path';
import { mockDeep } from 'jest-mock-extended';
import type { DeepMockProxy } from 'jest-mock-extended';
import resolvers from '../graphql/resolvers';
import type { ResolverContext } from '../graphql/context';

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

interface CreateProductDto {
	name: string;
	description: string;
	price: number;
	stock: number;
}
interface updateProductDto {
	name: string;
	description: string;
	price: number;
	stock: number;
    isVisible: boolean;
}

const newProduct: CreateProductDto = {
	name: 'Test Product RAVN',
	description: 'This is a test product',
	price: 10,
	stock: 5,
};
test('Should create a New Product', async () => {
	mockContext.orm.product.create.mockResolvedValueOnce({
		id: 1,
		...newProduct,
		isVisible: true,
		category: 'PLANTILLAS',
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const query = gql`
		mutation CreateProduct($createProductDto: CreateProductDto!) {
			createProduct(createProductDto: $createProductDto) {
				id
				isVisible
				name
			}
		}
	`;
	const result = await tester.graphql(query, undefined, context, {
		createProductDto: {
			...newProduct,
			category: 'PLANTILLAS',
		},
	});

	// expect(mockContext.orm.product.create).toHaveBeenCalled();
	expect(result).not.toHaveProperty('errors');
	expect(result).toEqual({
		data: {
			createProduct: {
				id: 1,
				isVisible: true,
				name: 'Test Product RAVN',
			},
		},
	});
});

test('Should update a Product', async () => {
    const product: Product = {
        id: 1,
        name: 'Product 1',
        description: 'product 1 description',
        category: 'SANDALIAS',
        price: 10,
        stock: 10,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedProduct: updateProductDto = {
        name: 'Test Product',
        description: 'This is a test product',
        isVisible: true,
        price: 10,
        stock: 5
      };

	mockContext.orm.product.update.mockResolvedValueOnce({
		id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: 'PLANTILLAS',
        ...updatedProduct
	});

	const query = gql`
		mutation UpdateProduct(
			$updateProductId: Int!
			$updateProductDto: UpdateProductDto!
		) {
			updateProduct(id: $updateProductId, updateProductDto: $updateProductDto) {
				id
				isVisible
				category
			}
		}
	`;
    // Aqui solo los campos que requiere el DTO 
	const result = await tester.graphql(query, undefined, context, {
		
        updateProductId:9 ,
        updateProductDto: {
            ...updatedProduct,
            category :'SANDALIAS'
        }
        
	});

	expect(mockContext.orm.product.update).toHaveBeenCalled();
	// expect(result).not.toHaveProperty('errors');
	expect(result).toEqual({
		data: {
			updateProduct: {
				id: 1,
				isVisible: true,
				category:'PLANTILLAS'
			},
		},
	});
});


describe('remove', () => {
    const product: Product = {
      id: 1,
      name: 'Product 1',
      description: 'product 1 description',
      category: 'PLANTILLAS',
      price: 10,
      stock: 10,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    test('when product with ID exists', async() => {
		// Genera los datos simulando una Mock DB
		mockContext.orm.product.delete.mockResolvedValueOnce(product);
		const query = gql`
			mutation DeleteProduct($deleteProductId: Int!) {
				deleteProduct(id: $deleteProductId) {
					id
				}
				}
			`;
			// Aqui solo los campos que requiere el DTO 
		const result = await tester.graphql(query, undefined, context, {
			deleteProductId: 1
		});
		// expect(result).not.toHaveProperty('data')

    });
	
    
  });