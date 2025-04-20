const PDFDocument = require('pdfkit');

function generateDiscountCard(clientName) {
    return new Promise((resolve, reject) => {
        try {
            // Create PDF with business card size
            const doc = new PDFDocument({
                size: [240, 320],
                margins: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            });

            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Add decorative border
            doc.rect(5, 5, 230, 310)
               .lineWidth(2)
               .strokeColor('#2D8259');
            doc.stroke();

            // Inner decorative border
            doc.rect(10, 10, 220, 300)
               .lineWidth(1)
               .strokeColor('#2D8259');
            doc.stroke();

            // Header section
            doc.fontSize(16)
               .fillColor('#2D8259')
               .text('Café DeChiapas', 20, 30, {align: 'center'})
               .fontSize(10)
               .text('Restaurant Cabana', {align: 'center'});

            // Year with stylish background
            doc.rect(20, 70, 200, 30)
               .fill('#2D8259');
            doc.fontSize(16)
               .fillColor('white')
               .text('2025', 20, 75, {align: 'center'});

            // Discount section with background
            doc.rect(30, 120, 180, 80)
               .fillColor('#f0f0f0')
               .fill();
            doc.fontSize(42)
               .fillColor('#2D8259')
               .text('15%', 30, 130, {align: 'center'});
            doc.fontSize(18)
               .text('DESCUENTO', {align: 'center'});
            doc.fontSize(10)
               .text('EN TODAS NUESTRAS SUCURSALES', {align: 'center'});

            // Client name with decorative line
            doc.moveTo(40, 220)
               .lineTo(200, 220)
               .strokeColor('#2D8259')
               .stroke();
            doc.fontSize(12)
               .fillColor('#2D8259')
               .text(clientName, 20, 230, {align: 'center'});

            // Restrictions in a styled box
            doc.rect(20, 260, 200, 45)
               .fillColor('#f5f5f5')
               .fill();
            doc.fontSize(7)
               .fillColor('#666666')
               .text('• Descuento no válido con otras promociones\n' +
                    '• No válido en días feriados\n' +
                    '• Descuento válido por persona\n' +
                    '• Válido en todas nuestras sucursales', 25, 265);

            // Add decorative coffee bean icon (simple drawing)
            doc.save()
               .translate(210, 20)
               .scale(0.3)
               .path('M 50 0 C 100 25 100 75 50 100 C 0 75 0 25 50 0')
               .fillColor('#2D8259')
               .fill()
               .restore();

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generateDiscountCard };