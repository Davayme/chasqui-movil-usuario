import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../../../common/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

type UploadDocsProps = {
  seatType: 'child' | 'elderly' | 'disabled';
  onDocumentSelected: (uri: string, type: string, name: string) => void;
};

export default function UploadDocs({ seatType, onDocumentSelected }: UploadDocsProps) {
  const [documentInfo, setDocumentInfo] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);

  const getDocumentTypeLabel = () => {
    switch (seatType) {
      case 'child':
        return 'Documento que acredite minoría de edad';
      case 'elderly':
        return 'Carnet de tercera edad';
      case 'disabled':
        return 'Carnet de discapacidad';
      default:
        return 'Documento';
    }
  };

  const getDocumentTypeDescription = () => {
    switch (seatType) {
      case 'child':
        return 'Sube una copia de un documento que acredite que es menor de 16 años para aplicar el descuento.';
      case 'elderly':
        return 'Sube una copia del carnet de tercera edad para aplicar el descuento.';
      case 'disabled':
        return 'Sube una copia del carnet de discapacidad para aplicar el descuento.';
      default:
        return '';
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocumentInfo({
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name || 'document',
        });
        
        onDocumentSelected(asset.uri, asset.mimeType || 'application/octet-stream', asset.name || 'document');
      }
    } catch (error) {
      console.log('Error al seleccionar el documento:', error);
    }
  };

  const isImage = documentInfo?.type && documentInfo.type.startsWith('image/');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{getDocumentTypeLabel()}</Text>
      <Text style={styles.description}>{getDocumentTypeDescription()}</Text>

      {!documentInfo ? (
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
          <Text style={styles.uploadButtonText}>Subir documento</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.documentPreviewContainer}>
          {isImage ? (
            <Image source={{ uri: documentInfo.uri }} style={styles.imagePreview} />
          ) : (
            <View style={styles.pdfPreview}>
              <Ionicons name="document-text" size={40} color={Colors.primary} />
              <Text style={styles.filename} numberOfLines={1}>
                {documentInfo.name}
              </Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.changeButton} onPress={pickDocument}>
            <Text style={styles.changeButtonText}>Cambiar documento</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.textLight,
    padding: 16,
  },
  uploadButtonText: {
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  documentPreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  pdfPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  filename: {
    marginTop: 8,
    color: Colors.textPrimary,
  },
  changeButton: {
    padding: 8,
  },
  changeButtonText: {
    color: Colors.accent,
    fontWeight: '500',
  }
});