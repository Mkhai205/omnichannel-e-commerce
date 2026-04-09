import type { Prisma, PrismaClient } from "../generated/prisma/client.js";
import type { SeedCleanupMode } from "./types.js";

type CleanupSummary = Record<string, number>;

type SeedScope = {
    userIds: string[];
    shopIds: string[];
    addressIds: string[];
    cartIds: string[];
    orderIds: string[];
    paymentIds: string[];
    variantIds: string[];
    productIds: string[];
    generatedVariantIds: string[];
    generatedProductIds: string[];
};

const SEED_EMAIL_SUFFIX = "seed@demo.local";
const SEED_PREFIX = "SEED-";
const SEED_GENERATED_VARIANT_PREFIX = "SEED-EXT-";

function dedupe(values: string[]): string[] {
    return [...new Set(values)];
}

async function collectSeedScope(prisma: PrismaClient): Promise<SeedScope> {
    const seedUsers = await prisma.user.findMany({
        where: {
            email: {
                endsWith: SEED_EMAIL_SUFFIX,
            },
        },
        select: {
            id: true,
        },
    });
    const userIds = seedUsers.map((item) => item.id);

    const shopIds =
        userIds.length > 0
            ? (
                  await prisma.shop.findMany({
                      where: {
                          userId: {
                              in: userIds,
                          },
                      },
                      select: {
                          id: true,
                      },
                  })
              ).map((item) => item.id)
            : [];

    const addressIds =
        userIds.length > 0
            ? (
                  await prisma.address.findMany({
                      where: {
                          userId: {
                              in: userIds,
                          },
                      },
                      select: {
                          id: true,
                      },
                  })
              ).map((item) => item.id)
            : [];

    const cartIds =
        userIds.length > 0
            ? (
                  await prisma.cart.findMany({
                      where: {
                          userId: {
                              in: userIds,
                          },
                      },
                      select: {
                          id: true,
                      },
                  })
              ).map((item) => item.id)
            : [];

    const orderWhereOr: Prisma.OrderWhereInput[] = [
        {
            orderNumber: {
                startsWith: SEED_PREFIX,
            },
        },
    ];

    if (userIds.length > 0) {
        orderWhereOr.push({
            userId: {
                in: userIds,
            },
        });
    }

    if (shopIds.length > 0) {
        orderWhereOr.push({
            shopId: {
                in: shopIds,
            },
        });
    }

    const orderIds = (
        await prisma.order.findMany({
            where: {
                OR: orderWhereOr,
            },
            select: {
                id: true,
            },
        })
    ).map((item) => item.id);

    const paymentWhereOr: Prisma.PaymentWhereInput[] = [
        {
            txnRef: {
                startsWith: SEED_PREFIX,
            },
        },
    ];

    if (userIds.length > 0) {
        paymentWhereOr.push({
            userId: {
                in: userIds,
            },
        });
    }

    const paymentIds = (
        await prisma.payment.findMany({
            where: {
                OR: paymentWhereOr,
            },
            select: {
                id: true,
            },
        })
    ).map((item) => item.id);

    const variantWhereOr: Prisma.ProductVariantWhereInput[] = [
        {
            sku: {
                startsWith: SEED_PREFIX,
            },
        },
    ];

    if (shopIds.length > 0) {
        variantWhereOr.push({
            product: {
                shopId: {
                    in: shopIds,
                },
            },
        });
    }

    const variants = await prisma.productVariant.findMany({
        where: {
            OR: variantWhereOr,
        },
        select: {
            id: true,
            productId: true,
        },
    });

    const generatedVariants = await prisma.productVariant.findMany({
        where: {
            sku: {
                startsWith: SEED_GENERATED_VARIANT_PREFIX,
            },
        },
        select: {
            id: true,
            productId: true,
        },
    });

    const shopProductIds =
        shopIds.length > 0
            ? (
                  await prisma.product.findMany({
                      where: {
                          shopId: {
                              in: shopIds,
                          },
                      },
                      select: {
                          id: true,
                      },
                  })
              ).map((item) => item.id)
            : [];

    const productIds = dedupe([
        ...shopProductIds,
        ...variants.map((item) => item.productId),
        ...generatedVariants.map((item) => item.productId),
    ]);

    return {
        userIds: dedupe(userIds),
        shopIds: dedupe(shopIds),
        addressIds: dedupe(addressIds),
        cartIds: dedupe(cartIds),
        orderIds: dedupe(orderIds),
        paymentIds: dedupe(paymentIds),
        variantIds: dedupe(variants.map((item) => item.id)),
        productIds,
        generatedVariantIds: dedupe(generatedVariants.map((item) => item.id)),
        generatedProductIds: dedupe(generatedVariants.map((item) => item.productId)),
    };
}

