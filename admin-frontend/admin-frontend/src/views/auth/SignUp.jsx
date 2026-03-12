import InputField from "components/fields/InputField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "services/api";

export default function SignUp() {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", role_id: "6" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const roles = [
        { id: "1", name: "Super Admin" },
        { id: "2", name: "Admin" },
        { id: "3", name: "Manager" },
        { id: "4", name: "Inventory Manager" },
        { id: "5", name: "Delivery Boy" },
        { id: "6", name: "Customer (User)" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) return setError("All fields are required");
        setLoading(true);
        setError("");
        try {
            await authService.register(formData);
            alert("Registration successful! Please login.");
            navigate("/auth/sign-in");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            <div className="mt-[5vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Create Account</h4>
                <p className="mb-9 ml-1 text-base text-gray-600">Join Healthy Food as a staff or customer</p>

                {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-500 border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <InputField label="Full Name*" placeholder="John Doe" id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    <InputField label="Email*" placeholder="mail@example.com" id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                    <div>
                        <label className="text-sm font-bold text-navy-700 dark:text-white ml-1">Account Type (Role)*</label>
                        <select
                            className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                            value={formData.role_id}
                            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id} className="text-navy-700">
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <InputField label="Phone Number" placeholder="+1234567890" id="phone" type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    <InputField label="Password*" placeholder="Min. 8 characters" id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                    <button type="submit" disabled={loading} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 shadow-lg shadow-brand-500/20">
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-600">Already have an account?</p>
                    <Link to="/auth/sign-in" className="ml-1 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
