"use client";
import { useEffect } from "react";

export default function PropellerAdsScript() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://groleegni.net/401/9441972";
    script.async = true;

    try {
      (document.body || document.documentElement).appendChild(script);
      console.log("PropellerAds script appended successfully");
    } catch (e) {
      console.error("Failed to append PropellerAds script:", e);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}


//<script>(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',9441972,document.createElement('script'))</script>
     