async function previewResetAll(prisma: PrismaClient): Promise<CleanupSummary> {
    return {
        paymentWebhookLogs: await prisma.paymentWebhookLog.count(),
        paymentOrders: await prisma.paymentOrder.count(),
        adminWalletLedgers: await prisma.adminWalletLedger.count(),
        sellerSettlements: await prisma.sellerSettlement.count(),
        orderItems: await prisma.orderItem.count(),
        cartItems: await prisma.cartItem.count(),
        payments: await prisma.payment.count(),
        orders: await prisma.order.count(),
        carts: await prisma.cart.count(),
        addresses: await prisma.address.count(),
        productReviews: await prisma.productReview.count(),
        productVariants: await prisma.productVariant.count(),
        products: await prisma.product.count(),
        categories: await prisma.category.count(),
        sellerWallets: await prisma.sellerWallet.count(),
        adminWallets: await prisma.adminWallet.count(),
        shops: await prisma.shop.count(),
        refreshTokens: await prisma.refreshToken.count(),
        oauthAccounts: await prisma.oauthAccount.count(),
        users: await prisma.user.count(),
    };
}

async function previewResetSeedOnly(prisma: PrismaClient): Promise<CleanupSummary> {
    const scope = await collectSeedScope(prisma);

    return {
        paymentWebhookLogs: await prisma.paymentWebhookLog.count({
            where: {
                OR: [
                    {
                        paymentId: {
                            in: scope.paymentIds,
                        },
                    },
                    {
                        eventKey: {
                            startsWith: SEED_PREFIX,
                        },
                    },
                ],
            },
        }),
        paymentOrders:
            scope.paymentIds.length > 0 || scope.orderIds.length > 0
                ? await prisma.paymentOrder.count({
                      where: {
                          OR: [
                              {
                                  paymentId: {
                                      in: scope.paymentIds,
                                  },
                              },
                              {
                                  orderId: {
                                      in: scope.orderIds,
                                  },
                              },
                          ],
                      },
                  })
                : 0,
        adminWalletLedgers: await prisma.adminWalletLedger.count({
            where: {
                OR: [
                    {
                        paymentId: {
                            in: scope.paymentIds,
                        },
                    },
                    {
                        orderId: {
                            in: scope.orderIds,
                        },
                    },
                    {
                        idempotencyKey: {
                            startsWith: SEED_PREFIX,
                        },
                    },
                ],
            },
        }),
        sellerSettlements: await prisma.sellerSettlement.count({
            where: {
                OR: [
                    {
                        orderId: {
                            in: scope.orderIds,
                        },
                    },
                    {
                        shopId: {
                            in: scope.shopIds,
                        },
                    },
                    {
                        idempotencyKey: {
                            startsWith: SEED_PREFIX,
                        },
                    },
                ],
            },
        }),
        orderItems:
            scope.orderIds.length > 0 || scope.variantIds.length > 0
                ? await prisma.orderItem.count({
                      where: {
                          OR: [
                              {
                                  orderId: {
                                      in: scope.orderIds,
                                  },
                              },
                              {
                                  variantId: {
                                      in: scope.variantIds,
                                  },
                              },
                          ],
                      },
                  })
                : 0,
        cartItems:
            scope.cartIds.length > 0 || scope.variantIds.length > 0
                ? await prisma.cartItem.count({
                      where: {
                          OR: [
                              {
                                  cartId: {
                                      in: scope.cartIds,
                                  },
                              },
                              {
                                  variantId: {
                                      in: scope.variantIds,
                                  },
                              },
                          ],
                      },
                  })
                : 0,
        payments:
            scope.paymentIds.length > 0
                ? await prisma.payment.count({
                      where: {
                          id: {
                              in: scope.paymentIds,
                          },
                      },
                  })
                : 0,
        orders:
            scope.orderIds.length > 0
                ? await prisma.order.count({
                      where: {
                          id: {
                              in: scope.orderIds,
                          },
                      },
                  })
                : 0,
        carts:
            scope.cartIds.length > 0
                ? await prisma.cart.count({
                      where: {
                          id: {
                              in: scope.cartIds,
                          },
                      },
                  })
                : 0,
        addresses:
            scope.addressIds.length > 0
                ? await prisma.address.count({
                      where: {
                          id: {
                              in: scope.addressIds,
                          },
                      },
                  })
                : 0,
        productReviews:
            scope.productIds.length > 0 || scope.userIds.length > 0
                ? await prisma.productReview.count({
                      where: {
                          OR: [
                              {
                                  productId: {
                                      in: scope.productIds,
                                  },
                              },
                              {
                                  userId: {
                                      in: scope.userIds,
                                  },
                              },
                          ],
                      },
                  })
                : 0,
        productVariants:
            scope.variantIds.length > 0
                ? await prisma.productVariant.count({
                      where: {
                          id: {
                              in: scope.variantIds,
                          },
                      },
                  })
                : 0,
        products:
            scope.productIds.length > 0
                ? await prisma.product.count({
                      where: {
                          id: {
                              in: scope.productIds,
                          },
                      },
                  })
                : 0,
        sellerWallets:
            scope.shopIds.length > 0
                ? await prisma.sellerWallet.count({
                      where: {
                          shopId: {
                              in: scope.shopIds,
                          },
                      },
                  })
                : 0,
        adminWallets: await prisma.adminWallet.count({
            where: {
                code: {
                    startsWith: SEED_PREFIX,
                },
            },
        }),
        shops:
            scope.shopIds.length > 0
                ? await prisma.shop.count({
                      where: {
                          id: {
                              in: scope.shopIds,
                          },
                      },
                  })
                : 0,
        refreshTokens:
            scope.userIds.length > 0
                ? await prisma.refreshToken.count({
                      where: {
                          userId: {
                              in: scope.userIds,
                          },
                      },
                  })
                : 0,
        oauthAccounts:
            scope.userIds.length > 0
                ? await prisma.oauthAccount.count({
                      where: {
                          userId: {
                              in: scope.userIds,
                          },
                      },
                  })
                : 0,
        users:
            scope.userIds.length > 0
                ? await prisma.user.count({
                      where: {
                          id: {
                              in: scope.userIds,
                          },
                      },
                  })
                : 0,
    };
}

