import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../../common/constants/colors';
import { awsService, ValidationResult } from '../../services/aws.service';

type UploadDocsProps = {
  seatType: 'child' | 'elderly' | 'disabled';
  onDocumentSelected: (uri: string, type: string, name: string) => void;
  onValidationResult: (result: ValidationResult) => void;
  firstName: string;
  lastName: string;
};

export default function UploadDocs({ 
  seatType, 
  onDocumentSelected, 
  onValidationResult,
  firstName,
  lastName
}: UploadDocsProps) {
  const [documentInfo, setDocumentInfo] = useState<{
    uri: string;
    type: string;
    name: string;
  } | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>('');

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
        const docInfo = {
          uri: asset.uri,
          type: asset.mimeType || 'application/octet-stream',
          name: asset.name || 'document',
        };
        
        setDocumentInfo(docInfo);
        onDocumentSelected(asset.uri, asset.mimeType || 'application/octet-stream', asset.name || 'document');
        
        // Validar automáticamente el documento si hay nombres y apellidos
        if (firstName.trim() && lastName.trim()) {
          await validateDocument(docInfo);
        } else {
          setValidationStatus('pending');
          setValidationMessage('Complete el nombre y apellido para validar automáticamente');
        }
      }
    } catch (error) {
      console.log('Error al seleccionar el documento:', error);
    }
  };
  const validateDocument = useCallback(async (docInfo = documentInfo) => {
    if (!docInfo || !firstName.trim() || !lastName.trim()) {
      Alert.alert(
        'Información incompleta',
        'Por favor complete el nombre y apellido antes de validar el documento.'
      );
      return;
    }

    try {
      setIsValidating(true);
      setValidationStatus('pending');
      setValidationMessage('Validando documento...');

      const result = await awsService.validateDocumentComplete(
        docInfo,
        seatType,
        firstName,
        lastName
      );

      if (result.isValid) {
        setValidationStatus('success');
        setValidationMessage('✓ Documento validado correctamente');
      } else {
        setValidationStatus('error');
        setValidationMessage(result.reason || 'Error en la validación del documento');
      }

      onValidationResult(result);
    } catch (error) {
      setValidationStatus('error');
      setValidationMessage('Error al validar el documento. Intente nuevamente.');
      console.error('Error validating document:', error);
    } finally {
      setIsValidating(false);
    }
  }, [documentInfo, firstName, lastName, seatType, onValidationResult]);
  // Función para revalidar cuando cambien los nombres
  React.useEffect(() => {
    if (documentInfo && firstName.trim() && lastName.trim() && validationStatus === 'pending') {
      validateDocument();
    }
  }, [firstName, lastName, documentInfo, validationStatus, validateDocument]);

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

          {/* Estado de validación */}
          {validationStatus && (
            <View style={[
              styles.validationStatus,
              validationStatus === 'success' && styles.validationSuccess,
              validationStatus === 'error' && styles.validationError,
              validationStatus === 'pending' && styles.validationPending
            ]}>
              {isValidating ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons 
                  name={validationStatus === 'success' ? 'checkmark-circle' : 
                        validationStatus === 'error' ? 'close-circle' : 'time'} 
                  size={20} 
                  color={validationStatus === 'success' ? '#4CAF50' : 
                         validationStatus === 'error' ? '#F44336' : Colors.primary} 
                />
              )}
              <Text style={[
                styles.validationText,
                validationStatus === 'success' && styles.validationTextSuccess,
                validationStatus === 'error' && styles.validationTextError,
              ]}>
                {validationMessage}
              </Text>
            </View>
          )}

          {/* Botón para revalidar manualmente */}
          {validationStatus === 'error' && (
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => validateDocument()}
              disabled={isValidating}
            >
              <Text style={styles.retryButtonText}>Intentar nuevamente</Text>
            </TouchableOpacity>
          )}
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
  },  changeButtonText: {
    color: Colors.accent,
    fontWeight: '500',
  },
  validationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  validationSuccess: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  validationError: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  validationPending: {
    backgroundColor: '#E3F2FD',
    borderColor: Colors.primary,
  },
  validationText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  validationTextSuccess: {
    color: '#2E7D32',
  },
  validationTextError: {
    color: '#C62828',
  },
  retryButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  }
});