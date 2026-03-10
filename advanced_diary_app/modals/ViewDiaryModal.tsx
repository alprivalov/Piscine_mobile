import {Modal, StyleSheet, TextInput, Text, TouchableWithoutFeedback, View, TouchableOpacity} from "react-native";
import {DiaryInterface} from "@/types/DiaryInterface";
import {SafeAreaView} from "react-native-safe-area-context";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useDiary} from "@/contexts/DiaryContext";
import Colors from "@/constants/Colors";

type Props = {
    visible: boolean,
    onClose: () => void,
    selectedDiary: DiaryInterface
}

export function ViewDiaryModal({visible, onClose, selectedDiary}: Props) {
    const { deleteDiary } = useDiary();


    const date = new Date(selectedDiary.date);
    const day = date.toLocaleString('fr-Fr',{
        weekday:'long',
    });
    const dayNumber = date.getDay()
    const month = date.toLocaleString('fr-Fr',{
        month:'long',
    })
    const year = date.getFullYear();

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>

                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <View style={styles.content}>
                    <Text style={styles.date}>{day}, {dayNumber} {month}, {year}</Text>
                    <View style={styles.separator}></View>
                    <View style={styles.feeling}>
                        <Text style={styles.feelingText}>My Feeling :</Text>
                        <MaterialCommunityIcons name={selectedDiary.feeling} size={28} style={{color:Colors.primary}}/>
                    </View>
                    <View style={styles.separator}></View>
                    <Text style={styles.contentText}>{selectedDiary.content}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (selectedDiary.id) {
                                deleteDiary(selectedDiary.id);
                                onClose();
                            }
                        }}
                        style={styles.deleteButton}
                    >
                        <Text style={styles.deleteButtonText}>Delete this entry</Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </Modal>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    content:{
        padding:30,
        borderRadius:10,
        zIndex: 1,
        backgroundColor: "white",
    },
    date:{
        fontSize:24,
        fontWeight:'bold',
        marginBottom:20,
    },
    dateDay:{},
    dateMonth:{},
    dateYear:{},
    feeling:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        width:'70%',
        backgroundColor: Colors.white,
        borderRadius : 16
    },
    feelingText:{
        marginRight: 4,
        fontSize:16,
        fontWeight:'500',
        color: Colors.primary,
    },
    contentText: {
        paddingVertical:16,
        fontSize:16,
        backgroundColor: Colors.background,
        color: Colors.text,
        borderRadius: 16,
        paddingLeft:10,
        marginBottom:20,
    },
    deleteButton:{
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius:10,
        width:'70%',
    },
    deleteButtonText:{
        fontSize:16,
        fontWeight:'bold',
        color:Colors.white
    },
    separator:{
        height:1,
        backgroundColor:'grey',
        marginVertical:10,
    },

});