import { Shopitem } from "@/models/Shopitem";
import { Text, View } from "react-native";

type shoprowProps = {
    rowitem : Shopitem;
}

const Shoprow = ({rowitem} : shoprowProps) => { 

    return(
        <View style={{ 
            height: 50, 
            backgroundColor: "lightgrey", 
            marginTop: 2, 
            flexDirection: "row"
        }}>
            <Text style={{ flex: 1 }} >{ rowitem.title }</Text>

            <Text style={{ width: 50 }} >{ rowitem.amount }</Text>

            <Text style={{ marginLeft: 20, marginRight: 20, fontSize: 30, width: 50 }} >{ rowitem.havebought ? "X" : " " }</Text>

        </View>
    );
}

export default Shoprow;