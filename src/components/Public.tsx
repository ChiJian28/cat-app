import Sidebar from "../components/Sidebar"
import { MdAddCircleOutline } from "react-icons/md";
import CreatePost from "../components/CreatePost";
import { useCreatePostStore } from "../store";
import useGetPost from "../hooks/useGetPost";
import { useState } from "react";
import { MdPublic } from "react-icons/md";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import useGetPostQueryStar from "../hooks/useGetPostQueryStar";
import Post from "./Post";
import Private from "./Private";

const Public = () => {
  const { isCreate, setIsCreate } = useCreatePostStore();
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const { userCollectedPosts } = useGetPostQueryStar();
  const { userPost } = useGetPost();

  return (
    <section className="h-screen p-2 bg-gray-100">
      <div className="absolute left-0 top-0 flex bg-slate-200 w-full pb-2">
        <MdPublic
          className={`${isPublic ? 'text-blue-500' : 'text-black'} w-[30px] h-[30px] cursor-pointer mr-3`}
          onClick={() => setIsPublic(true)}
        />
        <RiGitRepositoryPrivateLine
          onClick={() => setIsPublic(false)}
          className={`${isPublic ? 'text-black' : 'text-blue-500'} w-[30px] h-[30px] cursor-pointer`}
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-around md:flex-wrap h-full mt-[30px] overflow-y-scroll">
        {isPublic ? (
          <>
            {userPost.map((post) => (
              <Post key={post.id} post={post} />
            ))}
            <MdAddCircleOutline
              onClick={() => setIsCreate(!isCreate)}
              className="absolute top-0 hover:text-blue-500 right-0 w-[30px] h-[30px] cursor-pointer"
            />
            {isCreate && <CreatePost />}
          </>
        ) : (
          <>
            {userCollectedPosts.map((post: any) => (
              <Private key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
      <Sidebar />
    </section>
  )
}

export default Public