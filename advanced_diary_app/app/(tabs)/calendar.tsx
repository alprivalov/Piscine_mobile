
import { StyleSheet} from 'react-native';
import { View } from '@/components/Themed';
import {useDiary} from "@/contexts/DiaryContext";
import {useMemo, useState} from "react";
import {Calendar} from 'react-native-calendars';
import DiaryList from "@/components/diary/DiaryList";
import {emojisWithIcons} from "@/types/Emotes";


export default function CalendarScreen() {
    const { diary } = useDiary();
    const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split('T')[0]);

    const dayDiary = useMemo(
        () => diary.filter(item => item.date.slice(0, 10) === selectedDay),
        [diary, selectedDay]
    );

    const markedDate = useMemo(()=> {
        const mark: Record<string, any> = {};

        diary.forEach(item => {
            const emote = emojisWithIcons.find(emojis => emojis.icon == item.feeling)
            if(emote){
                mark[item.date.slice(0,10)] = {
                    marked: true,
                    dots: [{ key: item.feeling , color : emote?.color}]
                };
            }
        })

        mark[selectedDay] = {
            ...(mark[selectedDay] ?? {}),
            selected: true,
            disableTouchEvent:true,
            selectedColor: 'orange',
        }

        return mark;
    },[diary, selectedDay]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Calendar
                    initialDate={selectedDay}
                    style={{
                        height: 350,
                    }}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#dd99ee'
                    }}
                    onDayPress={day => {
                        setSelectedDay(day.dateString);
                    }}
                    markedDates={markedDate}
                />
            </View>
            <DiaryList diaryList={dayDiary}></DiaryList>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
});