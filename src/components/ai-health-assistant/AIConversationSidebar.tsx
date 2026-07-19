"use client";

import {
  LuClock3,
  LuHistory,
  LuMessageCircleHeart,
  LuPlus,
  LuTrash2,
  LuX,
} from "react-icons/lu";

import type { AIHealthConversation } from "./types";

interface AIConversationSidebarProps {
  conversations: AIHealthConversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  isBusy: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (conversationId: string) => void;
  onDelete: (conversation: AIHealthConversation) => void;
}

const formatDate = (value: string | null): string => {
  if (!value) return "Just now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const AIConversationSidebar = ({
  conversations,
  activeConversationId,
  isOpen,
  isBusy,
  onClose,
  onNewChat,
  onSelect,
  onDelete,
}: AIConversationSidebarProps) => {
  return (
    <aside
      className={`${isOpen ? "block" : "hidden"} min-w-0 overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-sm dark:border-[#41354A] dark:bg-[#2A2233] lg:block`}
    >
      <div className="flex items-center justify-between border-b border-[#F5CBCB] p-4 dark:border-[#41354A]">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
            <LuHistory className="size-4" />
          </span>
          <div>
            <h2 className="font-black text-slate-950 dark:text-white">
              All History
            </h2>
            <p className="text-[11px] font-semibold text-slate-400">
              {conversations.length} saved chats
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-xl text-slate-400 hover:bg-[#FBEFEF] lg:hidden dark:hover:bg-[#352B3D]"
          aria-label="Close chat history"
        >
          <LuX className="size-5" />
        </button>
      </div>

      <div className="p-3">
        <button
          type="button"
          onClick={onNewChat}
          disabled={isBusy}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#745D83] px-4 text-sm font-black text-white transition hover:bg-[#614E70] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27]"
        >
          <LuPlus className="size-4" />
          New Chat
        </button>
      </div>

      <div className="max-h-[520px] space-y-2 overflow-y-auto px-3 pb-3 lg:max-h-[760px]">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C5B3D3] p-5 text-center dark:border-[#5D4C69]">
            <LuMessageCircleHeart className="mx-auto size-7 text-[#745D83] dark:text-[#F5CBCB]" />
            <p className="mt-2 text-sm font-bold text-slate-500 dark:text-[#A997AE]">
              No saved chat yet
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;

            return (
              <div
                key={conversation.id}
                className={`group flex min-w-0 items-start gap-2 rounded-2xl border p-2 transition ${
                  isActive
                    ? "border-[#745D83] bg-[#FBEFEF] dark:border-[#C5B3D3] dark:bg-[#352B3D]"
                    : "border-transparent hover:border-[#F5CBCB] hover:bg-[#FFF9F9] dark:hover:border-[#41354A] dark:hover:bg-[#352B3D]/60"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className="min-w-0 flex-1 px-1 py-1 text-left"
                >
                  <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                    {conversation.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                    <LuClock3 className="size-3" />
                    {formatDate(conversation.lastMessageAt)}
                    <span>·</span>
                    <span>{conversation.messageCount} messages</span>
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(conversation)}
                  disabled={isBusy}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  aria-label={`Delete ${conversation.title}`}
                >
                  <LuTrash2 className="size-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default AIConversationSidebar;