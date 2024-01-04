import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const noFooterPage = ["/login", "/signup", "/posts/new"];
  const pathname = location.pathname;
  console.log(pathname);
  return (
    <>
      <Header />
      <Outlet />
      {!noFooterPage.includes(pathname) && <Footer />}
    </>
  );
};

export default Layout;
