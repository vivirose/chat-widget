import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Prompt} from "../types/message";


const Chat = () => {
    const [messages, setMessages] = useState<Prompt[]>([]);
    const [input, setInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [email, setEmail] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const contentHolderRef = useRef<HTMLDivElement>(null);


    const sendMessage = async () => {

        if (input.trim()) {
            const newMessages: Prompt[] = [...messages, {chat_prompt: input, user_email: email, waf_token: "1234"}];
            setMessages(newMessages);
            try {
                const response = await axios.post("https://api.arthur.ai/v1/conversations", {message: input});
                newMessages.push({chat_prompt: response.data.message, user_email: email, waf_token: "1234"});
                setMessages(newMessages);
                setInput("")
            } catch (error) {
                console.error("Error sending message:", error);
            }
            setInput("");
        }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const contentHolder = e.target as HTMLSpanElement;

        if (!e.shiftKey && e.key === "Enter" && input) {
            sendMessage();
            setInput("");
            contentHolder.innerText = "";
            return;
        }

        setInput(contentHolder.innerText);
    };

    useEffect(() => {
        if (messagesEndRef.current !== null) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);
console.log(messages)
    return (
        <div className='fixed bottom-12 right-4 max-w-96'>
            <div className='bg-white border rounded-lg shadow-lg'>
                <div style={{backgroundColor: "#ac37f6"}} className='text-white rounded-t-lg p-4'>
                    Welcome to Arthur Chat!
                </div>
                <div className='p-4'>
                    {email === "" &&
                        <form action="/submit" method="post">
                        <label htmlFor="textInput">Please input your work email to get started:</label>
                        <div className="flex gap-2 mt-2">
                            <input type="text" id="textInput" name="textInput" required
                                   className='border p-2 text-xs text-wrap block min-w-52 max-w-52 max-h-20 overflow-y-auto text-left'
                                   value={emailInput}
                                   onChange={(e) => setEmailInput(e.target.value)}
                            />
                            <button type="submit" style={{backgroundColor: "#ac37f6"}}
                                    className='hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEmail(emailInput);
                                        setEmailInput("");
                                    }}
                            >Submit
                            </button>
                        </div>
                    </form>}
                    <div className='overflow-y-auto h-44 mb-4'>
                        {messages.map((msg, index) => (
                            <div key={index} className={`my-2 text-right`}>
                                <span
                                    style={{wordWrap: "break-word"}}
                                    className='inline-flex max-w-64 text-left items-center rounded-md bg-blue-50 px-2 py-1 font-thin text-xl  ring-1 ring-inset ring-blue-700/10'
                                >
                                    {msg.chat_prompt}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>
                    <div className='flex gap-2'>
                        <div
                            role='textbox'
                            className='border p-2 text-xs text-wrap block min-w-52 max-w-52 max-h-20 overflow-y-auto text-left'
                            onKeyUp={handleKeyUp}
                            contentEditable
                            ref={contentHolderRef}
                            suppressContentEditableWarning
                        />
                        <button
                            style={{backgroundColor: "#ac37f6"}}
                            className= {`hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${email === "" ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={sendMessage}
                            disabled={email === ""}
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