async function previewPruneCatalogGenerated(prisma: PrismaClient): Promise<CleanupSummary> {
    const scope = await collectSeedScope(prisma);

    return {
        orderItems:
            scope.generatedVariantIds.length > 0
                ? await prisma.orderItem.count({
                      where: {
                          variantId: {
                              in: scope.generatedVariantIds,
                          },
                      },
                  })
                : 0,
        cartItems:
            scope.generatedVariantIds.length > 0
                ? await prisma.cartItem.count({
                      where: {
                          variantId: {
                              in: scope.generatedVariantIds,
                          },
                      },
                  })
                : 0,
        productReviews:
            scope.generatedProductIds.length > 0
                ? await prisma.productReview.count({
                      where: {
                          productId: {
                              in: scope.generatedProductIds,
                          },
                      },
                  })
                : 0,
        productVariants:
            scope.generatedVariantIds.length > 0
                ? await prisma.productVariant.count({
                      where: {
                          id: {
                              in: scope.generatedVariantIds,
                          },
                      },
                  })
                : 0,
        products:
            scope.generatedProductIds.length > 0
                ? await prisma.product.count({
                      where: {
                          id: {
                              in: scope.generatedProductIds,
                          },
                      },
                  })
                : 0,
    };
}

export async function previewCleanup(
    prisma: PrismaClient,
    mode: SeedCleanupMode,
): Promise<CleanupSummary> {
    if (mode === "none") {
        return {};
    }

    if (mode === "reset-all") {
        return previewResetAll(prisma);
    }

    if (mode === "prune-catalog-generated") {
        return previewPruneCatalogGenerated(prisma);
    }

    return previewResetSeedOnly(prisma);
}

async function cleanupResetAll(prisma: PrismaClient): Promise<CleanupSummary> {
    return {
        paymentWebhookLogs: (await prisma.paymentWebhookLog.deleteMany()).count,
        paymentOrders: (await prisma.paymentOrder.deleteMany()).count,
        adminWalletLedgers: (await prisma.adminWalletLedger.deleteMany()).count,
        sellerSettlements: (await prisma.sellerSettlement.deleteMany()).count,
        orderItems: (await prisma.orderItem.deleteMany()).count,
        cartItems: (await prisma.cartItem.deleteMany()).count,
        payments: (await prisma.payment.deleteMany()).count,
        orders: (await prisma.order.deleteMany()).count,
        carts: (await prisma.cart.deleteMany()).count,
        addresses: (await prisma.address.deleteMany()).count,
        productReviews: (await prisma.productReview.deleteMany()).count,
        productVariants: (await prisma.productVariant.deleteMany()).count,
        products: (await prisma.product.deleteMany()).count,
        categories: (await prisma.category.deleteMany()).count,
        sellerWallets: (await prisma.sellerWallet.deleteMany()).count,
        adminWallets: (await prisma.adminWallet.deleteMany()).count,
        shops: (await prisma.shop.deleteMany()).count,
        refreshTokens: (await prisma.refreshToken.deleteMany()).count,
        oauthAccounts: (await prisma.oauthAccount.deleteMany()).count,
        users: (await prisma.user.deleteMany()).count,
    };
}

