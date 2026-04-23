"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employer_routes_1 = __importDefault(require("../module/employer.template/employer.routes"));
const auth_routes_1 = __importDefault(require("../module/auth.template/auth.routes"));
const user_route_1 = __importDefault(require("../module/user.template/user.route"));
const city_routes_1 = __importDefault(require("../module/city.template/city.routes"));
const industries_routes_1 = __importDefault(require("../module/industries.template/industries.routes"));
const job_routes_1 = __importDefault(require("../module/job.template/job.routes"));
const manage_content_route_1 = __importDefault(require("../module/manage.contant.template/manage.content.route"));
const smtp_routes_1 = __importDefault(require("../module/smtp.template/smtp.routes"));
const manageKey_route_1 = __importDefault(require("../module/manage.key.template/manageKey.route"));
const job_types_route_1 = __importDefault(require("../module/job.type.template/job.types.route"));
const router = [
    {
        prefix: "/auth",
        router: auth_routes_1.default,
    },
    {
        prefix: "/employer",
        router: employer_routes_1.default,
    },
    {
        prefix: "/user",
        router: user_route_1.default,
    },
    {
        prefix: "/cities",
        router: city_routes_1.default,
    },
    {
        prefix: "/industries",
        router: industries_routes_1.default,
    },
    {
        prefix: "/job",
        router: job_routes_1.default,
    },
    {
        prefix: "/manage_content",
        router: manage_content_route_1.default,
    },
    { prefix: "/smtp", router: smtp_routes_1.default },
    {
        prefix: "/manage_key",
        router: manageKey_route_1.default,
    },
    {
        prefix: "/job-type",
        router: job_types_route_1.default,
    },
];
exports.default = router;
//# sourceMappingURL=index.js.map