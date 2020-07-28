import { Context, createContext } from 'react';

type AppContextType = {
  displayNotification: Function;
  openOverlay: Function;
  closeOverlay: Function;
  performTaskEdit: Function;
};

/**
 * Context for application to be used by child components.
 * Contains references to application-level function calls.
 */
export const AppContext: Context<AppContextType> = createContext(
  {} as AppContextType,
);
