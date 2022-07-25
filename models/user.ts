import db from '../db/connection';
import uuidAPIKey from "uuid-apikey";
import bcrypt from 'bcrypt';

/**
 * Get a user by his email name
 *
 * @param email email of the user
 * @returns a user
 */
export const getUserByEmail = async (email: string): Promise<User> => {
	const [users]: any = await db.query('SElECT * FROM user WHERE email = ?', [
		email,
	]);

	return users[0] as User;
};

/**
 * Get a user by his id
 *
 * @param id the id of the user
 * @returns a user
 */
export const getUserById = async (id: number): Promise<User> => {
	const [users]: any = await db.query(
		'SElECT id, email, username, apikey FROM user WHERE id = ?',
		[id]
	);

	return users[0] as User;
};

/**
 * Get a user by his apikey
 *
 * @param apikey the apikey of the user
 * @returns a user
 */
 export const getUserByApikey = async (apikey: string): Promise<User> => {
	const [users]: any = await db.query(
		'SElECT id, email, username, apikey FROM user WHERE apikey = ?',
		[apikey]
	);

	return users[0] as User;
};

/**
 * Give a user an apikey
 * 
 * @param id the id of the user
 * @returns the new apikey or false if an error happend
 */
export const giveUserApikey = async (id: number) => {
	const newKey = uuidAPIKey.create().apiKey;
	try {
		await db.execute(
			`UPDATE user SET apikey = ? WHERE id = ?`,
			[newKey, id]
		);
		return newKey;
	} catch (error) {
		return false;
	}
};

/**
 * Create a new user
 *
 * @param email email of the user
 * @param hashedPassword the hashed password the user will get
 * @param username the name you want the user to have
 */
export const createUser = async (
	email: string,
	hashedPassword: string,
	username: string
) => {
	await db.execute(
		'INSERT INTO `user` (email, password, username) VALUES( ?, ?, ? )',
		[email, hashedPassword, username]
	);
};

/**
 * Update the users information
 * 
 * @param email the new email
 * @param username the new username
 * @param newPassword the new password
 * @param password the old password
 * @param user the user from who you want to update their information
 * 
 * @returns A list of errors
 */
export const updateUser = async (
	email: string,
	username: string,
	newPassword: string,
	password: string,
	user: User
): Promise<updateUserError[]> => {
	let errors: updateUserError[] = [];

	const userWithPassword: User = await getUserByEmail(user.email);

	// password validation
	if (!(await bcrypt.compare(password, userWithPassword.password!))) {
		// password is incorrect
		errors.push({ field: 'password', error: 'Incorrect password' });
		return errors;
	}

	if (email !== user.email) {
		const mailRegex = /\S+@\S+\.\S+/;

		if (!mailRegex.test(email)) {
			errors.push({
				field: 'email',
				error: 'Please enter a valid email',
			});
			return errors;
		}

		try {
			await db.execute(`UPDATE user SET email = ? WHERE id = ?`, [
				email,
				user.id,
			]);
		} catch (error) {
			errors.push({ field: 'email', error: 'Email is already taken' });
		}

		// check if email is already in use
		console.log('update email');
	}

	// update username
	if (username !== user.username) {
		if (username.length < 8) {
			errors.push({
				field: 'username',
				error: 'Username must be more than 8 charachters',
			});
			return errors;
		}

		await db.execute(`UPDATE user SET username = ? WHERE id = ?`, [
			username,
			user.id,
		]);
	}

    // check if newPassword is given
	if (newPassword) {
        // password must be longer than 8 charachters
		if (newPassword.length < 8) {
			errors.push({
				field: 'newPassword',
				error: 'New password must be more than 8 charachters',
			});
			return errors;
		} else if (
			await bcrypt.compare(newPassword, userWithPassword.password!)
		) {
			errors.push({
				field: 'newPassword',
				error: "New password can't be the same as the old password",
			});
			return errors;
		} else {
            try {
                // update password
                const newHashedPassword = await bcrypt.hash(newPassword, 10);

                await db.execute(
                    `UPDATE user SET password = ? WHERE id = ?`,
                    [newHashedPassword, user.id]
                );
            } catch (error) {
                errors.push({field: 'newPassword', error: 'Something went wrong'});
                return errors;
            }
		}
	}

	return errors;
};
