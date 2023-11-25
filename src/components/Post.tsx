import { IoMdHeart } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { BiSolidComment } from "react-icons/bi";

interface Comment {
    sender: string;
    comment: string;
    senderPhotoUrl: string;
}

interface PostProps {
    post: {
        id: string;
        uname: string | null;
        content: string;
        authorID: string | null;
        createdAt: string;
        uPhotoUrl: string;
        uPostPhotoUrl: string;
        likesCount: number;
        likes: Record<string, boolean>;
        comments: Comment[];
        collectedCount: number;
        collected: Record<string, boolean>;
    };
}



const Post: React.FC<PostProps> = ({ post }) => {
    const [isWantDlt, setIsWantDlt] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isCollected, setIsCollected] = useState<boolean>(false);
    const [isComment, setIsComment] = useState<boolean>(false);

    useEffect(() => {
        const getLikesAndCollectedStatus = async () => {
            const postRef = doc(db, 'posts', post.id);
            const postSnapshot = await getDoc(postRef);
            const postData = postSnapshot.data();

            if (postData) {
                setIsLiked(post.likes[auth.currentUser?.uid!] || false);
                setIsCollected(post.collected[auth.currentUser?.uid!] || false);
            }
        };

        getLikesAndCollectedStatus();
    }, [post.id]);


    const handleLikeClick = async () => {
        try {
            // 更新本地状态
            setIsLiked(!isLiked);

            // 更新 Firestore 数据
            const postRef = doc(db, 'posts', post.id);

            // 获取现有的 likes 字段
            const postSnapshot = await getDoc(postRef);
            const existingLikes = postSnapshot.data()?.likes || {};

            // 更新 likes 字段
            await updateDoc(postRef, {
                likes: {
                    ...existingLikes,
                    [auth.currentUser?.uid as string]: !isLiked,
                },
            });
            // 更新 likesCount 字段
            const updatedLikesCount = !isLiked ? post.likesCount + 1 : post.likesCount - 1;

            await updateDoc(postRef, {
                likesCount: updatedLikesCount,
            });

            // update users collection
            const usersRef = doc(db, 'users', auth.currentUser?.uid!);
            const usersSnapshot = await getDoc(usersRef);
            const existingUsersLikes = usersSnapshot.data()?.likes || {};
            await updateDoc(usersRef, {
                likes: {
                    ...existingUsersLikes,
                    [post.id]: !isLiked,
                }
            });
        } catch (error) {
            console.error(error);
        }
    };


    const handleCollectClick = async () => {
        try {
            // 更新本地状态
            setIsCollected(!isCollected);

            // 更新 Firestore 数据
            const postRef = doc(db, 'posts', post.id);

            // 获取现有的 collected 字段
            const postSnapshot = await getDoc(postRef);
            const existingCollect = postSnapshot.data()?.collected || {};

            // 更新 collected 字段
            await updateDoc(postRef, {
                collected: {
                    ...existingCollect,
                    [auth.currentUser?.uid as string]: !isCollected,
                },
            });

            // 更新 collectCount 字段
            const updatedCollectsCount = !isCollected ? post.collectedCount + 1 : post.collectedCount - 1;

            await updateDoc(postRef, {
                collectedCount: updatedCollectsCount,
            });


            // update users collection
            const usersRef = doc(db, 'users', auth.currentUser?.uid!);
            const usersSnapshot = await getDoc(usersRef);
            const existingUsersLikes = usersSnapshot.data()?.collected || {};
            await updateDoc(usersRef, {
                collected: {
                    ...existingUsersLikes,
                    [post.id]: !isCollected,
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCommentClick = async (comments: any) => {
        try {
            const postRef = doc(db, 'posts', post.id);
            const newComment: Comment = {
                sender: auth.currentUser?.displayName as string,
                comment: comment,
                senderPhotoUrl: auth.currentUser?.photoURL as string,
            };
            setComment('');
            comments.push(newComment);
            await updateDoc(postRef, {
                comments: comments,
            });
        } catch (error) {
            console.error(error);
        }
    }

    const deletePost = async () => {
        const postRef = doc(db, 'posts', post.id);
        try {
            await deleteDoc(postRef);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div key={post.id} className="md:w-[35%]">
            <div className="w-fit mx-auto mt-5 md:my-[50px]">
                <div className="flex items-start">
                    <div className="w-[40px] mr-3 h-[40px] rounded overflow-hidden">
                        <img
                            className="w-full h-full"
                            src={post.uPhotoUrl}
                            alt="profile photo"
                        />
                    </div>
                    <div>
                        <h1 className="text-[#1369AC] font-bold">
                            {post.uname}
                        </h1>
                        <div className="w-[240px]">
                            {post.content}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between relative">
                    {auth.currentUser?.displayName === post.uname &&
                        <div className="w-full flex justify-end mb-1">
                            <FaTrashAlt
                                className={`${isWantDlt ? 'text-red-500' : 'text-black'} cursor-pointer`}
                                onClick={() => {
                                    setIsWantDlt(!isWantDlt)
                                }}
                            />
                        </div>
                    }
                    {isWantDlt && (
                        <div className="bg-slate-400 top-5 right-0 py-6 text-center rounded borded absolute">
                            <h1 className="text-red-800 text-xl font-bold">Confirm Delete Message</h1>
                            <p className="text-red-800">Are you sure you want to delete this message?</p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => {
                                        setIsWantDlt(false)
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold mr-5 py-2 px-4 rounded mt-2">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deletePost();
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="h-[300px] w-[300px] lg:h-[400px] lg:w-[400px] xl:h-[500px] xl:w-[500px] 2xl:w-[700px] 2xl:h-[700px]">
                    <img className="h-full w-full" src={post.uPostPhotoUrl} alt="cat" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="w-1/3">
                        <small className="text-slate-500">{post.createdAt}</small>
                    </div>
                    <div className="w-2/3 flex justify-end space-x-2">
                        <button onClick={() => setIsComment(!isComment)}>{isComment ? <BiSolidComment className='text-green-500 w-[20px] h-[20px] cursor-pointer' /> : <BiSolidComment className='w-[20px] h-[20px] cursor-pointer' />}</button>
                        <button onClick={() => handleLikeClick()}>{isLiked ? <IoMdHeart className='text-red-500 w-[20px] h-[20px] cursor-pointer' /> : <IoMdHeart className='text-black w-[20px] h-[20px] cursor-pointer' />}</button>
                        <button onClick={() => handleCollectClick()}>{isCollected ? <FaStar className='text-yellow-500 w-[20px] h-[20px] cursor-pointer' /> : <FaStar className='text-black w-[20px] h-[20px] cursor-pointer' />}</button>
                    </div>
                </div>
                {isComment && (
                    <div className="bg-gray-300">
                        {Object.keys(post.comments).length === 0 ? (
                            <p>Be the first to comment!</p>
                        ) : (
                            <div className="bg-gray-300 flex flex-col space-y-2 h-[150px] overflow-y-scroll">
                                {post.comments.map((comment: any, index: any) => (
                                    <div key={index} className="mr-3 flex items-center">
                                        <div className="rounded-full overflow-hidden h-[20px] w-[20px] mr-1">
                                            <img className="h-full w-full mr-2" src={comment.senderPhotoUrl} alt="Sender Photo" />
                                        </div>
                                        <h1 className="mr-1 text-[#1369AC] font-bold">{comment.sender}:</h1>
                                        <div className="bg-red-300 w-[220px] flex flex-wrap h-fit">
                                            <p style={{ overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto', margin: '0' }}>
                                                {comment.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="bg-slate-300 h-[40px] justify-between flex relative">
                            <input
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full"
                                value={comment}
                            >
                            </input>
                            <button
                                onClick={() => handleCommentClick(post.comments)}
                                className="bg-blue-500 text-white p-2 absolute bottom-0 right-0 rounded">
                                Send
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <hr className="md:hidden mt-5" />
        </div>
    )
}

export default Post