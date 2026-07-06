import axios from "axios";

export const analyzeCandidate = async (project, github) => {
  try {
    const prompt = `
You are an expert technical recruiter AI.

PROJECT REQUIREMENTS:
${project.requirements.join(", ")}

CANDIDATE DATA:

Languages:
${JSON.stringify(github.languages)}

Top Repositories (TOP 20 ONLY):
${JSON.stringify(
  (github.topRepos || []).slice(0, 20).map(repo => ({
    name: repo.name,
    language: repo.language,
    stars: repo.stargazers_count || 0,
    description: repo.description || ""
  }))
)}

Return ONLY valid JSON:

{
  "score": 0,
  "verdict": "",
  "summary": "",
  "strengths": [],
  "gaps": []
}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a strict JSON-only recruiter AI."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    const text = response.data.choices[0].message.content;

    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(clean);

    return {
      score: parsed.score || 0,
      verdict: parsed.verdict || "Unknown",
      summary: parsed.summary || "",
      strengths: parsed.strengths || [],
      gaps: parsed.gaps || []
    };
  } catch (error) {
    console.error("❌ Groq Error:", error.response?.data || error.message);

    return {
      score: 0,
      verdict: "Weak",
      summary: "AI analysis failed due to Groq error.",
      strengths: [],
      gaps: ["AI service unavailable"]
    };
  }
};