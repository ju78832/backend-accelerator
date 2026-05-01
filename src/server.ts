import express, { Request, Response } from "express";
import { PrismaClient } from "./generated/prisma/index";
import { z } from "zod";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------------
// 1. Zod Backend Validation Schema (Mirroring your Frontend)
// -------------------------------------------------------------------------
const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  grade: z.enum(["9", "10", "11", "12"], { message: "Select a grade" }),
  subjects: z
    .array(
      z.enum(["Mathematics", "Physics", "Chemistry", "Biology", "Science"]),
    )
    .min(1, "Select at least one subject"),
  address: z.string().trim().min(5, "Please enter your address").max(300),
  location: z.enum(["Baskhari", "Tanda", "Nyori"], {
    message: "Select a location",
  }),
  message: z.string().trim().max(500).optional().nullable(),
});

// -------------------------------------------------------------------------
// 2. Registration API Route
// -------------------------------------------------------------------------
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    // Validate request body against backend Zod schema
    const parsedBody = registrationSchema.safeParse(req.body);

    if (!parsedBody.success) {
      // Return structured validation errors matching what the frontend expects
      const formattedErrors: Record<string, string> = {};
      parsedBody.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      return res.status(400).json({ errors: formattedErrors });
    }

    const {
      fullName,
      email,
      phone,
      grade,
      subjects,
      address,
      location,
      message,
    } = parsedBody.data;

    // Check if the email has already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: { phone }, // Assuming phone number is unique for registration. Change to email if email should be unique.
    });

    if (existingRegistration) {
      return res.status(400).json({
        errors: { email: "This email address is already registered." },
      });
    }

    // Map string values to their respective Database Enums where mapped
    const gradeMapped = `G${grade}` as "G9" | "G10" | "G11" | "G12";
    const subjectsMapped = subjects.map((s) => s);

    // Save to PostgreSQL via Prisma
    const registration = await prisma.registration.create({
      data: {
        fullName,
        phone,
        grade: gradeMapped,
        location,
        subjects: subjectsMapped as any, // Cast to any to align Prisma generated types safely
        address,
        message: message || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: registration,
    });
  } catch (error) {
    console.error("Backend Error on Register Route:", error);
    return res.status(500).json({
      error: "An unexpected server error occurred. Please try again later.",
    });
  }
});

// Start server and auto-retry on next port if the default is busy.
const startPort = Number(process.env.PORT) || 3000;

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`Collider Academy Backend active on http://localhost:${port}`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`Port ${port} is in use, retrying on ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    console.error("Failed to start server:", error);
    process.exit(1);
  });
};

startServer(startPort);
