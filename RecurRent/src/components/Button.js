import * as React from 'react';
import { Button } from "react-native-paper";
import {
  primaryColor,
  lightTheme,
} from "../styles/GlobalStyles";

export const primaryBtnStyle = {
  borderRadius: 10,
  backgroundColor: primaryColor,
  paddingVertical: 10,
};

export const secondaryBtnStyle = {
  borderRadius: 10,
  backgroundColor: 'transparent',
  paddingVertical: 10,
};

const Btn = ({ title, onPress, mode, style, icon }) => {
  const buttonStyle =
    title.toLowerCase() === "primary" ? primaryBtnStyle : secondaryBtnStyle;

  return (
    <>
      <Button
        mode={mode || "contained"}
        onPress={onPress}
        style={[buttonStyle, style]}
        labelStyle={{ fontSize: 16 }}
        contentStyle={{ width: "100%" }}
        textColor={mode === "contained" ? lightTheme.colors.onPrimary : primaryColor}
		  icon={icon}
      >
        {title}
      </Button>
    </>
  );
};

export default Btn;

