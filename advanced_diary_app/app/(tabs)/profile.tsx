
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import { Text, View } from '@/components/Themed';
import {useDiary} from "@/contexts/DiaryContext";
import {useState} from "react";
import {CreateDiaryModal} from "@/modals/CreateDiaryModal";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {DiaryInterface} from "@/types/DiaryInterface";
import {ViewDiaryModal} from "@/modals/ViewDiaryModal";
import Colors from "@/constants/Colors";
import FeelingsComponent from "@/components/diary/FeelingsComponent";
import DiaryList from "@/components/diary/DiaryList";

export default function Profile() {
    const { diary } = useDiary();
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <DiaryList diaryList={diary}/>
                <CreateDiaryModal
                    visible={createModalVisible}
                    onClose={()=>setCreateModalVisible(false)}
                />
                <View style={{ marginTop: 'auto'}}>
                    <View style={styles.feeling}></View>
                    <FeelingsComponent/>
                    <TouchableOpacity
                        onPress={() => setCreateModalVisible(true)}
                        style={styles.createButton}
                    >
                        <Text style={styles.createButtonText}>Create Diary</Text>
                    </TouchableOpacity>
                </View>
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
    feeling: {
        marginTop: 10,
    },
    createButton: {
        alignSelf: 'center',
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 9,
        marginVertical:30,
        width: 200,
    },
    createButtonText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    }
});