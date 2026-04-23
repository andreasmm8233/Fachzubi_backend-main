"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConnection_1 = require("./utils/dbConnection");
const router_1 = __importDefault(require("./router"));
const path_1 = __importDefault(require("path"));
const emailService_1 = __importDefault(require("./utils/emailService"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const logger_1 = __importDefault(require("./utils/logger"));
const middleware_1 = __importDefault(require("./middleware"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env"),
});
const PORT = process.env.PORT ?? 4000;
const db = new dbConnection_1.Database(process.env.mongoURI ?? "");
db.connect();
(async () => {
    await emailService_1.default.init();
    await emailService_1.default.verifyConnection();
})();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(process.cwd(), "public")));
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
};
app.use((0, cors_1.default)(corsOptions));
(0, middleware_1.default)(app);
app.use((0, express_fileupload_1.default)());
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});
app.get("/", (_req, res) => {
    res.sendSuccess200Response("Yay!🚀", null);
});
router_1.default.forEach((route) => {
    app.use(`/api/v1${route.prefix}`, route.router);
});
app.listen(PORT, () => {
    logger_1.default.info(`Server is running 🚀🚀🚀🚀 http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map