import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
  onHide: () => void;
}

// Singleton para gestionar el toast
class ToastManager {
  private static instance: ToastManager;
  private toastRef: React.RefObject<{ show: (params: ToastParams) => void }> | null = null;

  private constructor() {}

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public setToastRef(ref: React.RefObject<{ show: (params: ToastParams) => void }>): void {
    this.toastRef = ref;
  }

  public showToast(params: ToastParams): void {
    if (this.toastRef && this.toastRef.current) {
      this.toastRef.current.show(params);
    }
  }
}

export const toastManager = ToastManager.getInstance();

export interface ToastParams {
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

export const showToast = (params: ToastParams): void => {
  toastManager.showToast(params);
};

const Toast: React.FC<ToastProps> = ({ visible, type, title, message, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  const getIconName = (): string => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  };

  const getIconColor = (): string => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      case 'info':
        return '#2196F3';
      default:
        return '#2196F3';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        }) }] }
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName() as any} size={24} color={getIconColor()} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export class ToastContainer extends React.Component {
  state = {
    visible: false,
    type: 'info' as ToastType,
    title: '',
    message: '',
  };

  private timeout: NodeJS.Timeout | null = null;
  
  componentDidMount() {
    toastManager.setToastRef({ current: this });
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  show = ({ type, title, message, duration = 3000 }: ToastParams) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.setState({
      visible: true,
      type,
      title,
      message,
    });

    this.timeout = setTimeout(() => {
      this.hide();
    }, duration);
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <Toast
        visible={this.state.visible}
        type={this.state.type}
        title={this.state.title}
        message={this.state.message}
        onHide={this.hide}
      />
    );
  }
}

export default ToastContainer;
