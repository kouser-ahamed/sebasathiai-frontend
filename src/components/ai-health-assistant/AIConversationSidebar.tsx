"use client";

import { useEffect, useRef, useState } from "react";

import {
  LuClock3,
  LuHistory,
  LuMessageCircleHeart,
  LuPlus,
  LuTrash2,
  LuTriangleAlert,
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
  const historyListRef = useRef<HTMLDivElement | null>(null);

  const [conversationToDelete, setConversationToDelete] =
    useState<AIHealthConversation | null>(null);

  const newestConversationId = conversations[0]?.id || "";
  const newestConversationTime = conversations[0]?.lastMessageAt || "";

  useEffect(() => {
    const scrollContainer = historyListRef.current;

    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [newestConversationId, newestConversationTime]);

  useEffect(() => {
    if (!conversationToDelete) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isBusy) {
        setConversationToDelete(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [conversationToDelete, isBusy]);

  const openDeleteModal = (conversation: AIHealthConversation) => {
    setConversationToDelete(conversation);
  };

  const closeDeleteModal = () => {
    if (isBusy) return;

    setConversationToDelete(null);
  };

  const confirmDelete = () => {
    if (!conversationToDelete || isBusy) return;

    onDelete(conversationToDelete);
    setConversationToDelete(null);
  };

  return (
    <>
      <aside
        className={`${
          isOpen ? "flex" : "hidden"
        } fixed inset-x-3 bottom-3 top-20 z-50 min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#41354A] dark:bg-[#2A2233] lg:static lg:flex lg:h-full lg:shadow-sm`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#F5CBCB] p-4 dark:border-[#41354A]">
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
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#FBEFEF] lg:hidden dark:hover:bg-[#352B3D]"
            aria-label="Close chat history"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <div className="shrink-0 p-3">
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

        <div
          ref={historyListRef}
          className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain scroll-smooth px-3 pb-3"
        >
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

                    <p className="mt-1 flex flex-wrap items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <LuClock3 className="size-3 shrink-0" />

                      <span>{formatDate(conversation.lastMessageAt)}</span>

                      <span>·</span>

                      <span>{conversation.messageCount} messages</span>
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteModal(conversation)}
                    disabled={isBusy}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/30 dark:hover:text-red-400"
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

      {conversationToDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-chat-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[#F5CBCB] bg-white shadow-2xl dark:border-[#41354A] dark:bg-[#2A2233]">
            <div className="flex items-start justify-between gap-4 border-b border-[#F5CBCB] p-5 dark:border-[#41354A] sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                  <LuTriangleAlert className="size-5" />
                </span>

                <div className="min-w-0">
                  <h3
                    id="delete-chat-modal-title"
                    className="text-lg font-black text-slate-950 dark:text-white"
                  >
                    Delete Chat History?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-[#BFAFC3]">
                    This action will permanently delete this conversation from
                    your saved AI health history.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isBusy}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#FBEFEF] hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#352B3D] dark:hover:text-white"
                aria-label="Close delete confirmation"
              >
                <LuX className="size-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="min-w-0 rounded-2xl border border-[#F5CBCB] bg-[#FBEFEF]/60 p-4 dark:border-[#41354A] dark:bg-[#352B3D]/70">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-[#A997AE]">
                  Selected conversation
                </p>

                <p className="mt-1 break-words text-sm font-black leading-6 text-slate-900 dark:text-white">
                  {conversationToDelete.title}
                </p>

                <p className="mt-2 flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-400">
                  <LuClock3 className="size-3.5 shrink-0" />

                  <span>{formatDate(conversationToDelete.lastMessageAt)}</span>

                  <span>·</span>

                  <span>{conversationToDelete.messageCount} messages</span>
                </p>
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-red-600 dark:text-red-400">
                Once deleted, this chat cannot be recovered.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#F5CBCB] p-5 dark:border-[#41354A] sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isBusy}
                className="h-11 w-full rounded-xl border border-[#F5CBCB] bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-[#FBEFEF] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#41354A] dark:bg-[#352B3D] dark:text-white dark:hover:bg-[#41354A] sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isBusy}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <LuTrash2 className="size-4" />

                {isBusy ? "Deleting..." : "Delete Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIConversationSidebar;
