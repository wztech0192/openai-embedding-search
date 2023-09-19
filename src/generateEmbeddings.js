// write a nodejs program that read a json file and print it on the console

const fs = require("fs");
const { fetchEmbeddingAsync } = require("./shared.js");

fs.readFile("serviceRequests.json", "utf8", async (err, data) => {
  if (err) throw err;

  const services = JSON.parse(data);

  const embeddingServices = [];
  const input = services.map((s) =>
    (s.typeCode.phase || s.typeCode.name).toLowerCase()
  );
  const payloads = await fetchEmbeddingAsync(input);
  const result = await payloads.json();

  for (let i = 0; i < result.data.length; i++) {
    const service = services[i];
    service.embedding = result.data[i].embedding;
    service.embeddingModel = result.model;
    embeddingServices.push(service);
  }
  // for (const service of services) {
  //   //if (!service.embedding) {
  //   try {
  //     const input = service.typeCode.name.toLowerCase();

  //     console.log("Process embedding for service: " + input);
  //     const payloads = await fetchEmbedding(input);
  //     const result = await payloads.json();
  //     service.embedding = result.data[0].embedding;
  //     service.embeddingModel = result.model;
  //   } catch (ex) {
  //     console.error(ex);
  //   }
  //   //}
  //   embeddingServices.push(service);
  // }

  fs.writeFile(
    "serviceRequests.json",
    JSON.stringify(embeddingServices, null, 4),
    (err) => {
      if (err) throw err;
    }
  );
});
