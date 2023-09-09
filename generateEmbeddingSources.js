// write a nodejs program that read a json file and print it on the console

const fs = require("fs");

fs.readFile("serviceRequests.json", "utf8", async (err, data) => {
  if (err) throw err;

  const services = JSON.parse(data);

  const embeddingServices = [];

  for (const service of services) {
    if (!service.embedding) {
      try {
        console.log("Process embedding for service: " + service.typeCode.code);
        const payloads = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            input: service.typeCode.name,
            model: "text-embedding-ada-002",
          }),
        });
        service.embedding = await payloads.json();
      } catch (ex) {
        console.error(ex);
      }
    }
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
