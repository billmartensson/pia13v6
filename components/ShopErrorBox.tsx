import { Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";

type shoperrorProps = {
    message: String;
    button1click: () => void;
    button1text: String;
    button2click?: () => void;
    button2text?: String;
}

const ShopErrorBox = ({ message, button1click, button1text, button2click, button2text }: shoperrorProps) => {

    return (

        <View style={styles.errorBackground}>

            <Pressable style={styles.errorColorBack} onPress={button1click}>
                <View ></View>
            </Pressable>

            <View style={styles.errorBox}>
                <Text>{message}</Text>

                <TouchableHighlight onPress={button1click}>
                    <Text style={{ width: 100, height: 60, backgroundColor: "cyan" }}>{button1text}</Text>
                </TouchableHighlight>

                {button2text != undefined &&
                    <TouchableHighlight onPress={button2click}>
                        <Text style={{ width: 100, height: 60, backgroundColor: "cyan" }}>{button2text}</Text>
                    </TouchableHighlight>
                }

            </View>
        </View>

    );
}

export default ShopErrorBox;



const styles = StyleSheet.create({
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