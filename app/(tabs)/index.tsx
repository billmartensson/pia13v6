import { Image, StyleSheet, Platform, View, Text, SafeAreaView, TextInput, Button, FlatList, Pressable, TouchableHighlight } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Shoprow from '@/components/ShopRow';
import { Shopitem } from '@/models/Shopitem';

export default function HomeScreen() {


  const [allShopdata, setAllShopdata] = useState<Shopitem[]>([]);
  const [shopdata, setShopdata] = useState<Shopitem[]>([]);


  const [shoptext, setShoptext] = useState("");

  const [addtext, setAddtext] = useState("");
  const [addamount, setAddamount] = useState("");

  const [listtype, setListtype] = useState("ALL");

  const [errormessage, setErrormessage] = useState("");

  useEffect(() => {
    loadShopping();
  }, []);

  useEffect(() => {
    console.log("NU ÄNDRADE VI FILTER");
    showList();
  }, [listtype, allShopdata]);

  async function deleteall() {
    await AsyncStorage.removeItem("shoplist");
    setAllShopdata([]);
  }

  async function saveShopping() {
    setShoptext(addtext);

    const addamountNumber = parseInt(addamount);

    setErrormessage("");
    if (addtext == "") {
      setErrormessage("Skriv något");
      return;
    }
    if (isNaN(addamountNumber)) {
      setErrormessage("Skriv siffra");
      return;
    }

    const now = Date.now();

    const addShop = new Shopitem();
    addShop.id = now.toString();
    addShop.title = addtext;
    addShop.amount = addamountNumber;

    const newshop = [...allShopdata, addShop];
    const newshopjson = JSON.stringify(newshop);

    await AsyncStorage.setItem("shoplist", newshopjson);

    setAllShopdata(newshop);

    await AsyncStorage.setItem("mytext", addtext);
  }

  async function loadShopping() {
    const loadedtext = await AsyncStorage.getItem("mytext");

    if (loadedtext != null) {
      setShoptext(loadedtext);
    }

    const loadedshop = await AsyncStorage.getItem("shoplist");

    if (loadedshop != null) {
      const loadedshopjson = JSON.parse(loadedshop);
      setAllShopdata(loadedshopjson);
      setShopdata(loadedshopjson);
    }

  }

  async function switchBought(shopid: string) {

    // hitta shopid i totala listan
    const shopindex = allShopdata.findIndex((item) => item.id == shopid);
    const clickedShop = allShopdata[shopindex];

    console.log(clickedShop);

    // Ändra bought
    clickedShop.havebought = !clickedShop.havebought;

    // Spara listan
    const newshop = [...allShopdata];
    newshop[shopindex] = clickedShop;
    setAllShopdata(newshop);

    showList();

    const newshopjson = JSON.stringify(newshop);
    await AsyncStorage.setItem("shoplist", newshopjson);

  }

  async function showAll() {
    setListtype("ALL");
  }

  async function showBought() {
    setListtype("BOUGHT");
  }

  function showNotBought() {
    setListtype("NOTBOUGHT");
  }

  function showList() {
    console.log("NU FILTER " + listtype);
    if (listtype == "ALL") {
      console.log(allShopdata);
      setShopdata(allShopdata);
    }
    if (listtype == "BOUGHT") {
      const filtershop = allShopdata.filter((item) => item.havebought == true);
      console.log(filtershop);
      setShopdata(filtershop);
    }
    if (listtype == "NOTBOUGHT") {
      const filtershop = allShopdata.filter((item) => item.havebought == false);
      console.log(filtershop);
      setShopdata(filtershop);
    }

  }

  return (
    <SafeAreaView>
      <View style={{ marginTop: 70 }}>

        {errormessage != "" &&
          <Text>{errormessage}</Text>
        }

        <View style={{ flexDirection: "row", width: Platform.isPad ? "50%" : "100%" }}>
          <View style={{ flex: 1 }}>
            <TextInput style={styles.shopTextinput} placeholder='Namn' onChangeText={setAddtext} value={addtext} />
            <TextInput style={styles.shopTextinput} placeholder='Antal' onChangeText={setAddamount} value={addamount} />
          </View>
          <Button title='Add' onPress={saveShopping} />
        </View>

        <Text>{Platform.OS}</Text>

        {Platform.OS == "ios" &&
          <Text>DETTA ÄR EN IPHONE!!</Text>
        }
        {Platform.isPad &&
          <Text>DETTA ÄR EN IPAD!!</Text>
        }

        <View style={{ flexDirection: "row" }}>

          <TouchableHighlight style={listtype == "ALL" ? styles.shopFilterTabActive : styles.shopFilterTab} onPress={showAll}>
            <View>
              <Text>Alla</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={listtype == "BOUGHT" ? styles.shopFilterTabActive : styles.shopFilterTab} onPress={showBought}>
            <View>
              <Text>Köpt</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style={listtype == "NOTBOUGHT" ? styles.shopFilterTabActive : styles.shopFilterTab} onPress={showNotBought}>
            <View>
              <Text>Ej köpt</Text>
            </View>
          </TouchableHighlight>

        </View>

        <FlatList
          style={{}}
          data={shopdata}
          renderItem={({ item, index }) =>
            <Pressable onPress={() => { switchBought(item.id) }}>
              <Shoprow rowitem={item} />
            </Pressable>
          }
        />

        <Button title='Delete all' onPress={deleteall} />

        {errormessage != "" &&
          <View style={ styles.errorBackground }>
            
            <Pressable style={ styles.errorColorBack } onPress={() => { setErrormessage("") }}>
              <View ></View>
            </Pressable>

            <View style={styles.errorBox}>
              <Text>{errormessage}</Text>

              <TouchableHighlight onPress={() => { setErrormessage(""); }}>
                <Text>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        }

      </View>
    </SafeAreaView>
  );
}

/*

          <Button title={ listtype == "ALL" ? '*Alla*' : 'Alla'} onPress={ showAll } />
          <Button title={ listtype == "BOUGHT" ? '*Köpt*' : 'Köpt'} onPress={ showBought } />
          <Button title={ listtype == "NOTBOUGHT" ? '*Ej köpt*' : 'Ej köpt'} onPress={ showNotBought } />

*/

const styles = StyleSheet.create({
  shopTextinput: {
    backgroundColor: "lightgrey",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    padding: 4
  },
  shopFilterTab: {
    backgroundColor: "red",
    height: 50,
    flex: 1
  },
  shopFilterTabActive: {
    backgroundColor: "green",
    height: 50,
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  errorBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    
  },
  errorColorBack: {
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.5,
    width: "100%",
    height: "100%",
  },
  errorBox: {
    width: 200,
    height: 200,
    backgroundColor: "red",
    opacity: 1,
  }
});
