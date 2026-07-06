import express from "express";
import { Project } from "../models/Project.js";

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, user: req.user._id });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const projectToUpdate = await Project.findById(req.params.id);
    if (!projectToUpdate) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (projectToUpdate.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};