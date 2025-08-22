import { View, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";

export default function LoadingDots() {
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const createAnimation = (animatedValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -8,
            duration: 300,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(animatedValue, {
            toValue: 0, 
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const loops = animations.map((anim, index) => createAnimation(anim, index * 200));
    loops.forEach(loop => loop.start());

    return () => loops.forEach(loop => loop.stop());
  }, []);

  return (
    <View className="flex-row items-center justify-center gap-2">
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          className="w-2 h-3 bg-white rounded-full"
          style={{
            transform: [{ translateY: anim }],
          }}
        />
      ))}
    </View>
  );
}
