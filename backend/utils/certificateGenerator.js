const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate certificate PDF
 * @param {Object} certificateData - Certificate data
 * @returns {Promise<string>} URL to the generated PDF
 */
const generateCertificatePDF = async (certificateData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get related data
            const courseData = await require('mongoose').model('Course').findById(certificateData.course);
            const studentData = await require('mongoose').model('User').findById(certificateData.student);

            if (!courseData || !studentData) {
                throw new Error('Missing course or student data for certificate generation');
            }

            // Create upload directory if it doesn't exist
            const uploadsDir = path.join(__dirname, '../uploads/certificates');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const fileName = `certificate-${certificateData._id}.pdf`;
            const filePath = path.join(uploadsDir, fileName);

            // Create PDF
            const doc = new PDFDocument({
                layout: 'landscape',
                size: 'A4'
            });

            // Pipe to file
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Add certificate content
            // Header
            doc.font('Helvetica-Bold')
                .fontSize(30)
                .text('Certificate of Completion', { align: 'center' })
                .moveDown(1);

            // Content
            doc.font('Helvetica')
                .fontSize(16)
                .text('This is to certify that', { align: 'center' })
                .moveDown(0.5);

            doc.font('Helvetica-Bold')
                .fontSize(24)
                .text(studentData.name, { align: 'center' })
                .moveDown(0.5);

            doc.font('Helvetica')
                .fontSize(16)
                .text('has successfully completed the course', { align: 'center' })
                .moveDown(0.5);

            doc.font('Helvetica-Bold')
                .fontSize(24)
                .text(courseData.title, { align: 'center' })
                .moveDown(1);

            // Details
            doc.fontSize(14)
                .font('Helvetica')
                .text(`Certificate ID: ${certificateData.certificateNumber}`, { align: 'center' })
                .moveDown(0.5);

            doc.text(`Date of Completion: ${new Date(certificateData.completionDate).toLocaleDateString()}`, { align: 'center' })
                .moveDown(0.5);

            doc.text(`Issue Date: ${new Date(certificateData.issueDate).toLocaleDateString()}`, { align: 'center' })
                .moveDown(2);

            // Add signature line
            doc.moveTo(doc.page.width / 2 - 100, doc.y)
                .lineTo(doc.page.width / 2 + 100, doc.y)
                .stroke();

            doc.moveDown(0.5)
                .fontSize(14)
                .text('Instructor Signature', { align: 'center' });

            // Finish PDF
            doc.end();

            // Wait for stream to finish
            stream.on('finish', () => {
                // In production, you would upload this file to a storage service
                // and return a public URL. For this mock, we'll return a local path
                const pdfUrl = `/uploads/certificates/${fileName}`;
                resolve(pdfUrl);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            console.error('Error generating certificate PDF:', error);
            reject(error);
        }
    });
};

module.exports = {
    generateCertificatePDF
};