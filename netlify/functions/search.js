exports.handler = async function (event) {
  const searchWord = event.queryStringParameters.query;
  const page = event.queryStringParameters.page || 1;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  const url =
    "https://api.unsplash.com/search/photos" +
    "?query=" + searchWord +
    "&page=" + page +
    "&per_page=12" +
    "&client_id=" + accessKey;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "unsplash request failed" })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "something went wrong on the server" })
    };
  }
};
