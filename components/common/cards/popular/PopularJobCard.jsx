import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./popularjobcard.style";

const PopularArticleCard = ({ item, selectedArticle, handleCardPress }) => {
  return (
    <TouchableOpacity
      style={styles.container(selectedArticle, item)}
      onPress={() => handleCardPress(item)}
    >
      <TouchableOpacity style={styles.logoContainer(selectedArticle, item)}>
        <Image
          source={{
            uri: item.image
              ? item.image
              : "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
          }}
          resizeMode="contain"
          style={styles.logoImage}
        />
      </TouchableOpacity>
      <Text style={styles.companyName} numberOfLines={1}>
        {item.article}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.jobName(selectedArticle, item)} numberOfLines={1}>
          {`${item.views.toLocaleString()} Views`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PopularArticleCard;
