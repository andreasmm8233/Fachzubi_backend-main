import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { cityModel } from "../models";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const mongoURI = process.env.mongoURI ?? "";
const frontendUrl = (process.env.FRONTEND_URL ?? "").replace(/\/+$/, "");
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

const slugifyCity = (cityName: string) =>
  encodeURIComponent(
    cityName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""),
  );

const buildCityQrData = (cityName: string) => {
  const citySlug = slugifyCity(cityName);
  const qrTargetUrl = `${frontendUrl}/jobs/${citySlug}`;
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    qrTargetUrl,
  )}`;
  return { qrCode, qrTargetUrl };
};

const run = async () => {
  if (!mongoURI) {
    throw new Error("Missing mongoURI in .env");
  }
  if (!frontendUrl) {
    throw new Error("Missing FRONTEND_URL in .env");
  }

  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");

  const filter = force
    ? {}
    : {
        $or: [
          { qrCode: { $exists: false } },
          { qrCode: "" },
          { qrTargetUrl: { $exists: false } },
          { qrTargetUrl: "" },
        ],
      };

  const cities = await cityModel.find(filter).select("_id name qrCode qrTargetUrl");
  console.log(`Found ${cities.length} city records to process`);

  if (cities.length === 0) {
    console.log("Nothing to migrate");
    return;
  }

  if (dryRun) {
    for (const city of cities) {
      const { qrCode, qrTargetUrl } = buildCityQrData(city.name);
      console.log(
        `[DRY-RUN] ${city._id} ${city.name} -> qrTargetUrl=${qrTargetUrl} qrCode=${qrCode}`,
      );
    }
    console.log("Dry run completed. No database changes were made.");
    return;
  }

  const operations = cities.map((city) => {
    const { qrCode, qrTargetUrl } = buildCityQrData(city.name);
    return {
      updateOne: {
        filter: { _id: city._id },
        update: { $set: { qrCode, qrTargetUrl } },
      },
    };
  });

  const result = await cityModel.bulkWrite(operations);
  console.log(
    `Migration complete. matched=${result.matchedCount} modified=${result.modifiedCount}`,
  );
};

void run()
  .catch((error) => {
    console.error("City QR migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
