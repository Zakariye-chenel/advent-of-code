import getInput from "../input.js";

export default async function () {
  const input = await getInput("2020", "2");

  const validPasswords = input.filter((element) => {
    const [policyString, password] = element.split(": ");
    const policy = parsePolicy(policyString);

    const matchingChars = password
      .split("")
      .filter((char) => char === policy.character).length;

    return (
      matchingChars >= policy.range.min && matchingChars <= policy.range.max
    );
  });

  const actuallyValidPasswords = input.filter((element) => {
    const [policyString, password] = element.split(": ");
    const truePolicy = parseTruePolicy(policyString);

    const isCharOnPosition = (char, position) =>
      password.charAt(position - 1) === char;

    const first = isCharOnPosition(
      truePolicy.character,
      truePolicy.positions.first
    );
    const second = isCharOnPosition(
      truePolicy.character,
      truePolicy.positions.second
    );

    return (first && !second) || (!first && second);
  });

  return {
    partOne: validPasswords.length,
    partTwo: actuallyValidPasswords.length,
  };
}

const parsePolicy = (string) => {
  const [rangeString, character] = string.split(" ");
  const range = rangeString.split("-").map((element) => parseInt(element));

  return {
    range: {
      min: range[0],
      max: range[1],
    },
    character: character,
  };
};

const parseTruePolicy = (string) => {
  const [positionsString, character] = string.split(" ");

  const positions = positionsString
    .split("-")
    .map((element) => parseInt(element));

  return {
    positions: {
      first: positions[0],
      second: positions[1],
    },
    character: character,
  };
};
