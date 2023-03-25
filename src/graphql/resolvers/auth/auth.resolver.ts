/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-misused-promises */
import type { RequestHandler } from 'express';
import bcrypt, { compare } from 'bcrypt';
import { TextEncoder } from 'util';
import { SignJWT } from 'jose';
import { AuthenticationError } from 'apollo-server-express';
import { transporter } from '../../../config/nodeMailer';
import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../utils/strategies/jwt.strategy';

import { prisma } from '../../context';

const JWT_SECRET_KEY =
	process.env.JWT_SECRET_KEY || 'Ravn Challenge Secret Key Token';

/**
 * This function takes in a user's email and password, checks if the user exists,
 * Only if user exists and if the password is valid, it signs a JWT token with the user's information,
 * role, and id, and returns the token and the user
 * @param req
 * @param res
 * @param next continue with the stack of Express
 */
export const signIn: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		/* Using shorthand-object in parameter for email */
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			throw new AuthenticationError('User not found');
		}

		const isValid = await compare(password, user.password);

		if (!isValid) {
			throw new AuthenticationError('Incorrect password');
		}
		/* Signing Token with id, email and role user */
		const token = await new SignJWT({
			id: user.id,
			email: user.email,
			roles: user.roles,
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('2h')
			.sign(new TextEncoder().encode(JWT_SECRET_KEY));

		res.json({ token, username: user.email, id: user.id });
	} catch (err) {
		res.sendStatus(401);
	}
};

/** This function generates a token with the given email, then send an email to the user
 *
 * @param email  user email
 * @returns
 */
export async function forgotPassword(
	parent: unknown,
	args: { email: string },
	context: unknown
) {
	const token = await new SignJWT({
		email: args.email,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(new TextEncoder().encode(JWT_SECRET_KEY));
	// envio un email
	try {
		// send mail with defined transport object
		await transporter.sendMail({
			from: '"Tiny Store👻" <foo@example.com>', // sender address
			to: args.email, // list of receivers
			subject: 'Reset your Tiny Store Password ✔', // Subject line
			text: 'Hello world?', // plain text body
			html: ` <h1>Follow the link below to set a new password:</h1> <b> ${token}</b>`, // html body
		});
	} catch (error) {
		throw new GraphQLError('Error, Email not sent');
	}
	return token;
}

/** This function validates the token, getting the email and expiration date of the token to be used for change the password
 *
 * @param token The token to validate the user email and expiration date,
 * @param newPassword  The new password
 * @returns user with password updated
 */
export async function validateResetPassword(
	parent: unknown,
	args: { token: string; newPassword: string },
	context: unknown
) {
	// Primero obtenemos info del token
	const payload = await verifyToken(args.token);
	const data = payload.email as string;
	const user = await prisma.user.findUnique({
		where: { email: data },
	});

	if (!user) {
		throw new GraphQLError('Invalid Token, please try again');
	}
	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(args.newPassword, salt);
	return await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: encryptedPassword,
		},
	});
}
