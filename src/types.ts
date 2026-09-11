export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  role: string;
  client?: string;
  technologies: string[];
  description: string;
  longDescription: string;
  highlights: string[];
  challenge: string;
  solution: string;
  image: string;
  secondaryImage?: string;
  accentColor: string;
  liveUrl?: string;
  githubUrl?: string;
}

export interface GitWork {
  repoName: string;
  repoUrl: string;
  roleOrUsage: string;
  keyImplementations: string[];
  primaryLanguage?: string;
  stars?: number;
  liveUrl?: string;
}

export interface SkillItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Design' | 'Tools & Architecture' | 'AI & ML';
  level: string;
  highlight: string;
  iconName?: string;
  gitWorks?: GitWork[];
}

export interface ExperienceItem {
  year: string;
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Certificate {
  id: string;
  number: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  category: string;
  skills: string[];
  description: string;
  badge?: string;
}

export interface CursorState {
  text: string;
  active: boolean;
  variant: 'default' | 'project' | 'button' | 'link' | 'explore';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
}

