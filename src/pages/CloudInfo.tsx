import Sidebar from "../components/Sidebar"
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import CloudInfoDetails from "../components/CloudInfoDetails";


interface Cat {
  id: string;
  url: string;
  name: string;
  description: string;
  social_needs: number;
  intelligence: number;
  stranger_friendly: number;
  temperament: string;
  reference_image_id: string;
  wikipedia_url: string;
  isClicked: boolean;
}

const CloudInfo = () => {
  const [search, setSearch] = useState<string>('');
  const [catData, setCatData] = useState<Cat[]>([]);

  useEffect(() => {
    fetchCat();
  }, []);

  const fetchCat = async () => {
    try {
      const apiKey = import.meta.env.VITE_CAT_API_KEY;
      const cat = await fetch(apiKey)
      const data = await cat.json();
      setCatData(data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(catData);

  return (
    <section className="h-screen">
      <div className="flex flex-col h-full">
        <div className="bg-gray-300 flex items-center justify-center h-[15%]">
          <div className="relative flex items-center w-[95%]">
            <input
              className="border-2 border-gray-300 bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute right-3">
              <IoSearchOutline className="text-gray-600 w-[30px] h-[30px] cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="h-[85%] overflow-y-scroll bg-slate-100">
          <div className="flex flex-wrap justify-between">
            {catData
              .filter((e) => {
                return search.toLowerCase() === '' ? e : e.name.toLowerCase().includes(search)
              })
              .map((e) => <CloudInfoDetails key={e.id} e={e} /> )}
          </div>
        </div>
      </div>
      <Sidebar />
    </section>
  )
}

export default CloudInfo