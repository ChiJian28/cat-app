import { Link } from "react-router-dom";
import { MdRemoveRedEye } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useSnackbar } from "notistack";
import Loader from "../components/Loader";
import defaultPhoto from '../assets/defaultPhoto.png';

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const photoUrl = auth.currentUser?.photoURL || defaultPhoto;

  const login = async () => {
    if (email === '' || pwd === '') {
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
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pwd);
      setIsLoading(false);
      enqueueSnackbar('Login successfully', { variant: 'success' });
      navigate('/home');
    } catch (error: any) {
      setIsLoading(false);
      console.error(error);
      enqueueSnackbar('Please sign up for an account first', { variant: 'error' });
    }
  };


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  return (
    <>
      {isLoading ? <Loader /> : (
        <section className="bg-gradient-to-r from-white p-12 to-gray-500 h-screen flex justify-center">
          <div className="bg-white md:p-4 rounded-lg shadow-md w-[90%] md:h-fit">
            <div className="md:w-full flex md:flex-col p-2 md:p-0 h-1/3">
              <div className="mr-3 md:mr-0">
                <div className="w-[90px] md:rounded-full lg:w-[150px] lg:h-[150px] xl:w-[200px] xl:h-[200px] mx-auto mt-6 h-[90px] border-[3px] border-white shadow-md rounded-full overflow-hidden">
                  <img className="h-full w-full object-cover" src={photoUrl} alt="profile photo" />    {/* Note the "!" after photoURL, indicating that it won't be null or undefined */}
                </div>
              </div>
              <div className="md:text-center">
                <div className="mt-[30px]">
                  <h1>Welcome Back,</h1>
                  <small className="text-gray-500">Log in to use your account 👋</small>
                </div>
              </div>
            </div>
            <hr className="w-full md:hidden" />
            <div className=" h-3/4 p-2 md:w-full">
              <div className="h-full">
                <div className="h-1/2 md:mt-[50px] flex flex-col justify-evenly">
                  <div className="flex flex-col md:mb-5">
                    <label className="text-gray-500">Email</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" className="p-2 rounded-md border-2" />
                  </div>
                  <div className="flex flex-col relative">
                    <label className="text-gray-500">Password</label>
                    <input onChange={(e) => setPwd(e.target.value)} type={showPassword ? 'text' : 'password'} className="p-2 rounded-md border-2" />
                    <MdRemoveRedEye
                      className={`${showPassword ? 'text-gray-400' : 'text-black'} absolute text-xl cursor-pointer top-[38px] right-4`}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </div>
                <div className="md:h-fit h-1/2 flex flex-col items-center justify-center space-y-8 md:space-y-14 md:mt-[30px] xl:mt-[50px]">
                  <button
                    className="bg-indigo-500 hover:bg-indigo-600 w-full md:p-4 rounded p-2 text-white"
                    onClick={() => login()}
                  >Log In</button>
                  <hr className="w-[95%] md:w-full mx-auto" />
                  <Link
                    className="cursor-pointer underline text-blue-500 text-sm"
                    to='/'>Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Login