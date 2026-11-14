import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export type YuristTab = 'index' | 'lawyers' | 'requests' | 'messages' | 'profile';

export type RouteLocation = {
  pathname: string;
  params?: Record<string, any>;
};

interface YuristRouterContextType {
  currentRoute: RouteLocation;
  stack: RouteLocation[];
  push: (target: string | RouteLocation) => void;
  replace: (target: string | RouteLocation) => void;
  back: () => void;
  canGoBack: boolean;
  activeTab: YuristTab;
  setActiveTab: (tab: YuristTab) => void;
}

const YuristRouterContext = createContext<YuristRouterContextType | null>(null);

let globalRouterDispatch: {
  push: (target: string | RouteLocation) => void;
  replace: (target: string | RouteLocation) => void;
  back: () => void;
} = {
  push: () => {},
  replace: () => {},
  back: () => {},
};

export const router = {
  push: (target: string | RouteLocation) => globalRouterDispatch.push(target),
  replace: (target: string | RouteLocation) => globalRouterDispatch.replace(target),
  back: () => globalRouterDispatch.back(),
};

export function useLocalSearchParams<T extends Record<string, any> = Record<string, any>>(): T {
  const ctx = useContext(YuristRouterContext);
  return (ctx?.currentRoute.params || {}) as T;
}

export function useYuristRouter() {
  const ctx = useContext(YuristRouterContext);
  if (!ctx) throw new Error('useYuristRouter must be used within YuristRouterProvider');
  return ctx;
}

interface YuristRouterProviderProps {
  children: React.ReactNode;
  onExit?: () => void;
}

export const YuristRouterProvider: React.FC<YuristRouterProviderProps> = ({ children, onExit }) => {
  const [activeTab, setActiveTabState] = useState<YuristTab>('index');
  const [stack, setStack] = useState<RouteLocation[]>([{ pathname: '/(tabs)/index' }]);

  const normalizeTarget = useCallback((target: string | RouteLocation): RouteLocation => {
    if (typeof target === 'string') {
      return { pathname: target };
    }
    return target;
  }, []);

  const push = useCallback(
    (target: string | RouteLocation) => {
      const loc = normalizeTarget(target);
      // If navigating to a tab
      if (loc.pathname === '/(tabs)' || loc.pathname === '/(tabs)/index' || loc.pathname === '/' || loc.pathname === 'index') {
        setActiveTabState('index');
        setStack([{ pathname: '/(tabs)/index', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/lawyers')) {
        setActiveTabState('lawyers');
        setStack([{ pathname: '/(tabs)/lawyers', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/requests')) {
        setActiveTabState('requests');
        setStack([{ pathname: '/(tabs)/requests', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/messages')) {
        setActiveTabState('messages');
        setStack([{ pathname: '/(tabs)/messages', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/profile')) {
        setActiveTabState('profile');
        setStack([{ pathname: '/(tabs)/profile', params: loc.params }]);
        return;
      }

      setStack((prev) => [...prev, loc]);
    },
    [normalizeTarget]
  );

  const replace = useCallback(
    (target: string | RouteLocation) => {
      const loc = normalizeTarget(target);
      if (loc.pathname === '/(tabs)' || loc.pathname === '/(tabs)/index' || loc.pathname === '/' || loc.pathname === 'index') {
        setActiveTabState('index');
        setStack([{ pathname: '/(tabs)/index', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/lawyers')) {
        setActiveTabState('lawyers');
        setStack([{ pathname: '/(tabs)/lawyers', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/requests')) {
        setActiveTabState('requests');
        setStack([{ pathname: '/(tabs)/requests', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/messages')) {
        setActiveTabState('messages');
        setStack([{ pathname: '/(tabs)/messages', params: loc.params }]);
        return;
      }
      if (loc.pathname.includes('/profile')) {
        setActiveTabState('profile');
        setStack([{ pathname: '/(tabs)/profile', params: loc.params }]);
        return;
      }

      setStack((prev) => [...prev.slice(0, -1), loc]);
    },
    [normalizeTarget]
  );

  const back = useCallback(() => {
    setStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, -1);
      }
      if (onExit) {
        onExit();
      }
      return prev;
    });
  }, [onExit]);

  const setActiveTab = useCallback((tab: YuristTab) => {
    setActiveTabState(tab);
    setStack([{ pathname: `/(tabs)/${tab}` }]);
  }, []);

  const currentRoute = stack[stack.length - 1] || { pathname: '/(tabs)/index' };
  const canGoBack = stack.length > 1;

  // Bind globals so router.push / router.back works everywhere
  globalRouterDispatch.push = push;
  globalRouterDispatch.replace = replace;
  globalRouterDispatch.back = back;

  const value = useMemo(
    () => ({
      currentRoute,
      stack,
      push,
      replace,
      back,
      canGoBack,
      activeTab,
      setActiveTab,
    }),
    [currentRoute, stack, push, replace, back, canGoBack, activeTab, setActiveTab]
  );

  return <YuristRouterContext.Provider value={value}>{children}</YuristRouterContext.Provider>;
};
