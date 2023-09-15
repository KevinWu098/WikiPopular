import { useState, useEffect } from "react";
import axios from "axios";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const day = String(date.getDate() - 1).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

const findImage = async (articleTitle) => {
  const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&formatversion=2&prop=pageimages%7Cpageterms&titles=${encodeURIComponent(
    articleTitle
  )}&format=json`;

  const imageResponse = await axios.get(imageUrl);
  const page = imageResponse.data.query.pages[0];

  if (page.thumbnail && page.thumbnail.source) {
    return page.thumbnail.source;
  } else {
    return null;
  }
};

const date = new Date();
const formattedDate = formatDate(date);
const apiURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${formattedDate}`;

const useFetch = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(apiURL);
      setData(
        response.data.items[0].articles
          .slice(2, 22)
          .filter(
            (article) =>
              !article.article.startsWith("Special:") &&
              !article.article.startsWith("Wikipedia:")
          )
        // .map(async (article) => {
        //   const image = await findImage(article.article);

        //   return {
        //     ...article,
        //     image,
        //   };
        // })
      );

      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { data, isLoading, error, refetch };
};

export default useFetch;
