import { View, Text } from "react-native";

import styles from "./summary.style";

const Summary = ({ info, usedBard }) => {
  const summary = usedBard ? "Summary, ⚙️ With Bard:" : "Summary: ";
  return (
    <View style={styles.container}>
      <Text style={styles.headText}>{summary}</Text>

      <View style={styles.contentBox}>
        <Text style={styles.contextText}>{info}</Text>
      </View>
    </View>
  );
};

export default Summary;
