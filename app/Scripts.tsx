"use client";
import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PropellerAdsScript() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (isHomePage) return;

    let script: HTMLScriptElement | null = null;

    const loadAd = () => {
      script = document.createElement("script");
      script.src = "https://groleegni.net/401/9441972";
      script.async = true;
      try {
        (document.body || document.documentElement).appendChild(script);
      } catch (e) {
        console.error("Failed to append PropellerAds script:", e);
      }
    };

    const id = setTimeout(loadAd, 2500);

    return () => {
      clearTimeout(id);
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isHomePage]);

  const showAdPopup = useCallback(() => {
    try {
      // This will use the PropellerAds popup functionality
      // You may need to adjust this based on PropellerAds documentation
      if (window.open) {
        window.open("https://groleegni.net/401/9441972", "_blank");
      }
    } catch (e) {
      console.error("Failed to show ad popup:", e);
    }
  }, []);

  useEffect(() => {
    window.showPropellerAd = showAdPopup;
    return () => {
      delete window.showPropellerAd;
    };
  }, [showAdPopup]);

  return null;
}


//<script>(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',9441972,document.createElement('script'))</script>
     