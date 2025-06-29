import { validateNameInDocument, extractIdNumber } from '../../../common/utils/text-utils';
import { API_URL } from "../../../common/config/config";

// Tipos para la respuesta del API
export interface DocumentValidation {
  isValidIdCard: boolean;
  confidence: number;
  detectedLabels: string[];
  extractedText: string[];
}

export interface AgeValidation {
  isMinor: boolean;
  isSenior: boolean;
  isDisabilityCard: boolean;
  birthDate: string;
  age: number;
  extractedFullText: string;
}

export interface ValidateDocumentResponse {
  message: string;
  data: {
    documentValidation: DocumentValidation;
    ageValidation: AgeValidation;
  };
}

export interface DocumentUploadData {
  uri: string;
  type: string;
  name: string;
}

export interface ValidationResult {
  isValid: boolean;
  validationData: ValidateDocumentResponse;
  reason?: string;
  nameValidation?: {
    isValid: boolean;
    missingFields: string[];
    extractedIdNumber?: string;
  };
}

class AwsService {
  private baseUrl = API_URL;

  /**
   * Valida un documento usando el endpoint de AWS
   * @param documentData - Datos del documento a validar
   * @returns Promise con la respuesta de validación
   */
  async validateDocument(documentData: DocumentUploadData): Promise<ValidateDocumentResponse> {
    try {
      const formData = new FormData();
      
      // Agregar el archivo al FormData
      formData.append('image', {
        uri: documentData.uri,
        type: documentData.type,
        name: documentData.name,
      } as any);

      const response = await fetch(`${this.baseUrl}/aws/validate-document`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al validar el documento');
      }

      const result: ValidateDocumentResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error en validateDocument:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Error desconocido al validar el documento'
      );
    }
  }

  /**
   * Valida un documento completo incluyendo nombres y apellidos
   * @param documentData - Datos del documento
   * @param seatType - Tipo de asiento que requiere validación
   * @param firstName - Nombre del pasajero
   * @param lastName - Apellido del pasajero
   * @returns Promise con resultado completo de validación
   */
  async validateDocumentComplete(
    documentData: DocumentUploadData,
    seatType: 'child' | 'elderly' | 'disabled',
    firstName: string,
    lastName: string
  ): Promise<ValidationResult> {
    try {
      const validationResult = await this.validateDocument(documentData);
      const { documentValidation, ageValidation } = validationResult.data;

      // Verificar que sea un documento válido primero
      if (!documentValidation.isValidIdCard || documentValidation.confidence < 70) {
        return {
          isValid: false,
          validationData: validationResult,
          reason: 'El documento no es válido o la confianza es muy baja'
        };
      }

      // Validar nombres y apellidos contra el texto extraído
      const nameValidation = validateNameInDocument(
        firstName, 
        lastName, 
        ageValidation.extractedFullText
      );

      if (!nameValidation.isValid) {
        return {
          isValid: false,
          validationData: validationResult,
          reason: `Los siguientes campos no coinciden con el documento: ${nameValidation.missingFields.join(', ')}`,
          nameValidation: {
            isValid: false,
            missingFields: nameValidation.missingFields,
            extractedIdNumber: extractIdNumber(ageValidation.extractedFullText) || undefined
          }
        };
      }

      // Validar según el tipo de asiento
      let isValidForType = false;
      let reason = '';

      switch (seatType) {
        case 'child':
          isValidForType = ageValidation.isMinor;
          reason = isValidForType 
            ? 'Documento válido para menor de edad' 
            : 'La persona no es menor de edad según el documento';
          break;

        case 'elderly':
          isValidForType = ageValidation.isSenior;
          reason = isValidForType 
            ? 'Documento válido para tercera edad' 
            : 'La persona no es de tercera edad según el documento';
          break;

        case 'disabled':
          isValidForType = ageValidation.isDisabilityCard;
          reason = isValidForType 
            ? 'Carnet de discapacidad válido' 
            : 'El documento no es un carnet de discapacidad válido';
          break;

        default:
          isValidForType = false;
          reason = 'Tipo de asiento no válido';
      }

      return {
        isValid: isValidForType,
        validationData: validationResult,
        reason,
        nameValidation: {
          isValid: true,
          missingFields: [],
          extractedIdNumber: extractIdNumber(ageValidation.extractedFullText) || undefined
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async validateDocumentForDiscount(
    documentData: DocumentUploadData, 
    seatType: 'child' | 'elderly' | 'disabled'
  ): Promise<{
    isValid: boolean;
    validationData: ValidateDocumentResponse;
    reason?: string;
  }> {
    try {
      const validationResult = await this.validateDocument(documentData);
      const { documentValidation, ageValidation } = validationResult.data;

      // Verificar que sea un documento válido primero
      if (!documentValidation.isValidIdCard || documentValidation.confidence < 70) {
        return {
          isValid: false,
          validationData: validationResult,
          reason: 'El documento no es válido o la confianza es muy baja'
        };
      }

      // Validar según el tipo de asiento
      let isValidForType = false;
      let reason = '';

      switch (seatType) {
        case 'child':
          isValidForType = ageValidation.isMinor;
          reason = isValidForType 
            ? 'Documento válido para menor de edad' 
            : 'La persona no es menor de edad según el documento';
          break;

        case 'elderly':
          isValidForType = ageValidation.isSenior;
          reason = isValidForType 
            ? 'Documento válido para tercera edad' 
            : 'La persona no es de tercera edad según el documento';
          break;

        case 'disabled':
          isValidForType = ageValidation.isDisabilityCard;
          reason = isValidForType 
            ? 'Carnet de discapacidad válido' 
            : 'El documento no es un carnet de discapacidad válido';
          break;

        default:
          isValidForType = false;
          reason = 'Tipo de asiento no válido';
      }

      return {
        isValid: isValidForType,
        validationData: validationResult,
        reason
      };
    } catch (error) {
      throw error;
    }
  }
}

// Exportar una instancia del servicio
export const awsService = new AwsService();

export default awsService;