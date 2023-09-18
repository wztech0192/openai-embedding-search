module.exports = function fetchEmbedding(input) {
  return fetch("https://api.openai.com/v1/embeddings", {
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
};
