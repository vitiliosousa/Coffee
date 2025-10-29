import React, { useRef, useState } from "react";
import { View, TextInput, TextInputProps, NativeSyntheticEvent, NativeTouchEvent } from "react-native";

interface OtpInputProps {
  length: number;
  value: string[];
  onChange: (otp: string[]) => void;
  onComplete?: (otp: string) => void;
  inputProps?: TextInputProps;
}

export default function OtpInput({
  length,
  value,
  onChange,
  onComplete,
  inputProps,
}: OtpInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    if (text && !/^\d+$/.test(text)) return; // Aceitar apenas números

    const newOtp = [...value];
    newOtp[index] = text;
    onChange(newOtp);

    // Auto-focus no próximo input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Chamar onComplete se todos os dígitos foram preenchidos
    if (newOtp.every(digit => digit !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<NativeTouchEvent>, index: number) => {
    // Voltar para o input anterior ao pressionar backspace
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => { inputRefs.current[index] = ref; }}
          value={value[index]}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          className="w-12 h-14 border-2 bg-white border-fundoescuro rounded-lg text-center text-2xl font-bold text-background"
          {...inputProps}
        />
      ))}
    </View>
  );
}
