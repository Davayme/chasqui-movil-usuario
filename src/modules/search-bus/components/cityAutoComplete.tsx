import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { City, searchCities } from '../services/searchService';

interface CityAutocompleteProps {
  placeholder: string;
  value: string;
  onSelectCity: (city: City) => void;
  icon: string;
}

export default function CityAutocomplete({ 
  placeholder, 
  value, 
  onSelectCity,
  icon
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);

  useEffect(() => {
    // Actualizar el query cuando cambia el value desde fuera
    if (value !== query && !showSuggestions) {
      setQuery(value);
    }
  }, [value]);

  // Avoid suggestions being shown after a city is selected
  useEffect(() => {
    if (value && value !== query) {
      setQuery(value);
      setShowSuggestions(false);
    }
  }, [value]);

  // Efecto para buscar ciudades cuando cambia el query
  useEffect(() => {
    if (query.length >= 2) {
      setSuggestions(searchCities(query));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  // Efecto para cerrar sugerencias cuando se toca fuera o se oculta el teclado
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowSuggestions(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSelect = (city: City) => {
    setQuery(city.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelectCity(city);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSelectCity({ id: '', name: '', province: '' });
    inputRef.current?.focus();
  };

  // Cerrar las sugerencias al tocar fuera
  const handleOutsideTouch = () => {
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container} ref={containerRef}>
      <View style={[
        styles.inputContainer,
        showSuggestions && suggestions.length > 0 ? styles.inputContainerActive : null
      ]}>
        <Ionicons name={icon as any} size={22} color={Colors.primary} style={styles.inputIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={Colors.textSecondary}
          onFocus={() => setShowSuggestions(query.length >= 2)}
          autoCapitalize="words"
        />
        {query.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={Colors.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dropdown para mostrar las sugerencias - con z-index elevado */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsDropdown}>
          <ScrollView
            style={styles.suggestionsList}
            contentContainerStyle={styles.suggestionsListContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="location-outline" 
                  size={16} 
                  color={Colors.primary} 
                  style={styles.suggestionIcon} 
                />
                <View style={styles.suggestionTextContainer}>
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  <Text style={styles.suggestionSubtext}>{item.province}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Invisible overlay to detect outside touches when suggestions are visible */}
      {showSuggestions && suggestions.length > 0 && (
        <Pressable 
          style={styles.outsideOverlay} 
          onPress={handleOutsideTouch}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    zIndex: 1, // Base z-index
    position: 'relative',
    elevation: Platform.OS === 'android' ? 1 : 0, // Para Android
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: 48,
    zIndex: 1, // Same as container
  },
  inputContainerActive: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: 48, // Align exactly with bottom of input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    elevation: 99, // Muy elevado para Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 9999, // Extremadamente alto para asegurar que está por encima de todo
    maxHeight: Platform.OS === 'ios' ? 160 : 180,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderTopWidth: 0,
  },
  suggestionsList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  suggestionsListContent: {
    paddingVertical: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  suggestionSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  outsideOverlay: {
    position: 'absolute',
    top: 230, // Start below the dropdown
    left: 0,
    right: 0,
    bottom: -1000, // Extend way beyond the screen
    zIndex: 990, // Just below the dropdown but above everything else
  },
});