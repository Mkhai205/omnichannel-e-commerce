import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import type { SeedAddressContext } from "../types.js";
import { uniquePhone } from "../utils.js";
import { randomVietnameseAddress, randomVietnameseFullName } from "../vietnamese.js";

export async function seedAddresses(prisma: PrismaClient): Promise<SeedAddressContext> {
    const addressRecords: SeedAddressContext["records"] = [
        {
            id: randomUUID(),
            userId: SEED_IDS.users.customerA,
        },
        {
            id: randomUUID(),
            userId: SEED_IDS.users.customerB,
        },
        {
            id: randomUUID(),
            userId: SEED_IDS.users.customerC,
        },
    ];

    const addresses: Prisma.AddressCreateManyInput[] = addressRecords.map((record, index) => {
        const localizedAddress = randomVietnameseAddress();

        return {
            id: record.id,
            userId: record.userId,
            type: index === 0 ? "HOME" : "OTHER",
            recipientName: randomVietnameseFullName(),
            recipientPhone: uniquePhone(21 + index),
            streetAddress: localizedAddress.streetAddress,
            wardDistrict: localizedAddress.wardDistrict,
            city: localizedAddress.city,
            state: localizedAddress.state,
            postalCode: localizedAddress.postalCode,
            country: localizedAddress.country,
            isDefault: true,
        };
    });

    await prisma.address.createMany({ data: addresses });

    return {
        count: addresses.length,
        records: addressRecords,
    };
}
