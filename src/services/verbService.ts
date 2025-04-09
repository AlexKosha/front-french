import {Verb} from '../types';
import {instance} from './authService';

export const fetchVerb = async (): Promise<Verb[]> => {
  const {data} = await instance.get('/verb');
  return data;
};
