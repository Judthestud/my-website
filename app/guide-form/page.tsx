"use client";

import { useMemo, useState, type FormEvent } from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

export default function GuideFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState("");
  const [awareness, setAwareness] = useState("");
  const [intention, setIntention] = useState("");
  const [country, setCountry] = useState("");
  const [recentFeelings, setRecentFeelings] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const countryOptions = useMemo(() => countryList().getData(), []);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault(); 

    try {
      const res = await fetch("/api/guide-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          focus,
          awareness,
          intention,
          country,
          recentFeelings, 
          desiredOutcome,
          availability, 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit form");
      }

      // mark form complete
      sessionStorage.setItem("formCompleted", "true");

      // redirect to booking
      window.location.href = "/booking";
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/cosmic-ocean-bg.png"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-8 py-20">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.45em] text-purple-200/60">
            Spiritual Guidance
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">
            Pre-Alignment Form 
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
            Share what you are seeking guidance with so the session can be more
            intentional, focused, and aligned.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-6"
        >
          {/* Name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your Name"
            className="w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35 focus:border-purple-300/50"
          />

          {/* Email */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            placeholder="Your Email"
            className="w-full rounded-2xl border border-white/15 bg-white/5 p-5 text-lg text-white outline-none backdrop-blur-md placeholder:text-white/35 focus:border-purple-300/50"
          />

         {/* Focus */}
         <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
           <p className="mb-4 text-sm text-white/85">
             Select a session focus
           </p>

         <div className="grid gap-3 md:grid-cols-2">
         {[
           "Clarity & Direction",
           "Emotional Release",
           "Purpose & Calling",
           "Inner Alignment",
           "Expansion & Awareness",
           "Relationships & Inner Patterns",
           "Life Transition",
         ].map((item) => (
          <button
            key={item}
            type="button"
             onClick={() => setFocus(item)}
             className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
              focus === item
              ? "border-purple-300/60 bg-purple-400/20 text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]"
              : "border-white/10 bg-white/5 text-white/90 hover:border-purple-300/30 hover:bg-purple-400/10 hover:text-white"
            }`}
           >
          {item}
      </button>
       ))}
     </div>
   </div>  

          {/* Awareness */}
         <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
           <p className="text-sm text-white/85">
             Where do you currently feel you are on your path?
           </p>

         <label className="flex items-center gap-3 text-white/80">
          <input
            type="radio"
            name="awareness"
            value="Deeply exploring spirituality and inner work"
            required
            checked={awareness === "Deeply exploring spirituality and inner work"}
            onChange={(e) => setAwareness(e.target.value)}
            className="accent-purple-400"
          />
              I’ve been deeply exploring spirituality and inner work
         </label>

         <label className="flex items-center gap-3 text-white/80">
          <input
            type="radio"
            name="awareness"
            value="Beginning to reconnect with myself"
            checked={awareness === "Beginning to reconnect with myself"}
            onChange={(e) => setAwareness(e.target.value)}
            className="accent-purple-400"
          />
             I’m beginning to reconnect with myself
         </label>

         <label className="flex items-center gap-3 text-white/80">
          <input
            type="radio"
            name="awareness"
            value="Seeking clarity and guidance"
            checked={awareness === "Seeking clarity and guidance"}
            onChange={(e) => setAwareness(e.target.value)}
            className="accent-purple-400"
          />
             I’m simply seeking clarity and guidance
         </label>

         <p className="mt-2 text-sm italic text-white/40">
             No prior spiritual experience is needed. Come exactly as you are.
         </p>
    </div> 


          {/* Country */}
<Select
  instanceId="country-select" 
  options={countryOptions}
  value={countryOptions.find(
  (option: { value: string; label: string }) => option.value === country
)} 
  onChange={(selectedOption: any) =>
  setCountry(selectedOption?.value || "")
} 
  placeholder="What country do you live in?"
  isSearchable
  className="text-lg"
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "rgba(255,255,255,0.05)",
      borderColor: "rgba(255,255,255,0.15)",
      borderRadius: "1rem",
      padding: "0.6rem",
      backdropFilter: "blur(12px)",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#111",
      borderRadius: "1rem",
      overflow: "hidden",
      zIndex: 50,
    }),

    menuList: (base) => ({
      ...base,
      maxHeight: "220px",
      overflowY: "auto",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? "rgba(168,85,247,0.2)"
        : "#111",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    input: (base) => ({
      ...base,
      color: "white",
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255,255,255,0.35)",
    }),
  }}
/> 

         {/* Recent Feelings */}
<div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
  <p className="mb-4 text-sm text-white/85">
    How have you been feeling lately?
  </p>

  <div className="grid gap-3 md:grid-cols-2">
    {[
      "Overwhelmed",
      "Disconnected",
      "Emotionally stuck",
      "Searching for clarity",
      "Motivated but uncertain",
      "Going through transition",
      "Seeking deeper purpose",
      "Ready for change",
    ].map((feeling) => (
      <button
        key={feeling}
        type="button"
        onClick={() => setRecentFeelings(feeling)}
        className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
          recentFeelings === feeling
            ? "border-purple-300/60 bg-purple-400/20 text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]"
            : "border-white/10 bg-white/5 text-white/90 hover:border-purple-300/30 hover:bg-purple-400/10 hover:text-white"
        }`}
      > 
        {feeling}
      </button>
    ))}
  </div>
