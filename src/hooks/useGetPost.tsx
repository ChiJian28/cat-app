import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";


function useGetPost() {
    const userPostCollectionRef = collection(db, 'posts');
    const [userPost, setUserPost] = useState<any[]>([]);

    useEffect(() => {
        const queryMessages = query(userPostCollectionRef, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {            // onSnapshot listen to the collection changes, then callback function will be called every time there is a change in the data
            let data: any[] = [];
            snapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setUserPost(data);
        })
        return () => unsubscribe();     //To stop listening to the collection changes, call the unsubscribe function.
    }, []);


    return { userPost }
}

export default useGetPost