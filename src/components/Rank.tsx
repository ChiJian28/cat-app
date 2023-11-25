import useGetPostQueryLikes from "../hooks/useGetPostQueryLikes";
import { FcLike } from "react-icons/fc";

const Rank = () => {
  const { userLikesPosts } = useGetPostQueryLikes();

  return (
    <section className="w-[95%] mx-auto md:mt-[100px] flex flex-col pb-[50px] space-y-3">
      <div className="md:p-[20px]">
        <h1 className="text-2xl md:text-4xl text-white">Weekly Post Rank</h1>
      </div>
      {userLikesPosts.map((user: any, index: number) => (
        <div key={user.id} className="flex flex-col">
          <div className="border-b-[0.5px] p-2 flex items-center md:text-[25px]">
            <div className="w-[10%]">
              <h2 className="text-slate-300">0{index + 1}.</h2>
            </div>
            <div className="w-[80%] flex items-center">
              <div className="w-[40px] h-[40px] md:h-[50px] md:w-[50px] 2xl:w-[70px] 2xl:h-[70px] overflow-hidden rounded-full border-none mr-3">
                <img
                  className="object-cover w-full h-full"
                  src={user.uPhotoUrl}
                  alt="profile photo"
                />
              </div>
              <p className="text-white">{user.uname}</p>
            </div>
            <div className="flex items-center w-[10%] space-x-2">
              <h2 className="text-slate-300">{user.likesCount} </h2>
              <FcLike />
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default Rank