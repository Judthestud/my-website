export default function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-purple-300">
          Product
        </p>

        <h1 className="mt-4 text-4xl font-light">
          {params.handle.replaceAll("-", " ")}
        </h1>

        <a
          href="/?step=gallery"
          className="mt-8 inline-block rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.25em]"
        >
          Back to Gallery
        </a>
      </div>
    </main>
  );
} 