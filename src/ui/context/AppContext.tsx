import { Context, createContext } from 'react';

type AppContextType = {
  displayNotification: Function;
  openOverlay: Function;
  closeOverlay: Function;
  performTaskEdit: Function;
};

export const AppContext: Context<AppContextType> = createContext(
  {} as AppContextType,
);
