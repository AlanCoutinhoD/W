const Client = require('../models/clientModel');
const transporter = require('../config/email');
const { generateDiscountCard } = require('../utils/pdfGenerator');  // Fix the import

const clientController = {
    register: async (req, res) => {
        try {
            const { fullName, phone, email, state } = req.body;

            await Client.create(fullName, phone, email, state);

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
                    <p>Adjunto encontrarás tu tarjeta de descuento del 10% para usar en nuestras sucursales.</p>
                    <p>Datos registrados:</p>
                    <ul>
                        <li>Nombre: ${fullName}</li>
                        <li>Teléfono: ${phone}</li>
                        <li>Email: ${email}</li>
                        <li>Estado: ${state}</li>
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
    }, // Added comma here
    
    getAllClients: async (req, res) => {
        try {
            const clients = await Client.getAll();
            res.status(200).json({
                success: true,
                data: clients
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener los clientes'
            });
        }
    }
   , 
    searchClients: async (req, res) => {
        try {
            const { search } = req.query;
            
            if (!search) {
                return res.status(400).json({
                    success: false,
                    message: 'Término de búsqueda requerido'
                });
            }

            const clients = await Client.searchClient(search);
            
            res.status(200).json({
                success: true,
                data: clients
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar clientes'
            });
        }
    }
  ,  
    updateCouponStatus: async (req, res) => {
        try {
            const { id } = req.params;
            
            const result = await Client.updateUsedStatus(id);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cupón marcado como utilizado'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar el estado del cupón'
            });
        }
    },
    deleteClient: async (req, res) => {
        try {
            const { id } = req.params;
            
            const result = await Client.deleteClient(id);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Cliente eliminado exitosamente'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el cliente'
            });
        }
    }
};

module.exports = clientController;