// folderGenerator.ts

import * as fs from "fs";
import * as path from "path";
import { UserConfig } from "../userConfig";

// Define an interface for the folder generator module
export interface FolderGeneratorModule {
  generateFolders: (config: UserConfig) => void;
}

// Implement the folder generator module
const folderGeneratorModule: FolderGeneratorModule = {
  generateFolders: (config: UserConfig) => {
    const configFile = path.join(
      config.homeDirectory,
      "data",
      "userConfig.json"
    );

    try {
      const jsonData = fs.readFileSync(configFile, "utf-8");
      const userConfig: UserConfig = JSON.parse(jsonData);
      console.log(userConfig);

      // Ensure the Data folder exists
      const dataFolder = path.join(userConfig.homeDirectory, "data");
      fs.mkdirSync(dataFolder, { recursive: true });

      // Generate folders based on false values and update them to true
      const foldersToGenerate = [
        "subfolders/stock",
        "subfolders/indice",
        "subfolders/nifty",
      ];

      foldersToGenerate.forEach((folderPath) => {
        
        const fullPath = path.join(dataFolder, folderPath);
        const value = folderPath.substring(11)
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log("Folder generated:", fullPath);

          // Update the value in userConfig to true
          userConfig.folder.subfolders[value] = true
        }
      });

      console.log(userConfig);
      
      // Save the updated user configuration back to the JSON file
      fs.writeFileSync(configFile, JSON.stringify(userConfig, null, 2));

      console.log("User configuration updated and saved.");
    } catch (error) {
      console.error("Error reading or parsing user configuration:", error);
    }
  },
};

export default folderGeneratorModule;
