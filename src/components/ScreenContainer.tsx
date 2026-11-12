import React, { useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shared screen wrapper that prevents double top safe-area padding when embedded
 * under a host app header and keeps bottom navigation flush across all screens.
 */
export default function ScreenContainer({ children, style }: ScreenContainerProps) {
  const rootRef = useRef<React.ComponentRef<typeof View>>(null);
  const [hasHostTopBar, setHasHostTopBar] = useState(false);

  const handleLayout = () => {
    rootRef.current?.measureInWindow((_x: number, y: number) => {
      setHasHostTopBar(y > 15);
    });
  };

  return (
    <View ref={rootRef} style={[{ flex: 1 }, style]} onLayout={handleLayout}>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={hasHostTopBar ? ['left', 'right'] : ['top', 'left', 'right']}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}

