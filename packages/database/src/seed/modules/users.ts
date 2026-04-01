import bcrypt from "bcryptjs";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { DEFAULT_SEED_PASSWORD, SEED_IDS } from "../constants.js";
import { uniquePhone } from "../utils.js";
import { randomVietnameseFullName } from "../vietnamese.js";

export async function seedUsers(prisma: PrismaClient): Promise<number> {
    const customerNames = Array.from({ length: 5 }, () => randomVietnameseFullName());
    const passwordHash = await bcrypt.hash(DEFAULT_SEED_PASSWORD, 10);

    const users: Prisma.UserCreateManyInput[] = [
        {
            id: SEED_IDS.users.admin,
            email: "admin.seed@demo.local",
            passwordHash,
            fullName: randomVietnameseFullName(),
            phone: uniquePhone(1),
            role: "ADMIN",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.sellerApproved,
            email: "seller.approved.seed@demo.local",
            passwordHash,
            fullName: randomVietnameseFullName(),
            phone: uniquePhone(2),
            role: "SELLER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.sellerPending,
            email: "seller.pending.seed@demo.local",
            passwordHash,
            fullName: randomVietnameseFullName(),
            phone: uniquePhone(3),
            role: "SELLER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.sellerRejected,
            email: "seller.rejected.seed@demo.local",
            passwordHash,
            fullName: randomVietnameseFullName(),
            phone: uniquePhone(4),
            role: "SELLER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerA,
            email: "customer.a.seed@demo.local",
            passwordHash,
            fullName: customerNames[0] ?? randomVietnameseFullName(),
            phone: uniquePhone(5),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerB,
            email: "customer.b.seed@demo.local",
            passwordHash,
            fullName: customerNames[1] ?? randomVietnameseFullName(),
            phone: uniquePhone(6),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerC,
            email: "customer.c.seed@demo.local",
            passwordHash,
            fullName: customerNames[2] ?? randomVietnameseFullName(),
            phone: uniquePhone(7),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerD,
            email: "customer.d.seed@demo.local",
            passwordHash,
            fullName: customerNames[3] ?? randomVietnameseFullName(),
            phone: uniquePhone(8),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerUnverified,
            email: "customer.unverified.seed@demo.local",
            passwordHash,
            fullName: customerNames[4] ?? randomVietnameseFullName(),
            phone: uniquePhone(9),
            role: "CUSTOMER",
            status: "UNVERIFIED",
        },
    ];

    await prisma.user.createMany({ data: users });

    return users.length;
}
