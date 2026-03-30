import { Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { prisma } from "../configs/prisma.js";
import * as Sentry from "@sentry/node"




const clerkWebhooks = async (req: Request, res: Response) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
      return res.status(500).json({
        message: "CLERK_WEBHOOK_SIGNING_SECRET is missing in backend environment",
      });
    }

    const evt: any = await verifyWebhook(req, { signingSecret });
    const { data, type } = evt;

    switch (type) {
      case "user.created":
      case "user.updated": {
        const email = data?.email_addresses?.[0]?.email_address ?? "";
        const fullName = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();
        const image = data?.profile_image_url || data?.image_url || "";

        await prisma.user.upsert({
          where: { id: data.id },
          update: {
            email,
            name: fullName || "User",
            image,
          },
          create: {
            id: data.id,
            email,
            name: fullName || "User",
            image,
          },
        });
        break;
      }

      case "user.deleted": {
        await prisma.user.delete({
          where: { id: data.id },
        }).catch(() => {}); // prevent crash if already deleted
        break;
      }

      case "paymentAttempt.updated": {
        if (
          (data.charge_type === "recurring" ||
            data.charge_type === "checkout") &&
          data.status === "paid"
        ) {
          const credits = { pro: 80, premium: 240 };

          const clerkUserId = data?.payer?.user_id;
          const planId = data?.subscription_items?.[0]?.plan?.slug;

          if (!planId || !(planId in credits)) {
            return res.status(400).json({ message: "Invalid plan" });
          }

          await prisma.user.update({
            where: { id: clerkUserId },
            data: {
              credits: {
                increment: credits[planId as keyof typeof credits],
              },
            },
          });
        }
        break;
      }

      default:
        break;
    }

    return res.json({ message: "Webhook Received: " + type });
  } catch (error: any) {
    Sentry.captureException(error)
    return res.status(500).json({ message: error.message });
  }
};

export default clerkWebhooks;