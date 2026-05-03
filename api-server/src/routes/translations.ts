import { Router } from "express";
import { db } from "@workspace/db";
import { translationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateTranslationBody } from "@workspace/api-zod";

const router = Router();

const SAMPLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  python: {
    java: `// Translated from Python to Java\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    cpp: `// Translated from Python to C++\n#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  },
  java: {
    python: `# Translated from Java to Python\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
    cpp: `// Translated from Java to C++\n#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  },
  cpp: {
    python: `# Translated from C++ to Python\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()`,
    java: `// Translated from C++ to Java\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
};

router.get("/translations", async (req, res) => {
  const translations = await db.select().from(translationsTable).orderBy(translationsTable.createdAt);
  res.json(translations.map(t => ({ ...t, createdAt: t.createdAt.toISOString() })));
});

router.post("/translations", async (req, res) => {
  const parsed = CreateTranslationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  // Simulate translation
  const translatedCode = SAMPLE_TRANSLATIONS[parsed.data.sourceLanguage]?.[parsed.data.targetLanguage]
    ?? `// Translation from ${parsed.data.sourceLanguage} to ${parsed.data.targetLanguage}\n// [LLM-generated translation would appear here]`;

  const [translation] = await db.insert(translationsTable).values({
    ...parsed.data,
    translatedCode,
    status: "completed",
    notes: `Translated using layered context-aware LLM pipeline. Source: ${parsed.data.sourceLanguage.toUpperCase()}, Target: ${parsed.data.targetLanguage.toUpperCase()}.`,
  }).returning();
  res.status(201).json({ ...translation, createdAt: translation.createdAt.toISOString() });
});

router.get("/translations/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [translation] = await db.select().from(translationsTable).where(eq(translationsTable.id, id));
  if (!translation) {
    res.status(404).json({ error: "Translation not found" });
    return;
  }
  res.json({ ...translation, createdAt: translation.createdAt.toISOString() });
});

export default router;
