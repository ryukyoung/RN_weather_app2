import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const getWeatherInfo = async (latitude: number, longitude: number) => {
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=metric&lang=kr&exclude=alerts&appid=${apiKey}`
    );
    const data = await response.json();
    //console.log(data);

    return data;
  } catch (error) {
    console.error("날씨 정보 API 호출 실패: " + error);
    return null;
  }
};

const convertDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  // 한국 시간대로 포맷팅
  const formattedDate = date.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formattedDate;
};

const formatMonthDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  // 한국 시간대로 포맷팅
  const formattedDate = date.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = formattedDate.split(". ");
  console.log(parts);

  const monthsDate: { [key: string]: string } = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  const monthKey = parts[1];
  const monthName = monthsDate[monthKey];
  const day = parts[2];

  return `${day} ${monthName}`;
};

const RenderWeeklyItem = ({ item }: { item: any }) => {
  console.log(item.temp);
  return (
    <View style={styles.footerItem}>
      <Text style={styles.footerItemText}>{item.temp.day.toFixed(0)}°</Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        }}
        style={styles.weatherIcon2}
      />
      <Text style={styles.weeklyRegDate}>{formatMonthDate(item.dt)}</Text>
    </View>
  );
};

const getGoogleMapGeocode = async (latitude: number, longitude: number) => {
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("구글 맵 API 호출 실패: " + error);
    return null;
  }
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Index() {
  const [ok, setOk] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [city, setCity] = useState<string | null>("");
  const [DailyWeatherData, setDailyWeatherData] = useState<Array<any>>([]);

  const locationData = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
      setErrorMsg("위치에 대한 권한 부여가 거부되었습니다.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    // console.log(latitude, longitude);

    const address = await getGoogleMapGeocode(latitude, longitude);
    //console.log(address);
    // console.log(address.results[4].formatted_address);

    const cityAddress = address.results[4].formatted_address;
    const citySplit = cityAddress.split(" ");
    // console.log(citySplit);

    const city = `${citySplit[1]} ${citySplit[2]}`;
    setCity(city);

    const weatherData = await getWeatherInfo(latitude, longitude);

    setDailyWeatherData(weatherData.daily);
    return;
  };

  useEffect(() => {
    locationData();
  }, []);

  return (
    <>
      <View style={styles.dailyContainer}>
        <StatusBar backgroundColor="skyblue" barStyle="dark-content" />
        <View style={[styles.container]}>
          <View style={styles.cityWrap}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            contentContainerStyle={styles.mainContentView}
          >
            {DailyWeatherData.map((item, index) => (
              <View style={styles.mainWrap} key={index}>
                <View style={styles.header}>
                  <Text style={styles.regDate}>{convertDate(item.dt)}</Text>

                  <View style={styles.weatherWrap}>
                    <Text style={styles.weather}>{item.weather[0].main}</Text>
                    <Image
                      source={{
                        uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                      }}
                      style={styles.weatherIcon}
                    />
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.tempWrap}>
                    <Text style={styles.temp}>{item.temp.day.toFixed(0)}</Text>
                    <Text style={styles.tempUnit}> ° </Text>
                  </View>
                  <View style={styles.summaryWrap}>
                    <Text style={styles.dailySummaryTitle}>Daily Summary</Text>
                    <Text style={styles.summaryText}>{item.summary}</Text>
                  </View>
                  <View style={styles.subInfoWrap}>
                    <View style={styles.subInfoInner}>
                      <View style={styles.subInfoItem}>
                        <Feather name="wind" size={24} color="white" />
                        <Text style={styles.subInfoDes}>
                          {item.wind_speed.toFixed(1)}km/h
                        </Text>
                        <Text style={styles.subInfoWeather}>wind</Text>
                      </View>
                      <View style={styles.subInfoItem}>
                        <Feather name="droplet" size={24} color="white" />
                        <Text style={styles.subInfoDes}>{item.humidity}%</Text>
                        <Text style={styles.subInfoWeather}>humidity</Text>
                      </View>
                      <View style={styles.subInfoItem}>
                        <Feather name="eye" size={24} color="white" />
                        <Text style={styles.subInfoDes}>{item.pop}%</Text>
                        <Text style={styles.subInfoWeather}>pop</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      <View style={styles.weeklyContainer}>
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerTitle}> Weekly forecast </Text>
          </View>
          <View style={styles.footerContent}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={DailyWeatherData}
              keyExtractor={(item) => item.dt.toString()}
              renderItem={({ item }) => <RenderWeeklyItem item={item} />}
              contentContainerStyle={{
                columnGap: 12, // 아이템 간 간격
                alignItems: "center",
              }}
              snapToInterval={70 + 12} // 각 항목의 너비(70) + columnGap(10)
              snapToAlignment={"start"} // 각 항목의 시작 부분에 스냅되도록 설정
              decelerationRate={"fast"}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dailyContainer: {
    flex: 0.73,
    backgroundColor: "skyblue",
  },
  weeklyContainer: {
    flex: 0.27,
    backgroundColor: "skyblue",
  },
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  mainContentView: {},
  mainWrap: {
    backgroundColor: "skyblue",
    width: SCREEN_WIDTH,
    position: "relative",
  },
  cityWrap: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "bold",
  },
  header: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  regDate: {
    fontSize: 15,
    fontWeight: "bold",
    color: "skyblue",
    borderColor: "black",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    paddingTop: 5,
    paddingBottom: 5,
    top: 12,
  },
  weather: {
    fontSize: 23,
    fontWeight: "bold",
  },
  weatherWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 120,
    top: 34,
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginLeft: -5,
  },
  body: {
    flex: 1.9,
  },
  tempWrap: {
    flex: 0.37,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  temp: {
    fontSize: 150,
    fontWeight: "bold",
    position: "absolute",
    top: -15,
    left: 75,
  },
  tempUnit: {
    fontSize: 130,
    position: "absolute",
    top: -25,
    right: 25,
  },
  summaryWrap: {
    flex: 0.21,
    paddingTop: 25,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20,
  },
  dailySummaryTitle: {
    fontSize: 17,
    marginTop: 15,
    fontWeight: "bold",
  },
  summaryText: {
    fontSize: 14.5,
    marginTop: 5,
  },
  subInfoWrap: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: -10,
  },
  subInfoInner: {
    backgroundColor: "black",
    borderRadius: 15,
    width: 320,
    height: 120,
    flexDirection: "row",
  },
  subInfoItem: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subInfoDes: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 3,
    color: "white",
  },
  subInfoWeather: {
    fontSize: 13,
    color: "white",
    paddingTop: 0,
  },
  footer: {
    flex: 0.9,
  },
  footerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    paddingTop: 5,
    paddingLeft: 30,
    paddingRight: 30,
  },
  footerContent: {
    flex: 1,
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    marginTop: -20,
    paddingRight: 35,
    paddingLeft: 35,
  },
  footerItem: {
    borderRadius: 10,
    width: 70,
    height: 100,
    borderWidth: 3,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  footerItemText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  weatherIcon2: {
    width: 50,
    height: 50,
  },
  weeklyRegDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
});
