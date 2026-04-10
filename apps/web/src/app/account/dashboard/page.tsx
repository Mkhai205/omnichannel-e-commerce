"use client";

import type { CustomerOrderListItem, UserAddress } from "@repo/shared-types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPinIcon, PackageIcon, UserIcon } from "lucide-react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { formatVnd } from "@/lib/currency";
import { toFriendlyErrorMessage } from "@/lib/toast-messages";
import { getCustomerOrders } from "@/services/order-service";
import { getMyAddresses } from "@/services/users-service";
import {
    formatOrderDate,
    getOrderStatusBadgeClass,
    getOrderStatusLabel,
} from "../orders/_lib/order-presentation";
import { AccountPageHeader } from "../_components/account-page-header";

export default function AccountDashboardPage() {
    const { user, isInitializing: isAuthInitializing } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [recentOrders, setRecentOrders] = useState<CustomerOrderListItem[]>([]);

    useEffect(() => {
        let isActive = true;

        const loadDashboardData = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [addressResponse, orderResponse] = await Promise.all([
                    getMyAddresses(),
                    getCustomerOrders({ page: 1, limit: 5 }),
                ]);

                if (!isActive) {
                    return;
                }

                setAddresses(addressResponse.addresses);
                setRecentOrders(orderResponse.data);
            } catch (error) {
                if (!isActive) {
                    return;
                }

                setErrorMessage(
                    toFriendlyErrorMessage(error, "Không thể tải thông tin tài khoản."),
                );
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        void loadDashboardData();

        return () => {
            isActive = false;
        };
    }, []);

    const defaultAddress = useMemo(() => {
        if (addresses.length === 0) {
            return null;
        }

        return addresses.find((address) => address.isDefault) ?? addresses[0];
    }, [addresses]);

    const userInitials = useMemo(() => {
        if (!user?.fullName) {
            return "U";
        }

        return user.fullName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    }, [user?.fullName]);

    return (
        <>
            <AccountPageHeader
                title="My Account"
                description="Theo dõi đơn hàng và quản lý thông tin cá nhân của bạn."
            />

            {isLoading || isAuthInitializing ? (
                <section className="grid gap-4 lg:grid-cols-2">
                    <div className="h-52 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                    <div className="h-52 animate-pulse rounded-2xl border border-gray-200 bg-white" />
                </section>
            ) : null}

            {!isLoading && errorMessage ? (
                <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                    {errorMessage}
                </section>
            ) : null}

            {!isLoading && !errorMessage ? (
                <>
                    <section className="grid gap-4 xl:grid-cols-2">
                        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="inline-flex size-16 items-center justify-center rounded-full bg-success text-lg font-semibold text-success-foreground">
                                {userInitials}
                            </div>
                            <h2 className="mt-3 text-lg font-semibold text-gray-900">
                                {user?.fullName ?? "Khách hàng"}
                            </h2>
                            <p className="text-sm text-gray-500">Customer</p>

                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                <li className="inline-flex items-center gap-2">
                                    <UserIcon className="size-4 text-gray-500" />
                                    {user?.email ?? "-"}
                                </li>
                                <li className="inline-flex items-center gap-2">
                                    <PackageIcon className="size-4 text-gray-500" />
                                    {recentOrders.length} đơn gần nhất
                                </li>
                            </ul>

                            <Button
                                asChild
                                className="mt-4 bg-success text-success-foreground hover:bg-success-dark"
                            >
                                <Link href="/account/settings">Edit Profile</Link>
                            </Button>
                        </article>

                        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                Billing Address
                            </h3>
                            {defaultAddress ? (
                                <div className="mt-3 space-y-2 text-sm text-gray-700">
                                    <p className="font-semibold text-gray-900">
                                        {defaultAddress.recipientName}
                                    </p>
                                    <p>
                                        {defaultAddress.streetAddress}
                                        {defaultAddress.wardDistrict
                                            ? `, ${defaultAddress.wardDistrict}`
                                            : ""}
                                        , {defaultAddress.city}
                                    </p>
                                    <p>{defaultAddress.recipientPhone}</p>
                                    <p>{user?.email ?? "-"}</p>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-gray-600">
                                    Chưa có địa chỉ mặc định. Vui lòng cập nhật trong phần cài đặt.
                                </p>
                            )}

                            <Button asChild variant="outline" className="mt-4">
                                <Link href="/account/settings">
                                    <MapPinIcon className="size-4" />
                                    Edit Address
                                </Link>
                            </Button>
                        </article>
                    </section>

                    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-base font-semibold text-gray-900">
                                Recent Order History
                            </h3>
                            <Link
                                href="/account/orders"
                                className="text-sm font-medium text-success-dark hover:text-success"
                            >
                                View All
                            </Link>
                        </div>

                        {recentOrders.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium text-gray-900">
                                                {order.orderNumber}
                                            </TableCell>
                                            <TableCell>
                                                {formatOrderDate(order.createdAt)}
                                            </TableCell>
                                            <TableCell>{formatVnd(order.totalAmount)}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${getOrderStatusBadgeClass(order.status)}`}
                                                >
                                                    {getOrderStatusLabel(order.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/account/orders/${order.id}`}
                                                    className="text-sm font-medium text-success-dark hover:text-success"
                                                >
                                                    View Details
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Bạn chưa có đơn hàng nào gần đây.
                            </p>
                        )}
                    </section>
                </>
            ) : null}
        </>
    );
}
