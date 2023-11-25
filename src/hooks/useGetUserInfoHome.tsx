import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";

const useGetUserInfoHome = () => {
    const userInfoCollectionRef = collection(db, 'users');
    const [userInfo, setUserInfo] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            // user is sign in
            if (user) {
                const uid = user.uid;
                const queryMsg = query(userInfoCollectionRef, where('uid', '==', uid));
                const unsubscribeFirestore = onSnapshot(queryMsg, (snapshot) => {
                    let data: any = [];
                    snapshot.forEach((doc) => {
                        data.push({ ...doc.data(), id: doc.id });
                    });
                    setUserInfo(data);
                });

                return () => {
                    unsubscribeFirestore();
                };
            // user is sign out
            } else {
                // Handle the case when the user is not authenticated
                setUserInfo([]);
            }
        });

        return () => {
            unsubscribeAuth();
        };
    }, []);

    return { userInfo };
};

export default useGetUserInfoHome;
