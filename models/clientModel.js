const db = require('../config/database');

class Client {
    static async create(fullName, phone, email) {
        const [result] = await db.query(
            'INSERT INTO clients (full_name, phone, email) VALUES (?, ?, ?)',
            [fullName, phone, email]
        );
        return result;
    }
}

module.exports = Client;