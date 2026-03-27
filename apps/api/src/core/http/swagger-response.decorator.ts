import { HttpStatus, applyDecorators, type Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ApiErrorResponseSwaggerDto,
  ApiSuccessResponseSwaggerDto,
} from './swagger-response.dto';

type SwaggerModel = Type<unknown>;

interface ErrorResponsesOptions {
  badRequest?: string | false;
  unauthorized?: string | false;
  notFound?: string | false;
  internalServerError?: string | false;
}

function buildSuccessEnvelopeSchema(model: SwaggerModel, statusCode: number) {
  return {
    allOf: [
      { $ref: getSchemaPath(ApiSuccessResponseSwaggerDto) },
      {
        properties: {
          statusCode: {
            type: 'number',
            example: statusCode,
          },
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    ],
  };
}

function buildErrorEnvelopeSchema(statusCode: number) {
  return {
    allOf: [
      { $ref: getSchemaPath(ApiErrorResponseSwaggerDto) },
      {
        properties: {
          statusCode: {
            type: 'number',
            example: statusCode,
          },
          data: {
            type: 'null',
            nullable: true,
            example: null,
          },
        },
      },
    ],
  };
}

export function ApiOkEnvelopeResponse(
  model: SwaggerModel,
  description = 'Success',
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseSwaggerDto, model),
    ApiOkResponse({
      description,
      schema: buildSuccessEnvelopeSchema(model, HttpStatus.OK),
    }),
  );
}

export function ApiCreatedEnvelopeResponse(
  model: SwaggerModel,
  description = 'Created successfully',
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(ApiSuccessResponseSwaggerDto, model),
    ApiCreatedResponse({
      description,
      schema: buildSuccessEnvelopeSchema(model, HttpStatus.CREATED),
    }),
  );
}

export function ApiCommonErrorResponses(
  options: ErrorResponsesOptions = {},
): MethodDecorator {
  const decorators: Array<MethodDecorator | ClassDecorator> = [
    ApiExtraModels(ApiErrorResponseSwaggerDto),
  ];

  if (options.badRequest !== false) {
    decorators.push(
      ApiBadRequestResponse({
        description: options.badRequest ?? 'Invalid request payload',
        schema: buildErrorEnvelopeSchema(HttpStatus.BAD_REQUEST),
      }),
    );
  }

  if (options.unauthorized !== false) {
    decorators.push(
      ApiUnauthorizedResponse({
        description: options.unauthorized ?? 'Unauthorized',
        schema: buildErrorEnvelopeSchema(HttpStatus.UNAUTHORIZED),
      }),
    );
  }

  if (options.notFound !== false) {
    decorators.push(
      ApiNotFoundResponse({
        description: options.notFound ?? 'Resource not found',
        schema: buildErrorEnvelopeSchema(HttpStatus.NOT_FOUND),
      }),
    );
  }

  if (options.internalServerError !== false) {
    decorators.push(
      ApiInternalServerErrorResponse({
        description: options.internalServerError ?? 'Internal server error',
        schema: buildErrorEnvelopeSchema(HttpStatus.INTERNAL_SERVER_ERROR),
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function ApiAuthSchemes(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth('bearer-auth'),
    ApiCookieAuth('cookie-auth'),
  );
}
