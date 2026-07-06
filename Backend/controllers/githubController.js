import { getGithubProfile } from "../services/githubService.js";
import { analyzeCandidate } from "../services/groqService.js";

export const previewGitHub = async (req, res, next) => {
  try {
    const { githubUrl } = req.body;

  
    if (!githubUrl || typeof githubUrl !== 'string') {
      return res.status(400).json({ message: "A valid githubUrl is required." });
    }

    const username = githubUrl.split("/").pop();
    if (!username) {
      return res.status(400).json({ message: "Could not extract username from the provided URL." });
    }

    const data = await getGithubProfile(username);

    
    res.json(data);
  } catch (error) {
    
    next(error);
  }
};

export const analyzeGitHubOnly = async (req, res, next) => {
  try {
    const { githubUrl, requirements } = req.body;

    
    if (!githubUrl || typeof githubUrl !== 'string') {
      return res.status(400).json({ message: "A valid githubUrl is required." });
    }

    if (!requirements || !Array.isArray(requirements)) {
      return res
        .status(400)
        .json({ message: "githubUrl and requirements array are required." });
    }

    const username = githubUrl.split("/").pop();
    if (!username) {
      return res.status(400).json({ message: "Could not extract username from the provided URL." });
    }

    const githubData = await getGithubProfile(username);

    const mockProject = { requirements };

    const analysis = await analyzeCandidate(mockProject, githubData);

    res.json({ message: "GitHub profile analysis complete", analysis });
  } catch (error) {
    next(error);
  }
};

export const getGithubProfileOverview = async (req, res, next) => {
  try {
    const { githubUrl } = req.body;

    if (!githubUrl || typeof githubUrl !== "string") {
      return res
        .status(400)
        .json({ message: "A valid githubUrl in the request body is required." });
    }

    const username = githubUrl.split("/").pop();
    if (!username) {
      return res
        .status(400)
        .json({ message: "Could not extract username from the provided URL." });
    }

    const data = await getGithubProfile(username);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
