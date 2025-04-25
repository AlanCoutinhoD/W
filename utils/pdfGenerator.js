const PDFDocument = require('pdfkit');

function generateDiscountCard(clientName) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: [240, 320],
                margins: {
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15
                }
            });

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Color scheme
            const mainBlue = '#1e4d8c';
            const white = '#FFFFFF';

            // Background
            doc.rect(0, 0, 240, 320)
               .fill(mainBlue);

            // Tool icon at top
            doc.save()
               .translate(20, 15)
               .scale(0.3)
               .path('M 50 0 L 90 40 L 80 50 L 40 10 Z M 10 40 L 50 80 L 40 90 L 0 50 Z')
               .fill(white)
               .restore();

            // Header text - updated to match image exactly
            doc.font('Helvetica-Bold')
               .fontSize(20)
               .fillColor(white)
               .text('ACCESORIOS Y REPARACIÓNES', 45, 25, {align: 'center'});

            // Year on left side
            doc.fontSize(24)
               .text('2', 20, 80)
               .text('0', 20, 105)
               .text('2', 20, 130)
               .text('5', 20, 155);

            // Discount section with white background
            doc.rect(45, 80, 175, 80)
               .fill(white);

            doc.fontSize(48)
               .fillColor(mainBlue)
               .text('10%', 60, 90, {align: 'center'})
               .fontSize(20)
               .text('DESCUENTO', 60, 140, {align: 'center'});

            // Service text
            doc.fontSize(12)
               .fillColor(white)
               .text('EN TODAS NUESTRAS\nREPARACIONES', 45, 180, {
                   align: 'center',
                   lineGap: 2
               });

            // Client name
            doc.fontSize(16)
               .text(clientName, 45, 230, {align: 'center'});

            // Restrictions
            doc.fontSize(8)
               .text('• Descuento no válido con otras promociones.', 20, 270)
               .text('• No válido en días feriados.', 20, 285)
               .text('• Descuento válido por persona.', 20, 300);

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generateDiscountCard };