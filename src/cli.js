// write a nodejs program that read a json file and print it on the console

const services = require("./serviceRequests.json");
const { getTopNMatchesAsync } = require("./shared");

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

recursiveAsyncReadLine(services);

function recursiveAsyncReadLine(services) {
  rl.question("Input: ", async (input) => {
    if (input == "exit")
      //we need some base case, for recursion
      return rl.close(); //closing RL and returning from function.

    const matches = await getTopNMatchesAsync(input, services);

    console.log("Top 5:", matches);

    console.log("------------------------------------");

    recursiveAsyncReadLine(services); //Calling this function again to ask new question
  });
}
