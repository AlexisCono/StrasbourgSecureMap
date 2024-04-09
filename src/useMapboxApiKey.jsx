import { useContext } from 'react';
import { GlobalStateContext } from './GlobalState';

export const useMapboxApiKey = () => useContext(GlobalStateContext).mapboxApiKey;