
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '@/components/Themed';
import {useDiary} from "@/contexts/DiaryContext";
import {useState} from "react";
import {CreateDiaryModal} from "@/modals/CreateDiaryModal";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {DiaryInterface} from "@/types/DiaryInterface";
import {ViewDiaryModal} from "@/modals/ViewDiaryModal";
import Colors from "@/constants/Colors";

export default function Profile() {
    const { diary } = useDiary();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
    const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
    const [selectedDiary, setSelectedDiary] = useState<DiaryInterface | null>(null);
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FlatList
                    data={diary}
                    renderItem={({item}) => {
                        const date = new Date(item.date);
                        const day = date.getDay()
                        const month = date.toLocaleString('fr-Fr',{
                            month:'long',
                        })
                        const year = date.getFullYear();
                        return(
                            <TouchableOpacity
                                style={styles.item}
                                onPress={()=> {
                                    setSelectedDiary(item)
                                    setViewModalVisible(true)
                                }
                            }>
                                <View style={styles.itemDate}>
                                    <Text style={styles.dateDay}>{day}</Text>
                                    <Text style={styles.dateMonth}>{month.slice(0,3)}</Text>
                                    <Text style={styles.dateYear}>{year}</Text>
                                </View>
                                <MaterialCommunityIcons name={item.feeling} size={32} style={styles.itemEmoji}/>
                                <View style={styles.separator}></View>
                                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#B2BEC3" />
                            </TouchableOpacity>
                        );
                    }}
                />
                <CreateDiaryModal
                    visible={createModalVisible}
                    onClose={()=>setCreateModalVisible(false)}
                />
                { selectedDiary && (
                    <ViewDiaryModal
                        visible={viewModalVisible}
                        onClose={()=>setViewModalVisible(false)}
                        selectedDiary={selectedDiary}
                    />
                )}
                <TouchableOpacity
                    onPress={() => setCreateModalVisible(true)}
                    style={styles.createButton}
                >
                    <Text style={styles.createButtonText}>Create Diary</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    content: {
        flex:1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    dateText: {
        fontSize: 14,
        textAlign: 'left',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
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
    itemDate: {
        backgroundColor: Colors.white + "40",
        borderRadius: 10,
        padding:10,
        alignItems: 'center',
        minWidth:60,
        marginRight:15,
    },
    dateDay: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dateMonth: {
        fontSize: 12,
        textTransform: 'uppercase',
        color: Colors.secondary,
    },
    dateYear:{
        fontSize: 12,
        textTransform: 'uppercase',
        color: Colors.secondary,
    },
    itemEmoji: {
        color: Colors.primary,
    },
    itemTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    separator:{
        width: 1,
        height: '60%',
        marginHorizontal: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    createButton: {
      alignSelf: 'center',
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 9,
        marginBottom:30,
        width: 200,
    },
    createButtonText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    }
});