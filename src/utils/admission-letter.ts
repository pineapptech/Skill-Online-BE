import PDFDocument, { moveDown } from 'pdfkit'

interface UserData{
    
    firstName: string
    email: string
}

class AdmissionLetter {
    public generatePFD(userData: UserData): Promise<Buffer>{
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50
                }
            })

            // store PDF chunks
            const chunks: Buffer[] = [];
            doc.on('data', (chunk) => chunks.push(chunk))
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject)

            // PDF Content Structure
            this.addHeader(doc)
            this.addUserDetails(doc, userData)
            this.addWelcomeMessage(doc, userData)
            this.addFooter(doc)

            // Finalize PDF 
            doc.end()
        })
    }

    // Add header to the PDF 
    private addHeader(doc:PDFKit.PDFDocument) {
        doc.font('Helvetica-Bold')
            .fontSize(25)
            .text('Welcome to Our Platform', {   align: 'center'})
            .moveDown(2)
    }

    private addUserDetails(doc:PDFKit.PDFDocument, userData:UserData) {
        doc.font('Helvetica')
            .fontSize(16)
            .text(`Dear ${userData.firstName},`, {align: 'center'})
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

    private addWelcomeMessage(doc:PDFKit.PDFDocument, userData:UserData){
        doc.fontSize(12)
            .fillColor('#34495E')
            .text('We are thrilled to have you join our community,', {align: 'left'})
            .moveDown()
            .text('Get Ready to explore amazing features and opportunities!')
            .moveDown(2)
    }

    private addFooter(doc:PDFKit.PDFDocument) {
        doc.fontSize(10)
            .fillColor('blue')
            .text('Thank you for joining us!', {align: 'center'})
            .moveDown()
            .fillColor('gray')
            .fontSize(8)
            .text('© 2024 Our Company. All rights reserved.', { align: 'center' });
    }
}

export default AdmissionLetter