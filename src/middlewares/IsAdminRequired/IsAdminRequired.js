import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LastLogUser from '../../apiUtils/LastLogUser';

const IsAdmin = ({ children }) => {
  const token = Cookies.get('_erzaconnect_tk_log');
  const [tokenVerif, setTokenVerif] = useState(false);
  const [userPseudo, setUserPseudo] = useState("");

  useEffect(()=>{
    const fetchLog = async () => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/user/isadmin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const res = await response.json();
          setUserPseudo(res.userPseudo);
          Cookies.set("_erzaconnect_user_pseudo", res.userPseudo, { expires : 1, sameSite: "Strict" });
          Cookies.set("_erzaconnect_user_role", res.userRole, { expires : 1, sameSite: "Strict" });
          setTokenVerif(true);
        } else {
          const cookieerzaconnect = Cookies.get();
          for (const nameCookie in cookieerzaconnect) {
            if (nameCookie.startsWith('_erzaconnect')) {
              Cookies.remove(nameCookie);
            }
          }
          window.location.href = "https://erzaconnect.com";
          setTokenVerif(false);
        }    
      } catch (error) {
        setTokenVerif(false);
        console.error("Erreur lors de la requête fetch :", error);
      }
      
    };
    fetchLog();
  }, [token])

  return (tokenVerif ? 
    <>
      {children}
      <LastLogUser userPseudo={userPseudo}/>
    </> 
  : "");
};

export default IsAdmin;