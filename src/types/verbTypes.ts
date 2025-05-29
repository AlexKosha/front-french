export interface VerbsInChoosenTense {
  infinitive: string;
  translationUA: string;
  translationEN: string;
  conjugations: Conjugation[];
}

export interface Conjugation {
  _id: string;
  pronoun: string;
  form: string;
}

export interface Tense {
  _id: string;
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

export type Props = {
  selectedVerbs: Verb[];
  level: number;
  titleName: string;
};
