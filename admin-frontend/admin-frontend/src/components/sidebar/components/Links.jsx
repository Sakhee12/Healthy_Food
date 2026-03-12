/* eslint-disable */
import DashIcon from "components/icons/DashIcon";
import React from "react";
import { Link, useLocation } from "react-router-dom";
// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();

  const { routes } = props;

  // Get user from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role?.toLowerCase() || "";

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // Filter routes based on user role
  const filteredRoutes = routes.filter(route => {
    if (!route.roles) return true; // Show by default if no roles specified
    return route.roles.includes(userRole);
  });

  // Initialize expanded state based on active routes
  const [expanded, setExpanded] = React.useState(() => {
    const init = {};
    filteredRoutes.forEach((route) => {
      if (route.children && route.children.length > 0) {
        const isActive = location.pathname.includes(route.path);
        init[route.name] = isActive;
      }
    });
    return init;
  });

  const toggleExpand = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const createLinks = (routesList) => {
    return routesList.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        // Filter children based on role
        const childRoutes = (route.children || []).filter(child => {
          if (!child.roles) return true;
          return child.roles.includes(userRole);
        });

        const hasChildren = childRoutes.length > 0;
        const isExpanded = expanded[route.name] || false;

        return (
          <div key={index} className="flex flex-col">
            <div
              className="relative mb-3 flex hover:cursor-pointer"
              onClick={() => hasChildren && toggleExpand(route.name)}
            >
              <li
                className="my-[3px] flex cursor-pointer items-center px-8"
              >
                <span
                  className={`${activeRoute(route.path) === true
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                    }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                {hasChildren ? (
                  <div className="flex w-full items-center justify-between">
                    <p
                      className={`leading-1 ml-4 flex ${activeRoute(route.path) === true
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                        }`}
                    >
                      {route.name}
                    </p>
                    <span className={`ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg>
                    </span>
                  </div>
                ) : (
                  <Link to={route.layout + "/" + route.path} className="w-full">
                    <p
                      className={`leading-1 ml-4 flex ${activeRoute(route.path) === true
                        ? "font-bold text-navy-700 dark:text-white"
                        : "font-medium text-gray-600"
                        }`}
                    >
                      {route.name}
                    </p>
                  </Link>
                )}
              </li>
              {activeRoute(route.path) ? (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>

            {hasChildren && isExpanded && (
              <ul className="ml-12 mb-3 border-l-2 border-gray-100 pl-4">
                {childRoutes.map((child, childIndex) => (
                  <Link key={childIndex} to={route.layout + "/" + route.path + "/" + child.path}>
                    <li className="my-2 flex items-center">
                      <p
                        className={`text-sm ${location.pathname.includes(child.path)
                          ? "font-bold text-brand-500 dark:text-white"
                          : "font-medium text-gray-500"
                          }`}
                      >
                        {child.name}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        );
      }
    });
  };
  // BRAND
  return createLinks(filteredRoutes);
}

export default SidebarLinks;
