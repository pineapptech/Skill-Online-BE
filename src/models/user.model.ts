import { model, Schema } from "mongoose";
import IUser from "../interfaces/user.interface";

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,

    },
    gender:{
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    regNo: {
        type: String,
        trim: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    stateOrCountry: {
        type: String,
        trim: true,
    },
    province: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    passportId: {
        type: String,
        trim: true
    },
    photoUrl: {
        type: String,
        trim: true,
    },
    course: {
        type: String,
        trim: true,
    }
},
{
    timestamps: true,
    versionKey: false
}
)

const User = model<IUser>('user', userSchema);
export default User;