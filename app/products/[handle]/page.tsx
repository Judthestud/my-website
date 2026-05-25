import { redirect } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  redirect(`https://v0wmpa-a1.myshopify.com/products/${handle}`);
} 