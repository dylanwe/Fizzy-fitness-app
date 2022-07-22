import db from '../db/connection';

/**
 * Get a user by his email name
 * 
 * @param email email of the user
 * @returns a user
 */
export const getUserByEmail = async (email: string): Promise<User> => {
    const [users]: any = await db.query(
        'SElECT * FROM user WHERE email = ?',
        [email]
    );

    return users[0] as User;
}

/**
 * Get a user by his id
 * 
 * @param id the id of the user
 * @returns a user
 */
export const getUserById = async (id: number): Promise<User> => {
    const [users]: any = await db.query(
        'SElECT id, email, username FROM user WHERE id = ?',
        [id]
    );

    return users[0] as User;
}

/**
 * Create a new user
 * 
 * @param email email of the user
 * @param hashedPassword the hashed password the user will get
 * @param username the name you want the user to have
 */
export const createUser = async (email: string, hashedPassword: string, username: string) => {
    await db.execute(
        'INSERT INTO `user` (email, password, username) VALUES( ?, ?, ? )',
        [email, hashedPassword, username]
    );
}