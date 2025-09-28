import { useState, useEffect } from "react";
import { hcsService } from "../services/hcsService";

export default function ChatBox({ topicId, signer }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Subscribe once when ChatBox mounts
  useEffect(() => {
    if (!topicId) return;

    const ws = hcsService.subscribeToTopic(topicId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // cleanup on unmount
    return () => {
      if (ws && ws.close) ws.close();
    };
  }, [topicId]);

  const handleSend = async () => {
    if (!input || !topicId || !signer) return;
    try {
      await hcsService.sendMessage(topicId, input, signer);
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md h-80">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-t-2xl p-3 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h3>
      </div>
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-y-auto h-72 mx-2 my-2">
        <div className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="flex">
              <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-xl max-w-xs">
                <p className="text-sm">{m}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex p-3 border-t dark:border-gray-700">
        <input
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="ml-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-all font-medium"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
