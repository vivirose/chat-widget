import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Message {
    text: string;
    sender: "user" | "ai";
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    //const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = async () => {
        if (input.trim()) {
            const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
            setMessages(newMessages);
            try {
                const response = await axios.post("https://api.arthur.ai/v1/conversations", { message: input });
                newMessages.push({ text: response.data.message, sender: "ai" });
                setMessages(newMessages);
            } catch (error) {
                console.error("Error sending message:", error);
            }
            setInput("");
        }
    };
    const handleKeyUp = (e: any) => {
        const contentHolder = e.target as HTMLSpanElement;

        if (!e.shiftKey && e.key === "Enter" && input) {
            sendMessage();
            //setMessage("");
            contentHolder.innerText = "";
            return;
        }

        //setMessage(contentHolder.innerText);
    };
    useEffect(() => {
        if (messagesEndRef.current !== null) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className='fixed bottom-4 right-4'>
            <div className='bg-white border rounded-lg shadow-lg'>
                <div style={{ backgroundColor: "#ac37f6" }} className='text-white rounded-t-lg p-4'>
                    Welcome to Arthur Chat!
                </div>
                <div className='p-4'>
                    <div className='overflow-y-auto h-96 mb-4'>
                        {messages.map((msg, index) => (
                            <div key={index} className={`my-2 ${msg.sender === "user" ? "text-right" : "text-left"} `}>
                                <span
                                    style={{ wordWrap: "break-word" }}
                                    className='inline-flex max-w-64 text-left items-center rounded-md bg-blue-50 px-2 py-1 font-normal text-xl text-blue-700 ring-1 ring-inset ring-blue-700/10'
                                >
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className='flex gap-2'>
                        <div
                            role='textbox'
                            className='border p-2 text-xs text-wrap block min-w-52 max-w-52 max-h-20 overflow-y-auto text-left'
                            onKeyUp={handleKeyUp}
                            contentEditable
                        />
                        <button
                            style={{ backgroundColor: "#ac37f6" }}
                            className='hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
