import { Project } from "../models/Project.js";

const extractUsernameFromUrl = (input) => {
  if (!input) return null;
  return input.split("/").pop();
};

export const addCandidate = async (req, res) => {
  try {
    
    const { name, username } = req.body;

  
    if (!name || !username) {
      return res.status(400).json({
        success: false,
        message: "Name and GitHub username are required.",
      });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const cleanUsername = extractUsernameFromUrl(username);

    const githubUrl = `https://github.com/${cleanUsername}`;

    const candidate = {
      name,
      githubUrl,
      username: cleanUsername,
      githubData: null,
      analysis: null,
      score: 0,
    };

    project.candidates.push(candidate);
    await project.save();

    
    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error adding candidate:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while adding the candidate.",
    });
  }
};


export const addCandidatesBulk = async (req, res) => {
  try {
    const { candidates } = req.body;

    if (!Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({
            success: false,
            message: "A non-empty array of candidates is required."
        });
    }

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const added = [];

    for (const c of candidates) {
      
      if (!c.name || !c.githubUrl) {
      
          console.warn(`Skipping invalid candidate in bulk add: ${JSON.stringify(c)}`);
          continue;
      }

      const username = c.githubUrl.split("/").pop();

    
      if (!project.candidates.some(p => p.username === username) && !added.some(a => a.username === username)) {
        const candidate = {
          name: c.name,
          githubUrl: c.githubUrl,
          username,
          githubData: null,
          analysis: null,
          score: 0,
        };

        project.candidates.push(candidate);
        added.push(candidate);
      }
    }

    await project.save();

    res.status(201).json({
      success: true,
      message: "Candidates added successfully",
      project, // Return the updated project
    });
  } catch (error) {
    console.error("Error adding candidates in bulk:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred during bulk add.",
    });
  }
};


export const updateCandidate = async (req, res) => {
  try {
    const { projectId, candidateId } = req.params;
    const { name, username } = req.body;

    // Validate that the required fields are present
    if (!name || !username) {
        return res.status(400).json({
            success: false,
            message: "Name and GitHub username are required."
        });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const candidate = project.candidates.id(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Update fields and reconstruct the githubUrl to stay consistent
    const cleanUsername = extractUsernameFromUrl(username);
    candidate.name = name;
    candidate.username = cleanUsername;
    candidate.githubUrl = `https://github.com/${cleanUsername}`;

    await project.save();

    res.json({
      success: true,
      project, // Return the updated project
    });
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating the candidate.",
    });
  }
};


export const deleteCandidate = async (req, res) => {
  try {
    const { projectId, candidateId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    const candidate = project.candidates.id(candidateId);

    if (!candidate) {
        return res.status(404).json({
            success: false,
            message: "Candidate not found in this project"
        });
    }

    candidate.deleteOne();
    await project.save();

    res.json({
      success: true,
      message: "Candidate deleted successfully",
      project, 
    });
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while deleting the candidate.",
    });
  }
};


export const getCandidates = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      candidates: project.candidates,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while fetching candidates.",
    });
  }
};
