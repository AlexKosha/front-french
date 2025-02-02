import {instance} from './authService';

export interface Vocab {
  world: string;
  translationEN: string;
  translationUK: string;
  image: string;
  themeId: string;
  audio: string;
}

export const fetchVocab = async (id: string): Promise<Vocab[]> => {
  const {data} = await instance.get(`/vocab/${id}`);
  return data;
};
