import {
    View, Text, Modal, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput,
    TouchableWithoutFeedback
} from "react-native";
import {useState} from "react";
import {useDiary} from "@/contexts/DiaryContext";
import SelectDropdown from 'react-native-select-dropdown'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import {emojisWithIcons} from "@/types/Emotes";



interface Props {
    visible: boolean;
    onClose : () => void;
}

export function CreateDiaryModal({visible, onClose}: Props ) {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [feeling, setFeeling] = useState<string>("emoticon-happy-outline");

    const { createDiary } = useDiary();

    const handleSubmit = () => {

        if (!title || !content) return ;

        createDiary({
            title,
            feeling,
            content
        })
        setTitle('')
        setContent('')
        setFeeling('emoticon-happy-outline');
        onClose();
    }

    return (
        <Modal
        visible={visible}
        transparent={true}
        onRequestClose={onClose}
    >
                <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>


                <View style={styles.content}>
                    <Text style={styles.title}>New entry</Text>
                    <TextInput
                        placeholder="title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.titleInput}
                    />
                    <SelectDropdown
                        data={emojisWithIcons}
                        defaultValue={emojisWithIcons.find((e) => e.icon === feeling)}
                        onSelect={(selectedItem, index) => setFeeling(selectedItem.icon)}
                        renderButton={(selectedItem, isOpened) => {
                            return(
                                <View style={styles.dropdownButtonStyle}>
                                    <MaterialCommunityIcons
                                        size={28}
                                        name={selectedItem ? selectedItem.icon : feeling}
                                        style={styles.dropdownButtonIconStyle}
                                    />
                                    <MaterialCommunityIcons
                                        size={28}
                                        name={isOpened ? "chevron-up" : "chevron-down"}
                                    />
                                </View>
                            )
                        }}
                        renderItem={ (item, index, isSelected) => {
                            return (
                                    <View style={{...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: Colors.background })}}>
                                    <MaterialCommunityIcons size={28} name={item.icon} style={styles.dropdownItemIconStyle}/>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                        {item.title}
                                    </Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />


                    <TextInput
                        placeholder="Text"
                        multiline={true}
                        value={content}
                        onChangeText={setContent}
                        style={styles.textInput}
                    />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitButtonText}>Add</Text>
                    </TouchableOpacity>

                </View>
            </View>
    </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content:{
        width: '85%',
        padding:30,
        borderRadius:24,
        zIndex: 1,
        backgroundColor: "white",
    },
    title :{
        fontSize:24,
        fontWeight: "bold",
        marginBottom:10,
    },
    titleInput: {
        marginBottom:20,
        borderWidth: 1,
        borderRadius:12,
        paddingLeft:10,
        backgroundColor: Colors.background,
        borderColor: Colors.secondary,
    },
    textInput: {
        height:120,
        borderWidth: 1,
        paddingLeft:10,
        borderRadius:12,
        fontSize:16,
        backgroundColor: Colors.background,
        borderColor: Colors.secondary,
        marginBottom:20,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius:13,
        alignItems:"center",
    },
    submitButtonText:{
        fontSize:16,
        fontWeight: "bold",
        color: Colors.white,
    },
    dropdownButtonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 12,
        marginBottom:20,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: Colors.primary,
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
        color: Colors.primary,
    },
    dropdownMenuStyle: {
        backgroundColor: Colors.background,
        borderRadius: 8,
    },
    dropdownItemStyle: {
        padding:10,
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: Colors.text,
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
        color: Colors.primary,
    },
})
