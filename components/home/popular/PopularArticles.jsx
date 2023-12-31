import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./populararticles.style";
import { COLORS, SIZES } from "../../../constants";
import PopularArticleCard from "../../common/cards/popular/PopularArticleCard.jsx";
import useFetch from "../../../hook/getData.js";

const PopularArticles = () => {
  const router = useRouter();

  const { data, isLoading, error } = useFetch();

  const [selectedJob, setSelectedJob] = useState();

  const handleCardPress = (item) => {
    router.push(`/article/${item.article}`);
    setSelectedJob(item.article);
  };

  const date = new Date();
  const formattedDate = `${date.getMonth() + 1}/${date.getDate() - 1}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Popular Articles from {formattedDate}
        </Text>
        <TouchableOpacity disabled={true}>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong!</Text>
        ) : (
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <PopularArticleCard
                item={item}
                selectedJob={selectedJob}
                handleCardPress={handleCardPress}
              />
            )}
            keyExtractor={(item) => item.article}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
          />
        )}
      </View>
    </View>
  );
};

export default PopularArticles;
