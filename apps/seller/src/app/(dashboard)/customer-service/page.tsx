"use client";

import { useMemo, useState } from "react";
import { CustomerChatPanel } from "./_components/customer-chat-panel";
import { CustomerConversationList } from "./_components/customer-conversation-list";
import { CustomerInsightPanel } from "./_components/customer-insight-panel";
import { CustomerServiceHeader } from "./_components/customer-service-header";
import { customerProfile, headerContent } from "./data/customer-service-mock-data";
import {
    appendComplaintMessageByCustomerId,
    customerServiceLocalDatabase,
    getComplaintMessagesByCustomerId,
} from "./data/customer-service-local-database";

export default function CustomerServicePage() {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
        customerServiceLocalDatabase[0]?.customerId ?? null,
    );
    const [, setChatRefreshCounter] = useState(0);

    const selectedRecord = useMemo(
        () =>
            customerServiceLocalDatabase.find(
                (record) => record.customerId === selectedCustomerId,
            ) ?? customerServiceLocalDatabase[0],
        [selectedCustomerId],
    );

    const selectedChatMessages = getComplaintMessagesByCustomerId(selectedRecord?.customerId ?? "");

    const handleSendMessage = (message: string) => {
        if (!selectedRecord?.customerId) {
            return;
        }

        const createdMessage = appendComplaintMessageByCustomerId(
            selectedRecord.customerId,
            message,
            "seller",
        );
        if (!createdMessage) {
            return;
        }

        setChatRefreshCounter((prev) => prev + 1);
    };

    return (
        <section className="flex w-full min-w-0 flex-col gap-6">
            <CustomerServiceHeader
                eyebrow={headerContent.eyebrow}
                title={headerContent.title}
                actionHistory={headerContent.actionHistory}
                actionCreate={headerContent.actionCreate}
            />

            <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(12rem,1fr)_minmax(0,1.85fr)_minmax(10.5rem,1.1fr)]">
                <div className="min-w-0">
                    <CustomerConversationList
                        records={customerServiceLocalDatabase}
                        selectedCustomerId={selectedRecord?.customerId ?? null}
                        onSelectCustomer={setSelectedCustomerId}
                    />
                </div>
                <div className="min-w-0">
                    <CustomerChatPanel
                        customerName={selectedRecord?.customerFullName ?? customerProfile.fullName}
                        messages={selectedChatMessages}
                        onSendMessage={handleSendMessage}
                    />
                </div>
                <div className="min-w-0">
                    <CustomerInsightPanel
                        profile={customerProfile}
                        selectedRecord={selectedRecord}
                    />
                </div>
            </div>
        </section>
    );
}
