export interface WordProgress {
  world: string;
  _id: string;
  translationEN: string;
  translationUK: string;
  image: string;
  themeId: string;
  completed: number[];
}

export interface ThemeSaveProgress {
  updatedAt: number;
  words: WordProgress[];
}

export interface LevelProps {
  level: number;
  progress: WordProgress[];
  titleName: string;
}

export interface WordItem {
  world: string;
  _id: string;
  translationEN: string;
  translationUK: string;
  image: string;
  audio: string;
}

export interface WordItemProgress {
  world: string;
  _id: string;
  translationEN: string;
  translationUK: string;
  image: string;
  audio: string;
  completed: [number];
}

export interface LevelComponentsProps {
  level: number;
  progress: any[];
  titleName: string;
  renderContent: (param: WordItem, playText: () => void) => JSX.Element;
  renderChoices: (choices: any, handleChoice: any) => JSX.Element;
}

export interface WordStat {
  word: WordItem;
  correctCount: number;
}
