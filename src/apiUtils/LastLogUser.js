import { useEffect } from "react";
import Cookies from "js-cookie";

function fecthStat(user, value){
  // Initialisation du temps d'expiration a 10min
  const d = new Date();
  d.setTime(d.getTime() + 10 * 60 * 1000);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ lastConnect : value, pseudoUser : user }),
  };

  fetch(`${process.env.REACT_APP_API_URL}/user/statprofile`, requestOptions)
  .then(response => { 
    if(response.ok){
      Cookies.set("_erzaconnect_lastLog_user", true, {expires: d, sameSite : "Strict"});
      Cookies.set("_erzaconnect_lastLog_user_expires", d.toISOString(), { expires: d, sameSite: "Strict" });
    } 
    response.json();
  })
  .then(result => { return result })
  .catch(error => console.log('error', error));

  return;
}


function LastLog({ userPseudo }) {
  useEffect(() => {
    const cookieValue = Cookies.get("_erzaconnect_lastLog_user");
    const cookieExpirationDate = Cookies.get("_erzaconnect_lastLog_user_expires");

    const currentDate = new Date();

    // Vérifiez si le cookie existe
    if (cookieValue !== undefined && cookieExpirationDate) {

      const expirationDate = new Date(cookieExpirationDate);

      if (currentDate > expirationDate) {
        fecthStat(userPseudo, currentDate);
      } else{
        return
      }
    } else {
      fecthStat(userPseudo, currentDate);
    }
  }, [userPseudo]);

  return null;
}

export default LastLog;