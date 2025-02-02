import {instance} from './authService';

export interface Topic {
  name: string;
  translationEN: string;
  translationUK: string;
}

export const fetchTopic = async (): Promise<Topic[]> => {
  const {data} = await instance.get<Topic[]>('/theme');
  return data;
};
