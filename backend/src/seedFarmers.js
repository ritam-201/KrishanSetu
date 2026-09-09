import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { User } from "./models/User.js";
import { FarmerProfile } from "./models/FarmerProfile.js";

dotenv.config();

/*
=========================================================
KISANSETU DEMO FARMER SEEDER

Creates 3 farmers for every Mandi in:
src/data/mandiData.ts

Farmers are connected to:
District
Block
Mandi / Procurement Center

Safe to run multiple times.
Existing demo farmers will be updated instead of duplicated.
=========================================================
*/

const FRONTEND_MANDI_FILE = path.resolve(
  process.cwd(),
  "..",
  "frontend",
  "src",
  "data",
  "mandiData.ts"
);

const farmerFirstNames = [
  "Amit",
  "Rakesh",
  "Suman",
  "Bikash",
  "Subhankar",
  "Pradip",
  "Sanjay",
  "Tapas",
  "Debashis",
  "Arindam",
  "Soumen",
  "Ranjit",
  "Manoj",
  "Bimal",
  "Ashok",
  "Subrata",
  "Sourav",
  "Rajesh",
  "Anup",
  "Partha",
  "Nirmal",
  "Rahul",
  "Abhishek",
  "Kunal",
  "Tapan",
  "Dipak",
  "Biswajit",
  "Prasenjit",
  "Sukanta",
  "Sanjib",
];

const farmerLastNames = [
  "Das",
  "Roy",
  "Ghosh",
  "Mondal",
  "Pal",
  "Maity",
  "Barman",
  "Mahato",
  "Dutta",
  "Jana",
  "Ghosh",
  "Chatterjee",
  "Mandal",
  "Bose",
  "Sen",
  "Rai",
  "Lama",
  "Tamang",
  "Sherpa",
  "Lepcha",
];

const villages = [
  "Krishnapur",
  "Rampur",
  "Haripur",
  "Madhabpur",
  "Gopalpur",
  "Shyampur",
  "Chandipur",
  "Kalyanpur",
  "Narayanpur",
  "Raghunathpur",
  "Basantapur",
  "Lakshmipur",
  "Durgapur",
  "Kamalpur",
  "Anandapur",
];

const crops = [
  {
    cropName: "Rice / Paddy",
    variety: "Swarna",
    season: "Kharif",
    expectedQuantityQuintals: 35,
  },
  {
    cropName: "Wheat",
    variety: "HD-2967",
    season: "Rabi",
    expectedQuantityQuintals: 25,
  },
  {
    cropName: "Mustard",
    variety: "Varuna",
    season: "Rabi",
    expectedQuantityQuintals: 18,
  },
  {
    cropName: "Maize",
    variety: "Hybrid",
    season: "Kharif",
    expectedQuantityQuintals: 22,
  },
];

function getBlockName(address = "") {
  const match = address.match(
    /^([A-Za-z\s-]+?)(?:\s+(?:Agricultural|Market|Block|Main|Zone))/i,
  );

  if (match?.[1]) {
    return match[1].trim();
  }

  return address.trim() || "General";
}

/*
---------------------------------------------------------
Read mandiData.ts

We extract every makeCenter(...) call directly from the
existing frontend data.

This means you don't have to maintain a second huge
Mandi list in the backend.
---------------------------------------------------------
*/

function loadMandisFromFrontend() {
  if (!fs.existsSync(FRONTEND_MANDI_FILE)) {
    throw new Error(`Cannot find mandiData.ts at:\n${FRONTEND_MANDI_FILE}`);
  }

  const source = fs.readFileSync(FRONTEND_MANDI_FILE, "utf8");

  const regex =
    /makeCenter\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,/g;

  const mandis = [];

  let match;

  while ((match = regex.exec(source)) !== null) {
    const [, id, name, code, district, address] = match;

    mandis.push({
      id,
      name,
      code,
      district,
      state: "West Bengal",
      address,
      block: getBlockName(address),
    });
  }

  if (mandis.length === 0) {
    throw new Error("No Mandis were found inside mandiData.ts.");
  }

  return mandis;
}

function generateFarmerName(index) {
  const first = farmerFirstNames[index % farmerFirstNames.length];

  const last =
    farmerLastNames[
      Math.floor(index / farmerFirstNames.length) % farmerLastNames.length
    ];

  return `${first} ${last}`;
}

function generatePhone(index) {
  /*
   * Demo-only phone numbers.
   * Starts from 91XXXXXXXXXX pattern.
   */
  return `9001${String(index).padStart(6, "0")}`;
}

function generateEmail(index) {
  return `farmer${index}@kisansetu.demo`;
}

function generateFarmerId(index) {
  return `FMR-WB-${String(index).padStart(5, "0")}`;
}

function generateRegistrationNumber(index) {
  return `KSR-WB-${String(index).padStart(6, "0")}`;
}

function generateCropList(farmerIndex) {
  const crop1 = crops[farmerIndex % crops.length];

  const crop2 = crops[(farmerIndex + 1) % crops.length];

  return [
    {
      ...crop1,
      expectedQuantityQuintals:
        crop1.expectedQuantityQuintals + (farmerIndex % 10),
      harvestDate: "2026-11-15",
      expectedProcurementDate: "2026-11-20",
    },
    {
      ...crop2,
      expectedQuantityQuintals:
        crop2.expectedQuantityQuintals + (farmerIndex % 8),
      harvestDate: "2027-01-10",
      expectedProcurementDate: "2027-01-15",
    },
  ];
}

