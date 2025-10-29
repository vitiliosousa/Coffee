import { View, Text, TextInput, TextInputProps } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  ...rest
}: FormInputProps) {
  return (
    <View>
      <Text className="text-background mb-2 font-semibold">{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="w-full border bg-white border-fundoescuro rounded-lg px-4 py-4 text-lg"
        {...rest}
      />
    </View>
  );
}
