import { os } from '@orpc/server'

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: 'Too many requests, please try again later.',
    status: 429,
  },
  BAD_REQUEST: {
    message:
      'The request could not be understood or was missing required parameters.',
  },
  NOT_FOUND: {
    message: 'The requested resource could not be found.',
  },
  FORBIDDEN: {
    message: 'You do not have permission to access this resource.',
  },
  UNAUTHORIZED: {
    message:
      'Authentication is required and has failed or has not yet been provided.',
  },
  INTERNAL_SERVER_ERROR: {
    message: 'An unexpected error occurred on the server.',
  },
})
