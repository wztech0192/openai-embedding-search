// write a nodejs program that read a json file and print it on the console

const fetchEmbedding = require("./fetchEmbedding.js");
const services = require("./serviceRequests.json");

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

    const result = await fetchEmbedding(input.toLowerCase());
    const resultPayload = await result.json();
    const testEmbedding = resultPayload.data[0].embedding;

    const matches = services
      .map((s) => ({
        ...s.typeCode,
        similarity: cosineSimilarity(testEmbedding, s.embedding),
      }))
      .filter((m) => m.similarity > 0.5);

    matches.sort((a, b) => b.similarity - a.similarity);

    console.log("Top 10:", matches.slice(0, 10));

    console.log("------------------------------------");

    recursiveAsyncReadLine(services); //Calling this function again to ask new question
  });
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, index) => sum + a * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
