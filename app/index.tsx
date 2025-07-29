import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Dimensions,
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
              <View style={styles.footer}></View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "skyblue",
  },
  mainContentView: {},
  mainWrap: {
    backgroundColor: "skyblue",
    borderWidth: 3,
    borderColor: "red",
    width: SCREEN_WIDTH,
    position: "relative",
  },
  cityWrap: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
  },
  header: {
    flex: 0.6,
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
    right: 100,
    top: 34,
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginLeft: -5,
  },
  body: {
    flex: 2.3,
    borderColor: "green",
    borderWidth: 3,
  },
  tempWrap: {
    flex: 0.4,
    borderWidth: 3,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  temp: {
    fontSize: 150,
    fontWeight: "bold",
    position: "absolute",
    top: -20,
    left: 68,
  },
  tempUnit: {
    fontSize: 130,
    position: "absolute",
    top: -23,
    right: 10,
  },
  summaryWrap: {
    flex: 0.27,
    backgroundColor: "skyblue",
    borderWidth: 3,
    borderColor: "red",
  },
  dailySummaryTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 8,
    marginLeft: 13,
  },
  summaryText: {
    fontSize: 14.5,
    marginTop: 5,
    marginLeft: 13,
    paddingRight: 15,
  },
  subInfoWrap: {
    flex: 0.33,
    backgroundColor: "skyblue",
    alignItems: "center",
    justifyContent: "center",
  },
  subInfoInner: {
    backgroundColor: "black",
    borderRadius: 17,
    width: 320,
    height: 110,
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
    flex: 0.8,
  },
});
