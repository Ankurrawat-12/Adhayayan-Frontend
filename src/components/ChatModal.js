import React, { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";

const ChatModal = ({ onClose, lesson }) => {
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([])
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);
    const chatRef = useRef(null);

    // Scroll chat to the bottom automatically when messages update
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setLoading(true);



        setMessages(newMessages);

        const requestBody = {
            lesson: lesson.content, // ✅ Pass lesson content
            chat_history: newMessages, // ✅ Pass previous messages
            user_message: input,
        };
        console.log("Sending to API:", requestBody);


        try {
            const response = await fetch("https://adhayayan-backend.onrender.com/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });


            const data = await response.json();
            console.log("API Response:", data);


            if (!response.ok) {
                throw new Error(data.msg || "Failed to get AI response");
            }


            setMessages([...newMessages, { sender: "ai", text: data.response }]);
        } catch (err) {
            console.error("Error fetching AI response:", err);
        }


        setInput("");
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 flex items-end justify-end p-4">
            {/* Chat Window */}
            <div className="bg-white w-[25vw] h-[70vh] shadow-lg rounded-lg flex flex-col">
                {/* Header */}
                <div className="bg-[#E85A4F] text-white p-4 flex justify-between items-center rounded-t-lg">
                    <h3 className="text-lg font-bold">AI Tutor</h3>
                    <button onClick={onClose} className="text-xl">✖</button>
                </div>

                {/* Messages Area */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-[#F5F5F5]">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center">Ask me anything!</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`rounded-lg px-3 py-2 text-white max-w-xs ${
                                        msg.sender === "user" ? "bg-[#E85A4F]" : "bg-gray-700"
                                    }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Field */}
                <div className="p-3 border-t flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 p-2 border rounded-lg focus:outline-none"
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="ml-2 bg-[#E85A4F] text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "..." : "➤"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
