import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  clientId: z.string().min(1, "Client is required"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  budget: z.number().positive("Budget must be a positive number"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z.enum(["PLANNED", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"]).default("PLANNED"),
});

export const assignTeamMemberSchema = z.object({
  userId: z.string().min(1, "User is required"),
  roleOnProject: z.string().min(1, "Role on project is required"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type AssignTeamMemberInput = z.infer<typeof assignTeamMemberSchema>;
