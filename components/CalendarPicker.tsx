// components/CalendarPicker.tsx
import React, { useState } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface CalendarPickerProps {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
}

export default function CalendarPicker({ onDateChange, initialDate }: CalendarPickerProps) {
  const [date, setDate] = useState(initialDate || new Date());
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    if (onDateChange) onDateChange(currentDate);
  };

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="bg-background px-5 py-3 w-full rounded-2xl shadow-md"
      >
        <Text className="text-white font-semibold text-base">
          Escolher Data
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}
