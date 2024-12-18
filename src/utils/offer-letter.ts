import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { error, warn } from 'console';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    course: string;
    city: string;
    regNo: string;
    phone: string;
}

class OfferLetterGenerator {
    public generateOfferLetter(userData: UserData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            });

            const chunks: Buffer[] = [];

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

    private findImagePath(imageName: string): string {
        const possiblePaths = [
            path.resolve(__dirname, imageName),
            path.resolve(__dirname, 'assets', imageName),
            path.resolve(process.cwd(), imageName),
            path.resolve(process.cwd(), 'assets', imageName),
            path.resolve(process.cwd(), 'src', 'assets', imageName)
        ];

        for (const imagePath of possiblePaths) {
            if (fs.existsSync(imagePath)) {
                return imagePath;
            }
        }
        warn(`Image not Found ${imageName}. Skipping Image Insertion`);
        return 'Image Not Found';
    }
    private addOfferLetterHeader(doc: PDFKit.PDFDocument) {
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
            } catch (imageError) {
                console.error(`Error Inserting Logo: ${imageError}`);
            }
            doc.fontSize(18)
                .font('Helvetica')
                .text(' ', {
                    continued: true
                })
                .moveDown(2);
        } catch (error) {
            console.error(`Error in addOfferLetterHeader: ${error}`);
        }
    }

    private addApplicationFormHeader(doc: PDFKit.PDFDocument, userData: UserData) {
        doc.font('Helvetica-Bold').fontSize(16).text('', { align: 'center' }).moveDown(2);

        const formFields = [
            { label: 'Course of Choice', value: userData.course },
            { label: 'Unique Reg No', value: userData.regNo },
            { label: 'Name of Candidate', value: `${userData.firstName} ${userData.lastName}` },
            { label: 'Address', value: userData.city },
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

    private addOfferLetterDetails(doc: PDFKit.PDFDocument, userData: UserData) {
        const body = `Dear ${userData.firstName} ${userData.lastName},

          This is to inform you that Skillonline Srl on behalf of this Consortium (INTERTEK, ACCREDIA, CIRPS, IBI), after the evaluation of your application to undergo and online professional certification course, has offered you admission to study ${userData.course}

          The program which has a duration of six months will commence on the 3rd of February, 2025. We are excited to have you join our community of learners and look forward to supporting your journey towards achieving professional excellence in this field. 
          
          As part of your admission onboarding, further details regarding the enrollment process, course schedule and program requirements are enclosed separately, in this email to you. Please confirm your acceptance of this offer by replying this email with the line “ I accept this offer” within 72 hours of receipt of this email.


Congratulations on your admission!`;

        doc.fontSize(14).font('Times-Roman').text(body, { align: 'justify', lineGap: 2 }).moveDown();
    }

    private addOfferLetterFooter(doc: PDFKit.PDFDocument) {
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
    }
}

export default OfferLetterGenerator;
