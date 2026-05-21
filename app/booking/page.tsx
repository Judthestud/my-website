"use client";

import { useState } from "react";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const dates = [
    { value: "2026-05-03", label: "May 3", sub: "Tomorrow" },
    { value: "2026-05-04", label: "May 4", sub: "Monday" },
    { value: "2026-05-05", label: "May 5", sub: "Tuesday" },
  ];

  const availability: Record<string, string[]> = {
    "2026-05-03": ["10:00 AM", "1:00 PM", "4:00 PM"],
    "2026-05-04": ["11:00 AM", "2:00 PM", "5:00 PM"],
    "2026-05-05": ["9:00 AM", "12:00 PM", "3:00 PM"],
  };

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedDate,
        selectedTime,
        service: "Spiritual Guidance Session",
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden text-white">

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/cosmic-ocean-bg.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="flex w-[380px] flex-col items-center gap-5 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.15)]">

        <h1 className="text-xl font-medium">Book a Session</h1>

        {/* Date Selection */}
        <div className="w-full">
          <p className="text-xs text-gray-400">Select a date</p>

          <div className="mt-2 grid grid-cols-3 gap-2">
            {dates.map((date) => (
              <button
                key={date.value}
                onClick={() => {
                  setSelectedDate(date.value);
                  setSelectedTime("");
                }}
                className={`rounded-xl border px-3 py-3 text-sm transition-all duration-300 ${
                  selectedDate === date.value
                    ? "border-purple-300 bg-purple-400/20 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                    : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div>{date.label}</div>
                <div className="text-xs opacity-70">{date.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="w-full">
          <p className="text-xs uppercase tracking-[0.2em] text-purple-200/60">
            Select a time
          </p>

          <div className="mt-2 grid grid-cols-2 gap-2">
            {(availability[selectedDate] || []).map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`rounded-xl border px-3 py-3 text-sm transition-all duration-300 ${
                  selectedTime === time
                    ? "scale-[1.02] border-purple-300 bg-purple-400/20 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                    : "border-white/10 bg-white/5 text-white/85 hover:scale-[1.02] hover:bg-white/10 hover:text-white"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedDate && (availability[selectedDate] || []).length === 0 && (
            <p className="mt-2 text-sm text-gray-400">
              No sessions available for this date.
            </p>
          )}
        </div>

        <p className="text-sm text-gray-300">$100 per session</p>

        {/* Selected Summary */}
        {selectedDate && selectedTime && (
          <div className="w-full rounded-2xl border border-purple-300/20 bg-white/5 p-4 text-sm text-white shadow-[0_0_35px_rgba(168,85,247,0.18)] backdrop-blur-xl">

            <p className="text-xs uppercase tracking-[0.25em] text-purple-200/60">
              Selected Session
            </p>

            <div className="mt-3 space-y-1 text-white/80">
              <p>
                Date: <span className="text-white">{selectedDate}</span>
              </p>
              <p>
                Time: <span className="text-white">{selectedTime}</span>
              </p>
              <p>
                Duration: <span className="text-white">1 hour</span>
              </p>
              <p>
                Price: <span className="text-white">$100</span>
              </p>
            </div>

          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={!selectedDate || !selectedTime}
          className={`w-full rounded-2xl border py-3 font-medium transition-all duration-300 ${
            selectedDate && selectedTime
              ? "border-white/20 bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:scale-[1.03]"
              : "cursor-not-allowed border-white/10 bg-white/10 text-white/30"
          }`}
        >
          Reserve & Pay
        </button>

      </div>
    </main>
  );
} 