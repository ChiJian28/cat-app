import { MdOutlineCancel } from "react-icons/md";
import { IoMdPhotos } from "react-icons/io";
import { useCreatePostStore } from "../store";
import { useState } from "react";
import { auth, db, storage } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSnackbar } from "notistack";

const CreatePost = () => {
  const { setIsCreate: setIsCreate } = useCreatePostStore();
  const [text, setText] = useState<string>('');
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const filesFolderRef = ref(storage, `UserMessagePhoto/${fileUpload?.name}`);
  const userPostCollectionRef = collection(db, 'posts');
  const { enqueueSnackbar } = useSnackbar();

  const formatTime = (date: Date): string => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const day = date.getDate();
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  
    return `${day} ${month} ${time}`;
  };

  const createPost = async () => {
    setIsCreate(false);
    try {
      await uploadFile();
      const userPostPhotoUrl = await getPhotoUrlFromStorage();
      await addDoc(userPostCollectionRef, {
        uname: auth.currentUser?.displayName,
        content: text,
        authorID: auth.currentUser?.uid,
        createdAt: formatTime(new Date()),
        uPhotoUrl: auth.currentUser?.photoURL,
        uPostPhotoUrl: userPostPhotoUrl || null,
        likesCount: 0,
        likes: {},
        comments: [],
        collectedCount: 0,
        collected: {},
      })
      enqueueSnackbar('Post successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('An error occured, please try again', { variant: 'error' });
      console.error(error);
    }
  };

  const getPhotoUrlFromStorage = async () => {
    if (!fileUpload) {
      return;
    }
    const url = await getDownloadURL(filesFolderRef);
    console.log('Get photo URL successfully');
    return url;
  };


  const uploadFile = async () => {
    if (!fileUpload) {
      return;
    }
    try {
      await uploadBytes(filesFolderRef, fileUpload);      // (whr, what)
      console.log("Photo uploaded successfully");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <section className="w-[90%] md:w-[50%] xl:w-[40%] 2xl:w-[30%] bg-white p-2 md:left-[350px] left-5 lg:left-[550px] xl:left-[780px] 2xl:left-[1300px] absolute top-8">
      <div className="">
        <div className="flex w-[65%] justify-between ml-[35%] md:w-[55%] md:ml-[45%] items-center">
          <h1 className="font-bold text-xl">Create Post</h1>
          <MdOutlineCancel
            onClick={() => setIsCreate(false)}
            className='w-[30px] h-[30px] cursor-pointer hover:text-red-500'
          />
        </div>
        <hr className="my-3" />
        <div>
          <div className="flex" >
            <div className="w-[40px] h-[40px] overflow-hidden rounded-full border-2 mr-4">
              <img
                className="object-cover w-full h-full"
                src={auth.currentUser?.photoURL!}
                alt="profile photo"
              />
            </div>
            <div>
              <p>{auth.currentUser?.displayName}</p>
            </div>
          </div>
          <div className="mt-[10px]">
            <textarea
              value={text}
              className="w-full h-[150px]"
              placeholder="Type here..."
              onChange={(e) => setText(e.target.value)}
            >
            </textarea>
          </div>
        </div>
        <div className="flex flex-col justify-between mt-4 h-[90px]">
          <div className="bg-green-500 hover:bg-green-600 border-2 justify-end flex border-black p-2">
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={(e) => {
                const files = e.target.files;
                if (files !== null) {
                  setFileUpload(files[0]);
                }
              }}
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <IoMdPhotos size={24} />
            </label>
          </div>
          <button
            onClick={() => createPost()}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded text-white w-full">Post</button>
        </div>
      </div>
    </section>
  )
}

export default CreatePost