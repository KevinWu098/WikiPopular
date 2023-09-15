import { useState, useEffect } from "react";
import axios from "axios";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are 0-indexed
  const day = String(date.getDate() - 1).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

const findImage = async (articleTitle) => {
  const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=info|extracts|pageimages|images&inprop=url&exsentences=1&titles=${encodeURIComponent(
    articleTitle
  )}&format=json&origin=*`;

  const imageResponse = await axios.get(imageUrl);
  const pageId = Object.keys(imageResponse.data.query.pages)[0];

  const imageURL = imageResponse.data.query.pages[pageId].thumbnail?.source;

  return imageURL;
};

const findSummary = async (articleTitle) => {
  const summaryURL = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=${encodeURIComponent(
    articleTitle
  )}&explaintext=1&exsectionformat=plain&format=json&origin=*`;

  const summaryResponse = await axios.get(summaryURL);
  const pageId = Object.keys(summaryResponse.data.query.pages)[0];

  const summary =
    summaryResponse.data.query.pages[pageId]?.extract.split("\n\n\n")[0];

  return summary;
};

const date = new Date();
const formattedDate = formatDate(date);
const apiURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/${formattedDate}`;

const useFetch = (title) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(apiURL);
      const formattedResponse = response.data.items[0].articles
        .slice(2, 50)
        .filter(
          (article) =>
            !article.article.startsWith("Special:") &&
            !article.article.startsWith("Wikipedia:")
        )
        .slice(0, 15)
        .map((article) => {
          const formattedTitle = article.article.replace(/_/g, " ");
          return { ...article, article: formattedTitle };
        })
        .filter((article) => {
          if (!title || article.article == title) return true;
        });

      const articlesWithImages = await Promise.all(
        formattedResponse.map(async (article) => {
          const imageUrl = await findImage(article.article);
          return { ...article, image: imageUrl };
        })
      );

      const articlesWithSummaries = await Promise.all(
        articlesWithImages.map(async (article) => {
          const summary = await findSummary(article.article);
          return { ...article, summary: summary };
        })
      );

      setData(articlesWithSummaries);

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
