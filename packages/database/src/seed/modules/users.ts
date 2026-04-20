import bcrypt from "bcryptjs";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { DEFAULT_SEED_PASSWORD, SEED_IDS } from "../constants.js";
import type { SeedUserContext } from "../types.js";
import { uniquePhone } from "../utils.js";
import { randomVietnameseFullName } from "../vietnamese.js";

export async function seedUsers(prisma: PrismaClient): Promise<SeedUserContext> {
    const customerNames = Array.from({ length: 3 }, () => randomVietnameseFullName());
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
            id: SEED_IDS.users.sellerA,
            email: "seller.a.seed@demo.local",
            passwordHash,
            fullName: randomVietnameseFullName(),
            phone: uniquePhone(2),
            role: "SELLER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.sellerB,
            email: "seller.b.seed@demo.local",
            passwordHash,
            fullName: randomVietnameseFullName(),
            phone: uniquePhone(3),
            role: "SELLER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerA,
            email: "customer.a.seed@demo.local",
            passwordHash,
            fullName: customerNames[0] ?? randomVietnameseFullName(),
            phone: uniquePhone(4),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerB,
            email: "customer.b.seed@demo.local",
            passwordHash,
            fullName: customerNames[1] ?? randomVietnameseFullName(),
            phone: uniquePhone(5),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
        {
            id: SEED_IDS.users.customerC,
            email: "customer.c.seed@demo.local",
            passwordHash,
            fullName: customerNames[2] ?? randomVietnameseFullName(),
            phone: uniquePhone(6),
            role: "CUSTOMER",
            status: "ACTIVE",
        },
    ];

    await prisma.user.createMany({ data: users });

    return {
        count: users.length,
        adminId: SEED_IDS.users.admin,
        sellerIds: [SEED_IDS.users.sellerA, SEED_IDS.users.sellerB],
        customerIds: [SEED_IDS.users.customerA, SEED_IDS.users.customerB, SEED_IDS.users.customerC],
    };
}
