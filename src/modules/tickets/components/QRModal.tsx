import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { showToast } from '../../../common/components/Toast';
import { Colors } from '../../../common/constants/colors';
import { getMockTicketQR, getTicketQR, saveTicketQR } from '../services/qrService';

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
      const result = await saveTicketQR(ticketId, ticketInfo);
      
      showToast({
        type: result.success ? 'success' : 'error',
        title: result.success ? 'Éxito' : 'Error',
        message: result.message
      });
      
      if (result.success) {
        // Cerrar el modal después de guardar exitosamente
        setTimeout(onClose, 1000);
      }
    } catch (error) {
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
          
          <View style={styles.qrContainer}>
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
                  <Ionicons name="share-outline" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Compartir QR</Text>
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
  qrContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  qrImage: {
    width: 230,
    height: 230,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
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