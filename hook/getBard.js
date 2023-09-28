import { useState, useEffect } from "react";
import axios from "axios";

const BARD_API_URL = `http://localhost:3002/api/getBard?summary=`;
export const getBard = (articleSummary) => {
  const [bardSummary, setBardSummary] = useState("");
  const [isBardLoading, setIsBardLoading] = useState(false);
  const [bardError, setBardError] = useState(null);

  const summary = encodeURIComponent(articleSummary?.toString());

  const fetchData = async () => {
    setIsBardLoading(true);

    const apiURL = BARD_API_URL + summary;

    try {
      const response = await axios.get(apiURL);
      setBardSummary(response.data);

      setIsBardLoading(false);
    } catch (error) {
      setBardError(error);
      console.log(error);
    } finally {
      setIsBardLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bardRefetch = () => {
    setIsBardLoading(true);
    fetchData();
  };

  return { bardSummary, isBardLoading, bardError, bardRefetch };
};
