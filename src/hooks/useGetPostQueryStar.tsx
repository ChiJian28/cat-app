import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../config/firebase";


const useGetPostQueryStar = () => {
    const [userCollectedPosts, setUserCollectedPosts] = useState<any[]>([]);

    useEffect(() => {
        const userCollectedPostsRef = collection(db, 'posts');
        const queryPost = query(userCollectedPostsRef, where(`collected.${auth.currentUser?.uid}`, '==', true));

        const unsubscribe = onSnapshot(queryPost, (snapshot) => {
            const collectedPosts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserCollectedPosts(collectedPosts);
        }, (error) => {
            console.error('Error fetching user collected posts:', error);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);
    return { userCollectedPosts };
}

export default useGetPostQueryStar