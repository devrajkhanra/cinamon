// osEnvironment.ts

import os from "os";

// Define an enum for supported operating systems
export enum OperatingSystem {
  Windows = "win32",
  MacOS = "darwin",
  Linux = "linux",
}

// Define an interface for the environment module
export interface Environment {
  detectUserEnvironment: () => [OperatingSystem, string] | null;
}

// Implement the environment module
const environment: Environment = {
  detectUserEnvironment: () => {
    const operatingSystem: string = process.platform;

    if (
      Object.values(OperatingSystem).includes(
        operatingSystem as OperatingSystem
      )
    ) {
      const homeDirectory: string = os.homedir();
      return [operatingSystem as OperatingSystem, homeDirectory];
    } else {
      console.error("Unsupported operating system");
      return null;
    }
  },
};

export default environment;
