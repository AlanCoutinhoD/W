const Client = require('../models/clientModel');
const transporter = require('../config/email');

const clientController = {
    register: async (req, res) => {
        try {
            const { fullName, phone, email } = req.body;

            await Client.create(fullName, phone, email);

            // Send confirmation email
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Registro Exitoso',
                html: `
                    <h1>¡Gracias por registrarte!</h1>
                    <p>Hola ${fullName},</p>
                    <p>Tu registro ha sido completado exitosamente.</p>
                    <p>Datos registrados:</p>
                    <ul>
                        <li>Nombre: ${fullName}</li>
                        <li>Teléfono: ${phone}</li>
                        <li>Email: ${email}</li>
                    </ul>
                `
            });

            res.status(201).json({
                success: true,
                message: 'Cliente registrado exitosamente'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar el cliente'
            });
        }
    }
};

module.exports = clientController;