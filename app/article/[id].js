import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Article,
  ArticleSummary,
  ArticleFooter,
  ArticleTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/getData";
import { getBard } from "../../hook/getBard";

const tabs = ["Summary", "See Also"];

const ArticleDetails = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { data, isLoading, error, refetch } = useFetch(params.id);
  const { bardSummary, isBardLoading, bardError, bardRefetch } = getBard(
    params.id
  );

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
    bardRefetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return <ArticleSummary info={bardSummary ?? "No description"} />;
      case "See Also":
        return (
          <Specifics title="See Also" points={data[0].related ?? ["N/A"]} />
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.push("/")}
            />
          ),
          // headerRight: () => (
          //   <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          // ),
          headerTitle: "",
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isLoading || isBardLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error || bardError ? (
            <Text>Something went wrong!</Text>
          ) : bardSummary.length === 0 ? (
            <Text> No Data </Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Article
                articleImage={data[0]?.image}
                articleTitle={data[0]?.article}
                views={data[0]?.views}
              />
              <ArticleTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        <ArticleFooter
          url={`https://en.wikipedia.org/wiki/${encodeURIComponent(
            data[0]?.article
          )}`}
        />
      </>
    </SafeAreaView>
  );
};

export default ArticleDetails;
