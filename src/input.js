import * as path from "path";
import * as util from "util";
import * as fs from "fs";

const readFile = util.promisify(fs.readFile);
const dataDirectory = path.resolve("inputs");

export default async function getInput(year, day) {
  const fileContent = await readFile(
    path.join(dataDirectory, year, `${day}.txt`)
  );
  return fileContent.toString().split("\n");
}
