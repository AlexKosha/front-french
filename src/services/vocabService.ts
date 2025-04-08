import {instance} from './authService';
import {Vocab} from '../types';

export const fetchVocab = async (id: string): Promise<Vocab[]> => {
  const {data} = await instance.get(`/vocab/${id}`);
  return data;
};
