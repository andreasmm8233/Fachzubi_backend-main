"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
class Database {
    mongoURI;
    constructor(uri) {
        this.mongoURI = uri;
    }
    connect() {
        mongoose_1.default
            .connect(this.mongoURI)
            .then(() => {
            logger_1.default.info("Database connection successful");
        })
            .catch((err) => {
            logger_1.default.error("Database connection error", err);
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=dbConnection.js.map