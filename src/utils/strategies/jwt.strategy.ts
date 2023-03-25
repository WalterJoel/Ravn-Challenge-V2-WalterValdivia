/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Request, RequestHandler } from 'express';
import { TextEncoder } from 'util';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY =
	process.env.JWT_SECRET_KEY || 'Ravn Challenge Secret Key Token';

export const verifyToken = async (req: Request | string) => {
	let token;
	if (typeof req === 'string') {
		token = req;
	} else {
		const { authorization } = req.headers;
		token = (authorization || '').replace('Bearer ', '');
	}

	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(JWT_SECRET_KEY)
		);
		return verified.payload;
	} catch (e) {
		throw new Error('Invalid token');
	}
};

/**
 * This function is used by express like middleware to verify in each request if a user is authenticated
 */
const authMiddleware: RequestHandler = async (req, res, next) => {
	try {
		const payload = await verifyToken(req);
		req.user = { id: payload.id, email: payload.email, roles: payload.roles };
	} catch (e) {
		// ignore
	} finally {
		next();
	}
};

/* By default export authMiddleware */
export default authMiddleware;
