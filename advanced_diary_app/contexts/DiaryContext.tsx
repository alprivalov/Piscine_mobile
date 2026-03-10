import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext";
import {query, addDoc, collection, where, getDocs, deleteDoc, doc} from "@firebase/firestore";
import {db} from "@/firebase";
import {Alert} from "react-native";
import {DiaryInterface} from "@/types/DiaryInterface";

interface DiaryCreateInterface {
    title: string;
    feeling: string;
    content: string,
}

interface ContextType {
    diary: DiaryInterface[]
    loading : boolean,
    createDiary : (newDiary : DiaryCreateInterface) => void;
    deleteDiary: (id: string) => void;
}

const DiaryContext = createContext<ContextType | null>(null);

export function DiaryProvider({children}: {children: ReactNode}) {
    const [diary, setDiary] = useState<DiaryInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const notesCollection = collection(db,"diary");

    useEffect(() => {
        const q = query(notesCollection,where("email", "==", user.email))

        const fetchDiary = async () => {
            try {
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDiary(data as DiaryInterface[]);
            } catch (err) {
                console.error(err);
            }
        }
        fetchDiary();
    }, [user?.email]);

    const createDiary = async (newDiary : DiaryCreateInterface) => {
        setLoading(true);
        try {

            const diary: DiaryInterface = {
                email: user.email,
                date: new Date().toISOString(),
                title : newDiary.title,
                feeling : newDiary.feeling,
                content : newDiary.content,
            }

            const doc = await addDoc(collection(db,"diary"),diary);

            setDiary(prev => [...prev, { ...diary, id: doc.id }])
            Alert.alert("Success","New Diary has been created!");
        } catch (err){
            Alert.alert("Error","Failed to create Diary");
        } finally {
            setLoading(false);
        }
    }

    const deleteDiary = async (diaryId : string) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db,"diary",diaryId));
            setDiary(prev => prev.filter((item) => item.id !== diaryId ));
            Alert.alert("Success","Diary deleted successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <DiaryContext.Provider
            value={{
                diary,
                loading,
                createDiary,
                deleteDiary,
            }}
        >
            {children}
        </DiaryContext.Provider>
    );

}

export function useDiary() {
    const context = useContext(DiaryContext);
    if(context == null) {
        throw new Error("useDiary must be used within a DiaryProvider");
    }
    return context;
}