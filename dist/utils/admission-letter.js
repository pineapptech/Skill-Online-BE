"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
class AdmissionLetter {
    generatePFD(userData) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            });
            // store PDF chunks
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            // PDF Content Structure
            this.addHeader(doc);
            this.addUserDetails(doc, userData);
            this.addWelcomeMessage(doc, userData);
            this.addFooter(doc);
            // Finalize PDF 
            doc.end();
        });
    }
    // Add header to the PDF 
    addHeader(doc) {
        doc.font('Helvetica-Bold')
            .fontSize(25)
            .text('Welcome to Our Platform', { align: 'center' })
            .moveDown(2);
    }
    addUserDetails(doc, userData) {
        doc.font('Helvetica')
            .fontSize(16)
            .text(`Dear ${userData.firstName},`, { align: 'center' })
            .moveDown();
        doc.fontSize(12)
            .text('Congratulations on successfully registering with our platform!', { align: 'left' })
            .moveDown()
            .text('Here are your registration details:', { align: 'left' })
            .moveDown();
        doc.fontSize(10)
            .text(`Name: ${userData.firstName}`, { align: 'left' })
            .text(`Email: ${userData.email}`, { align: 'left' })
            .moveDown(2);
    }
    addWelcomeMessage(doc, userData) {
        doc.fontSize(12)
            .fillColor('#34495E')
            .text('We are thrilled to have you join our community,', { align: 'left' })
            .moveDown()
            .text('Get Ready to explore amazing features and opportunities!')
            .moveDown(2);
    }
    addFooter(doc) {
        doc.fontSize(10)
            .fillColor('blue')
            .text('Thank you for joining us!', { align: 'center' })
            .moveDown()
            .fillColor('gray')
            .fontSize(8)
            .text('© 2024 Our Company. All rights reserved.', { align: 'center' });
    }
}
exports.default = AdmissionLetter;
