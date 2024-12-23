import { Document } from 'mongoose';

interface IContact extends Document {
    name: string;
    email: string;
    message: string;
}

export default IContact;
