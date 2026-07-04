import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
// @ts-ignore - pdf-parse often lacks strong TypeScript definitions
import pdf from 'pdf-parse';

// Configure Multer to store the file temporarily in RAM (Memory)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported for now!'));
    }
  },
});

export const parseResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    // Extract text from the PDF buffer in memory
    const pdfData = await pdf(req.file.buffer);
    const rawText = pdfData.text;

    // --- MOCK JSON RESPONSE ---
    // Instead of calling the LLM, we generate a perfectly structured mock JSON
    // so the frontend form can auto-fill successfully. We dump the raw text into
    // the summary so you can verify the extraction worked.
    
    const mockParsedData = {
      personalInfo: {
        firstName: "Auto-Filled",
        lastName: "User",
        email: "autofill@example.com",
        phone: "+1 234 567 8900",
        github: "https://github.com/autofilled",
        linkedin: "https://linkedin.com/in/autofilled",
      },
      summary: `[RAW TEXT EXTRACTED]:\n\n${rawText.substring(0, 500)}... (truncated for preview)`,
      skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"],
      experience: [
        {
          company: "Tech Corp",
          position: "Software Engineer",
          startDate: "2021-01",
          endDate: "Present",
          description: "Built awesome scalable applications.",
        }
      ],
      education: [
        {
          institution: "University of Technology",
          degree: "B.S. Computer Science",
          year: "2020",
        }
      ]
    };

    return res.status(200).json({
      message: 'Resume parsed successfully (Mock Mode)',
      data: mockParsedData,
    });

  } catch (error: any) {
    if (error.message === 'Only PDF files are supported for now!') {
       return res.status(400).json({ error: { message: error.message } });
    }
    next(error);
  }
};
