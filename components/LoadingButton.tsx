import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from "react-native";

interface LoadingButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading: boolean;
  className?: string; // Para permitir classes Tailwind adicionais
  textClassName?: string; // Para permitir classes Tailwind adicionais para o texto
}

export default function LoadingButton({
  title,
  isLoading,
  className,
  textClassName,
  disabled,
  ...rest
}: LoadingButtonProps) {
  return (
    <TouchableOpacity
      disabled={isLoading || disabled}
      className={`flex items-center rounded-full py-4 ${
        isLoading || disabled ? "bg-gray-300" : "bg-background"
      } ${className}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`text-white font-semibold ${textClassName}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
