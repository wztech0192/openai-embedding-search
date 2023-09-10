// write a nodejs program that read a json file and print it on the console

const fs = require("fs");
const fetchEmbedding = require("./fetchEmbedding.js");

fs.readFile("serviceRequests.json", "utf8", async (err, data) => {
  if (err) throw err;

  const services = JSON.parse(data);

  const embeddingServices = [];

  for (const service of services) {
    //if (!service.embedding) {
    try {
      const input = service.typeCode.name.toLowerCase();

      console.log("Process embedding for service: " + input);
      const payloads = await fetchEmbedding(input);
      const result = await payloads.json();
      service.embedding = result.data[0].embedding;
      service.embeddingModel = result.model;
    } catch (ex) {
      console.error(ex);
    }
    //}
    embeddingServices.push(service);
  }

  fs.writeFile(
    "serviceRequests.json",
    JSON.stringify(embeddingServices, null, 4),
    (err) => {
      if (err) throw err;
    }
  );
});
