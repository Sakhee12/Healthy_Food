
// Admin Imports
import ViewCategories from "views/admin/category/ViewCategories";
import MainDashboard from "views/admin/default";
import ViewProducts from "views/admin/product/ViewProducts";
import Profile from "views/admin/profile";
import AdminManagement from "views/admin/admin-management/AdminManagement";

// Auth Imports
import Placeholder from "views/admin/Placeholder";
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";
import ForgotPassword from "views/auth/ForgotPassword";

// Icon Imports
import {
  MdBarChart,
  MdCategory,
  MdDeliveryDining,
  MdHome,
  MdListAlt,
  MdLocalOffer,
  MdLogout,
  MdNotifications,
  MdOutlineShoppingCart,
  MdPayment,
  MdPeople,
  MdSettings
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    roles: ["superadmin", "admin", "manager", "inventory_manager", "delivery_boy"]
  },
  {
    name: "Products",
    layout: "/admin",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    path: "products",
    roles: ["superadmin", "admin", "manager", "inventory_manager"],
    children: [
      { name: "View Products", path: "view", component: <ViewProducts />, roles: ["superadmin", "admin", "manager", "inventory_manager"] },
      { name: "Add Product", path: "add", component: <ViewProducts />, roles: ["superadmin", "admin", "manager"] },
      { name: "Inventory", path: "inventory", component: <Placeholder title="Inventory" />, roles: ["superadmin", "admin", "manager", "inventory_manager"] },
      { name: "Product Reviews", path: "reviews", component: <Placeholder title="Product Reviews" />, roles: ["superadmin", "admin", "manager"] },
    ]
  },
  {
    name: "Category Management",
    layout: "/admin",
    icon: <MdCategory className="h-6 w-6" />,
    path: "category",
    roles: ["superadmin", "admin"],
    children: [
      { name: "View Categories", path: "view", component: <ViewCategories />, roles: ["superadmin", "admin"] },
      { name: "Add Category", path: "add", component: <ViewCategories />, roles: ["superadmin", "admin"] },
    ]
  },
  {
    name: "Order Management",
    layout: "/admin",
    icon: <MdListAlt className="h-6 w-6" />,
    path: "orders",
    roles: ["superadmin", "admin", "manager", "delivery_boy"],
    children: [
      { name: "New Orders", path: "new", component: <Placeholder title="New Orders" apiPath="/admin/orders" />, roles: ["superadmin", "admin", "manager"] },
      { name: "Processing Orders", path: "processing", component: <Placeholder title="Processing" apiPath="/admin/orders" />, roles: ["superadmin", "admin", "manager", "delivery_boy"] },
      { name: "Delivered Orders", path: "delivered", component: <Placeholder title="Delivered" apiPath="/admin/orders" />, roles: ["superadmin", "admin", "manager", "delivery_boy"] },
      { name: "Cancelled Orders", path: "cancelled", component: <Placeholder title="Cancelled" apiPath="/admin/orders" />, roles: ["superadmin", "admin", "manager"] },
    ]
  },
  {
    name: "Customer Management",
    layout: "/admin",
    icon: <MdPeople className="h-6 w-6" />,
    path: "customers",
    roles: ["superadmin", "admin"],
    children: [
      { name: "All Customers", path: "all", component: <Placeholder title="All Customers" />, roles: ["superadmin", "admin"] },
      { name: "Customer Orders", path: "customer-orders", component: <Placeholder title="Customer Orders" />, roles: ["superadmin", "admin"] },
    ]
  },
  {
    name: "Delivery Partner",
    layout: "/admin",
    icon: <MdDeliveryDining className="h-6 w-6" />,
    path: "delivery",
    roles: ["superadmin", "admin"],
    children: [
      { name: "Delivery Boys", path: "boys", component: <Placeholder title="Delivery Boys" />, roles: ["superadmin", "admin"] },
      { name: "Assign Delivery", path: "assign", component: <Placeholder title="Assign Delivery" />, roles: ["superadmin", "admin"] },
    ]
  },
  {
    name: "Offers & Coupons",
    layout: "/admin",
    icon: <MdLocalOffer className="h-6 w-6" />,
    path: "offers",
    roles: ["superadmin", "admin", "manager"],
    children: [
      { name: "Create Coupon", path: "create", component: <Placeholder title="Create Coupon" />, roles: ["superadmin", "admin", "manager"] },
      { name: "Manage Offers", path: "manage", component: <Placeholder title="Manage Offers" />, roles: ["superadmin", "admin", "manager"] },
    ]
  },
  {
    name: "Payments",
    layout: "/admin",
    icon: <MdPayment className="h-6 w-6" />,
    path: "payments",
    roles: ["superadmin", "admin"],
    children: [
      { name: "Transactions", path: "transactions", component: <Placeholder title="Transactions" />, roles: ["superadmin", "admin"] },
      { name: "Refunds", path: "refunds", component: <Placeholder title="Refunds" />, roles: ["superadmin", "admin"] },
    ]
  },
  {
    name: "Reports & Analytics",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "reports",
    roles: ["superadmin", "admin"],
    children: [
      { name: "Sales Report", path: "sales", component: <Placeholder title="Sales Report" />, roles: ["superadmin", "admin"] },
      { name: "Order Report", path: "order-report", component: <Placeholder title="Order Report" />, roles: ["superadmin", "admin"] },
      { name: "Top Selling Fruits", path: "top-selling", component: <Placeholder title="Top Selling" />, roles: ["superadmin", "admin"] },
    ]
  },
  {
    name: "Notifications",
    layout: "/admin",
    icon: <MdNotifications className="h-6 w-6" />,
    path: "notifications",
    roles: ["superadmin", "admin", "manager"],
    children: [
      { name: "Send Notification", path: "send", component: <Placeholder title="Send Notification" />, roles: ["superadmin", "admin", "manager"] }
    ]
  },
  {
    name: "Admin Management",
    layout: "/admin",
    icon: <MdPeople className="h-6 w-6" />,
    path: "admin-management",
    component: <AdminManagement />,
    roles: ["superadmin"]
  },
  {
    name: "Settings",
    layout: "/admin",
    icon: <MdSettings className="h-6 w-6" />,
    path: "settings",
    roles: ["superadmin", "admin", "manager", "inventory_manager", "delivery_boy"],
    children: [
      { name: "App Settings", path: "app", component: <Placeholder title="App Settings" />, roles: ["superadmin", "admin"] },
      { name: "Admin Profile", path: "profile", component: <Profile />, roles: ["superadmin", "admin", "manager", "inventory_manager", "delivery_boy", "customer"] },
    ]
  },
  {
    name: "Logout",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLogout className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLogout className="h-6 w-6" />,
    component: <SignUp />,
  },
  {
    name: "Forgot Password",
    layout: "/auth",
    path: "forgot-password",
    icon: <MdLogout className="h-6 w-6" />,
    component: <ForgotPassword />,
  },
];
export default routes;
