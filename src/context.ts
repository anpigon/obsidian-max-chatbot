import {createContext} from 'react';
import MAXPlugin from './main';

export const AppContext = createContext<MAXPlugin | undefined>(undefined);
