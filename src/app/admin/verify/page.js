"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FiCheckCircle, FiAlertCircle, FiLoader, FiUser, FiFileText } from "react-icons/fi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function AdminVerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | approving | approved | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No token found in the URL.");
      return;
    }

    fetch(`${API_URL}/api/restaurants/admin/payment-details?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setDetails(json.data);
          setStatus("ready");
        } else {
          setStatus("error");
          setErrorMsg(json.message || "Invalid or expired link.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Could not connect to the server.");
      });
  }, [token]);

  const handleApprove = async () => {
    setStatus("approving");
    try {
      const res = await fetch(`${API_URL}/api/restaurants/admin/approve-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus("approved");
      } else {
        setStatus("error");
        setErrorMsg(json.message || "Approval failed.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Could not connect to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-2xl mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Payment Review</h1>
          <p className="text-gray-400 mt-1 text-sm">Kenyan.menu · Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {status === "loading" && (
            <div className="p-10 flex flex-col items-center gap-3 text-gray-400">
              <FiLoader className="w-8 h-8 animate-spin text-green-500" />
              <p className="text-sm">Loading payment details...</p>
            </div>
          )}

          {status === "error" && (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Link Invalid or Expired</p>
                <p className="text-gray-400 text-sm mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          {status === "approved" && (
            <div className="p-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-white font-bold text-xl">Subscription Activated!</p>
                <p className="text-gray-400 text-sm mt-2">
                  <span className="font-semibold text-green-400">{details?.restaurantName}</span>&apos;s public menu is now live for 31 days.
                </p>
              </div>
            </div>
          )}

          {(status === "ready" || status === "approving") && details && (
            <>
              {/* Details */}
              <div className="p-6 border-b border-gray-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Restaurant</p>
                    <p className="text-white font-semibold text-lg">{details.restaurantName}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiFileText className="w-4 h-4 text-gray-500" />
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Message / Code</p>
                  </div>
                  <pre className="bg-gray-800 text-green-300 text-sm rounded-xl p-4 whitespace-pre-wrap break-words font-mono leading-relaxed border border-gray-700">
                    {details.paymentMessage}
                  </pre>
                </div>
              </div>

              {/* Action */}
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-4 text-center">
                  By clicking approve, you confirm that this payment is valid and the restaurant will receive a 31-day subscription.
                </p>
                <button
                  onClick={handleApprove}
                  disabled={status === "approving"}
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-green-900/30"
                >
                  {status === "approving" ? (
                    <>
                      <FiLoader className="animate-spin w-5 h-5" />
                      Activating Subscription...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      ✅ Approve &amp; Activate Subscription
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          This is a private admin page. Approval links expire after 7 days.
        </p>
      </div>
    </div>
  );
}

export default function AdminVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    }>
      <AdminVerifyContent />
    </Suspense>
  );
}
