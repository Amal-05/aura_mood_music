import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PlaylistSuggestion {
  title: string;
  description: string;
  source: "Spotify" | "YouTube" | "AURA Curated";
  tracks: number;
  coverUrl: string;
  moodTags: string[];
  searchUrl: string;
}

export async function getMoodMusicRecs(mood: string, energy: number): Promise<{ playlists: PlaylistSuggestion[]; quote: string }> {
  const prompt = `
    Identify 3 highly specific music playlist ideas for a user feeling "${mood}" with an energy level of ${energy}/100.
    For each playlist, provide:
    - title
    - description (max 100 chars)
    - source (either "Spotify", "YouTube", or "AURA Curated")
    - tracks (number between 8 and 30)
    - moodTags (2 specific tags like "Neon", "Calm", "Cyberpunk", "Mellow")
    - moodQuote (A short motivational quote related to this mood)
    - searchQuery (A specific search term to find this vibe on Spotify/YouTube)

    Return ONLY a JSON object with two keys: "playlists" (the array) and "dailyQuote" (a single string).
    Example JSON:
    {
      "playlists": [
        {
          "title": "Cyber Zen",
          "description": "Lofi beats meets glitch-hop for total immersion.",
          "source": "AURA Curated",
          "tracks": 12,
          "moodTags": ["Focus", "Digital"]
        }
      ],
      "dailyQuote": "Transition your energy into flow."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) return { playlists: [], quote: "" };
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);
    
    return {
      playlists: (data.playlists || []).map((s: any, i: number) => {
        const query = s.searchQuery || s.title;
        const searchUrl = s.source === "YouTube" 
          ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
          : `https://open.spotify.com/search/${encodeURIComponent(query)}`;
          
        return {
          ...s,
          searchUrl,
          coverUrl: `https://picsum.photos/seed/${s.title.replace(/\s/g, '')}${i}/400/225`
        };
      }),
      quote: data.dailyQuote || "Your rhythm, your rules."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { playlists: [], quote: "" };
  }
}
