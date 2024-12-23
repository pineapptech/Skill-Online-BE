import { model, Schema } from 'mongoose';
import IContact from '../interfaces/contact.interface';

const contactSchema = new Schema<IContact>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const Contact = model<IContact>('Contact', contactSchema);
export default Contact;
