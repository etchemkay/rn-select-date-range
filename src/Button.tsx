import React from "react";
import { TouchableOpacity, Text, StyleSheet, TextStyle } from "react-native";

interface IProps {
  label: string;
  onPress: () => void;
  align?: "center" | "auto" | "left" | "right" | "justify" | undefined;
  disabled: boolean;
  font?: string;
  textStyle?: TextStyle;
}

export default ({
  label,
  onPress = () => {},
  align,
  disabled = false,
  font,
  textStyle = {}
}: IProps) => {
  const labelStyle = {
    textAlign: align,
    opacity: disabled ? 0.2 : 1,
    fontFamily: font,
    fontSize: 14,
    ...textStyle,
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.buttonContainer}
      onPress={() => onPress()}
    >
      <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 30,
    flex: 0.7,
    justifyContent: "center",
  },
});
