import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./nearbyjobcard.style";

const NearbyJobCard = ({ article, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={{
            uri: article.image
              ? article.image
              : "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1200px-Wikipedia-logo-v2.svg.png",
          }}
          resizeMode="cover"
          style={styles.logoImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {article.title}
        </Text>
        <Text style={styles.jobType} numberOfLines={1}>
          {`${article.published}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NearbyJobCard;
