import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseYAML = (): any => {
  const filePath = path.join(process.cwd(), "src/data", "gameData.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return yaml.load(fileContents);
};
