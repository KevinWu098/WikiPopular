import { View, Text } from "react-native";

import styles from "./about.style";

const Summary = ({ info }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headText}>Summary:</Text>

      <View style={styles.contentBox}>
        <Text style={styles.contextText}>{info}</Text>
      </View>
    </View>
  );
};

export default Summary;
