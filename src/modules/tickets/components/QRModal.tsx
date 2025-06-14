import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { showToast } from '../../../common/components/Toast';
import { Colors } from '../../../common/constants/colors';
import { getMockTicketQR, getTicketQR } from '../services/qrService';

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  ticketId: string;
  ticketInfo: string;
}

const QRModal: React.FC<QRModalProps> = ({ 
  visible, 
  onClose, 
  ticketId, 
  ticketInfo 
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const viewShotRef = useRef<ViewShot | null>(null);

  // Extraer información del boleto para mostrar en la imagen
  const ticketParts = ticketInfo.split('_');
  const origin = ticketParts[0] || '';
  const destination = ticketParts[1] || '';
  const date = ticketParts.slice(2).join(' ').replace(/_/g, ' ') || '';

  useEffect(() => {
    if (visible) {
      loadQRCode();
    } else {
      // Limpiar el estado cuando se cierra el modal
      setQrCode(null);
      setLoading(true);
    }
  }, [visible, ticketId]);

  const loadQRCode = async () => {
    setLoading(true);
    try {
      // Intentar obtener el QR del servidor
      const qrData = await getTicketQR(ticketId);
      setQrCode(qrData);
    } catch (error) {
      console.error('Error al cargar QR:', error);
      // Usar un QR de prueba en caso de error
      setQrCode(getMockTicketQR(ticketId));
      showToast({
        type: 'warning',
        title: 'Usando QR de prueba',
        message: 'No se pudo conectar al servidor'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQR = async () => {
    setSaving(true);
    try {
      // Solicitar permisos para guardar en la galería
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Se requieren permisos para guardar en la galería'
        });
        setSaving(false);
        return;
      }

      // Capturar la vista que contiene el QR y el título
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        
        // Guardar la imagen en la galería
        await MediaLibrary.saveToLibraryAsync(uri);
        
        showToast({
          type: 'success',
          title: 'Éxito',
          message: 'Boleto guardado en la galería'
        });
        
        // Cerrar el modal después de guardar exitosamente
        setTimeout(onClose, 1000);
      } else {
        throw new Error('No se pudo capturar la imagen');
      }
    } catch (error) {
      console.error('Error al guardar QR:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo guardar el QR'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Código QR del Boleto</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ViewShot
            ref={viewShotRef}
            options={{ format: 'png', quality: 1 }}
            style={styles.viewShotContainer}
          >
            <View style={styles.qrCaptureContainer}>
              <View style={styles.qrHeader}>
                <Text style={styles.qrTitle}>ChasquiGo - Boleto de Viaje</Text>
                <Text style={styles.qrSubtitle}>{origin} → {destination}</Text>
                <Text style={styles.qrDate}>{date}</Text>
              </View>
              
              <View style={styles.qrImageContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={Colors.primary} />
                ) : qrCode ? (
                  <Image
                    source={{ uri: qrCode }}
                    style={styles.qrImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.errorText}>No se pudo cargar el código QR</Text>
                )}
              </View>
              
              <Text style={styles.qrFooter}>
                Presente este código al personal de la cooperativa
              </Text>
            </View>
          </ViewShot>
          
          <Text style={styles.infoText}>
            Muestra este código al personal de la cooperativa para abordar
          </Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, saving && styles.actionButtonDisabled]}
              onPress={handleSaveQR}
              disabled={saving || !qrCode}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Guardar en Galería</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  viewShotContainer: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qrCaptureContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  qrSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  qrDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  qrImageContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  qrFooter: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  actionsContainer: {
    width: '100%',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: Colors.gray400,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default QRModal; 