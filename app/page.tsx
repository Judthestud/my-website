"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { getTestProducts } from "@/lib/shopify-test";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { Suspense } from "react";
import Image from "next/image"; 

function HomeContent() { 
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [shopifyData, setShopifyData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number | null>(null);

  const allImages = [
  "/images/Klerifai Shoot/Klerifai1.jpg",
  "/images/Klerifai Shoot/Klerifai2.jpg",
  "/images/Klerifai Shoot/Klerifai3.jpeg",
  "/images/Klerifai Shoot/Klerifai4.jpeg",
  "/images/Klerifai Shoot/Klerifai5.jpeg",
  "/images/Klerifai Shoot/Klerifai6.jpeg",
  "/images/Klerifai Shoot/Klerifai7.jpeg",
  "/images/Klerifai Shoot/Klerifai8.jpeg",
  "/images/Klerifai Shoot/Klerifai9.jpeg",
  "/images/Klerifai Shoot/Klerifai10.jpeg",
]; 

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const router = useRouter();

const goToView = (view: string) => {
  setShowMenu(false);
  setSelectedImageIndex(null);
  setActiveView(view);

  if (view === "home") {
    router.push("/");
  } else {
    router.push(`/?step=${view}`);
  }
};

const goToGuideForm = () => {
  setShowMenu(false);
  setSelectedImageIndex(null);
  sessionStorage.setItem("cameFromGuideForm", "true");
  router.push("/guide-form");
}; 

const resetToHome = () => {
  goToView("home");
};

const restorePageInteractivity = () => {
  document.body.style.pointerEvents = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  document.body.classList.remove("overflow-hidden");
}; 

useEffect(() => {
  restorePageInteractivity();

  const step = searchParams.get("step");

  setShowMenu(false);
  setSelectedImageIndex(null);
  setActiveView(step || "home");
}, [searchParams]);

useEffect(() => {
  const syncViewFromUrl = () => {
    if (sessionStorage.getItem("cameFromGuideForm") === "true") {
      sessionStorage.removeItem("cameFromGuideForm");
      window.location.reload();
      return;
    }

    restorePageInteractivity();

    const params = new URLSearchParams(window.location.search);
    const step = params.get("step");

    setShowMenu(false);
    setSelectedImageIndex(null);
    setActiveView(step || "home");

    requestAnimationFrame(() => {
      restorePageInteractivity();
    });
  };

  window.addEventListener("pageshow", syncViewFromUrl);
  window.addEventListener("popstate", syncViewFromUrl);

  return () => {
    window.removeEventListener("pageshow", syncViewFromUrl);
    window.removeEventListener("popstate", syncViewFromUrl);
  };
}, []);

useEffect(() => {
  async function fetchShopify() {
    try {
      const res = await fetch("/api/shopify-test");
      const data = await res.json();

      setShopifyData(data);

      const edges = data?.products?.edges || [];
      setProducts(edges);
    } catch (err) {
      console.error("Shopify fetch error:", err);
      setProducts([]);
    }
  }

  fetchShopify();
}, []); 

  const availability: Record<string, string[]> = {
  "2026-05-04": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-05": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-06": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-07": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-08": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],

  "2026-05-11": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-12": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-13": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-14": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
  "2026-05-15": ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"],
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

const isHome = activeView === "home";


  const navClass = (active: boolean) =>
  `relative flex h-8 items-center pb-2 transition focus:outline-none ${
    active
      ? "text-purple-200 scale-105 drop-shadow-[0_0_14px_rgba(216,180,254,0.95)]"
      : "text-white/45 hover:text-white"
  }`;  

  const dates = [ 
  { value: "2026-05-03", label: "May 3", sub: "Tomorrow" },
  { value: "2026-05-04", label: "May 4", sub: "Monday" },
  { value: "2026-05-05", label: "May 5", sub: "Tuesday" },
]; 

return (  
  <>
    {success && (
      <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-green-500/90 px-6 py-3 text-white shadow-lg">
        ✅ Payment successful. Your session is confirmed. Check your email.
      </div>
    )} 

  <main className="relative min-h-screen overflow-x-hidden bg-black">
    
     {/* Top Nav */}
  <div className="fixed left-0 right-0 top-0 z-[60] flex items-center justify-between px-10 py-6 text-white">
   
    {/* Logo */}
    <button
    onClick={resetToHome}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/20 text-xl tracking-widest backdrop-blur-md"
    >
      N
    </button>

    {/* Center Nav */}
    <div className="flex-1 flex justify-center">
      <div className="hidden h-8 items-center gap-12 text-xs uppercase tracking-[0.25em] md:flex">
       
        {/* Home */}
        <button
        onClick={resetToHome} 
          className={navClass(isHome)}
        >
          HOME
        </button>

       {/* Gallery */}
        <button
          onClick={() => goToView("gallery")}
          className={navClass(activeView === "gallery")}
        >
        
         GALLERY
        </button> 

       {/* Modeling */}
       <button
          onClick={() => goToView("modeling")}
          className={navClass(activeView === "modeling")}
       >
         MODELING
       </button>

       {/* About */}
       <button 
        onClick={() => goToView("about")} 
         className={navClass(activeView === "about")}> 
          ABOUT
       </button> 

        {/* Spiritual Guidance */}
       <button
          onClick={() => goToView("guidance")}
          className={navClass(activeView === "guidance")}
        >
         SPIRITUAL GUIDANCE
       </button> 

       {/* Contact */}
       <button
          onClick={() => goToView("contact")}
         className={navClass(activeView === "contact")}
       >
        CONTACT
      </button> 
      </div>
    </div>

    {/* Menu Button */}
    <button
      onClick={() => setShowMenu(true)}
      className="rounded-2xl border border-white/20 bg-black/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/85 backdrop-blur-md transition hover:border-purple-300/50 hover:bg-purple-500/10"
    >
      ✦ MENU
    </button>
  </div> 

   {/* Vision Background */}
 <div className="pointer-events-none absolute inset-0 z-0 bg-black">
    <img
    src="/images/cosmic-ocean-bg.png"
    alt=""
    className="h-full w-full object-cover"
  />
</div> 

{/* Ocean Reflection Glow */}
<div className="pointer-events-none fixed bottom-[13%] left-1/2 z-20 h-[22vh] w-[18vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(216,180,254,0.18)_0%,rgba(168,85,247,0.08)_35%,transparent_72%)] blur-2xl opacity-70 animate-pulseSlow" />

{/* Depth Gradient */}
<div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.85)_100%)]" />

