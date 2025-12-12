import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GeminiService } from '../services/gemini.service';

const prisma = new PrismaClient();

export const getProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
};

export const getProjectRisk = async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({ where: { id: Number(id) } });

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Logic: Budget Usage vs Progress
  const budgetUsedPercent = (project.actualCost / project.budget) * 100;

  let riskScore = 0;
  let riskLevel = "Low";

  // If we spent more % of money than % of work completed (with 20% buffer) -> HIGH RISK
  if (budgetUsedPercent > project.progress + 20) {
    riskScore += 50; // Major penalty
  }

  // Delay Check (Mock logic based on dates)
  const today = new Date();
  if (today > new Date(project.endDate) && project.progress < 100) {
    riskScore += 30;
  }

  // Determine Level
  if (riskScore > 60) riskLevel = "Critical";
  else if (riskScore > 30) riskLevel = "High";
  else riskLevel = "Medium"; // Default baseline risk

  // Optional: Save to DB or just return
  res.json({
    projectId: project.id,
    riskScore: riskScore,
    riskLevel: riskLevel,
    details: {
      budgetUsed: budgetUsedPercent.toFixed(1) + '%',
      progress: project.progress + '%'
    }
  });
};

export const getProjectAiInsight = async (req: Request, res: Response) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) } });

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Fetch or calculate risk (simplified)
  const risk = { riskScore: 75, riskLevel: 'High', factors: ['Budget Overrun'] };

  const insight = await GeminiService.analyzeProjectHealth(project, risk);
  res.json({ insight });
};
