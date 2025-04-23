import { OpenAI } from 'openai';
import { Router } from "@shopify/shopify-app-express";

export const apiRouter = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Endpoint pour traiter les messages via OpenAI
apiRouter.post("/api/chat", async (req, res) => {
  try {
    const { message, shopDomain } = req.body;

    // Récupérer le contexte du magasin (produits, politiques, etc.)
    const shopContext = await getShopContext(shopDomain);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant de service client pour la boutique Shopify ${shopDomain}. 
          Utilise ces informations sur la boutique pour répondre aux questions : ${shopContext}
          Sois professionnel, concis et utile.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    res.json({
      response: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({
      error: "Désolé, je ne peux pas traiter votre demande pour le moment."
    });
  }
});

// Fonction pour récupérer le contexte du magasin
async function getShopContext(shopDomain) {
  // TODO: Implémenter la récupération des données du magasin
  // - Produits populaires
  // - Politiques de livraison
  // - FAQ
  // - etc.
  return "Délai de livraison standard: 3-5 jours ouvrés. Livraison gratuite à partir de 50€.";
} 