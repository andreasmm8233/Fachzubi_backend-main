"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
        return;
    }
    try {
        const hashed = await bcrypt_1.default.hash(this.get("password"), 10);
        this.set("password", hashed);
        next();
    }
    catch (err) {
        next(err);
    }
});
userSchema.methods.updatePassword = async function (newPassword) {
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    this.password = hashedPassword;
    await this.save();
};
userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt_1.default.compare(candidatePassword, this.password);
    return isMatch;
};
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.js.map