import React from "react";
import { View, Text, Image } from "react-native";

import styles from "./company.style";
import { icons } from "../../../constants";

const Article = ({ articleImage, articleTitle, views }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={{
            uri: articleImage
              ? articleImage
              : "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
          }}
          style={styles.logoImage}
        />
      </View>

      <View style={styles.jobTitleBox}>
        <Text style={styles.jobTitle}>{articleTitle}</Text>
      </View>

      <View style={styles.companyInfoBox}>
        <View style={styles.locationBox}>
          <Image
            source={icons.views}
            resizeMode="contain"
            style={styles.locationImage}
          />
          <Text style={styles.locationName}>{views}</Text>
        </View>
      </View>
    </View>
  );
};

export default Article;
