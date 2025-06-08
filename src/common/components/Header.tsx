import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  textColor?: string;
  backgroundColor?: string;
}

export default function Header({ 
  title, 
  showBackButton = false, 
  onBackPress, 
  rightComponent,
  transparent = false,
  textColor = '#fff',
  backgroundColor = Colors.primary
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          paddingTop: insets.top,
          backgroundColor: transparent ? 'transparent' : backgroundColor
        }
      ]}
    >
      <View style={styles.content}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderLeft} />
        )}
        
        <Text 
          style={[
            styles.title, 
            { color: textColor }
          ]} 
          numberOfLines={1}
        >
          {title}
        </Text>
        
        {rightComponent ? (
          <View style={styles.rightContainer}>
            {rightComponent}
          </View>
        ) : (
          <View style={styles.placeholderRight} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  placeholderLeft: {
    width: 40,
  },
  placeholderRight: {
    width: 40,
  },
  rightContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});