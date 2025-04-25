const db = require('../config/database');

class Client {
    static async create(fullName, phone, email, state) {
        const [result] = await db.query(
            'INSERT INTO clients (full_name, phone, email, state, used) VALUES (?, ?, ?, ?, 0)',
            [fullName, phone, email, state]
        );
        return result;
    }

    static async getAll() {
        const [rows] = await db.query(
            'SELECT id, full_name, phone, email, state, used, created_at FROM clients ORDER BY created_at DESC'
        );
        return rows;
    }

    static async searchClient(searchTerm) {
        const [rows] = await db.query(
            'SELECT * FROM clients WHERE full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR state LIKE ?',
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        return rows;
    }

    static async updateUsedStatus(clientId) {
        const [result] = await db.query(
            'UPDATE clients SET used = 1 WHERE id = ?',
            [clientId]
        );
        return result;
    }

    static async deleteClient(clientId) {
        const [result] = await db.query(
            'DELETE FROM clients WHERE id = ?',
            [clientId]
        );
        return result;
    }
}

module.exports = Client;