import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,       // ✅ use String (built-in Mongoose type)
        required: true,     // ✅ fixed typo
        unique: true
    },
    description: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {             // ✅ fixed typo
        type: String,
    },
    logo: {
        type: String // ✅ URL to logo
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);
