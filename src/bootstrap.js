import * as fs from "fs";
import * as util from "util";
import * as path from "path";

import inquirer from "inquirer";

const sourceDirectory = path.resolve(".", "src");
const readDirectory = util.promisify(fs.readdir);

async function getFiles(directory) {
  const entries = await readDirectory(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.name !== "bootstrap.js")
      .map((entry) => {
        const resolvedPath = path.resolve(directory, entry.name);
        return entry.isDirectory()
          ? getFiles(resolvedPath)
          : path.relative(sourceDirectory, resolvedPath);
      })
  );
  return files.flat();
}

async function bootstrap() {
  const possibleChoices = (await getFiles(path.resolve(".", "src"))).map(
    (option) => {
      const [year, day] = option.split("/");
      return {
        year: year,
        day: day.replace(".js", ""),
      };
    }
  );

  const output = possibleChoices.reduce((object, current) => {
    const occurs = object.reduce((n, item, i) => {
      return item.year === current.year ? i : n;
    }, -1);
    if (occurs >= 0) {
      object[occurs].day = object[occurs].day.concat(current.day);
    } else {
      const obj = {
        year: current.year,
        day: [current.day],
      };
      object = object.concat([obj]);
    }

    return object;
  }, []);

  try {
    const { year } = await inquirer.prompt({
      type: "list",
      name: "year",
      message: "Choose year",
      choices: possibleChoices.map((choice) => choice.year),
    });

    const { day } = await inquirer.prompt({
      type: "list",
      name: "day",
      message: "Choose a day",
      choices: possibleChoices.map((choice) => choice.day),
    });

    const file = await import(path.resolve(sourceDirectory, year, `${day}.js`));
    const { partOne, partTwo } = await file.default();

    console.log(`Part one: ${partOne}`);
    console.log(`Part two: ${partTwo}`);
  } catch (error) {
    if (error.isTtyError) {
      console.error("Interactive terminal interface could not be rendered.");
    } else {
      console.error("Something went wrong.");
      console.error(error);
    }
  }
}

bootstrap();
