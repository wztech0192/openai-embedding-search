const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

if (!OPEN_AI_API_KEY) throw new Error("OPEN_AI_API_KEY is not set");

/**
 *
 * @param {string | string[]} input
 * @returns
 */
const fetchEmbeddingAsync = (input) =>
  fetch(
    "https://inst-azure-openai-01.openai.azure.com/openai/deployments/buffalo-311/embeddings?api-version=2023-05-15",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": OPEN_AI_API_KEY,
      },
      body: JSON.stringify({
        input: input,
      }),
    }
  );

/**
 *
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns
 */
const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, index) => sum + a * vecB[index], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 *
 * @param {string} input
 * @param {object} services
 * @param {number} similarity
 * @param {number} topN
 * @returns
 */
const getTopNMatchesAsync = async (
  input,
  services,
  similarity = 0.5,
  topN = 5
) => {
  const result = await fetchEmbeddingAsync(input.toLowerCase());
  const resultPayload = await result.json();

  const inputEmbedding = resultPayload.data[0].embedding;

  const matches = services
    .map((s) => ({
      ...s.typeCode,
      similarity: cosineSimilarity(inputEmbedding, s.embedding),
    }))
    .filter((m) => m.similarity >= similarity);

  matches.sort((a, b) => b.similarity - a.similarity);

  return matches.slice(0, topN);
};

module.exports = {
  cosineSimilarity,
  fetchEmbeddingAsync,
  getTopNMatchesAsync,
};
