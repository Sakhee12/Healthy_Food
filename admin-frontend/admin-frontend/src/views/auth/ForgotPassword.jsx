import InputField from "components/fields/InputField";
import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return setError("Please enter your email");
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await authService.forgotPassword(email);
            setMessage("Reset token generated! Check terminal/console. (Demo Mode)");
            // In a real app, you'd show a "Check your email" message
        } catch (err) {
            setError(err.response?.data?.message || "Failed to request reset");
        }
        setLoading(false);
    };

    return (
        <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
            <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">Forgot Password?</h4>
                <p className="mb-9 ml-1 text-base text-gray-600">Enter your email and we'll send you a reset link!</p>

                {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-500 border border-red-100">{error}</div>}
                {message && <div className="mb-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-500 border border-green-100">{message}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <InputField label="Email*" placeholder="mail@example.com" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <button type="submit" disabled={loading} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 shadow-lg shadow-brand-500/20">
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center">
                    <Link to="/auth/sign-in" className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Back to Sign In</Link>
                </div>
            </div>
        </div>
    );
}
