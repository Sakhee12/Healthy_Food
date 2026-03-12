import Card from "components/card";
import { useEffect, useState } from "react";
import API from "services/api";

const Placeholder = ({ title, apiPath }) => {
    const [status, setStatus] = useState("Connecting...");
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (apiPath) {
                    response = await API.get(apiPath);
                    setData(response.data);
                    setStatus(`Connected & Loaded ${response.data.length || 0} items`);
                } else {
                    await API.get("/auth/send-otp").catch(err => {
                        if (err.response) return;
                        throw err;
                    });
                    setStatus("Connected to Backend");
                }
                setConnected(true);
            } catch (error) {
                setStatus("Backend Offline or API Error");
                setConnected(false);
            }
        };
        fetchData();
    }, [apiPath]);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center pt-[5%] px-4">
            <Card extra="w-full max-w-[800px] p-10 text-center">
                <div className="mb-4 flex items-center justify-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-sm font-medium text-gray-500">{status}</span>
                </div>
                <h1 className="text-3xl font-bold text-navy-700 dark:text-white mb-6">
                    {title || "Module"}
                </h1>

                {connected && data ? (
                    <div className="mt-4 w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-navy-700">
                        <p className="text-left text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Live Backend Data Sample</p>
                        <pre className="text-left text-xs text-navy-700 dark:text-white overflow-x-auto max-h-[200px]">
                            {JSON.stringify(data.slice(0, 3), null, 2)}
                        </pre>
                        {data.length === 0 && <p className="text-gray-500 italic">No data found in database. Add some items to see them here!</p>}
                    </div>
                ) : (
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        The <strong>{title}</strong> module is now linked to the backend API.
                        Its data is fetched directly from the database via REST endpoints.
                    </p>
                )}

                <div className="mt-8 flex justify-center">
                    {connected ? (
                        <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
                            <p className="mt-4 text-brand-500 font-bold italic">Synchronizing Module Data...</p>
                        </div>
                    ) : (
                        <div className="text-red-500 font-bold bg-red-50/50 p-4 rounded-xl border border-red-100">
                            Please start the Backend server on port 5000 and ensure the database is accessible.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Placeholder;
