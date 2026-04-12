"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUserListItem, UserRole, UserStatus } from "@repo/shared-types";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { isApiRequestError } from "@/services/http-client";
import {
    getAdminUsers,
    updateAdminUserRole,
    updateAdminUserStatus,
} from "@/services/users-service";

const PAGE_SIZE = 20;

const ROLE_FILTER_OPTIONS: Array<UserRole | "ALL"> = ["ALL", "CUSTOMER", "SELLER", "ADMIN"];
const STATUS_FILTER_OPTIONS: Array<UserStatus | "ALL"> = ["ALL", "ACTIVE", "BANNED", "UNVERIFIED"];

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
    const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [roleDrafts, setRoleDrafts] = useState<Record<string, UserRole>>({});
    const [mutatingUserId, setMutatingUserId] = useState<string | null>(null);

    const loadUsers = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await getAdminUsers({
                page,
                limit: PAGE_SIZE,
                search: search.trim() || undefined,
                role: roleFilter === "ALL" ? undefined : roleFilter,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            });

            setUsers(response.data);
            setTotalItems(response.meta.totalItems);
            setTotalPages(Math.max(1, response.meta.totalPages));
            setErrorMessage(null);
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to load users");
            }
        } finally {
            setIsLoading(false);
        }
    }, [page, roleFilter, search, statusFilter]);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const totalAdmins = useMemo(
        () => users.filter((user) => user.role === "ADMIN").length,
        [users],
    );

    const handleSaveRole = async (user: AdminUserListItem) => {
        const nextRole = roleDrafts[user.id] ?? user.role;
        if (nextRole === user.role) {
            return;
        }

        setMutatingUserId(user.id);
        try {
            await updateAdminUserRole(user.id, { role: nextRole });
            await loadUsers();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to update user role");
            }
        } finally {
            setMutatingUserId(null);
        }
    };

    const handleToggleStatus = async (user: AdminUserListItem) => {
        const nextStatus: UserStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";

        setMutatingUserId(user.id);
        try {
            await updateAdminUserStatus(user.id, { status: nextStatus });
            await loadUsers();
        } catch (error) {
            if (isApiRequestError(error)) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Unable to update user status");
            }
        } finally {
            setMutatingUserId(null);
        }
    };

    return (
        <section className="mx-auto grid w-full max-w-7xl gap-4 pb-10">
            <header className="grid gap-3 md:grid-cols-3">
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Total users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">{totalItems}</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Admins in page
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">{totalAdmins}</p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Current page
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold text-slate-900">{page}</p>
                    </CardContent>
                </Card>
            </header>

            <Card className="border-slate-200 bg-white">
                <CardHeader>
                    <CardTitle>Users moderation</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
                        <Input
                            placeholder="Search by email, name, phone"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                        />

                        <select
                            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                            value={roleFilter}
                            onChange={(event) => {
                                setRoleFilter(event.target.value as UserRole | "ALL");
                                setPage(1);
                            }}
                        >
                            {ROLE_FILTER_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    Role: {option}
                                </option>
                            ))}
                        </select>

                        <select
                            className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(event.target.value as UserStatus | "ALL");
                                setPage(1);
                            }}
                        >
                            {STATUS_FILTER_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    Status: {option}
                                </option>
                            ))}
                        </select>

                        <Button type="button" variant="outline" onClick={() => void loadUsers()}>
                            Reload
                        </Button>
                    </div>

                    {errorMessage ? (
                        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {errorMessage}
                        </p>
                    ) : null}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>Loading users...</TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5}>No users found</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    const roleValue = roleDrafts[user.id] ?? user.role;
                                    const isMutating = mutatingUserId === user.id;

                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="grid gap-0.5">
                                                    <span className="font-medium text-slate-900">
                                                        {user.fullName}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <select
                                                    className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm"
                                                    value={roleValue}
                                                    onChange={(event) => {
                                                        setRoleDrafts((prev) => ({
                                                            ...prev,
                                                            [user.id]: event.target
                                                                .value as UserRole,
                                                        }));
                                                    }}
                                                    disabled={isMutating}
                                                >
                                                    <option value="CUSTOMER">CUSTOMER</option>
                                                    <option value="SELLER">SELLER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </TableCell>
                                            <TableCell>{user.status}</TableCell>
                                            <TableCell>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        disabled={
                                                            isMutating || roleValue === user.role
                                                        }
                                                        onClick={() => void handleSaveRole(user)}
                                                    >
                                                        Save role
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={
                                                            user.status === "BANNED"
                                                                ? "secondary"
                                                                : "destructive"
                                                        }
                                                        disabled={isMutating}
                                                        onClick={() =>
                                                            void handleToggleStatus(user)
                                                        }
                                                    >
                                                        {user.status === "BANNED"
                                                            ? "Activate"
                                                            : "Ban"}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={page <= 1 || isLoading}
                            onClick={() => {
                                setPage((prev) => Math.max(1, prev - 1));
                            }}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-slate-600">
                            Page {page}/{totalPages}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={page >= totalPages || isLoading}
                            onClick={() => {
                                setPage((prev) => Math.min(totalPages, prev + 1));
                            }}
                        >
                            Next
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
