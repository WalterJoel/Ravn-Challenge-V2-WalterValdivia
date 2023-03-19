import {GraphQLLocalStrategy,} from 'graphql-passport'

import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';

const prisma = new PrismaClient();

// Creating  a temporary function to getUser
async function getUser(
	email:any,password:any
): Promise<User | null> {
	return await prisma.user.findUnique({
		where: { email },
	});
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
export const GQLLocalStrategy = new GraphQLLocalStrategy(async (email,password,done) => {
    try {
        const user = await getUser(email,password);
        done(null, user);
    } catch (error) {
        done(error,false)
    }
   
});
