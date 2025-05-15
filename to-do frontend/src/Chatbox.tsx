import { useState } from "react";
import axios from "axios";
import "./ChatBox.css";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === "") return;
    const userMessage: Message = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await axios.post("https://localhost:7036/ai/ask", {
        message: updatedMessages,
      });
      setMessages((prev) => [...prev, { sender: "ai", text: resp.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Hiba történt az AI válasz lekérésekor." },
      ]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbox-wrapper ${isOpen ? "open" : ""}`}>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {isOpen && (
        <div className="chatbox">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender === "user" ? "user" : "ai"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="chat-message ai">Gondolkodom…</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Kérdezz valamit..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>⮞</button>
          </div>
        </div>
      )}
    </div>
  );
};
