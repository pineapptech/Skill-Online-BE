"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const console_1 = require("console");
class OfferLetterGenerator {
    generateOfferLetter(userData) {
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
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            this.addApplicationFormHeader(doc, userData);
            // Add a line separator
            doc.moveDown();
            doc.strokeColor('#000000').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();
            this.addOfferLetterHeader(doc);
            this.addOfferLetterDetails(doc, userData);
            this.addOfferLetterFooter(doc);
            doc.end();
        });
    }
    findImagePath(imageName) {
        const possiblePaths = [
            path_1.default.resolve(__dirname, imageName),
            path_1.default.resolve(__dirname, 'assets', imageName),
            path_1.default.resolve(process.cwd(), imageName),
            path_1.default.resolve(process.cwd(), 'assets', imageName),
            path_1.default.resolve(process.cwd(), 'src', 'assets', imageName)
        ];
        for (const imagePath of possiblePaths) {
            if (fs_1.default.existsSync(imagePath)) {
                return imagePath;
            }
        }
        (0, console_1.warn)(`Image not Found ${imageName}. Skipping Image Insertion`);
        return 'Image Not Found';
    }
    addOfferLetterHeader(doc) {
        // doc.image('../image/logo.jpeg', 50, 50, {width: 100});
        try {
            const logoPath = this.findImagePath('logo.jpeg');
            try {
                const pageWidth = doc.page.width;
                const logoWidth = 100;
                const xCoordinate = (pageWidth - logoWidth) / 2;
                // Center the logo at the top of the document
                doc.image(logoPath, xCoordinate, 50, {
                    width: logoWidth
                });
            }
            catch (imageError) {
                console.error(`Error Inserting Logo: ${imageError}`);
            }
            doc.fontSize(18)
                .font('Helvetica')
                .text(' ', {
                continued: true
            })
                .moveDown(2);
        }
        catch (error) {
            console.error(`Error in addOfferLetterHeader: ${error}`);
        }
    }
    addApplicationFormHeader(doc, userData) {
        doc.font('Helvetica-Bold').fontSize(16).text('', { align: 'center' }).moveDown(2);
        const formFields = [
            { label: 'Course of Choice', value: userData.course },
            { label: 'Unique Reg No', value: userData.regNo },
            { label: 'Name of Candidate', value: `${userData.firstName} ${userData.lastName}` },
            { label: 'Address', value: userData.address },
            { label: 'Phone Number', value: userData.phone },
            { label: 'Date', value: new Date().toLocaleString() }
        ];
        doc.font('Helvetica').fontSize(12);
        // Add form fields to the document
        formFields.forEach((field) => {
            doc.font('Helvetica-Bold')
                .text(field.label, { continued: true })
                .font('Helvetica')
                .text('  ' + field.value)
                .moveDown(0.5);
        });
    }
    addOfferLetterDetails(doc, userData) {
        const body = `Dear ${userData.firstName} ${userData.lastName},

          This is to inform you that Skillonline Srl on behalf of this Consortium (INTERTEK, ACCREDIA, CIRPS, IBI), after the evaluation of your application to undergo an online professional certification course, has offered you admission to study ${userData.course}

          The program which has a duration of six months will commence on the 3rd of February, 2025. We are excited to have you join our community of learners and look forward to supporting your journey towards achieving professional excellence in this field. 
          
          As part of your admission onboarding, further details regarding the enrollment process, course schedule and program requirements are enclosed separately, in this email to you. Please confirm your acceptance of this offer by replying this email with the line “ I accept this offer” within 72 hours of receipt of this email.


Congratulations on your admission!`;
        doc.fontSize(14).font('Times-Roman').text(body, { align: 'justify', lineGap: 2 }).moveDown();
    }
    /* private addOfferLetterFooter(doc: PDFKit.PDFDocument) {
        try {
            const signaturePath = this.findImagePath('signature.jpeg');
            const alignLeft: any = 'left';

            if (signaturePath) {
                try {
                    doc.image(signaturePath, doc.page.width - 200, doc.y, {
                        width: 100,
                        height: 30,
                        align: alignLeft
                    });
                    doc.moveDown(1);
                } catch (imageError) {
                    console.log('Error inserting signature: ' + imageError);
                }
            }
            doc.fontSize(12).font('Helvetica').text('Best regards,', { align: 'left' }).moveDown(2).text('Gabriele Tomasi-Canova', { align: 'left' });
        } catch (error) {
            console.error('Error in addOfferLetterFooter', error);
        }
    } */
    addOfferLetterFooter(doc) {
        try {
            doc.fontSize(12).font('Helvetica').text('Best regards,', { align: 'left' });
            const signaturePath = this.findImagePath('signature.jpeg');
            if (signaturePath) {
                try {
                    doc.image(signaturePath, 50, doc.y, {
                        // Adjusting x-coordinate for alignment
                        width: 100,
                        height: 30
                    });
                    doc.moveDown(1);
                }
                catch (imageError) {
                    console.error('Error inserting signature: ' + imageError);
                }
            }
            doc.moveDown(2);
            doc.fontSize(12).font('Helvetica').text('Gabriele Tomasi-Canova', { align: 'left' });
        }
        catch (error) {
            console.error('Error in addOfferLetterFooter', error);
        }
    }
}
exports.default = OfferLetterGenerator;
