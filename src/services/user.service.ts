import { log } from 'console';
import cloudinary from '../config/cloudinary';
import IUser from '../interfaces/user.interface';
import fs from 'fs';
import User from '../models/user.model';
import generateIdentifier from '../utils/generate-regno';
import IContact from '../interfaces/contact.interface';
import Contact from '../models/contact.model';
import Promo from '../models/promo.model';

export class UserService {
    public createUser = async (
        file: Express.Multer.File | undefined,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        course: string,
        city: string,
        address: string,
        userData: Partial<IUser>
    ): Promise<IUser> => {
        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !course || !city || !address) {
            throw new Error('All Fields are required');
        }

        // Check if file is provided
        if (!file) {
            throw new Error('File is required');
        }

        const promoCode = (await Promo.findOne({ promoCode: userData.promoCode })) || '';

        try {
            // Upload file to cloudinary
            const result = await cloudinary.uploader.upload(file!.path, { folder: 'userPhoto' });

            // Log result only in non-production environment
            process.env.NODE_ENV !== 'production' ? log(result) : '';

            // Remove temporary file
            if (fs.existsSync(file!.path)) {
                fs.unlinkSync(file!.path);
            }

            const regNo = generateIdentifier(course);

            // Create user with uploaded photo URL
            const user = await User.create({
                photoUrl: result.secure_url,
                firstName,
                lastName,
                email,
                phone,
                course,
                regNo,
                address,
                promoCode,
                ...userData
            });

            return user;
        } catch (error) {
            // Ensure temporary file is deleted in case of error
            if (file && file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            throw error;
        }
    };

    public deleteUsers = async () => {
        const user = await User.deleteMany();
        return user;
    };

    public getUsers = async (): Promise<IUser[]> => {
        const user = await User.find();
        return user;
    };

    public sendContactMessage = async (userData: IContact) => {
        const { name, email, message } = userData;
        if (!name || !email || !message) {
            throw new Error('All Fields are required');
        }
        const contact = await Contact.create({
            name,
            email,
            message
        });
        return contact;
    };

    public getAUserEmail = async (email: string) => {
        const emailExists = await User.findOne({ email });
        return emailExists;
    };
}

export default UserService;
