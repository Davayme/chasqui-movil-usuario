import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { showToast } from '../../../common/components/Toast';
import { Colors } from '../../../common/constants/colors';
import { useAuth } from '../../../common/context/AuthContext';
import { getMockTicketQR, getTicketQR } from '../services/ticket-service';

interface UITicket {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  company: string;
  seats: string;
  price: number;
  status: string;
  statusText: string;
  passengerCount: number;
  qrCode?: string;
  qrBase64?: string;
  ticketId: number;
  passengers: {
    name: string;
    seat: string;
    type: string;
    price: number;
  }[];
}

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  ticketId: string;
  ticket: UITicket;
  qrBase64?: string; // QR ya disponible del backend
}

const QRModal: React.FC<QRModalProps> = ({ 
  visible, 
  onClose, 
  ticketId, 
  ticket,
  qrBase64
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const viewShotRef = useRef<ViewShot | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadQRCode = async () => {
      setLoading(true);
      try {
        // Si ya tenemos el QR en base64, usarlo directamente
        if (qrBase64) {
          console.log('Usando QR base64 del ticket');
          setQrCode(qrBase64);
          setLoading(false);
          return;
        }
        
        // Si no, intentar obtener el QR del servidor
        console.log('Obteniendo QR del servidor para ticket:', ticketId);
        const qrData = await getTicketQR(parseInt(ticketId));
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

    if (visible) {
      loadQRCode();
    } else {
      // Limpiar el estado cuando se cierra el modal
      setQrCode(null);
      setLoading(true);
    }
  }, [visible, ticketId, qrBase64]);

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
          
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Sección que se captura para guardar en galería */}
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1 }}
              style={styles.viewShotContainer}
            >
              <View style={styles.qrCaptureContainer}>
                <View style={styles.qrHeader}>
                  <Text style={styles.qrTitle}>ChasquiGo - Boleto de Viaje</Text>
                  <Text style={styles.qrSubtitle}>{ticket.origin} → {ticket.destination}</Text>
                  <Text style={styles.qrDate}>{ticket.departureDate} - {ticket.departureTime}</Text>
                  {user && (
                    <Text style={styles.userName}>Comprado por: {user.firstName} {user.lastName}</Text>
                  )}
                  <Text style={styles.orderNumber}>Orden: {ticket.orderNumber}</Text>
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

            {/* Información adicional (NO se incluye en la imagen guardada) */}
            <View style={styles.ticketDetails}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Detalles del Viaje</Text>
                <View style={styles.detailRow}>
                  <Ionicons name="business-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailLabel}>Empresa:</Text>
                  <Text style={styles.detailValue}>{ticket.company}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailLabel}>Total:</Text>
                  <Text style={styles.detailValue}>${ticket.price.toLocaleString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="people-outline" size={16} color={Colors.textSecondary} />
                  <Text style={styles.detailLabel}>Pasajeros:</Text>
                  <Text style={styles.detailValue}>{ticket.passengerCount}</Text>
                </View>
              </View>

              {/* Lista de pasajeros */}
              {ticket.passengers && ticket.passengers.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Pasajeros</Text>
                  {ticket.passengers.map((passenger, index) => (
                    <View key={index} style={styles.passengerCard}>
                      <View style={styles.passengerHeader}>
                        <Text style={styles.passengerName}>{passenger.name}</Text>
                        <Text style={styles.passengerType}>{passenger.type}</Text>
                      </View>
                      <View style={styles.passengerDetails}>
                        <View style={styles.passengerDetail}>
                          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                          <Text style={styles.passengerDetailText}>Asiento {passenger.seat}</Text>
                        </View>
                        <View style={styles.passengerDetail}>
                          <Ionicons name="cash-outline" size={14} color={Colors.textSecondary} />
                          <Text style={styles.passengerDetailText}>${passenger.price.toLocaleString()}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            <Text style={styles.infoText}>
              Muestra este código al personal de la cooperativa para abordar
            </Text>
          </ScrollView>
          
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
    maxWidth: 400,
    maxHeight: '90%',
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
  scrollContent: {
    width: '100%',
  },
  viewShotContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  qrCaptureContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  qrHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  qrDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  userName: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  orderNumber: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  qrImageContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  qrFooter: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: 12,
  },
  ticketDetails: {
    width: '100%',
    marginBottom: 20,
  },
  detailSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginLeft: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginLeft: 8,
  },
  passengerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  passengerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  passengerType: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  passengerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passengerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerDetailText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
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
    backgroundColor: '#9ba9be',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default QRModal; 