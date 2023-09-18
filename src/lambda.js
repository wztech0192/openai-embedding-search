import services from "./serviceRequests.json";

export const handler = async (event) => {
  let input = event?.queryStringParameters?.search;
  const similarity = event?.queryStringParameters?.similarity ?? 0.5;
  const topN = event?.queryStringParameters?.top ?? 5;

  if (!input || typeof input !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify("Search input is required"),
    };
  }

  if (input.length > 200) {
    input = input.substring(0, 200);
  }

  const result = await fetchEmbedding(input.toLowerCase());

  const resultPayload = await result.json();

  const testEmbedding = resultPayload.data[0].embedding;

  const matches = services
    .map((s) => ({
      ...s.typeCode,
      similarity: cosineSimilarity(testEmbedding, s.embedding),
    }))
    .filter((m) => m.similarity >= similarity);

  matches.sort((a, b) => b.similarity - a.similarity);

  const response = {
    statusCode: 200,
    body: JSON.stringify(matches.slice(0, topN)),
  };

  return response;
};

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, index) => sum + a * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const fetchEmbedding = (input) =>
  fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer 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",
    },
    body: JSON.stringify({
      input: input,
      model: "text-embedding-ada-002",
    }),
  });
