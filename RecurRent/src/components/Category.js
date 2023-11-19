// components/Category.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { backgroundColor, lightTheme, primaryColor, tertiaryColor, textColor, typography } from '../styles/GlobalStyles';

const Category = ({ name, onPress, isActive }) => {
  return (
    <TouchableOpacity
      style={[styles.categoryContainer, isActive && styles.activeCategory]}
      onPress={onPress}
    >
      <Text style={[typography.caption, styles.categoryText, isActive && styles.activeText]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    padding: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: tertiaryColor,
    backgroundColor: lightTheme.colors.onPrimary,
  },
  activeCategory: {
    backgroundColor: primaryColor,
    color: backgroundColor, 
  },
  activeText: {
    color: backgroundColor,
  },
  categoryText: {
    color: textColor,
  },
});

export default Category;
