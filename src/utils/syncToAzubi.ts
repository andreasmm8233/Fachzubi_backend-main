import logger from "./logger";
import {
  employerModel,
  companyImageModel,
  mediaModel,
  jobModel,
  jobImagesModel,
  jobDocumentModel,
} from "../models";

const getPublicBaseUrl = (): string =>
  process.env.FACHZUBI_PUBLIC_URL ??
  `http://localhost:${process.env.PORT ?? 3001}`;

const toAbsoluteUrl = (filepath?: string | null): string | null => {
  if (!filepath) return null;
  if (/^https?:\/\//i.test(filepath)) return filepath;
  const base = getPublicBaseUrl().replace(/\/$/, "");
  return `${base}/${String(filepath).replace(/^\//, "")}`;
};

/**
 * Re-fetches the employer with all related entities (industry, city, region,
 * logo, gallery images) resolved, and builds the full sync payload that
 * AzubiB2B stores for the "Manage Companies (Fachzubi)" detail view.
 */
const buildFullCompanyPayload = async (
  employerId: string,
): Promise<Record<string, unknown> | null> => {
  const employer: any = await employerModel
    .findById(employerId)
    .populate("industryName", "industryName")
    .populate("city", "name address zipCode")
    // .populate("region", "regionName") // REGION FEATURE DISABLED
    .populate({ path: "companyLogo", select: "_id filepath fileName" })
    .lean();

  if (!employer) return null;

  // Gallery images (companyImage -> media filepath)
  const imageDocs: any[] = await companyImageModel
    .find({ companyId: employer._id })
    .lean();
  const mediaIds = imageDocs.map((d) => d.imageId);
  const mediaDocs: any[] = mediaIds.length
    ? await mediaModel.find({ _id: { $in: mediaIds } }).lean()
    : [];
  const companyImages = mediaDocs
    .map((m) => toAbsoluteUrl(m.filepath))
    .filter((u): u is string => Boolean(u));

  return {
    fachzubiId: String(employer._id),
    companyName: employer.companyName,
    email: employer.email,
    contactPerson: employer.contactPerson,
    phoneNo: employer.phoneNo,
    address: employer.address,
    companyDescription: employer.companyDescription,
    website: employer.website,
    status: employer.status,
    // rich detail
    jobTitle: employer.jobTitle ?? "",
    zipCode: employer.zipCode ?? "",
    videoLink: Array.isArray(employer.videoLink) ? employer.videoLink : [],
    industryName: employer.industryName?.industryName ?? "",
    cityName: employer.city?.name ?? "",
    cityAddress: employer.city?.address ?? "",
    cityZipCode: employer.city?.zipCode ?? "",
    // regionName: employer.region?.regionName ?? "", // REGION FEATURE DISABLED
    logoUrl: toAbsoluteUrl(employer.companyLogo?.filepath),
    companyImages,
    createdAt: employer.createdAt,
    updatedAt: employer.updatedAt,
  };
};

export const syncCompanyToAzubi = (employer: any): void => {
  const AZUBI_API_URL = process.env.AZUBI_API_URL ?? "";
  const SYNC_SECRET = process.env.SYNC_SECRET ?? "";
  if (!AZUBI_API_URL || !SYNC_SECRET) return;
  if (!employer?._id) return;

  // fire-and-forget: resolve full details then push
  void (async () => {
    try {
      const payload = await buildFullCompanyPayload(String(employer._id));
      if (!payload) return;
      const res = await fetch(`${AZUBI_API_URL}/api/v1/sync/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sync-secret": SYNC_SECRET,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        logger.error(
          `syncCompanyToAzubi: AzubiB2B responded ${res.status} ${body}`,
        );
      }
    } catch (err) {
      logger.error("syncCompanyToAzubi failed", err as Error);
    }
  })();
};

export const syncDeleteCompanyToAzubi = (employerId: string): void => {
  const AZUBI_API_URL = process.env.AZUBI_API_URL ?? "";
  const SYNC_SECRET = process.env.SYNC_SECRET ?? "";
  if (!AZUBI_API_URL || !SYNC_SECRET) return;

  fetch(`${AZUBI_API_URL}/api/v1/sync/company/${employerId}`, {
    method: "DELETE",
    headers: { "x-sync-secret": SYNC_SECRET },
  }).catch((err: Error) => {
    logger.error("syncDeleteCompanyToAzubi failed", err);
  });
};

/**
 * Re-fetches the job with related entities (company, city, industry, region)
 * resolved, and builds the full sync payload used by the AzubiB2B "Manage Jobs
 * (Fachzubi)" detail view.
 */
const buildFullJobPayload = async (
  jobId: string,
): Promise<Record<string, unknown> | null> => {
  const job: any = await jobModel
    .findById(jobId)
    .populate("company", "_id companyName")
    .populate("city", "name")
    .populate("industryName", "industryName")
    // .populate("region", "regionName") // REGION FEATURE DISABLED
    .lean();

  if (!job) return null;

  const cityNames = Array.isArray(job.city)
    ? job.city.map((c: any) => c?.name).filter(Boolean)
    : [];
  const industryNames = Array.isArray(job.industryName)
    ? job.industryName.map((i: any) => i?.industryName).filter(Boolean)
    : [];

  // Job gallery images (jobImages -> media filepath)
  const imageDocs: any[] = await jobImagesModel.find({ jobId: job._id }).lean();
  const imageMediaIds = imageDocs.map((d) => d.imageId);
  const imageMedia: any[] = imageMediaIds.length
    ? await mediaModel.find({ _id: { $in: imageMediaIds } }).lean()
    : [];
  const jobImages = imageMedia
    .map((m) => toAbsoluteUrl(m.filepath))
    .filter((u): u is string => Boolean(u));

  // Attachments / documents (jobDocument -> media filepath)
  const docDocs: any[] = await jobDocumentModel.find({ job: job._id }).lean();
  const docMediaIds = docDocs.map((d) => d.document);
  const docMedia: any[] = docMediaIds.length
    ? await mediaModel.find({ _id: { $in: docMediaIds } }).lean()
    : [];
  const attachments = docMedia
    .map((m) => ({
      file: toAbsoluteUrl(m.filepath),
      fileName: m.fileName ?? "",
      type: m.type ?? "",
    }))
    .filter((a) => Boolean(a.file));

  return {
    fachzubiId: String(job._id),
    fachzubiCompanyId: job.company?._id ? String(job.company._id) : String(job.company),
    jobTitle: job.jobTitle,
    email: job.email,
    additionalEmail: job.additionalEmail ?? "",
    address: job.address,
    zipCode: job.zipCode ?? "",
    jobDescription: job.jobDescription,
    startDate: job.startDate,
    status: job.status,
    // rich detail
    videoLink: Array.isArray(job.videoLink) ? job.videoLink : [],
    companyName: job.company?.companyName ?? "",
    cityNames,
    industryNames,
    industryName: industryNames.join(", "),
    // regionName: job.region?.regionName ?? "", // REGION FEATURE DISABLED
    jobImages,
    attachments,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

export const syncDeleteJobToAzubi = (jobId: string): void => {
  const AZUBI_API_URL = process.env.AZUBI_API_URL ?? "";
  const SYNC_SECRET = process.env.SYNC_SECRET ?? "";
  if (!AZUBI_API_URL || !SYNC_SECRET) return;

  fetch(`${AZUBI_API_URL}/api/v1/sync/job/${jobId}`, {
    method: "DELETE",
    headers: { "x-sync-secret": SYNC_SECRET },
  }).catch((err: Error) => {
    logger.error("syncDeleteJobToAzubi failed", err);
  });
};

export const syncJobToAzubi = (job: any): void => {
  const AZUBI_API_URL = process.env.AZUBI_API_URL ?? "";
  const SYNC_SECRET = process.env.SYNC_SECRET ?? "";
  if (!AZUBI_API_URL || !SYNC_SECRET) return;
  if (!job?._id) return;

  void (async () => {
    try {
      const payload = await buildFullJobPayload(String(job._id));
      if (!payload) return;
      const res = await fetch(`${AZUBI_API_URL}/api/v1/sync/job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sync-secret": SYNC_SECRET,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        logger.error(
          `syncJobToAzubi: AzubiB2B responded ${res.status} ${body}`,
        );
      }
    } catch (err) {
      logger.error("syncJobToAzubi failed", err as Error);
    }
  })();
};
