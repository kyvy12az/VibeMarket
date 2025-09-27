import { Outlet, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import Navigation from "./Navigation";
import Footer from "./Footer";
const hiddenLayoutPaths = ["/chat", "/call"];

const Layout = () => {
  const { pathname } = useLocation();
  const isLayoutHidden = hiddenLayoutPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isLayoutHidden && <Navigation />}
      <main>
        <Outlet />
      </main>
      {!isLayoutHidden && <Footer />}
    </div>
  );
};

export default Layout;