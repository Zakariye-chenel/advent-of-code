import getInput from "../input.js";

export default async function () {
  const multiply = (array) => array.reduce((a, b) => a * b);

  const input = await getInput("2020", "1");
  const inputNumbers = await Promise.all(input.map((value) => parseInt(value)));

  return {
    partOne: multiply(walkDepth2(inputNumbers)),
    partTwo: multiply(walkDepth3(inputNumbers)),
  };
}

const walkDepth2 = (array) => {
  for (const [a, first] of array.entries()) {
    for (let b = a; b < array.length; b++) {
      const second = array[b];
      if (first + second === 2020) {
        return [first, second];
      }
    }
  }
};

const walkDepth3 = (array) => {
  for (const [a, first] of array.entries()) {
    for (let b = a; b < array.length; b++) {
      const second = array[b];
      for (let c = b; c < array.length; c++) {
        const third = array[c];
        if (first + second + third === 2020) {
          return [first, second, third];
        }
      }
    }
  }
};