async function cleanupResetSeedOnly(prisma: PrismaClient): Promise<CleanupSummary> {
    const scope = await collectSeedScope(prisma);

    const paymentWebhookLogs = await prisma.paymentWebhookLog.deleteMany({
        where: {
            OR: [
                {
                    paymentId: {
                        in: scope.paymentIds,
                    },
                },
                {
                    eventKey: {
                        startsWith: SEED_PREFIX,
                    },
                },
            ],
        },
    });

    const paymentOrders =
        scope.paymentIds.length > 0 || scope.orderIds.length > 0
            ? await prisma.paymentOrder.deleteMany({
                  where: {
                      OR: [
                          {
                              paymentId: {
                                  in: scope.paymentIds,
                              },
                          },
                          {
                              orderId: {
                                  in: scope.orderIds,
                              },
                          },
                      ],
                  },
              })
            : { count: 0 };

    const adminWalletLedgers = await prisma.adminWalletLedger.deleteMany({
        where: {
            OR: [
                {
                    paymentId: {
                        in: scope.paymentIds,
                    },
                },
                {
                    orderId: {
                        in: scope.orderIds,
                    },
                },
                {
                    idempotencyKey: {
                        startsWith: SEED_PREFIX,
                    },
                },
            ],
        },
    });

    const sellerSettlements = await prisma.sellerSettlement.deleteMany({
        where: {
            OR: [
                {
                    orderId: {
                        in: scope.orderIds,
                    },
                },
                {
                    shopId: {
                        in: scope.shopIds,
                    },
                },
                {
                    idempotencyKey: {
                        startsWith: SEED_PREFIX,
                    },
                },
            ],
        },
    });

    const orderItems =
        scope.orderIds.length > 0 || scope.variantIds.length > 0
            ? await prisma.orderItem.deleteMany({
                  where: {
                      OR: [
                          {
                              orderId: {
                                  in: scope.orderIds,
                              },
                          },
                          {
                              variantId: {
                                  in: scope.variantIds,
                              },
                          },
                      ],
                  },
              })
            : { count: 0 };

    const cartItems =
        scope.cartIds.length > 0 || scope.variantIds.length > 0
            ? await prisma.cartItem.deleteMany({
                  where: {
                      OR: [
                          {
                              cartId: {
                                  in: scope.cartIds,
                              },
                          },
                          {
                              variantId: {
                                  in: scope.variantIds,
                              },
                          },
                      ],
                  },
              })
            : { count: 0 };

    const payments =
        scope.paymentIds.length > 0
            ? await prisma.payment.deleteMany({
                  where: {
                      id: {
                          in: scope.paymentIds,
                      },
                  },
              })
            : { count: 0 };

    const orders =
        scope.orderIds.length > 0
            ? await prisma.order.deleteMany({
                  where: {
                      id: {
                          in: scope.orderIds,
                      },
                  },
              })
            : { count: 0 };

    const carts =
        scope.cartIds.length > 0
            ? await prisma.cart.deleteMany({
                  where: {
                      id: {
                          in: scope.cartIds,
                      },
                  },
              })
            : { count: 0 };

    const addresses =
        scope.addressIds.length > 0
            ? await prisma.address.deleteMany({
                  where: {
                      id: {
                          in: scope.addressIds,
                      },
                  },
              })
            : { count: 0 };

    const productReviews =
        scope.productIds.length > 0 || scope.userIds.length > 0
            ? await prisma.productReview.deleteMany({
                  where: {
                      OR: [
                          {
                              productId: {
                                  in: scope.productIds,
                              },
                          },
                          {
                              userId: {
                                  in: scope.userIds,
                              },
                          },
                      ],
                  },
              })
            : { count: 0 };

    const productVariants =
        scope.variantIds.length > 0
            ? await prisma.productVariant.deleteMany({
                  where: {
                      id: {
                          in: scope.variantIds,
                      },
                  },
              })
            : { count: 0 };

    const products =
        scope.productIds.length > 0
            ? await prisma.product.deleteMany({
                  where: {
                      id: {
                          in: scope.productIds,
                      },
                  },
              })
            : { count: 0 };

    const sellerWallets =
        scope.shopIds.length > 0
            ? await prisma.sellerWallet.deleteMany({
                  where: {
                      shopId: {
                          in: scope.shopIds,
                      },
                  },
              })
            : { count: 0 };

    const adminWallets = await prisma.adminWallet.deleteMany({
        where: {
            code: {
                startsWith: SEED_PREFIX,
            },
        },
    });

    const shops =
        scope.shopIds.length > 0
            ? await prisma.shop.deleteMany({
                  where: {
                      id: {
                          in: scope.shopIds,
                      },
                  },
              })
            : { count: 0 };

    const refreshTokens =
        scope.userIds.length > 0
            ? await prisma.refreshToken.deleteMany({
                  where: {
                      userId: {
                          in: scope.userIds,
                      },
                  },
              })
            : { count: 0 };

    const oauthAccounts =
        scope.userIds.length > 0
            ? await prisma.oauthAccount.deleteMany({
                  where: {
                      userId: {
                          in: scope.userIds,
                      },
                  },
              })
            : { count: 0 };

    const users =
        scope.userIds.length > 0
            ? await prisma.user.deleteMany({
                  where: {
                      id: {
                          in: scope.userIds,
                      },
                  },
              })
            : { count: 0 };

    return {
        paymentWebhookLogs: paymentWebhookLogs.count,
        paymentOrders: paymentOrders.count,
        adminWalletLedgers: adminWalletLedgers.count,
        sellerSettlements: sellerSettlements.count,
        orderItems: orderItems.count,
        cartItems: cartItems.count,
        payments: payments.count,
        orders: orders.count,
        carts: carts.count,
        addresses: addresses.count,
        productReviews: productReviews.count,
        productVariants: productVariants.count,
        products: products.count,
        categories: 0,
        sellerWallets: sellerWallets.count,
        adminWallets: adminWallets.count,
        shops: shops.count,
        refreshTokens: refreshTokens.count,
        oauthAccounts: oauthAccounts.count,
        users: users.count,
    };
}

