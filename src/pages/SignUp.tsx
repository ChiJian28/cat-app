import { auth, googleProvider, storage } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import catSignUp from '../assets/catSignUp.mp4';
import GoogleButton from 'react-google-button';
import { useState } from "react";
import Cookies from "universal-cookie";
import { MdRemoveRedEye } from "react-icons/md";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSnackbar } from "notistack";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import defaultPhoto from '../assets/defaultPhoto.png';


const SignUp = () => {
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [confirmPwd, setConfirmPwd] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const filesFolderRef = ref(storage, `Photos/${fileUpload?.name}`);
  const [userName] = email.split('@');
  const cookies = new Cookies();

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      cookies.set('auth-token', result.user.refreshToken);
      enqueueSnackbar('Sign up successfully', { variant: 'success' });
      navigate('/home');
    } catch (error) {
      console.error(error);
    }
  };

  const signUpWithEP = async () => {
    if (email === '' || pwd === '' || confirmPwd === '') {
      enqueueSnackbar('Please fill in all the fields', { variant: 'error' });
      return;
    }
    if (!isValidEmail(email)) {
      enqueueSnackbar('Please enter a valid email', { variant: 'error' });
      return;
    }
    if (pwd.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters long', { variant: 'error' });
      return;
    }
    if (pwd !== confirmPwd) {
      enqueueSnackbar('Password not match', { variant: 'error' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pwd);
      await uploadFile();
      const userPhotoUrl = await getPhotoUrlFromStorage();
      await updateProfile(result.user, {
        displayName: userName,
        photoURL: userPhotoUrl || defaultPhoto
      });
      cookies.set('auth-token', result.user.refreshToken);
      setIsLoading(false);
      enqueueSnackbar('Sign up successfully', { variant: 'success' });
      navigate('/login')
    } catch (error: any) {
      setIsLoading(false);
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        enqueueSnackbar("This email is already in use. Please use a different email.", { variant: 'error' });
      }
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="bg-gradient-to-r from-white p-12 to-gray-500 h-screen flex justify-center">
          <div className="absolute top-0 right-0 cursor-pointer">
            <Link to='/login'>
              <CiLogin className='w-[30px] hover:text-red-400 h-[30px] md:h-[40px] md:w-[40px]' />
            </Link>
          </div>
          <div className="bg-gradient-to-t from-white md:flex to-slate-500 w-[90%]">
            <div className="md:w-[50%] md:h-full h-1/4 p-2 md:p-0">
              <div className="w-[140px] md:w-full md:h-full md:border-0 md:rounded mx-auto h-[140px] border-[3px] border-white shadow-md rounded-full overflow-hidden">
                <video className="w-full h-full object-cover" src={catSignUp} autoPlay muted loop />
              </div>
            </div>
            <div className="h-3/4 p-2 md:w-[50%] md:h-full">
              <div className="h-full">
                <div className="text-center flex flex-col items-center md:justify-around justify-between md:h-[30%] h-[23%]">
                <h1 className="md:text-4xl xl:text-6xl">Cat enthusiasts, unite!</h1>
                  <GoogleButton
                    onClick={() => signUpWithGoogle()}
                    label="Sign up with Google"
                  />
                </div>
                <div className='mt-6 mb-7 md:mt-0 md:mb-0 flex items-center justify-center'>
                  <hr className='w-[55px] md:w-[35%] lg:w-[30%] xl:w-[35%] 2xl:w-[40%]' />
                  <small className='mx-2 text-gray-500'>Or sign up with email</small>
                  <hr className='w-[55px] md:w-[35%] lg:w-[30%] xl:w-[35%] 2xl:w-[40%]' />
                </div>
                <div className="flex relative items-center h-[45%] md:h-[53%] flex-col md:justify-evenly justify-between">
                  <input
                    className="p-1 md:p-4 rounded border w-[90%]"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" />
                  <input
                    className="p-1 md:p-4 rounded border w-[90%]"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <MdRemoveRedEye
                    className={`${showPassword ? 'text-gray-400' : 'text-black'} absolute text-xl cursor-pointer top-[60px] right-6 md:top-[110px] md:right-8 xl:top-[170px] xl:right-14`}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <input
                    className="p-1 md:p-4 rounded border w-[90%]"
                    placeholder="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                  />
                  <MdRemoveRedEye
                    className={`${showConfirmPassword ? 'text-gray-400' : 'text-black'} absolute text-xl cursor-pointer top-[113px] right-6 md:top-[180px] md:right-8 xl:top-[275px] xl:right-14`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                  <input
                    className='p-1 md:p-4 rounded border w-[90%]'
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files !== null) {
                        setFileUpload(files[0]);
                      }
                    }}
                  />
                </div>
                <div className="flex mt-[15px] md:mt-0 xl:mt-[15px]">
                  <button
                    className="w-[90%] md:p-4 mx-auto bg-indigo-500 hover:bg-indigo-600 rounded text-white p-2"
                    onClick={() => signUpWithEP()}
                  >Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default SignUp