"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            position="top-right"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: "border border-border",
                    title: "text-sm font-semibold",
                    description: "text-sm text-muted-foreground",
                },
            }}
            {...props}
        />
    );
}

export { Toaster };
