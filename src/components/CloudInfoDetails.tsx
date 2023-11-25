import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface CloudInfoDetailsProps {
    e: {
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
  }

const CloudInfoDetails: React.FC<CloudInfoDetailsProps> = ({ e }) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);


    return (
        <div className="text-justify mb-12 md:w-[40%] xl:w-[30%] md:my-[50px] w-[90%] mx-auto space-y-2">
            <div className="h-[350px] mb-[20px] w-full" onClick={() => setIsClicked(!isClicked)} >
                {isClicked ? (
                    <>
                        <div className="bg-indigo-300 cursor-pointer h-[350px] rounded-[20px]">
                            <div className="h-full flex flex-col justify-around items-center">
                                <div className="flex flex-col items-center">
                                    <h2>Social Needs</h2>
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                className={index < e.social_needs ? "text-orange-500" : ""}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <h2>Intelligence</h2>
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                className={index < e.intelligence ? "text-orange-500" : ""}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <h2>Stranger Friendly</h2>
                                    <div className="flex">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar
                                                key={index}
                                                className={index < e.stranger_friendly ? "text-orange-500" : ""}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white h-[350px] flex items-center justify-center rounded-[20px] cursor-pointer">
                        <div className="w-[280px] h-[280px] rounded-full border-[10px] border-indigo-100 overflow-hidden">
                            <img className="w-full h-full object-cover" src={`https://cdn2.thecatapi.com/images/${e.reference_image_id}.jpg`} alt="cat" />
                        </div>
                    </div>
                )}
            </div>
            <div className="h-[300px] bg-white rounded-[20px] flex flex-col justify-between p-2">
                <h1 className="font-bold text-xl">{e.name}</h1>
                <p><small>{e.description}</small></p>
                <p><i>{e.temperament}</i></p>
                <div className="h-[30px]">
                    <a className="shadow hover:bg-yellow-400 hover:text-red-500 border-none p-2 bg-yellow-500 rounded-md" href={e.wikipedia_url}>WIKIPEDIA</a>
                </div>
            </div>
        </div>
    )
}

export default CloudInfoDetails