async function seedFarmers() {
  console.log("\n🌾 KisanSetu Demo Farmer Seeder");
  console.log("================================");

  const mandis = loadMandisFromFrontend();

  console.log(`📍 Found ${mandis.length} Mandis`);

  const passwordHash = await bcrypt.hash("Farmer@123", 10);

  let farmerCounter = 1;

  let createdUsers = 0;
  let updatedUsers = 0;

  let createdProfiles = 0;
  let updatedProfiles = 0;

  /*
   * 3 farmers per Mandi.
   *
   * If there are 130 Mandis:
   * 130 × 3 = 390 farmers
   */

  for (const mandi of mandis) {
    for (let farmerNumber = 1; farmerNumber <= 3; farmerNumber++) {
      const farmerIndex = farmerCounter++;

      const name = generateFarmerName(farmerIndex);

      const phone = generatePhone(farmerIndex);

      const email = generateEmail(farmerIndex);

      const farmerId = generateFarmerId(farmerIndex);

      const registrationNumber = generateRegistrationNumber(farmerIndex);

      const village = villages[farmerIndex % villages.length];

      /*
       --------------------------------------------------
       USER
       --------------------------------------------------
      */

      let user = await User.findOne({
        phone,
      });

      if (user) {
        user.name = name;
        user.email = email;
        user.passwordHash = passwordHash;
        user.role = "farmer";
        user.assignedCenterId = mandi.id;
        user.assignedCenterName = mandi.name;

        await user.save();

        updatedUsers++;
      } else {
        user = await User.create({
          name,
          phone,
          email,
          passwordHash,
          role: "farmer",
          assignedCenterId: mandi.id,
          assignedCenterName: mandi.name,
        });

        createdUsers++;
      }

      /*
       --------------------------------------------------
       FARMER PROFILE
       --------------------------------------------------
      */

      const profileData = {
        userId: user._id,

        farmerId,

        fullName: name,

        dob: "1985-06-15",

        gender: farmerNumber === 2 ? "Female" : "Male",

        preferredLanguage: farmerNumber === 2 ? "bn" : "en",

        mobileNumber: phone,

        email,

        addressLine: `${village}, ${mandi.block}`,

        village,

        block: mandi.block,

        district: mandi.district,

        state: "West Bengal",

        pinCode: `700${String(100 + (farmerIndex % 899))}`,

        govtIdType: "Aadhaar Card",

        maskedGovtId: `XXXX-XXXX-${String(1000 + farmerIndex).slice(-4)}`,

        farmerRegistrationNumber: registrationNumber,

        verificationStatus: "Verified",

        verificationDate: "2026-09-01",

        farmName: `${village} Green Farm`,

        farmLocation: `${village}, ${mandi.block}, ${mandi.district}`,

        totalLandArea: 2 + (farmerIndex % 8),

        landUnit: "Acres",

        ownershipType: farmerNumber === 3 ? "Leased" : "Owned",

        irrigationAvailable: farmerIndex % 5 !== 0,

        soilType: "Alluvial Loam",

        crops: generateCropList(farmerIndex),

        /*
         * THIS IS THE MOST IMPORTANT FIELD.
         *
         * It connects the farmer to the selected Mandi.
         */
        preferredCenterId: mandi.id,

        preferredTimeSlot:
          farmerNumber === 1
            ? "09:00 AM - 12:00 PM"
            : farmerNumber === 2
              ? "12:00 PM - 03:00 PM"
              : "03:00 PM - 06:00 PM",

        preferredNotificationMethod: "SMS & WhatsApp",

        completionPercentage: 95,

        updatedAt: new Date(),
      };

      const existingProfile = await FarmerProfile.findOne({
        farmerId,
      });

      if (existingProfile) {
        Object.assign(existingProfile, profileData);

        await existingProfile.save();

        updatedProfiles++;
      } else {
        await FarmerProfile.create(profileData);

        createdProfiles++;
      }

      console.log(
        `✅ ${farmerId} | ${name} | ${mandi.district} | ${mandi.block} | ${mandi.name}`,
      );
    }
  }

  console.log("\n================================");
  console.log("🎉 FARMER SEEDING COMPLETED");
  console.log("================================");

  console.log(`📍 Mandis processed: ${mandis.length}`);

  console.log(`👨‍🌾 Farmers created: ${createdProfiles}`);

  console.log(`🔄 Farmers updated: ${updatedProfiles}`);

  console.log(`👤 Users created: ${createdUsers}`);

  console.log(`🔄 Users updated: ${updatedUsers}`);

  console.log(`📊 Total demo farmers: ${mandis.length * 3}`);

  console.log("\n🔑 Demo farmer password: Farmer@123");
}

async function start() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/kisansetu";

    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected");

    await seedFarmers();

    await mongoose.disconnect();

    console.log("\n✅ MongoDB connection closed.");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Farmer seeding failed:");

    console.error(error);

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
}

start();
