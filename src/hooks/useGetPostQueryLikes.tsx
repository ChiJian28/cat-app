import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";


const useGetPostQueryLikes = () => {
    const [userLikesPosts, setUserLikesPosts] = useState<any[]>([]);

    useEffect(() => {
        const userLikesMap = new Map(); // Map to store user's highest liked post

        const userLikesPostsRef = collection(db, 'posts');
        const rankedPostsQuery = query(userLikesPostsRef, orderBy('likesCount', 'desc'));

        const unsubscribe = onSnapshot(rankedPostsQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const postData = change.doc.data();
                const userId = postData.authorID;

                // If user's post is not in the map or has more likes, update the map
                if (!userLikesMap.has(userId) || postData.likesCount > userLikesMap.get(userId).likesCount) {
                    userLikesMap.set(userId, { id: change.doc.id, ...postData });
                }

                // Convert the map values to an array and set the state
                const likesPosts = Array.from(userLikesMap.values());
                setUserLikesPosts(likesPosts);
            });
        }, (error) => {
            console.error('Error fetching user likes posts:', error);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return { userLikesPosts };
};

export default useGetPostQueryLikes;
