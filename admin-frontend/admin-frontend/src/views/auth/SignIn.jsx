import InputField from "components/fields/InputField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "services/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and password required");
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      const managementRoles = ["superadmin", "admin", "manager", "inventory_manager", "delivery_boy", "customer"];
      if (!managementRoles.includes(user.role?.toLowerCase())) {
        throw new Error("Access denied. Authorized roles only.");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin/default");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[5vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Admin Sign In</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">Enter your credentials to access the admin panel</p>

        {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-500 border border-red-100">{error}</div>}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <InputField label="Email*" placeholder="admin@healthyfood.com" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputField label="Password*" placeholder="Min. 8 characters" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex items-center justify-end px-2">
            <Link to="/auth/forgot-password" title="Forgot Password?" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white shadow-lg shadow-brand-500/20">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center">
          <p className="text-sm font-medium text-gray-600">Not registered yet?</p>
          <Link to="/auth/sign-up" className="ml-1 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
