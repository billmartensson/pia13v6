import { Image, StyleSheet, Platform, View, Text, SafeAreaView, TextInput, Button, FlatList } from 'react-native';

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
  

  const [shopdata, setShopdata] = useState<Shopitem[]>([]); 


  const [shoptext, setShoptext] = useState("");
  const [addtext, setAddtext] = useState("");
  const [addamount, setAddamount] = useState("");
  


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
    addShop.id = addtext;
    addShop.title = addtext;
    addShop.amount = addamountNumber;

    const newshop = [...shopdata, addShop];
    const newshopjson = JSON.stringify(newshop);

    await AsyncStorage.setItem("shoplist", newshopjson);

    setShopdata(newshop);

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
      setShopdata(loadedshopjson);
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

        <FlatList
          data={shopdata}
          renderItem={({item}) => <Text>{ item.title } { item.amount }</Text>}
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
