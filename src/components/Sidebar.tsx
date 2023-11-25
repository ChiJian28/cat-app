import { IoHomeOutline } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { PiBooks } from "react-icons/pi";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <section className="bg-[#0612C8] absolute bottom-5 left-[25%] text-white items-center flex justify-between px-2 w-1/2 rounded-3xl h-[40px] xl:h-[50px]">
            <div className="hover:border-[1px] rounded-full p-2 cursor-pointer">
                <Link to='/home/cat'>
                    <LiaUserFriendsSolid />
                </Link>
            </div>
            <div className="hover:border-[1px] rounded-full p-2 cursor-pointer">
                <Link to='/home'>
                    <IoHomeOutline />
                </Link>
            </div>
            <div className="hover:border-[1px] rounded-full p-2 cursor-pointer">
                <Link to='/home/info'>
                    <PiBooks />
                </Link>
            </div>
        </section>
    )
}

export default Sidebar