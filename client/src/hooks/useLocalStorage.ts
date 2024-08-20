import { useEffect, useState } from "react";

const useLocalStorage = () => {
    const [local] = useState((): string => {
        if (typeof window !== "undefined") {
          const from_localStorage = window.localStorage.getItem("userId");
          if (from_localStorage === null || from_localStorage === undefined) {
            return crypto.randomUUID();
          }
    
          return `${from_localStorage}` ? from_localStorage : crypto.randomUUID();
        }
        return crypto.randomUUID();
      });
      
      const [userId, setUserId] = useState<string>(local);
    
      useEffect(() => {
        window.localStorage.setItem("userId", `${local}`);
      }, [local]);

      return userId;
}



export default useLocalStorage;