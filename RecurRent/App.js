
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Entypo name="archive" size={96} color="#2196F3" />
        <Text style={styles.contentText}>Welcome to RecurRent</Text>
        <TouchableOpacity style={styles.centerButton}>
          <Text style={styles.centerButtonText}>Let's Go</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#dbeafe',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 24,
    color: '#333',
    fontFamily: 'Helvetica Neue',
    marginTop: 20,
  },
  centerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  centerButtonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Helvetica Neue',
  },
});