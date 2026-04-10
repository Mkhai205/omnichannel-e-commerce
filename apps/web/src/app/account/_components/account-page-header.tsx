import type { ReactNode } from "react";

type AccountPageHeaderProps = {
    title: string;
    description: string;
    action?: ReactNode;
};

export function AccountPageHeader({ title, description, action }: AccountPageHeaderProps) {
    return (
        <header className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            {action ?? null}
        </header>
    );
}
