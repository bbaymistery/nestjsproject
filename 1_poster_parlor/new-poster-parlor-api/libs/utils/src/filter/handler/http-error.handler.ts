import { HttpException } from '@nestjs/common';
import { ErrorResponse, HttpExceptionResponse } from '@new-poster-parlor-api/shared';

/**
 * 🛠️ HTTP ERROR HANDLER (Standart HTTP Xəta Həll Edicisi)
 * 
 * 💡 NƏ İŞƏ YARIYIR?
 * NestJS-də standart `HttpException` (məsələn: 400 Bad Request, 401 Unauthorized, 404 Not Found)
 * baş verdikdə bu funksiya işə düşür.
 * 
 * 🔍 NƏ EDİR?
 * 1. Xətanın status kodunu alır (400, 401, 404 və s.).
 * 2. Yoxlayır: Bəlkə bu NestJS ValidationPipe-dan gələn massiv şəklində xətadır?
 * 3. Cavabı standart `{ success: false, statusCode, timestamp, path, error }` JSON obyektinə salır.
 */
export function handleHttpError(exception: HttpException, path: string): ErrorResponse {
  // Xətanın HTTP Status kodunu (404, 400 və s.) alırıq
  const statusCode = exception.getStatus();
  const response = exception.getResponse() as HttpExceptionResponse;

  // Əgər message bir massivdirsə (array), deməli DTO validation xətasıdır
  const isValidationError = Array.isArray(response.message);

  return {
    success: false,
    message: isValidationError
      ? 'Validation failed'
      : typeof response.message === 'string'
        ? response.message
        : 'Bad Request',
    statusCode,
    path,
    timestamp: new Date().toISOString(),
    error: {
      code: response.error || 'HTTP_EXCEPTION',
      // Əgər validation xətasıdırsa, sahə-sahə massiv şəklində siyahı hazırlayırıq
      ...(isValidationError && {
        validationErrors: (response.message as string[]).map((msg: string) => ({
          field: msg.split(' ')[0],
          message: msg,
        })),
      }),
    },
  };
}