{/* Shooting star 1: left rising toward center */}
<div
  className="pointer-events-none absolute left-[10%] top-[56%] z-10 h-[2px] w-[140px] bg-gradient-to-r from-transparent via-white to-purple-200 opacity-0 blur-[1px]"
  style={{
    animation: "shootingStarUpLeft 3s ease-out infinite",
  }}
/>

{/* Shooting star 2: fast right-to-left streak */}
<div
  className="pointer-events-none absolute right-[5%] top-[25%] z-10 h-[1px] w-[140px] bg-gradient-to-r from-transparent via-white/90 to-purple-200/60 opacity-0 blur-[1px]"
  style={{
    animation: "shootingStarFastRightToLeft 2s linear infinite",
    animationDelay: "1.2s",
  }}
/> 

{/* dark cinematic overlay */}
<div className="pointer-events-none absolute inset-0 bg-black/40" />

{/* center glow */}
<div className="pointer-events-none absolute left-1/2 top-[45%] h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-purple-500/20 blur-3xl" />

{/* horizon glow boost */}
<div className="pointer-events-none absolute bottom-[35%] left-1/2 h-[200px] w-[800px] -translate-x-1/2 bg-white/10 blur-2xl" />

{/* Subtle Wave Motion */}
<div className="pointer-events-none absolute bottom-0 left-0 w-[200%] h-[35%] opacity-20 blur-[2px] animate-waveSlow bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_70%)]" />

{/* bottom depth fade */}
<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/80 to-transparent" />

