import arcject, { slidingWindow } from "@/lib/arcject"
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildStandardArcjet = () =>
    arcject.withRule(
        slidingWindow({
            mode: "LIVE",
            interval: '1m',
            max: 2
        })
    )

export const heavyWriteSecurityMiddleware = base
    .$context<{
        request: Request;
        user: KindeUser<Record<string, unknown>>;
    }>()
    .middleware(async ({ context, next, errors }) => {
        const decision = await buildStandardArcjet().protect(context.request, {
            userId: context.user?.id,
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                throw errors.RATE_LIMITED({
                    message: "Too many write requests. Please try again later.",
                })
            }

            throw errors.FORBIDDEN({
                message: "Request Blocked.",
            })
        }

        return next()
    })