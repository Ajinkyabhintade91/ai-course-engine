export interface BlueprintModule {
  moduleId: string;
  slug: string;
  unitId: string;
  unitTitle: string;
  moduleTitle: string;
  difficulty: string;
  subTopics: string[];
  searchQueries: Record<string, string>;
  status: string;
}

export interface Blueprint {
  courseTitle: string;
  courseDescription: string;
  availablePaidPlatforms: string[];
  stages?: string[];
  modules: BlueprintModule[];
}

export interface Citation {
  title: string;
  source: string;
  url: string;
}

export interface Video {
  id: string;
  title: string;
  creator: string;
  platform: string;
  tier: string;
  url: string;
  timingInstruction: string;
  keyTakeaway: string;
}

export interface LabStep {
  stepNumber: number;
  title: string;
  instruction: string;
  hintConceptual: string;
  hintSyntax: string;
  testAssertion: string;
}

export interface InteractiveLab {
  labTitle: string;
  context: string;
  language: 'python' | 'javascript';
  starterCode: string;
  steps: LabStep[];
  solutionCode: string;
}

export interface CourseModule {
  moduleId: string;
  slug: string;
  unitId: string;
  unitTitle: string;
  title: string;
  difficulty: string;
  estimatedMinutes: number;
  readingMarkdown: string;
  citations: Citation[];
  videoLibrary: Video[];
  interactiveLab: InteractiveLab;
}

export interface CourseResponse {
  blueprint: Blueprint;
  /** slug -> true when content/modules/<slug>.json exists on disk */
  availability: Record<string, boolean>;
  activeSlug: string | null;
  activeModule: CourseModule | null;
  /** Set when the active module's file exists but could not be read. */
  moduleError?: string;
}

export interface RunResult {
  passed: boolean;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}
