import Sidebar from "../components/Sidebar";
import Rank from "../components/Rank";
import { useSnackbar } from "notistack";
import Cookies from "universal-cookie";
import { auth, db } from "../config/firebase";
import Profile from "../components/Profile";
import { signOut } from "firebase/auth";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { collection, query, getDocs, where, setDoc, doc } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    checkIfUserExists();
  }, [auth.currentUser?.uid]);

  
  const checkIfUserExists = async () => {
    const userId = auth.currentUser?.uid;

    try {
      if (userId) {
        const queryUser = query(collection(db, 'users'), where('uid', '==', userId));
        const snapshot = await getDocs(queryUser);

        if (snapshot.empty) {
          console.log('User does not exist in Firestore, so I will initialize the user');
          createUser();
        } else {
          console.log('User exists in Firestore, not going to initialize');
        }
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
    }
  };

  const createUser = async () => {
    try {
      const newUser = {
        username: auth.currentUser?.displayName,
        uid: auth.currentUser?.uid,
        profilePicture: auth.currentUser?.photoURL,
        likes: {},
        collected: {},
        total_likes: 0,
        total_collected: 0,
      };

      const customUserId = auth.currentUser?.uid!;
      const newUserRef = doc(db, 'users', customUserId);
      await setDoc(newUserRef, newUser);
      console.log('New user created with ID: ', newUserRef.id);
    } catch (error) {
      console.error(error);
    }
  };


  const logOut = async () => {
    try {
      await signOut(auth);
      cookies.remove("auth-token");
      enqueueSnackbar("Log Out successfully", { variant: 'success' });
      navigate('/')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="bg-slate-800 h-screen overflow-y-scroll">
      <IoIosLogOut
        onClick={() => logOut()}
        className='absolute top-0 right-0 text-white w-[30px] h-[30px] 2xl:w-[40px] 2xl:h-[40px] cursor-pointer'
      />
      <Profile />
      <Sidebar />
      <Rank />
    </section>
  )
}

export default Home