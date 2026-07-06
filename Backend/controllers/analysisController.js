import { Project } from "../models/Project.js";
import { getGithubProfile } from "../services/githubService.js";
import { analyzeCandidate } from "../services/groqService.js";


export const runAnalysis = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const analysisPromises = project.candidates.map(async (candidate) => {
      try {
        const username = new URL(candidate.githubUrl).pathname
          .split("/")
          .filter(Boolean)[0];

        if (!username) throw new Error("Invalid GitHub URL");

      
        const github = await getGithubProfile(username);

        if (!github) throw new Error("GitHub fetch failed");

      
        const analysis = await analyzeCandidate(project, github);

        if (!analysis) throw new Error("AI analysis failed");

  
        candidate.username = username;
        candidate.githubData = null; // 
        candidate.analysis = analysis;
        candidate.score = analysis.score || 0;

        return {
          name: candidate.name,
          username,
          score: candidate.score,
          success: true,
        };
      } catch (error) {
        console.error(`❌ Failed for ${candidate.name}:`, error.message);

        return {
          name: candidate.name,
          score: 0,
          success: false,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(analysisPromises);

    
    project.candidates.sort((a, b) => b.score - a.score);

    await project.save();

  
    const cleanRanking = project.candidates.map((c) => ({
      name: c.name,
      username: c.username,
      score: c.score,
      analysis: c.analysis,
    }));

    res.status(200).json({
      success: true,
      message: "Analysis completed",
      ranking: cleanRanking,
      results,
    });
  } catch (error) {
    console.error("❌ Analysis Controller Error:", error);
    next(error);
  }
};


export const getRanking = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const sorted = project.candidates
      .sort((a, b) => b.score - a.score)
      .map((c) => ({
        name: c.name,
        username: c.username,
        score: c.score,
        analysis: c.analysis,
      }));

    res.status(200).json({
      success: true,
      ranking: sorted,
    });
  } catch (error) {
    next(error);
  }
};