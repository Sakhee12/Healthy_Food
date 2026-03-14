import Footer from "components/footer/Footer";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import routes from "routes";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routesList) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userRole = user?.role?.toLowerCase() || "";

    return routesList.flatMap((prop, key) => {
      // Filter out routes that the user doesn't have the role for
      if (prop.roles && !prop.roles.includes(userRole)) {
        return [];
      }

      if (prop.layout === "/admin") {
        if (prop.children) {
          return prop.children
            .filter(child => !child.roles || child.roles.includes(userRole))
            .map((child, childKey) => (
              <Route
                path={`/${prop.path}/${child.path}`}
                element={React.cloneElement(child.component, { title: child.name })}
                key={`${key}-${childKey}`}
              />
            ));
        }
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return [];
      }
    });
  };

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);

  React.useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  if (!localStorage.getItem("token")) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Healthy Food Admin"}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="mx-auto mb-auto h-full min-h-[84vh] p-2 pt-5 md:pr-2">
              <React.Suspense fallback={<div className="flex h-full w-full items-center justify-center font-bold text-navy-700">Loading component...</div>}>
                <Routes>
                  {getRoutes(routes)}

                  <Route
                    path="/"
                    element={<Navigate to="/admin/default" replace />}
                  />
                </Routes>
              </React.Suspense>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
