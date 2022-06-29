import mysql2 from 'mysql2';

/**
 * the connection to the database
 */
const db = mysql2.createConnection({
	host: <string>process.env.DB_HOST,
	user: <string>process.env.DB_USER,
	password: <string>process.env.DB_PASSWORD,
	database: <string>process.env.DB_NAME,
}).promise();

export default db;