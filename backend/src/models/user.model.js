import mongoose, { Schema } from "mongoose";

mongoose.set('strictQuery', false);

//mongoose.set('st')
const userScheme = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        token: { type: String }
    }
)

const User = mongoose.model("User", userScheme);

export { User };
