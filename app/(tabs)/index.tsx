import { Image, StyleSheet, Platform, View, Text, SafeAreaView, TextInput, Button, FlatList, Pressable } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Shopitem {
  id: string = "";
  title: string = "";
  amount: number = 0;
  havebought: boolean = false;
}




export default function HomeScreen() {
  

  const [allShopdata, setAllShopdata] = useState<Shopitem[]>([]); 
  const [shopdata, setShopdata] = useState<Shopitem[]>([]); 


  const [shoptext, setShoptext] = useState("");
  
  const [addtext, setAddtext] = useState("");
  const [addamount, setAddamount] = useState("");
  
  const [listtype, setListtype] = useState("ALL");


  useEffect(() => {
    loadShopping();
  }, []);

  async function deleteall() {
    await AsyncStorage.removeItem("shoplist");
  }

  async function saveShopping() {
    setShoptext(addtext);

    const addamountNumber = parseInt(addamount);
    if(isNaN(addamountNumber)) {
      return;
    }

    const addShop = new Shopitem();
    addShop.id = "a";
    addShop.title = addtext;
    addShop.amount = addamountNumber;

    const newshop = [...allShopdata, addShop];
    const newshopjson = JSON.stringify(newshop);

    await AsyncStorage.setItem("shoplist", newshopjson);

    setAllShopdata(newshop);

    showList();


    await AsyncStorage.setItem("mytext", addtext);
  }

  async function loadShopping() {
    const loadedtext = await AsyncStorage.getItem("mytext");

    if(loadedtext != null) {
      setShoptext(loadedtext);
    }

    const loadedshop = await AsyncStorage.getItem("shoplist");

    if(loadedshop != null) {
      const loadedshopjson = JSON.parse(loadedshop);
      setAllShopdata(loadedshopjson);
      setShopdata(loadedshopjson);
    }
    
  }

  async function switchBought(rownumber : number){    
    const clickedshop = shopdata[rownumber];

    const newshop = [...shopdata];
    
    /*
    if(clickedshop.havebought == true) {
      clickedshop.havebought = false;
    } else {
      clickedshop.havebought = true;
    }
    */

    clickedshop.havebought = !clickedshop.havebought;

    newshop[rownumber] = clickedshop;
    setShopdata(newshop);

    const newshopjson = JSON.stringify(newshop);

    await AsyncStorage.setItem("shoplist", newshopjson);
  }

  async function showAll() {
    setListtype("ALL");
    showList();
  }

  async function showBought() {
    setListtype("BOUGHT");
    showList();
  }

  function showNotBought() {
    setListtype("NOTBOUGHT");
    showList();
  }

  function showList() {
    if(listtype == "ALL") {
      setShopdata(allShopdata);
    }
    if(listtype == "BOUGHT") {
      const filtershop = allShopdata.filter((item) => item.havebought == true);
      setShopdata(filtershop);
    }
    if(listtype == "NOTBOUGHT") {
      const filtershop = allShopdata.filter((item) => item.havebought == false);
      setShopdata(filtershop);
    }
    
  }

  return (
    <SafeAreaView>
      <View>
        <Text>{ shoptext }</Text>

        <TextInput onChangeText={setAddtext} value={addtext} />
        <TextInput onChangeText={setAddamount} value={addamount} />

        <Button title='Save' onPress={saveShopping} />

        <Button title='Delete all' onPress={deleteall} />

        <View style={{ flexDirection: "row" }}>
          <Button title={ listtype == "ALL" ? '*Alla*' : 'Alla'} onPress={ showAll } />
          <Button title={ listtype == "BOUGHT" ? '*Köpt*' : 'Köpt'} onPress={ showBought } />
          <Button title={ listtype == "NOTBOUGHT" ? '*Ej köpt*' : 'Ej köpt'} onPress={ showNotBought } />
        </View>

        <FlatList
          data={shopdata}
          renderItem={({item, index}) => 
            <Pressable onPress={() => { switchBought(index) }}>
              <Text>{ item.title } { item.amount } { item.havebought ? "KÖPT" : "EJ KÖPT" }</Text>
            </Pressable>
          }
          />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