</div> 

        {/* Desired Outcome */}
<div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
  <p className="mb-4 text-sm text-white/85">
    What are you hoping to achieve?
  </p>

  <div className="grid gap-3 md:grid-cols-2">
    {[
      "Greater clarity and direction",
      "Emotional healing",
      "Inner peace",
      "Stronger discipline and focus",
      "Spiritual alignment",
      "Confidence in my next step",
      "Deeper self-understanding",
      "Transformation and growth",
    ].map((outcome) => (
      <button
        key={outcome}
        type="button"
        onClick={() => setDesiredOutcome(outcome)}
        className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 ${
          desiredOutcome === outcome
            ? "border-purple-300/60 bg-purple-400/20 text-white shadow-[0_0_25px_rgba(168,85,247,0.25)]"
            : "border-white/10 bg-white/5 text-white/90 hover:border-purple-300/30 hover:bg-purple-400/10 hover:text-white"
        }`}
      >
        {outcome}
      </button>
    ))}
  </div>
</div> 

     {/* Availability */}
<div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
  <p className="text-sm text-white/85">
    When are you typically available? (Select all that apply)
  </p>

  {[
    "Mornings",
    "Afternoons",
    "Evenings",
    "Late nights",
    "Weekdays",
    "Weekends",
    "Flexible schedule",
  ].map((time) => (
    <label
      key={time}
      className="flex items-center gap-3 text-white/80"
    >
      <input
        type="checkbox"
        checked={availability.includes(time)}
        onChange={(e) => {
          if (e.target.checked) {
            setAvailability([...availability, time]);
          } else {
            setAvailability(
              availability.filter((item) => item !== time)
            );
          }
        }}
        className="accent-purple-400"
      />

      {time}
    </label>
  ))}
</div> 

         {/* Disclaimer */}
<div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70 backdrop-blur-md">
  <p className="leading-7">
    Spiritual Guidance sessions are intended for personal reflection,
    mindset development, emotional awareness, and spiritual exploration.
    These sessions are not medical treatment, psychotherapy, psychiatric
    care, crisis counseling, or legal/financial advice, and are not a
    substitute for licensed professional services.
  </p>

  <p className="mt-4 leading-7 text-white/50">
    By continuing, you acknowledge full responsibility for your own
    decisions, wellbeing, and participation in the session experience.
  </p>

  <label className="mt-5 flex items-start gap-3 text-white/80">
    <input
      type="checkbox"
      checked={agreedToDisclaimer}
      onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
      className="mt-1 accent-purple-400"
      required
    />

    <span>
      I understand and agree to the session disclaimer and participation
      terms.
    </span>
  </label>
</div> 

          {/* Submit */}
          <button
            type="submit"
            disabled={!agreedToDisclaimer} 
            className="mt-4 rounded-full border border-purple-300/40 bg-purple-500/15 px-10 py-5 text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:scale-[1.02] hover:bg-purple-400/25 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)]"
          >
            Continue to Date & Time →
          </button>
        </form>
      </section>
    </main>
  );
} 