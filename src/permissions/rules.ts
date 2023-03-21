import { rule, and, or, not } from 'graphql-shield'
import type{User, PrismaClient } from '@prisma/client';

export interface ResolverContext {
    orm: PrismaClient;
     user:User ;
}

// export async function currentUser(
// 	parent: unknown,
// 	arg: unknown,
// 	context: ResolverContext
// ): Promise<User[]> {
// 	return await context.orm.user.findMany();
// }


export const isClient= rule({ cache: 'contextual' })(
    async (parent, args, ctx:ResolverContext, info) : Promise<any> => {
  
      return ctx.user.roles.includes('MANAGER')
    },
  )


// const isEditor = rule({ cache: 'contextual' })(async (parent, args, ctx:ResolverContext, info) => {
//   return ctx.user
// })

// export const isCustomer = rule()(
//   async (parent, args, ctx: Context, info) => {
//     const email = getUserEmail(ctx)
//     // Is there a Customer with such email in our database (Prisma)?
//     return ctx.db.exists.Customer({ email })
//   },
// )

// export const isAuthenticated = or(isCustomer, isGrocer)