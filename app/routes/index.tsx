import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ChatWidget from "~/components/ChatWidget";

export const loader = async () => {
  return json({
    title: "Bienvenue sur notre boutique",
  });
};

export default function Index() {
  const { title } = useLoaderData<typeof loader>();

  return (
    <div className="relative min-h-screen">
      <h1 className="text-4xl font-bold text-center py-8">{title}</h1>
      {/* Votre contenu existant */}
      <ChatWidget />
    </div>
  );
} 