"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import PromptPage from "@/components/PromptPage";

export default function DashboardLayout() {
  const { data: session } = useSession();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatList, setChatList] = useState<{ id: string; title: string }[]>([]);
  const [chatContent, setChatContent] = useState<{ [id: string]: any }>({});
  const router = useRouter();

  const createNewChat = async () => {
    const res = await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session?.user.id }),
    });
    const newChat = await res.json();
    return { id: newChat.id, title: `Resume Match #${chatList.length + 1}` };
  };

  useEffect(() => {
    if (!session?.user) return;

    const fetchChats = async () => {
      try {
        const res = await fetch("/api/chats");
        const data = await res.json();

        if (data.length === 0) {
          const newChat = await createNewChat();
          setChatList([newChat]);
          setActiveChatId(newChat.id);
        } else {
          setChatList(data);
          setActiveChatId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();
  }, [session]);

  useEffect(() => {
    if (!activeChatId) return;

    const fetchChatContent = async () => {
      try {
        const res = await fetch(`/api/chats/${activeChatId}`);
        const data = await res.json();
        setChatContent((prev) => ({ ...prev, [activeChatId]: data }));
      } catch (err) {
        console.error("Failed to fetch chat content", err);
      }
    };

    fetchChatContent();
  }, [activeChatId]);

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    setChatList((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = async (id: string) => {
    try {
      await fetch(`/api/chats/${id}`, { method: "DELETE" });
      setChatList((prev) => prev.filter((chat) => chat.id !== id));
      setChatContent((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (activeChatId === id) {
        setActiveChatId(chatList.length > 1 ? chatList.find(chat => chat.id !== id)?.id || null : null);
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <button
          onClick={handleNewChat}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700"
        >
          + New Chat
        </button>
        <div className="mt-6 space-y-3 overflow-y-auto">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm font-medium hover:bg-indigo-50 transition ${
                chat.id === activeChatId ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span>{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
                className="text-red-500 hover:text-red-700 invisible group-hover:visible"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <section className="flex-1 p-6 overflow-y-auto">
          {activeChatId && <PromptPage chatId={activeChatId} chatData={chatContent[activeChatId]} />}
        </section>
      </main>
    </div>
  );
}