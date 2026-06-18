import { z } from "zod";

const MIN_DAYS = 7;
const MAX_YEARS = 15;

export const simulatorSchema = z
  .object({
    cryptoId: z.string().min(1, "Sélectionnez une cryptomonnaie"),
    cryptoName: z.string().min(1),
    cryptoSymbol: z.string().min(1),
    amount: z
      .number()
      .positive("Le montant doit être supérieur à 0")
      .max(10_000_000, "Montant trop élevé"),
    frequency: z.enum(["one-shot", "daily", "weekly", "monthly"]),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const now = new Date();

    if (isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date de début invalide",
        path: ["startDate"],
      });
      return;
    }
    if (isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date de fin invalide",
        path: ["endDate"],
      });
      return;
    }
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de fin doit être après la date de début",
        path: ["endDate"],
      });
    }
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < MIN_DAYS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sélectionnez une période d'au moins 7 jours",
        path: ["endDate"],
      });
    }
    if (end > now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La date de fin ne peut pas être dans le futur",
        path: ["endDate"],
      });
    }
    const diffYears = diffDays / 365;
    if (diffYears > MAX_YEARS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `La période ne peut pas dépasser ${MAX_YEARS} ans`,
        path: ["endDate"],
      });
    }
  });

export type SimulatorFormInput = z.infer<typeof simulatorSchema>;
