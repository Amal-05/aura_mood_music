import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || "").trim());

export interface PlaylistSuggestion {
  title: string;
  description: string;
  source: "Spotify" | "YouTube" | "AURA Curated";
  tracks: number;
  coverUrl: string;
  moodTags: string[];
  searchUrl: string;
  youtubeId?: string;
}

const STATIC_FALLBACKS: Record<string, any> = {
  happy: {
    playlists: [
      { title: "Sunshine Beats", description: "Upbeat melodies to brighten your digital workspace.", source: "AURA Curated", tracks: 24, moodTags: ["Vibrant", "Upbeat"], searchQuery: "happy morning beats", youtubeId: "y6Sxv-sUYtM" },
      { title: "Electric Joy", description: "High-energy synth waves for maximum positivity.", source: "Spotify", tracks: 18, moodTags: ["Energetic", "Synth"], searchQuery: "positive synthwave", youtubeId: "5qap5aO4i9A" }
    ],
    quote: "Happiness is the highest form of productivity."
  },
  calm: {
    playlists: [
      { title: "Deep Forest Echoes", description: "Nature-infused ambient tracks for deep focus.", source: "AURA Curated", tracks: 12, moodTags: ["Nature", "Ambient"], searchQuery: "forest ambient meditation", youtubeId: "jfKfPfyJRdk" },
      { title: "Soft Piano Rain", description: "Gentle keys and soft rainfall for ultimate tranquility.", source: "AURA Curated", tracks: 15, moodTags: ["Piano", "Peaceful"], searchQuery: "rainy piano study", youtubeId: "6p6pW5vP1oU" }
    ],
    quote: "In the midst of movement and chaos, keep stillness inside of you."
  },
  melancholy: {
    playlists: [
      { title: "Midnight Solitude", description: "Reflective melodies for late-night introspection.", source: "AURA Curated", tracks: 10, moodTags: ["Nocturnal", "Deep"], searchQuery: "melancholic piano", youtubeId: "79kpoG4mSsc" },
      { title: "Rainy Day Dreams", description: "Lofi textures and soft hums for rainy afternoons.", source: "Spotify", tracks: 20, moodTags: ["Lofi", "Rainy"], searchQuery: "lofi hip hop for sad days", youtubeId: "DWcUYeeE1W0" }
    ],
    quote: "The soul has its own rhythm, even in the shadows."
  },
  energetic: {
    playlists: [
      { title: "Cyberpunk Rush", description: "Fast-paced digital beats for high-intensity work.", source: "AURA Curated", tracks: 30, moodTags: ["Neon", "Fast"], searchQuery: "cyberpunk edm mix", youtubeId: "219920150" },
      { title: "Digital Cardio", description: "Rhythmic basslines to keep your momentum high.", source: "YouTube", tracks: 25, moodTags: ["Bass", "Rhythm"], searchQuery: "high energy workout mix", youtubeId: "L8_fA8-8F_E" }
    ],
    quote: "Action is the foundational key to all success."
  }
};

export async function getMoodMusicRecs(mood: string, energy: number): Promise<{ playlists: PlaylistSuggestion[]; quote: string }> {
  // Normalize mood to lowercase to match fallback keys
  const normalizedMood = mood.toLowerCase();

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
    - youtubeId (A stable 11-character YouTube video ID for this vibe)
    - dailyQuote (A single motivational quote for the day)

    Return ONLY a JSON object with two keys: "playlists" (the array) and "dailyQuote" (a single string).
    Example JSON:
    {
      "playlists": [
        {
          "title": "Cyber Zen",
          "description": "Lofi beats meets glitch-hop for total immersion.",
          "source": "AURA Curated",
          "tracks": 12,
          "moodTags": ["Focus", "Digital"],
          "searchQuery": "lofi hip hop study beats",
          "youtubeId": "jfKfPfyJRdk"
        }
      ],
      "dailyQuote": "Transition your energy into flow."
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }, { apiVersion: 'v1' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response");

    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);
    
    return {
      playlists: (data.playlists || []).map((s: any, i: number) => ({
        ...s,
        searchUrl: s.source === "YouTube" 
          ? `https://www.youtube.com/results?search_query=${encodeURIComponent(s.searchQuery || s.title)}`
          : `https://open.spotify.com/search/${encodeURIComponent(s.searchQuery || s.title)}`,
        coverUrl: `https://picsum.photos/seed/${s.title.replace(/\s/g, '')}${i}/400/225`
      })),
      quote: data.dailyQuote || "Your rhythm, your rules."
    };
  } catch (error) {
    console.error("Gemini Error, using fallback:", error);
    const fallback = STATIC_FALLBACKS[normalizedMood] || STATIC_FALLBACKS['calm'];
    
    return {
      playlists: fallback.playlists.map((s: any, i: number) => ({
        ...s,
        searchUrl: `https://open.spotify.com/search/${encodeURIComponent(s.searchQuery)}`,
        coverUrl: `https://picsum.photos/seed/${s.title.replace(/\s/g, '')}${i}/400/225`
      })),
      quote: fallback.quote
    };
  }
}
