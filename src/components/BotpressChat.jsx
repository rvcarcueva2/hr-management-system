import { useEffect } from "react";

const BotpressChat = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.6/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    script1.onload = () => {
      const script2 = document.createElement("script");
      script2.src = "https://files.bpcontent.cloud/2026/04/30/05/20260430050918-HFIWOBA6.js";
      script2.async = true;
      document.body.appendChild(script2);
    };

    
    return () => {
      document.querySelectorAll('script[src*="botpress"], script[src*="bpcloud"]')
        .forEach(s => s.remove());

      if (window.botpressWebChat) {
        window.botpressWebChat.close();
      }
    };
  }, []);

  return null;
};

export default BotpressChat;