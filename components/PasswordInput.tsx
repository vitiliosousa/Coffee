import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";

interface PasswordInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChangeText,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      {label && <Text className="text-background mb-2 font-semibold">{label}</Text>}
      <View className="flex-row items-center border bg-white border-fundoescuro rounded-lg pr-4">
        <TextInput
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
          className="flex-1 px-4 py-4 text-lg"
          {...rest}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff size={20} color="#BCA9A1" />
          ) : (
            <Eye size={20} color="#BCA9A1" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
