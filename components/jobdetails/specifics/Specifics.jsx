import React from "react";
import { View, Text } from "react-native";

import styles from "./specifics.style";
import { Link } from "expo-router";

const Specifics = ({ title, points }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}:</Text>

      <View style={styles.pointsContainer}>
        {points.map((item, index) => (
          <View style={styles.pointWrapper} key={item + index}>
            <Text style={styles.pointDot} />
            <Link
              style={styles.pointText}
              href={item}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item}
            </Link>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Specifics;
