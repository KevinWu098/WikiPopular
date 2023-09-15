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
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch, { getSummary } from "../../hook/useFetch";

const tabs = ["Summary", "Related"];

const JobDetails = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { data, isLoading, error, refetech } = useFetch(params.id);

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetech();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Summary":
        return <JobAbout info={data[0].summary ?? "No description"} />;
      case "Related":
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
              handlePress={() => router.back()}
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
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong!</Text>
          ) : data.length === 0 ? (
            <Text> No Data </Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                articleImage={data[0].image}
                articleTitle={data[0].article}
                views={data[0].views}
              />
              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}
            </View>
          )}
        </ScrollView>

        <JobFooter
          url={`https://en.wikipedia.org/wiki/${encodeURIComponent(
            data[0]?.article
          )}`}
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;