async function cleanupPruneCatalogGenerated(prisma: PrismaClient): Promise<CleanupSummary> {
    const scope = await collectSeedScope(prisma);

    if (scope.generatedVariantIds.length === 0 && scope.generatedProductIds.length === 0) {
        return {
            orderItems: 0,
            cartItems: 0,
            productReviews: 0,
            productVariants: 0,
            products: 0,
        };
    }

    const orderItems =
        scope.generatedVariantIds.length > 0
            ? await prisma.orderItem.deleteMany({
                  where: {
                      variantId: {
                          in: scope.generatedVariantIds,
                      },
                  },
              })
            : { count: 0 };

    const cartItems =
        scope.generatedVariantIds.length > 0
            ? await prisma.cartItem.deleteMany({
                  where: {
                      variantId: {
                          in: scope.generatedVariantIds,
                      },
                  },
              })
            : { count: 0 };

    const productReviews =
        scope.generatedProductIds.length > 0
            ? await prisma.productReview.deleteMany({
                  where: {
                      productId: {
                          in: scope.generatedProductIds,
                      },
                  },
              })
            : { count: 0 };

    const productVariants =
        scope.generatedVariantIds.length > 0
            ? await prisma.productVariant.deleteMany({
                  where: {
                      id: {
                          in: scope.generatedVariantIds,
                      },
                  },
              })
            : { count: 0 };

    const products =
        scope.generatedProductIds.length > 0
            ? await prisma.product.deleteMany({
                  where: {
                      id: {
                          in: scope.generatedProductIds,
                      },
                  },
              })
            : { count: 0 };

    return {
        orderItems: orderItems.count,
        cartItems: cartItems.count,
        productReviews: productReviews.count,
        productVariants: productVariants.count,
        products: products.count,
    };
}

export async function cleanDatabase(
    prisma: PrismaClient,
    mode: SeedCleanupMode,
): Promise<CleanupSummary> {
    if (mode === "none") {
        return {};
    }

    if (mode === "reset-all") {
        return cleanupResetAll(prisma);
    }

    if (mode === "prune-catalog-generated") {
        return cleanupPruneCatalogGenerated(prisma);
    }

    return cleanupResetSeedOnly(prisma);
}
