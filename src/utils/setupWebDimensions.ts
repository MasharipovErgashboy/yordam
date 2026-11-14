import { Dimensions, Platform } from 'react-native';

export const IPHONE_15_PRO_MAX_WIDTH = 430;
export const IPHONE_15_PRO_MAX_HEIGHT = 932;

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  const isDesktop = () => window.innerWidth > 500;

  const originalGet = Dimensions.get.bind(Dimensions);
  Dimensions.get = (dim: 'window' | 'screen') => {
    const orig = originalGet(dim);
    if (isDesktop()) {
      return {
        ...orig,
        width: IPHONE_15_PRO_MAX_WIDTH,
        height: IPHONE_15_PRO_MAX_HEIGHT,
      };
    }
    return orig;
  };

  const originalAddEventListener = Dimensions.addEventListener.bind(Dimensions);
  Dimensions.addEventListener = (type: any, handler: any) => {
    const wrappedHandler = (dims: any) => {
      if (isDesktop()) {
        handler({
          window: {
            ...dims.window,
            width: IPHONE_15_PRO_MAX_WIDTH,
            height: IPHONE_15_PRO_MAX_HEIGHT,
          },
          screen: {
            ...dims.screen,
            width: IPHONE_15_PRO_MAX_WIDTH,
            height: IPHONE_15_PRO_MAX_HEIGHT,
          },
        });
      } else {
        handler(dims);
      }
    };
    return originalAddEventListener(type, wrappedHandler);
  };
}

