"use client";
import React, { useEffect, useState } from "react";
import Body1 from "@/components/Body1";
import P2ptablebuy from "@/components/p2p/p2ptablebuy/P2ptablebuy";
import { useDarkMode } from "@/components/DarkmodeContext";

const Home = () => {
  const [showAds, setShowAds] = useState([]);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    // Fetch all ads
    const  fetchAds = async() => {
      const res = await fetch("https://binaryp2psytes.net/api/p2p/ad/getallad/buy");
      const data = await res.json();

      if(!data) {
        return;
      }

      //Checking if therer are at least 4 ads
      if(data.length < 4) {
        setShowAds(data);
        return;
      }
      
      //Showing only 4 ads frothe array data
      setShowAds(data.data?.slice(0,4));
      
      
    }

    fetchAds();
  },[]);

  return (
    <div className={`${darkMode && "text-white bg-black"} h-full pb-16 md:pb-0 w-screen`}>
      <Body1 />
      <P2ptablebuy showAds={showAds} fromHome={true} />
    </div>
  );
};

export default Home;
