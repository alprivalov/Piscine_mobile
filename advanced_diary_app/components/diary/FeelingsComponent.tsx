import {View, StyleSheet, Text, FlatList} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useDiary} from "@/contexts/DiaryContext";
import {emojisWithIcons} from "@/types/Emotes";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function FeelingsComponent(){
    const numberEntries = 10;
    const { diary } = useDiary();

    const getReactionAsPercent = (feeling: string) =>{
        if(diary.filter(diary => diary.feeling == feeling).length <= 0){
            return 0;
        }
        return (( (diary.filter(diary => diary.feeling == feeling).length)/diary.length)  * 100).toFixed(1);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Your feel for your {numberEntries} entries</Text>
                <FlatList
                    data={emojisWithIcons}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.items}
                    renderItem={(items) => {
                        return(
                            <View style={styles.item}>
                                <MaterialCommunityIcons name={items.item.icon} style={styles.itemIcon} size={24}/>
                                <Text style={styles.itemText}>{getReactionAsPercent(items.item.icon)}%</Text>
                            </View>
                        );
                    }}
                >
                </FlatList>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    content:{
        justifyContent: "center",
    },
    title: {
        alignSelf: "center",
        marginBottom:10,
        fontSize: 25,
        fontWeight: "bold",
    },
    items:{
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    item:{
        flexDirection: "row",
        padding:3,
    },
    itemIcon:{
        paddingRight:30,
        color : Colors.primary,
    },
    itemText:{
        fontSize: 18,
    },
})