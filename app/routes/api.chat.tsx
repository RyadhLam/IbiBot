import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const message = formData.get("message");

  // Réponse statique simple
  return json({
    response: "Je suis un assistant simple. OpenAI n'est pas encore configuré."
  });
}; 