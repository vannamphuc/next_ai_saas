import arcject, { detectBot, shield } from "@/lib/arcject"
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildStandardArcjet = () =>
    arcject.withRule(
        shield({
            mode: "LIVE"
        })
    ).withRule(
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW",
                "CATEGORY:MONITOR",

            ]
        })
    )

export const standardSecurityMiddlewae = base
    .$context<{
        request: Request;
        user: KindeUser<Record<string, unknown>>;
    }>()
    .middleware(async ({ context, next, errors }) => {
        const decision = await buildStandardArcjet().protect(context.request, {
            userId: context.user?.id,
        })

        if (decision.isDenied()) {
            if (decision.reason.isBot()) {
                throw errors.FORBIDDEN({
                    message: "Automated traffic is not allowed.",
                })
            }

            if (decision.reason.isShield()) {
                throw errors.FORBIDDEN({
                    message: "Access denied by security policy.",
                })
            }

            throw errors.FORBIDDEN({
                message: "Request Blocked.",
            })
        }

        return next()
    })