{/* vignette */}
<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)]" /> 
      


  {activeView === "home" && ( 

    <div className="relative z-40 flex min-h-screen flex-col items-center px-6 pt-48 text-center text-white animate-homeFadeIn md:pt-56">
      <h2 className="max-w-4xl text-5xl font-light leading-tight tracking-wide md:text-7xl">
        Welcome to the Field
      </h2>  

       <div className="mt-8 flex items-center gap-4">
         <div className="h-px w-32 bg-purple-400/40" />
         <div className="text-3xl text-purple-200 drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
           ✦
         </div>
         <div className="h-px w-32 bg-purple-400/40" />
      </div>

      {/* Light language line */}
         <p className="mt-6 text-xs md:text-sm tracking-[0.3em] text-white/40 drop-shadow-[0_0_10px_rgba(168,85,247,0.25)]">
           ⟦ ∆◯∴ ⟧ KA’RI ∂   ⟦ ⛧∆⛧ ⟧ VA’REI ∂   ⟦ □∴□ ⟧ THA’RI ∇
       </p> 

      <p className="mt-8 max-w-3xl text-base leading-8 text-white/85 md:text-lg">
        A sacred digital space for reflection, clarity, creativity, and alignment.
        Explore the gallery, learn more about the work, or move directly into guidance
        when YOU feel called.
      </p>  

       <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
  
     {/* Clarity */}
       <div className="group rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:border-purple-300/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]">
        <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">
         Clarity
        </p>
        <p className="mt-4 text-sm leading-7 text-white/60">
          Gain insight into your current path and the patterns that may be keeping you from your TRUE DIVINE SELF.
       </p>
  </div>

      {/* Alignment */}
        <div className="group rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:border-purple-300/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]">
          <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">
            Alignment
          </p>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Reconnect with your inner wisdom and realign with what truly matters to you.
          </p>
     </div>

      {/* Remembering */}
        <div className="group rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:border-purple-300/30 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]">
         <p className="text-xs uppercase tracking-[0.35em] text-purple-200/80">
          Remembering
         </p>
         <p className="mt-4 text-sm leading-7 text-white/60">
           Start remembering who you are as divine consciousness. 
       </p> 
  </div>

</div>

      {/* Spiritual Guidance FIRST */}
<div className="mt-16 w-full max-w-3xl rounded-3xl border border-purple-300/25 bg-black/25 p-6 text-center backdrop-blur-md shadow-[0_0_45px_rgba(168,85,247,0.15)]">
  <p className="text-xs uppercase tracking-[0.4em] text-purple-200/70">
    Spiritual Guidance
  </p>

  <p className="mt-4 text-sm leading-7 text-white/90">
    Learn more about the guidance experience, how sessions work, and whether this path feels aligned for you.
  </p>

  <button
   onClick={() => {
    setActiveView("guidance");
  }} 
    className="mt-6 rounded-full border border-purple-300/40 bg-purple-500/10 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white transition-all duration-500 hover:scale-105 hover:bg-purple-400/20 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)]"
  >
    Spiritual Guidance →
  </button> 
</div>

{/* THEN the Form CTA */}
<div className="mt-16 w-full max-w-4xl rounded-3xl border border-purple-300/25 bg-black/30 p-6 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.18)]">
  <p className="text-lg text-white">
    Ready to begin your session?
  </p>

  <p className="mt-3 text-sm leading-7 text-white/60">
    Fill out the form to share a little about yourself and what you’re seeking guidance with.
  </p>

  <button
  onClick={goToGuideForm} 
  className="mt-6 rounded-full border border-purple-300/40 bg-purple-500/15 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white transition-all duration-500 hover:scale-105 hover:bg-purple-400/25 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)]"
>
  Fill Out Guidance Form →
</button> 

  <p className="mt-4 text-xs text-white/40">
    You will be guided to scheduling immediately after.
  </p>
</div>  
</div>  
)} 

    {/* About Me */}
{activeView === "about" && ( 
 <div className="relative z-20 min-h-screen overflow-y-auto bg-black/70 backdrop-blur-md">
     <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 gap-6 px-4 pt-32 pb-12 md:grid-cols-2 md:px-10">
       
      {/* Left side image */}
      <div className="flex h-fit w-full items-start justify-center pt-6 md:sticky md:top-10">
       <img
           src="/about-me.jpg"
           alt="About Me"
           className="h-[80vh] w-auto rounded-2xl border border-white/20 object-contain shadow-2xl"
        />
   </div>  

      {/* Right side text */}
      <div className="flex flex-col text-white">
        <h2 className="mb-6 text-4xl font-semibold tracking-tight">About Me</h2>

        <div className="space-y-4 text-base leading-relaxed text-gray-300">
          <p>Hello, my name is Judson Parker.</p>

          <p>
            I am not here as anything above anyone else. I am just a regular person who has gone through real experiences that forced me to grow.
          </p>

          <p>
            I am originally from Montgomery, Alabama. After graduating high school, I joined the United States Marine Corps and was stationed at Camp Pendleton in San Diego, where I served four years in the infantry and deployed on the 15th MEU. After being honorably discharged, I chose to stay in San Diego because it felt like home.
          </p>

          <p>
            After the military, I went back to school. I started in mechanical engineering before transitioning into finance. During that time, my life took a serious turn. I experienced betrayal from people I trusted deeply, and it pushed me into one of the lowest points I have ever faced.
          </p>

          <p>But that moment changed everything.</p>

          <p>
            In the darkest moments, and trust me I had some dark ones, I chose to move through it with love. What came out of that period was a complete internal shift into awakeneing. 
          </p>

          <p>That experience is what led me here.</p>

          <p>
            I offer spiritual guidance from lived experience and my experience with Divine Intelligence. My goal is to help people find clarity, alignment and stability within themselves so they can move through life with more direction, happiness, and content. 
          </p>

          <p>
            I believe your internal foundation determines everything else. Your decisions, your relationships and your direction all come from that foundation. When it is solid, everything else begins to align.
          </p>

            I do not judge nor care what belief system you have or if you are religious or athiest. I respect every and all belief systems and usually looking forward to learning something about them I didnt know.
          <p>

            I am deeply interested in philosophy, spirituality, theology, and mythology because I believe there are underlying truths present across all of them. I love fitness, health, wellness, food, taking walks, going to the beach, grabbing coffee, and good conversation with friends. I also model and paint, both of which I love because they are creative ways of expressing your inner state.
          </p>

          <p>At the core of everything I do is a simple principle.</p>

          <p>
            Treat others with the same level of awareness and respect that you would want for yourself. Love yourself and love everyone else. 
          </p>

          <p>
            Because whether people realize it or not, we are far more connected than we think.
          </p>

          <p>If you are here, there is a reason.</p>
        </div>

        <button
          onClick={() => {
            resetToHome();
          }}
          className="mt-8 w-fit text-sm text-gray-400 transition hover:text-white"
        >
          ← Back
        </button>
      </div>
    </div>
  </div>
)} 

