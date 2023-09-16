import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";

import styles from "./recentarticles.style";
import { COLORS } from "../../../constants";
import RecentArticleCard from "../../common/cards/nearby/RecentArticleCard.jsx";
import { getRecent } from "../../../hook/useFetch.js";

const Nearbyjobs = () => {
  const { data, isLoading, error, refetch } = getRecent();

  const refresh = () => {
    refetch();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Articles</Text>
        <TouchableOpacity onPress={() => refresh()}>
          <Text style={styles.headerBtn}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong!</Text>
        ) : (
          data.map((article) => (
            <RecentArticleCard
              article={article}
              key={`recent-${article?.title}`}
              handleNavigate={() => Linking.openURL(article.link)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default Nearbyjobs;
