import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./welcome.style";
import { icons, SIZES } from "../../../constants";

const topSearches = [
    "Top 100",
    "Sports",
    "Movies",
    "Celebrities",
    "US News",
    "World News",
];

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
    const router = useRouter();

    const [activeJobType, setActiveJobType] = useState("Full-time");

    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.userName}>Hey there!</Text>
                <Text style={styles.welcomeMessage}>
                    See what's on WikiPopular
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <TextInput
                        style={styles.searchInput}
                        value={searchTerm}
                        onChangeText={(text) => setSearchTerm(text)}
                        placeholder="What are you looking for?"
                        disabled={true}
                    />
                </View>
                <TouchableOpacity
                    style={styles.searchBtn}
                    onPress={handleClick}
                    disabled={true}
                >
                    <Image
                        source={icons.search}
                        resizeMode="contain"
                        style={styles.searchBtnImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                <FlatList
                    data={topSearches}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.tab(activeJobType, item)}
                            onPress={() => {
                                setActiveJobType(item);
                                router.push(`/search/${item}`);
                            }}
                            disabled={true}
                        >
                            <Text style={styles.tabText(activeJobType, item)}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ columnGap: SIZES.small }}
                    horizontal
                />
            </View>
        </View>
    );
};

export default Welcome;
