"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@repo/ui";
import { Clock3, EllipsisVertical, Phone, SendHorizontal, Smile } from "lucide-react";
import type { ComplaintChatMessage } from "../data/customer-service-local-database";

type CustomerChatPanelProps = {
  customerName: string;
  messages: ComplaintChatMessage[];
  onSendMessage: (message: string) => void;
};

export function CustomerChatPanel({ customerName, messages, onSendMessage }: CustomerChatPanelProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSend = () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessageInput("");
  };

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="border-b border-slate-200 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">MH</div>
            <div>
              <CardTitle className="text-xl text-slate-900">{customerName}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                Đang hoạt động
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-700">THÀNH VIÊN VIP</span>
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="size-9 rounded-lg text-slate-600 hover:bg-slate-100">
              <Phone aria-hidden="true" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="size-9 rounded-lg text-slate-600 hover:bg-slate-100">
              <EllipsisVertical aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-160 flex-col p-4">
        <div className="mb-4 flex justify-center">
          <span className="rounded-md bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Hôm nay</span>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
          {messages.map((message) => {
            const isSeller = message.author === "seller";

            return (
              <div key={message.id} className={isSeller ? "ml-auto w-full max-w-[70%]" : "w-full max-w-[78%]"}>
                <div
                  className={
                    isSeller
                      ? "rounded-2xl rounded-br-md bg-blue-500 px-4 py-3 text-sm leading-relaxed text-white"
                      : "rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700"
                  }
                >
                  {message.body}
                </div>

                {message.imageBlocks ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {message.imageBlocks.map((imageLabel) => (
                      <div
                        key={imageLabel}
                        className="aspect-square rounded-xl border border-slate-200 bg-linear-to-br from-slate-200 via-slate-100 to-slate-300 p-3 text-xs font-semibold text-slate-500"
                      >
                        {imageLabel}
                      </div>
                    ))}
                  </div>
                ) : null}

                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <Clock3 aria-hidden="true" className="size-3" />
                  {message.sentAt}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" className="size-9 rounded-lg text-slate-500 hover:bg-slate-200">
              <Smile aria-hidden="true" />
            </Button>
            <Input
              value={messageInput}
              onChange={(event) => setMessageInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Nhập phản hồi..."
              className="h-9 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
            />
            <Button
              type="button"
              variant="default"
              size="icon"
              className="size-9 rounded-lg bg-blue-500 text-white hover:bg-blue-500/90"
              onClick={handleSend}
            >
              <SendHorizontal aria-hidden="true" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
