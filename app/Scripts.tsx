import React from 'react'
import Script from 'next/script'

const Scripts = () => {
  return (
    <>
      <Script
        id="monetag-ad-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(s,u,z,p){
              s.src = u;
              s.setAttribute('data-zone', z);
              p.appendChild(s);
            })(document.createElement('script'), 'https://shebudriftaiter.net/tag.min.js', 9208595, document.body || document.documentElement);
          `,
        }}
      />
      <Script
        src="https://staupsoaksy.net/act/files/tag.min.js?z=9208589"
        strategy="afterInteractive"
        async
        data-cfasync="false"
      />
    </>
  );
}

export default Scripts