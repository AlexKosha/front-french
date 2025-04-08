export interface Topic {
  name: string;
  translationEN: string;
  translationUK: string;
}

export interface TopicState {
  topic: Topic[];
  isLoading: boolean;
  error: string | null;
}
