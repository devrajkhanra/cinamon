import * as fs from "fs";
import * as path from "path";
import axios from "axios";

interface DownloadedFile {
  fileName: string;
  date: string;
}

const downloadCsvFile = async (
  url: string,
  folderPath: string,
  fileName: string,
  date: string = getCurrentDate()
): Promise<void> => {
  try {
    const response = await axios.get(url);
    // console.log(response);
    
    const file = `${fileName}.csv`;
    const filePath = path.join(folderPath, file);
    fs.writeFileSync(filePath, response.data);
    console.log(`File downloaded successfully: ${filePath}`);
    updateDownloadedFilesList(folderPath, file, date);
  } catch (error) {
    console.error(`Error downloading file from ${url}: ${error}`);
  }
};

const updateDownloadedFilesList = (
  folderPath: string,
  fileName: string,
  date: string
): void => {
  const jsonFilePath = `${folderPath}/downloadedFiles.json`;
  let downloadedFiles: DownloadedFile[] = [];

  if (fs.existsSync(jsonFilePath)) {
    const jsonFileContent = fs.readFileSync(jsonFilePath, "utf-8");
    downloadedFiles = JSON.parse(jsonFileContent);
  }

  const newEntry: DownloadedFile = {
    fileName,
    date,
  };

  // Check if the file entry already exists
  const existingEntryIndex = downloadedFiles.findIndex(
    (entry) => entry.fileName === fileName
  );
  if (existingEntryIndex !== -1) {
    // Update the date if the file is already present
    downloadedFiles[existingEntryIndex].date = date;
  } else {
    // Add a new entry if the file is not present
    downloadedFiles.push(newEntry);
  }

  // Save the updated list to the JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(downloadedFiles, null, 2));
  console.log(`Updated downloaded files list: ${jsonFilePath}`);
};

const getCurrentDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = today.getFullYear();

  return `${dd}${mm}${yyyy}`;
};

// // Example usage:
// const url = 'https://example.com/data.csv';
// const folderPath = '/path/to/download/folder';
// const userDate = '01/01/2023'; // You can replace this with user input
// downloadCsvFile(url, folderPath, userDate);

export default downloadCsvFile;
