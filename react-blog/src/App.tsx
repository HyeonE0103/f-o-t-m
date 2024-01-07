import { useContext, useEffect, useState } from "react";
import { app } from "firebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Router from "./components/Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";
import ThemeContext from "context/ThemeContext";

function App() {
  const auth = getAuth(app);
  const context = useContext(ThemeContext);

  //auth를 체크하기 전(initialize전)에는 loader를 띄어주는용도
  const [init, setInit] = useState<boolean>(false);
  //auth의 currentUser가 있으면 authentication로 변경
  const [isAuthentication, setIsAuthentication] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //유저가 있으면
        setIsAuthentication(true);
      } else {
        //유저가 없으면
        setIsAuthentication(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
      <ToastContainer />
      {init ? <Router isAuthentication={isAuthentication} /> : <Loader />}
    </div>
  );
}
export default App;
