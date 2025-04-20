const Client = require('../models/clientModel');
const transporter = require('../config/email');
const { generateDiscountCard } = require('../utils/pdfGenerator');

const clientController = {
    register: async (req, res) => {
        try {
            const { fullName, phone, email } = req.body;

            await Client.create(fullName, phone, email);

            // Generate PDF
            const pdfBuffer = await generateDiscountCard(fullName);

            // Send confirmation email with PDF attachment
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Registro Exitoso - Tu Tarjeta de Descuento',
                html: `
                    <h1>¡Gracias por registrarte!</h1>
                    <p>Hola ${fullName},</p>
                    <p>Tu registro ha sido completado exitosamente.</p>
                    <p>Adjunto encontrarás tu tarjeta de descuento del 15% para usar en nuestras sucursales.</p>
                    <p>Datos registrados:</p>
                    <ul>
                        <li>Nombre: ${fullName}</li>
                        <li>Teléfono: ${phone}</li>
                        <li>Email: ${email}</li>
                    </ul>
                `,
                attachments: [
                    {
                        filename: 'tarjeta_descuento.pdf',
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
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