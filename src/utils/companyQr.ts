// QR codes for companies point to the public company page, which the frontend
// QR scanner opens directly (it navigates to the scanned URL's path).
const getQrFrontendUrl = (): string =>
  (process.env.QR_FRONTEND_URL ?? "https://unibonus.app").replace(/\/+$/, "");

export const buildCompanyQrData = (companyId: string) => {
  const qrTargetUrl = `${getQrFrontendUrl()}/company-list/${encodeURIComponent(companyId)}`;
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    qrTargetUrl,
  )}`;
  return { qrCode, qrTargetUrl };
};
