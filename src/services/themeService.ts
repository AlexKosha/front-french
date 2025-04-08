import {instance} from './authService';
import {Topic} from '../types';

export const fetchTopic = async (): Promise<Topic[]> => {
  const {data} = await instance.get<Topic[]>('/theme');
  return data;
};
