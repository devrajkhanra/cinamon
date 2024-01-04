// main.ts

import environment from "./modules/environment";
import userConfigModule, { UserConfig } from "./modules/userConfig";
import folderGeneratorModule from "./modules/folder";
import fs from "fs";
import path from "path";
import * as readlineSync from "readline-sync";
import downloadCsvFile from "./modules/downloader";

function initialSetup() {
  // Get the user's operating system and home directory
  const userEnvironment = environment.detectUserEnvironment();
  const date: string = readlineSync.question("Enter the Date (ddmmyyyy): ");
  console.log(date);

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
    } else {
      downloadCsvFile(
        `https://archives.nseindia.com/products/content/sec_bhavdata_full_${date}.csv`,
        `${homeDirectory}/data/subfolders/stock`,
        `sec_bhavdata_full_${date}`,
        date
      );
      downloadCsvFile(
        `https://archives.nseindia.com/content/indices/ind_close_all_${date}.csv`,
        `${homeDirectory}/data/subfolders/indice`,
        `ind_close_all_${date}`,
        date
      );
      downloadCsvFile(
        `https://archives.nseindia.com/content/indices/ind_nifty50list.csv`,
        `${homeDirectory}/data/subfolders/nifty`,
        "ind_nifty50list"
      );
      downloadCsvFile(
        `https://archives.nseindia.com/content/indices/ind_niftynext50list.csv`,
        `${homeDirectory}/data/subfolders/nifty`,
        "ind_niftynext50list"
      );
      downloadCsvFile(
        `https://archives.nseindia.com/content/indices/ind_niftymidcap50list.csv`,
        `${homeDirectory}/data/subfolders/nifty`,
        "ind_niftymidcap50list"
      );
      downloadCsvFile(
        `https://archives.nseindia.com/content/indices/ind_niftysmallcap50list.csv`,
        `${homeDirectory}/data/subfolders/nifty`,
        "ind_niftysmallcap50list"
      );
      // FNO List
      // downloadCsvFile(
      //   `https://nsearchives.nseindia.com/content/fo/fo_mktlots.csv`,
      //   `${homeDirectory}/data/subfolders/nifty`,
      //   "ind_niftyfnolist"
      // );
    }
  } else {
    // Handle the case when the operating system is unsupported
    console.error("Exiting application due to unsupported operating system.");
  }
}

initialSetup();
