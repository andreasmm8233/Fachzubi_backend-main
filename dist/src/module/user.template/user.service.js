"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const models_1 = require("../../models");
class UserService {
    async findById(id) {
        return await models_1.userModel.findById(id);
    }
    async findOneWithOptions(options) {
        return await models_1.userModel.findOne(options);
    }
    async create(user) {
        return await models_1.userModel.create(user);
    }
    async createSession(payload) {
        const { userId, userAgent, ipAddress } = payload;
        return await models_1.userSessionModel.create({
            userId,
            userAgent,
            ipAddress,
        });
    }
    async getUserSessionDetailsBySessionId(sessionId) {
        return await models_1.userSessionModel.findById(sessionId);
    }
    async getUserSessionDetails(payload) {
        return await models_1.userSessionModel.findOne(payload);
    }
    async updateProfile(userId, newPassword, oldPassword, profileFields) {
        const user = await models_1.userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (oldPassword) {
            const isPasswordMatch = await user.comparePassword(oldPassword);
            if (!isPasswordMatch) {
                throw new Error("Old password is incorrect");
            }
        }
        if (newPassword) {
            await user.updatePassword(newPassword);
        }
        if (profileFields) {
            Object.assign(user, profileFields);
        }
        await user.save();
    }
    async updateForgetPassword(userId, newPassword) {
        const user = await models_1.userModel.findById(userId);
        if (user) {
            user.password = newPassword;
            return await user.save();
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map