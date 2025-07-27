import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

export default function Index() {
  const [ok, setOk ] = useState<boolean>(false);
  const[errorMsg, setErrorMsg] = useState<string>("");
    
  const locationData = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();

    if(!granted) {
      setOk(false);
      setErrorMsg("위치에 대한 권한 부여가 거부되었습니다.");
    }

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
        <Text style={styles.cityName}>Seoul</Text>
      </View>
      <ScrollView horizontal pagingEnabled contentContainerStyle={styles.mainContentView}>
        <View style={styles.mainWrap}>
        <View style={styles.header}> 
            <Text style={styles.regDate}>Fri, 2025-07-25</Text>
            <Text style={styles.weather}>맑음</Text>
        </View>
        <View style={styles.body}> 
          <Text style={styles.temp}>
            35
          </Text>
          <Text style={styles.tempUnit}>
            °
          </Text>
        </View>
        <View style={styles.footer}> </View>
      </View>
      <View style={styles.mainWrap}>
        <View style={styles.header}> 
            <Text style={styles.regDate}>Sat, 2025-07-26</Text>
            <Text style={styles.weather}>맑음</Text>
        </View>
        <View style={styles.body}> 
          <Text style={styles.temp}>
            35
          </Text>
          <Text style={styles.tempUnit}>
            °
          </Text>
        </View>
        <View style={styles.footer}> </View>
      </View>
      <View style={styles.mainWrap}>
        <View style={styles.header}> 
            <Text style={styles.regDate}>Sun, 2025-07-27</Text>
            <Text style={styles.weather}>맑음</Text>
        </View>
        <View style={styles.body}> 
          <Text style={styles.temp}>
            35
          </Text>
          <Text style={styles.tempUnit}>
            °
          </Text>
        </View>
        <View style={styles.footer}> </View>
      </View>
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
  cityWrap: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
    cityName: {
      fontSize: 30,
      fontWeight: "bold",
  },
  header: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  regDate: {
    fontSize: 15,
    fontWeight: "bold",
    color: "skyblue",
    borderColor: "black",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 50,
    paddingTop: 5,
    paddingBottom: 5,
  },
  weather: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 10,
  },
  body: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
  },
  mainContentView: {

  },
  mainWrap: {
    backgroundColor: "skyblue",
    borderWidth: 3,
    borderColor: "red",
    width: SCREEN_WIDTH,
    position: "relative"
  },
  temp: {
    fontSize: 150,
    fontWeight: "bold",
    right: 20,
    top: -50,
  },
  tempUnit: {
    fontSize: 130,
    position: "absolute",
    top: 95,
    right: 45,
  },
  footer: {
    flex: 1,
    backgroundColor: "skyblue",
    borderWidth: 3,
    borderColor: "red",
  }
})
