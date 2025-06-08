export interface Vocab {
  world: string;
  translationEN: string;
  translationUK: string;
  image: string;
  themeId: string;
}

export interface VocabState {
  vocab: Vocab[];
  themeId: string;
  isLoading: boolean;
  error: string | null;
}