{activeView === "gallery" && (
  <div className="fixed inset-0 z-20 overflow-y-auto px-6 pb-20 pt-28 text-white">
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-purple-200/60">
          Gallery
        </p>

        <h1 className="mt-3 text-3xl font-light tracking-[0.08em] text-white md:text-5xl">
          Art Gallery
        </h1>

        <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <p className="mx-auto mt-4 max-w-lg text-xs leading-6 text-white/55">
          A curated collection of visionary artwork and visual experiences.
        </p>
      </div>

     <div className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-15 px-4 sm:grid-cols-4">
         {products.map((product: any) => (
          <a
            key={product.node?.id}
            href={product.node?.onlineStoreUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-[20px] border border-white/10 bg-black/35 backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-purple-300/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]"
          >
            <div className="relative h-[220px] overflow-hidden">
              <img
                src={
                  product.node?.featuredImage?.url ||
                  product.node?.images?.edges?.[0]?.node?.url ||
                  "/images/cosmic-ocean-bg.png"
                }
                alt={
                  product.node?.featuredImage?.altText ||
                  product.node?.title
                }
                className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            </div>

            <div className="p-3"> 
              <h2 className="text-lg font-light tracking-[0.08em] text-white">
                {product.node?.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/50">
                {product.node?.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs tracking-[0.08em] text-purple-200">
                  {product.node?.priceRange?.minVariantPrice?.amount
                    ? `$${Number(
                        product.node.priceRange.minVariantPrice.amount
                      ).toFixed(2)}`
                    : ""}
                </p>

                <span className="text-[9px] uppercase tracking-[0.25em] text-white/45 transition group-hover:text-white">
                  View Piece →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={resetToHome}
          className="rounded-full border border-white/15 px-5 py-2 text-[10px] uppercase tracking-[0.25em] text-white/60 transition hover:border-white/40 hover:text-white"
        >
          ← Back
        </button>
      </div>
    </div>
  </div>
)} 

   {activeView === "modeling" && ( 
  <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 py-24">

    <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-10 tracking-[0.15em] sm:tracking-wide" > 
      Modeling
    </h1>

   {/* SHOOT SECTIONS */}
   <div className="w-full flex flex-col items-center">

  {[ 
    {
      title: "Klerifai Shoot",
      images: [
              "/images/Klerifai Shoot/Klerifai1.jpg",
              "/images/Klerifai Shoot/Klerifai2.jpg",
              "/images/Klerifai Shoot/Klerifai3.jpeg",
              "/images/Klerifai Shoot/Klerifai4.jpeg",
              "/images/Klerifai Shoot/Klerifai5.jpeg",
              "/images/Klerifai Shoot/Klerifai6.jpeg",
              "/images/Klerifai Shoot/Klerifai7.jpeg",
              "/images/Klerifai Shoot/Klerifai8.jpeg",
              "/images/Klerifai Shoot/Klerifai9.jpeg",
              "/images/Klerifai Shoot/Klerifai10.jpeg", 
              ],
     },
     {
      title: "Orange County Fashion Show",
      images: [
              "/images/Orange County Fashion Show/OCFS1.jpg",
              "/images/Orange County Fashion Show/OCFS2.jpg",
               ],
     },
     {
      title: "Fire & Desire Fashion Show",
      images: [
              "/images/Fire & Desire Fashion Show/F&DFS1.JPG",
              "/images/Fire & Desire Fashion Show/F&DFS2.JPG",
              "/images/Fire & Desire Fashion Show/F&DFS4.jpeg",
              "/images/Fire & Desire Fashion Show/F&DFS5.jpeg",
              "/images/Fire & Desire Fashion Show/F&DFS6.jpeg",
              ], 
     },
     {
      title: "Studio Shoot",
      images: [
              "/images/Studio Shoot/SS1.PNG",
              "/images/Studio Shoot/SS2.PNG",
              "/images/Studio Shoot/SS3.PNG",
              "/images/Studio Shoot/SS4.PNG",
              "/images/Studio Shoot/SS5.PNG",
              "/images/Studio Shoot/SS6.PNG",
              "/images/Studio Shoot/SS7.PNG",
              "/images/Studio Shoot/SS8.PNG",
              "/images/Studio Shoot/SS9.PNG",
              "/images/Studio Shoot/SS10.PNG",
              "/images/Studio Shoot/SS11.PNG",
              "/images/Studio Shoot/SS12.PNG",
              "/images/Studio Shoot/SS13.PNG",
              "/images/Studio Shoot/SS14.PNG",
              "/images/Studio Shoot/SS15.PNG",
              "/images/Studio Shoot/SS16.PNG",
              "/images/Studio Shoot/SS17.PNG",
              "/images/Studio Shoot/SS18.PNG",
              "/images/Studio Shoot/SS19.PNG",
              ], 
     },
     {
      title: "Farm Shoot",
      images: [
              "/images/Farm Shoot/Farmshoot1.JPG",
              "/images/Farm Shoot/Farmshoot2.JPG",
              "/images/Farm Shoot/Farmshoot3.JPG",
              "/images/Farm Shoot/Farmshoot4.JPG",
              "/images/Farm Shoot/Farmshoot5.JPG",
              ],  
     },

     ].map((shoot) => (

    <div key={shoot.title} className="mb-20 w-full">

      {/* TITLE */}
      <h2 className="mb-6 text-center text-sm uppercase tracking-[0.4em] text-white/60">
        {shoot.title} 
      </h2>  

    {/* CAROUSEL */} 
      <div className="relative w-full max-w-7xl overflow-hidden mx-auto">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-black/80 to-transparent" />
        
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-black/80 to-transparent" />

        <div className="overflow-x-auto overflow-y-hidden no-scrollbar px-2 scroll-smooth">
          
          <div className="flex w-max max-w-none gap-6 px-10 py-6 snap-x snap-mandatory scroll-smooth">

            {shoot.images.map((src, i) => (
              
          <div
            key={src}
            onClick={() => {
             const imageIndex = allImages.indexOf(src);

             if (imageIndex !== -1) {
             setSelectedImageIndex(imageIndex);
           }
          }}
           className="group cursor-pointer snap-center shrink-0
           w-[220px] sm:w-[260px] md:w-[320px]
           h-[330px] sm:h-[390px] md:h-[460px]
           rounded-[1.5rem] overflow-hidden border border-white/15 bg-black/30 shadow-2xl
           transition duration-500 hover:scale-[1.03] hover:border-purple-300/40
           hover:shadow-[0_0_40px_rgba(168,85,247,0.35)] hover:-translate-y-1"
          >  

               <div className="relative h-full w-full">
               <Image
                  src={src}
                  alt={`${shoot.title}-${i}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 320px" 
                  className="object-cover object-center opacity-95 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
             />
              </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  ))} 

 {/* LIGHTBOX */}
{selectedImageIndex !== null && (
  <div
    onClick={() => setSelectedImageIndex(null)}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
  >
    <button
      onClick={(e) => {
        e.stopPropagation();
        setSelectedImageIndex(null);
      }}
      className="absolute right-5 top-5 z-[220] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
    >
      ×
    </button>

  <div
  onClick={(e) => e.stopPropagation()}
  className="relative h-[85vh] w-[92vw] sm:h-[90vh] sm:w-[90vw]"
>
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedImageIndex(
        selectedImageIndex === 0
          ? allImages.length - 1
          : selectedImageIndex - 1
      );
    }}
    className="absolute left-3 top-1/2 z-[210] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
  >
    ‹
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedImageIndex(
        selectedImageIndex === allImages.length - 1
          ? 0
          : selectedImageIndex + 1
      );
    }}
    className="absolute right-3 top-1/2 z-[210] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
  >
    ›
  </button>
   <div className="absolute bottom-4 left-1/2 z-[210] -translate-x-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm tracking-[0.2em] text-white/70 backdrop-blur-md">
     {selectedImageIndex + 1} / {allImages.length}
   </div>  

  <Image
    src={allImages[selectedImageIndex]}
    alt="Expanded modeling image"
    fill
    sizes="90vw"
    className="rounded-3xl object-contain shadow-[0_0_80px_rgba(168,85,247,0.35)]"
  />
</div> 
  </div>
)} 

</div> 

   {/* BACK BUTTON */}
<button
  type="button"
 onClick={() => setActiveView("home")} 
  className="mt-12 text-white/85 hover:text-white transition"
>
  ← Back
</button>
</div>
)} 

   {activeView === "guidance" ? ( 
     <div
       className="fixed inset-0 z-40 overflow-y-auto px-6 pb-24 pt-32 text-white transition-opacity duration-500 opacity-100"

   >
    <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
      {/* SECTION 1 */}
      <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-purple-300/20 p-10">
        <h2 className="text-4xl font-light tracking-wide text-white md:text-5xl">
          What is Spiritual Guidance?
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/90">
         We are divine beings temporarily having a human experience.
         Divine consciousness embodied in matter. Your spiritual foundation 
         is what every other aspect of your life is built on. When this foundation 
         is strong, you can begin to master your mind and your reality. 
         Spiritual Guidance helps you expand your consciousness, awareness,
         and belief potential. The goal is to help you step into your highest 
         timeline, connect with your higher self, activate all your chakras and create inner harmony.
         Spiritual Guidance is a one on one virtual session designed to meet you
         exactly where you are on your path, offering clarity, alignment, and 
         deeper insight. The sessions are relaxed, stress free, and informal.
         Wear whatever makes you feel comfortable, whether that is pajamas, sweatpants,
         or anything else. I also teach breathwork and meditation. 
        </p>
      </div>

      {/* SECTION 2 */}
      <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-purple-300/20 p-10">
        <h2 className="text-4xl font-light tracking-wide text-white md:text-5xl">
          Why Spiritual Guidance Makes You More Successful
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/90">
          Success begins with alignment. When your mind, energy, and intentions are clear,
          you make better decisions, move with more confidence, and stop wasting energy
          on paths that pull you away from your purpose. Spiritual Guidance helps you
          identify internal blocks, strengthen your awareness, and reconnect with the
          version of yourself that is capable of creating the life you are meant to live.
        </p>
      </div>

      {/* SECTION 3 */}
      <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-purple-300/20 p-10">
        <h2 className="text-4xl font-light tracking-wide text-white md:text-5xl">
          How to Approach Spiritual Guidance
        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/90">
          Approach with an open heart and an open mind. Give yourself grace, patience,
          and honesty as you move through the session. This is a sacred space free from
          judgment and outside negativity. You do not need to have everything figured out.
          Come as you are. I am here to help you connect with your inner self, reconnect
          with Source, and remember who you truly are.
        </p>
      </div>

    {/* Form Step */}
<div className="mt-10 flex flex-col items-center gap-4">

<button
  type="button"
  onClick={goToGuideForm} 
  className="rounded-full border border-purple-300/40 bg-purple-500/10 px-10 py-4 text-xs uppercase tracking-[0.3em] text-white transition-all duration-500 hover:scale-105 hover:bg-purple-400/20 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)] inline-block"
> 
  Fill Out Pre-Alignment Form →
</button> 

<p className="text-xs text-white/40 mt-2 text-center max-w-sm">
  Complete the form before your session to get the most out of your experience.
</p> 
</div> 
      {/* ESSENCE */}
      <div className="mx-auto mt-16 w-full max-w-5xl px-6">
        <p className="text-xs uppercase tracking-[0.6em] text-white/50">
          THE ESSENCE
        </p>

        <div className="mx-auto mt-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {[
            ["✦", "Clarity", "Gain insight into your stream and what may be causing blocks."],
            ["◎", "Alignment", "Reconnect with your inner wisdom and what truly matters."],
            ["☾", "Power", "Learn to connect with Source and unlock your divine gifts."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="group rounded-2xl border border-white/10 bg-black/30 p-6 text-left backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-purple-300/40 hover:bg-white/5 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]"
            >
              <div className="mb-4 text-2xl text-purple-300 transition-all duration-500 group-hover:text-purple-200 group-hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                {icon}
              </div>

              <p className="text-sm uppercase tracking-widest text-white">
                {title}
              </p>

              <p className="mt-4 text-sm leading-6 text-white/55">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW TO APPROACH */}
      <div className="mx-auto mt-16 w-full max-w-5xl px-6">
        <p className="text-xs uppercase tracking-[0.6em] text-white/50">
          HOW TO APPROACH
        </p>

        <div className="mx-auto mt-10 grid w-full grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {[
            ["1", "Set Intention"],
            ["2", "Bring Questions"],
            ["3", "Be Open"],
            ["4", "Integrate"],
          ].map(([num, title]) => (
            <div key={num} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-purple-300/40 bg-purple-500/20 text-sm text-white">
                {num}
              </div>

              <p className="text-xs uppercase tracking-[0.3em] text-white">
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
         resetToHome();
        }}
        className="mt-12 block text-sm text-white/50 transition hover:text-white"
      >
        ← Back
      </button>
    </div>
  </div>
) : null} 

{activeView === "contact" && ( 
  <div className="absolute inset-0 z-40 px-6 pt-32 pb-24 text-white">

    <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-purple-300/20 bg-black/30 px-10 py-14 text-center backdrop-blur-md shadow-[0_0_60px_rgba(168,85,247,0.16)]">

     <h2 className="text-5xl font-light tracking-[0.08em] text-white md:text-6xl">
  Contact
</h2>

<p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55">
  For inquiries, collaborations, or guidance requests, reach out below.
</p>

{/* Email */}
<div className="mt-14">
  <p className="text-xs uppercase tracking-[0.35em] text-purple-200/60">
    Email
  </p>

  <a
    href="mailto:tjudsonparker@gmail.com"
    className="mt-4 block text-base text-purple-300 transition hover:text-purple-200 hover:underline"
  >
    tjudsonparker@gmail.com  
  </a>
</div>

{/* Divider */}
<div className="mx-auto mt-12 h-px w-16 bg-purple-300/30" />

{/* Socials */}
<div className="mt-10">
  <p className="text-xs uppercase tracking-[0.35em] text-purple-200/60">
    Social
  </p>

  <div className="mt-6 flex flex-col items-center gap-4 text-sm">

    <a
      href="https://instagram.com/tjudsonparker"
      target="_blank"
      className="flex items-center gap-3 text-white/60 transition hover:text-white"
    >
      <FaInstagram className="text-lg" />
      @tjudsonparker
    </a>

    <a
      href="https://tiktok.com/@judsonparker8"
      target="_blank"
      className="flex items-center gap-3 text-white/60 transition hover:text-white"
    >
      <FaTiktok className="text-lg" />
      @judsonparker8
    </a>

  </div>
</div>

{/* Back */}
<button
  onClick={() => {
    resetToHome();
  }}
  className="mt-14 text-sm text-white/40 transition hover:text-white"
>
  ← Back 
</button> 
    </div>
  </div>
)} 
     

   </main>
 </>
);
} 
export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
} 