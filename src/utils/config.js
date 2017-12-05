/* @flow */
import fs from "fs";
import path from "path";
import { AikError } from "./error";
import { isFile } from "./is-file";
import resolveToCwd from "./resolve-to-cwd";
import { configParsingError } from "./messages";

export function findUpwards({ configName, dir }: { configName: string, dir: string }) {
  while (dir !== path.dirname(dir)) {
    const configPath = path.join(dir, configName);
    if (isFile(configPath)) {
      return configPath;
    }
    dir = path.dirname(dir);
  }
}

export function loadConfig({
  configName,
  filename
}: {
  configName: string,
  filename: string
}): { config?: any, path?: string } {
  const configPath = findUpwards({ configName, dir: resolveToCwd(path.dirname(filename)) });
  if (!configPath) return {};
  try {
    return { config: JSON.parse(fs.readFileSync(configPath, "utf-8")) || {}, path: configPath };
  } catch (error) {
    throw new AikError(
      `Unable to parse "${configName}"`,
      configParsingError({
        configName,
        configPath,
        error
      })
    );
  }
}
