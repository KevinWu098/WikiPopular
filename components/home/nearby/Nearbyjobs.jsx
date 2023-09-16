import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./nearbyjobs.style";
import { COLORS, SIZES } from "../../../constants";
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard.jsx";
import useFetch, { getRecent } from "../../../hook/useFetch.js";

const Nearbyjobs = () => {
  const router = useRouter();

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
            <NearbyJobCard
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
