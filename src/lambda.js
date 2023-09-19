const services = require("./serviceRequests.json");
const { getTopNMatchesAsync } = require("./shared");

export const handler = async (event) => {
  let input = event?.queryStringParameters?.search?.trim().toLowerCase();

  if (!input || typeof input !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify("Search input is required"),
    };
  }

  if (input.length > 200) {
    return {
      statusCode: 400,
      body: JSON.stringify("Search input must be less than 200 characters"),
    };
  }

  let matches = [];
  // perform keyword match when only provide single word
  if (!input.includes(" ")) {
    matches = services
      .filter(
        (c) =>
          c?.typeCode?.code?.toLowerCase().includes(input) ||
          c?.typeCode?.name?.toLowerCase().includes(input) ||
          c.name.toLowerCase().includes(input)
      )
      .slice(0, 40)
      .map((s) => ({
        ...s.typeCode,
        similarity: 100,
      }));
  } else {
    matches = await getTopNMatchesAsync(
      input,
      services,
      event?.queryStringParameters?.similarity,
      event?.queryStringParameters?.top
    );
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(matches),
  };

  return response;
};
