export interface Conjugation {
  pronoun: string;
  form: string;
}

export interface Tense {
  name: string;
  translationUA: string;
  translationEN: string;
  conjugations: Conjugation[];
}

export interface Verb {
  infinitive: string;
  translationUA: string;
  translationEN: string;
  tenses: Tense[];
}

export interface VerbState {
  verb: Verb[];
  isLoading: boolean;
  error: string | null;
}
