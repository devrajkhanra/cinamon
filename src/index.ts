// main.ts

import environment from "./modules/environment";
import userConfigModule, { UserConfig } from "./modules/userConfig";
import folderGeneratorModule from "./modules/folder";
import fs from "fs";
import path from "path";

function initialSetup() {
  // Get the user's operating system and home directory
  const userEnvironment = environment.detectUserEnvironment();

  if (userEnvironment) {
    const [userOS, homeDirectory] = userEnvironment;
    const data: boolean = fs.existsSync(path.join(homeDirectory, "data"));
    // Save user configuration to a JSON file
    if (!data) {
      const userConfig: UserConfig = {
        operatingSystem: userOS,
        homeDirectory,
        folder: {
          data: true,
          subfolders: {
            stock: false,
            indice: false,
            nifty: false,
          },
        },
      };

      userConfigModule.saveUserConfig(userConfig);

      // Generate folders based on the user configuration
      folderGeneratorModule.generateFolders(userConfig);
    }
  } else {
    // Handle the case when the operating system is unsupported
    console.error("Exiting application due to unsupported operating system.");
  }
}

export default initialSetup
