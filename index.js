// write a nodejs program that read a json file and print it on the console

const fs = require("fs");
const fetchEmbedding = require("./fetchEmbedding.js");

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

    fs.writeFile(
      "output.json",
      JSON.stringify(
        {
          input,
          matches,
        },
        null,
        4
      ),
      (err) => {
        if (err) throw err;
      }
    );
    console.log("------------------------------------");

    recursiveAsyncReadLine(services); //Calling this function again to ask new question
  });
}

fs.readFile("serviceRequests.json", "utf8", async (err, data) => {
  if (err) throw err;

  const services = JSON.parse(data);

  recursiveAsyncReadLine(services);
  //   fs.readFile("testInput.json", "utf8", async (err, testInput) => {
  //     testInput = JSON.parse(testInput);
  //     console.log(testInput);
  //     const testEmbedding = testInput.data[0].embedding;
  //     console.log("Start compare...");

  //     const matches = services.map((s) => ({
  //       ...s.typeCode,
  //       similarity: cosineSimilarity(
  //         testEmbedding,
  //         s.embedding.data[0].embedding
  //       ),
  //     }));

  //     matches.sort((a, b) => b.similarity - a.similarity);
  //     fs.writeFile("output.json", JSON.stringify(matches, null, 4), (err) => {
  //       if (err) throw err;
  //     });
  //     console.log("finished");
  //   });
});

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, index) => sum + a * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
