import { faker } from "@faker-js/faker";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { SEED_IDS } from "../constants.js";
import { uniquePhone } from "../utils.js";

export async function seedAddresses(prisma: PrismaClient): Promise<number> {
    const customerUsers = [
        {
            id: SEED_IDS.users.customerA,
            addressId: SEED_IDS.addresses.customerA,
            phoneIndex: 21,
        },
        {
            id: SEED_IDS.users.customerB,
            addressId: SEED_IDS.addresses.customerB,
            phoneIndex: 22,
        },
        {
            id: SEED_IDS.users.customerC,
            addressId: SEED_IDS.addresses.customerC,
            phoneIndex: 23,
        },
        {
            id: SEED_IDS.users.customerD,
            addressId: SEED_IDS.addresses.customerD,
            phoneIndex: 24,
        },
        {
            id: SEED_IDS.users.customerUnverified,
            addressId: SEED_IDS.addresses.customerUnverified,
            phoneIndex: 25,
        },
    ] as const;

    const addresses: Prisma.AddressCreateManyInput[] = customerUsers.map((customer, index) => ({
        id: customer.addressId,
        userId: customer.id,
        type: index === 0 ? "HOME" : "OTHER",
        recipientName: faker.person.fullName(),
        recipientPhone: uniquePhone(customer.phoneIndex),
        streetAddress: faker.location.streetAddress(),
        wardDistrict: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode("#####"),
        country: "Vietnam",
        isDefault: true,
    }));

    await prisma.address.createMany({ data: addresses });

    return addresses.length;
}
