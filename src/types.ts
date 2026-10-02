export type CharacterId =
  | 'wednesday'
  | 'morticia'
  | 'gomez'
  | 'fester'
  | 'pugsley'
  | 'dedos'
  | 'enid'
  | 'xavier'
  | 'bianca'
  | 'eugene';

export interface Character {
  id: CharacterId;
  name: string;
  isAddamsFamily: boolean;
  seriesRole: string;
  emoji: string;
  outcastTitle: string;
  badgeAccent: string;
  portraitDesc: string;
  shortWhy: string;
  iconicQuote: string;
  superpower: string;
  promptGenerative: string;
  strengths: string[];
  dormitory: string;
  secretSociety: string;
}

export interface QuizOption {
  id: string;
  letter?: string; // assigned after shuffle
  characterId: CharacterId;
  text: string;
  shortTag: string;
  guardianComment: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  scenario: string;
  options: QuizOption[];
}

export interface QuizResult {
  topCharacter: Character;
  affinityScores: Record<CharacterId, number>; // percentages
  answers: Record<number, string>; // questionId -> optionId or characterId
  studentName: string;
  matriculaId: string;
  completedAt: string;
}
