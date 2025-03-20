import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      // console.log(`Cleared data from ${modelName}`);
    } catch (error : any) {
      console.error(`Error clearing data from ${modelName}:`, error.message);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData3");

  const orderedFileNames = [
    "user.json",
    "project.json",
    "task.json",
    "team.json",
    "projectTeam.json",
    "userComments.json",
  ];

  // await deleteAllData(orderedFileNames);

  for (const fileName of orderedFileNames) {

    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];
    // console.log("modelName => ", modelName)

    try {
      for (const data of jsonData) {
          await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error : any) {
      console.error(`Error seeding data for ${modelName}:`, error.message);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());