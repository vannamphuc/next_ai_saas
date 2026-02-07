import aj, {
  detectBot,
  sensitiveInfo,
  shield,
  slidingWindow,
} from '@/lib/arcject'
import { base } from './base'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs'

const buildAiAj = () =>
  aj
    .withRule(
      shield({
        mode: 'LIVE',
      }),
    )
    .withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: 3,
      }),
    )
    .withRule(
      detectBot({
        mode: 'LIVE',
        allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW'],
      }),
    )
    .withRule(
      sensitiveInfo({
        mode: 'LIVE',
        deny: ['EMAIL', 'PHONE', 'CREDIT_CARD', 'IP_ADDRESS'],
      }),
    )

export const aiSecurityMiddleware = base
  .$context<{
    request: Request
    user: KindeUser<Record<string, unknown>>
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildAiAj().protect(context.request, {
      userId: context.user?.id,
    })

    if (decision.isDenied()) {
      if (decision.reason.isSensitiveInfo()) {
        throw errors.RATE_LIMITED({
          message: 'Sensitive information detected. Please try again later.',
        })
      }

      if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: 'Too many write requests. Please try again later.',
        })
      }

      if (decision.reason.isBot()) {
        throw errors.FORBIDDEN({
          message: 'Bot detected. Please try again later.',
        })
      }

      if (decision.reason.isShield()) {
        throw errors.FORBIDDEN({
          message: 'Request Blocked.',
        })
      }

      throw errors.FORBIDDEN({
        message: 'Request Blocked.',
      })
    }

    return next()
  })
