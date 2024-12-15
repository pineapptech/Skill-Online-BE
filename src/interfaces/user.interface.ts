import { Document } from "mongoose"

interface IUser extends Document {
    firstName: string;
    lastName: string;
    gender:string;
    email: string;
    regNo: string;
    phone: string;
    stateOrCountry: string;
    province: string;
    city: string;
    passportId: string;
    photoUrl: string;
    course: string;
}

export default IUser;