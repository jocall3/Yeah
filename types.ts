import type React from 'react';
import { CHROME_VIEW_IDS, FEATURE_CATEGORIES } from './constants.tsx';

export type ChromeViewType = typeof CHROME_VIEW_IDS[number];
export type FeatureId = string;
export type FeatureCategory = typeof FEATURE_CATEGORIES[number];

export interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: FeatureCategory;
  component: React.FC<any>;
  aiConfig?: {
    model: string;
    systemInstruction?: string;
  };
}

export type ViewType = FeatureId | ChromeViewType;

export interface GeneratedFile {
  filePath: string;
  content: string;
  description: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view: ViewType;
  props?: any;
  action?: () => void;
}

export interface StructuredPrSummary {
    title: string;
    summary: string;
    changes: string[];
}

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  tier: 'free' | 'pro';
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  email: string | null;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
}

export type Theme = 'light' | 'dark';

export interface StructuredExplanation {
    summary: string;
    lineByLine: { lines: string; explanation: string }[];
    complexity: { time: string; space: string };
    suggestions: string[];
}

export interface ColorTheme {
    primary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textOnPrimary: string;
    border: string;
}

export interface ThemeState {
    mode: Theme;
    customColors: ColorTheme | null;
}

export interface SemanticColorTheme {
    mode: 'light' | 'dark';
    palette: {
        primary: { value: string; name: string; };
        secondary: { value: string; name: string; };
        accent: { value: string; name: string; };
        neutral: { value: string; name: string; };
    };
    theme: {
        background: { value: string; name: string; };
        surface: { value: string; name: string; };
        textPrimary: { value: string; name: string; };
        textSecondary: { value: string; name: string; };
        textOnPrimary: { value: string; name: string; };
        border: { value: string; name: string; };
    };
    accessibility: {
        primaryOnSurface: { ratio: number; score: string; };
        textPrimaryOnSurface: { ratio: number; score:string; };
        textSecondaryOnSurface: { ratio: number; score: string; };
        textOnPrimaryOnPrimary: { ratio: number; score: string; };
    };
}

export interface SlideSummary {
    title: string;
    body: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  // Fix: Add owner property to match GitHub API response shape
  owner: { login: string; };
}

// --- Code Review Types ---
export interface StructuredReviewSuggestion {
    suggestion: string;
    codeBlock: string;
    explanation: string;
}

export interface StructuredReview {
    summary: string;
    suggestions: StructuredReviewSuggestion[];
}

// --- AI Personality Forge Types ---
export interface SystemPrompt {
  id: string;
  name: string;
  persona: string;
  rules: string[];
  outputFormat: 'json' | 'markdown' | 'text';
  exampleIO: { input: string; output: string }[];
}

// --- Vault Types ---
export interface EncryptedData {
    id: string;
    ciphertext: ArrayBuffer;
    iv: Uint8Array;
}

// --- New Types for Implemented Features ---
export interface SecurityVulnerability {
    vulnerability: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
    description: string;
    mitigation: string;
    exploitSuggestion?: string;
}

export interface CodeSmell {
    smell: string;
    line: number;
    explanation: string;
}