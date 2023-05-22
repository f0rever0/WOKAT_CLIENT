import useNavigation, { NavType } from '@/hooks/useNavigation';
import { PropsWithChildren, createContext } from 'react';

interface NavigationContext {
  navType: string;
  switchNavType: (args: NavType) => void;
}

export const NavigationContext = createContext({
  navType: '무료 공간',
  switchNavType: (args: NavType) => {},
});

export const NavigationContextProvider = (props: PropsWithChildren) => {
  const { children } = props;
  const { navType, switchNavType } = useNavigation();

  return (
    <NavigationContext.Provider value={{ navType, switchNavType }}>
      {children}
    </NavigationContext.Provider>
  );
};
