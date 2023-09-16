import { useState, useEffect } from "react";
import axios from "axios";
import { parse } from "react-native-rss-parser";

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

  // const formattedSummary = await aiFormattedSummary(summary);
  // return formattedSummary;
};

// Too inconsistent ** and slow **
// const aiFormattedSummary = async (summary) => {
//   const PALM_API_KEY = "AIzaSyCm4XJ52YJr3b0YSYAPAcMHLTbfyiWFP2Q";
//   const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage`;

//   const requestData = {
//     prompt: {
//       context: "Correct the formatting of this Wikipedia lead section: ",
//       examples: [],
//       messages: [{ content: summary }],
//     },
//     temperature: 0.65,
//     top_k: 40,
//     top_p: 0.95,
//     candidate_count: 1,
//   };

//   const headers = {
//     "Content-Type": "application/json",
//   };

//   try {
//     const response = await axios.post(
//       `${apiUrl}?key=${PALM_API_KEY}`,
//       requestData,
//       {
//         headers,
//       }
//     );

//     if (response.status === 200) {
//       if (
//         response.data &&
//         response.data.candidates &&
//         response.data.candidates.length > 0
//       ) {
//         const botResponse = response.data.candidates[0].content;

//         return botResponse;
//       } else {
//         console.error("Response structure is not as expected.");
//       }
//     } else {
//       console.error(
//         "Google Cloud API request failed with status:",
//         response.status
//       );
//     }
//   } catch (error) {
//     console.error(
//       "An error occurred while making the Google Cloud API request:",
//       error
//     );
//   }
// };

const findRelated = async (articleTitle) => {
  const relatedURL = `https://en.wikipedia.org/w/api.php?action=parse&prop=sections&page=${encodeURIComponent(
    articleTitle
  )}&format=json&origin=*`;

  const relatedURLResponse = await axios.get(relatedURL);
  const sections = relatedURLResponse.data.parse.sections;
  let seeAlsoIndex = -1;

  for (let i = 0; i < sections.length; i++) {
    if (sections[i].line.toLowerCase() === "see also") {
      seeAlsoIndex = i;
      break;
    }
  }

  if (seeAlsoIndex == -1) return undefined;

  const relatedData = `https://en.wikipedia.org/w/api.php?action=parse&prop=links&page=${encodeURIComponent(
    articleTitle
  )}&section=${seeAlsoIndex}&format=json&origin=*&ns=0
  `;

  const relatedDataResponse = await axios.get(relatedData);

  const relatedTitles = relatedDataResponse.data.parse.links
    .slice(0, 3)
    .map((link) => link["*"])
    .map(
      (title) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`
    );

  return relatedTitles;
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
            !article.article.startsWith("User:") &&
            !article.article.startsWith("Wikipedia:") &&
            !article.article.startsWith("Talk:") &&
            !article.article.startsWith("File:") &&
            !article.article.startsWith("Draft:") &&
            !article.article.startsWith("Category:") &&
            !article.article.startsWith("User talk:")
        )
        .slice(0, 15)
        .map((article) => {
          const formattedTitle = article.article.replace(/_/g, " ");
          return { ...article, article: formattedTitle };
        })
        .filter((article) => {
          if (!title || article.article == title) return true;
        })
        .map(async (article) => {
          const title = article.article;
          const imageUrl = await findImage(title);
          const summary = await findSummary(title);
          const relatedTitles = await findRelated(title);
          return {
            ...article,
            image: imageUrl,
            summary: summary,
            related: relatedTitles,
          };
        });

      setData(await Promise.all(formattedResponse));

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

export const getRecent = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const rssURL =
    "https://en.wikipedia.org/w/api.php?hidebots=1&hidecategorization=1&hideWikibase=1&urlversion=1&days=7&limit=20&action=feedrecentchanges&feedformat=rss&origin=*";

  const fetchRecent = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(rssURL);
      const data = await parse(response.data);

      const articles = data.items
        .map((article) => {
          return {
            title: article.title,
            link: article.links[0].url.split("&diff")[0],
            published: article.published,
          };
        })
        .filter(
          (article) =>
            !article.title.startsWith("Special:") &&
            !article.title.startsWith("User:") &&
            !article.title.startsWith("Wikipedia:") &&
            !article.title.startsWith("Talk:") &&
            !article.title.startsWith("File:") &&
            !article.title.startsWith("Draft:") &&
            !article.title.startsWith("Category:") &&
            !article.title.startsWith("User talk:")
        )
        .slice(0, 8)
        .map(async (article) => {
          const title = article.title;
          const imageUrl = await findImage(title);
          return {
            ...article,
            image: imageUrl,
          };
        });

      setData(await Promise.all(articles));
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchRecent();
  };

  return { data, isLoading, error, refetch };
};
