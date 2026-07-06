
import { Project } from "../models/Project.js";

export const getDashboardAnalytics = async (
  req,
  res
) => {
  try {
    const projects = await Project.find({
      user: req.user.id,
    });

    let totalProjects = projects.length;
    let totalCandidates = 0;
    let totalAnalyses = 0;
    let totalScore = 0;
    let topScore = 0;
    let strongMatches = 0;
    let weakMatches = 0;

    const recentActivity = [];

    projects.forEach((project) => {
      // Add project creation to recent activity
      recentActivity.push({
        message: `Project "${project.name}" was created`,
        date: project.createdAt || new Date(),
      });

      totalCandidates +=
        project.candidates.length;

      project.candidates.forEach(
        (candidate) => {
        
          if (candidate.analysis) {
            totalAnalyses++;

            const score =
              candidate.analysis.score || 0;

            totalScore += score;

            if (score > topScore) {
              topScore = score;
            }

            if (score >= 75) {
              strongMatches++;
            }

            if (score < 50) {
              weakMatches++;
            }
          }

          // Recent activity
          recentActivity.push({
            message: `Candidate "${candidate.name}" added to ${project.name}`,
            date:
              candidate.createdAt ||
              new Date(),
          });
        }
      );
    });

    const averageScore =
      totalAnalyses > 0
        ? Math.round(
            totalScore /
              totalAnalyses
          )
        : 0;

    recentActivity.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    res.status(200).json({
      totalProjects,
      totalCandidates,
      totalAnalyses,
      averageScore,
      topScore,
      strongMatches,
      weakMatches,
      recentActivity:
        recentActivity.slice(0, 5),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to load dashboard analytics",
    });
  }
};
