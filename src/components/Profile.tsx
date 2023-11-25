import { IoMdHeart } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import useGetUserInfoHome from "../hooks/useGetUserInfoHome";
import { useState, useEffect } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const Profile = () => {
    const [likes, setLikes] = useState<number>(0);
    const [collects, setCollects] = useState<number>(0);
    const { userInfo } = useGetUserInfoHome();

    useEffect(() => {
        updateUserData();
    }, [userInfo]);
    
    const updateUserData = async () => {
        const userId = auth.currentUser?.uid;
        try {
            for (const e of userInfo) {
                const trueCount = Object.values(e.likes).filter((value) => value === true).length;
                const trueCollect = Object.values(e.collected).filter((value) => value === true).length;

                setLikes(trueCount);
                setCollects(trueCollect);
                // Update user data in Firestore
                if (userId) {
                    await updateDoc(doc(db, 'users', userId), {
                        total_likes: trueCount,
                        total_collected: trueCollect,
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="border rounded-2xl bg-[#ECECEC] p-2 w-[95%] mx-auto h-[200px] mb-[80px] md:h-[300px]">
            {userInfo.map((user) => (
                <div key={user.id} className="h-full flex">
                    <div className="w-1/3 items-center flex justify-center">
                        <div className="w-[80px] h-[80px] md:w-[100%] xl:w-[60%] md:h-[100%] overflow-hidden md:rounded-none rounded-full border-2">
                            <img
                                className="object-cover w-full h-full"
                                src={user.profilePicture}
                                alt="profile photo"
                            />
                        </div>
                    </div>
                    <div className="w-2/3 flex items-center">
                        <div className="p-4 rounded">
                            <h1 className="text-xl xl:text-3xl text-indigo-800 font-bold">{user.username}</h1>
                            <div className="flex xl:mt-[30px] items-center flex-col justify-between">
                                <p className="flex items-center text-red-500">
                                    <IoMdHeart className="mr-2 xl:w-[50px] xl:h-[30px]" />
                                    {likes}
                                </p>
                                <p className="flex items-center text-yellow-400">
                                    <FaStar className="mr-2 xl:w-[50px] xl:h-[30px]" />
                                    {collects}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default Profile