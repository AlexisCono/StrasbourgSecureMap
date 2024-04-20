import { useContext } from "react";
import { GlobalStateContext } from "../context/GlobalState";

export const useMapboxApiKey = () =>
  useContext(GlobalStateContext).mapboxApiKey;
