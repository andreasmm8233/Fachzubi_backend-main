import employerRoute from "../module/employer.template/employer.routes";
import authRoute from "../module/auth.template/auth.routes";
import userRoute from "../module/user.template/user.route";
import cityRoute from "../module/city.template/city.routes";
import industriesRoute from "../module/industries.template/industries.routes";
import jobRoute from "../module/job.template/job.routes";
import manageContentRoute from "../module/manage.contant.template/manage.content.route";
import smtpRoute from "../module/smtp.template/smtp.routes";
import manageKeyRoute from "../module/manage.key.template/manageKey.route";
import jobTypesRoute from "../module/job.type.template/job.types.route";
import employeeRoute from "../module/manage.employee.template/manage.employee.route";
import regionRoute from "../module/region.template/region.routes";

const router = [
  {
    prefix: "/auth",
    router: authRoute,
  },
  {
    prefix: "/employer",
    router: employerRoute,
  },
  {
    prefix: "/user",
    router: userRoute,
  },
  {
    prefix: "/regions",
    router: regionRoute,
  },
  {
    prefix: "/cities",
    router: cityRoute,
  },
  {
    prefix: "/industries",
    router: industriesRoute,
  },
  {
    prefix: "/job",
    router: jobRoute,
  },
  {
    prefix: "/manage_content",
    router: manageContentRoute,
  },
  { prefix: "/smtp", router: smtpRoute },
  {
    prefix: "/manage_key",
    router: manageKeyRoute,
  },
  {
    prefix: "/job-type",
    router: jobTypesRoute,
  },
  {
    prefix: "/employees",
    router: employeeRoute,
  },
];

export default router;
