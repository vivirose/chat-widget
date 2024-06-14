import {useEffect, useRef, useState} from "react";
import {useMessage} from "../hooks/useMessage";


const Chat = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const contentHolderRef = useRef<HTMLDivElement>(null);
    const {handleSendMessage} = useMessage();


    const sendMessage = () => {
        if (input === "") return;
        setMessages((prevMessages) => [...prevMessages, input]);
        setLoading(true)

        handleSendMessage({chat_prompt: input, user_email: email, waf_token: ""}).then((response) => {
            if (response) {
                setLoading(false);
                setMessages((prevMessages) => [...prevMessages, response]);
            }
        });


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
                        <>
                            <div className='text-left text-sm font-thin mb-4'
                            >Hey there! Thanks for stopping by! We're here to help you. Dive into Arthur Chat and
                                Shield, and ask us anything you want to know about Arthur. Let's get chatting!
                            </div>
                            <form action="/submit" method="post">
                                <label htmlFor="textInput" className='text-left text-sm'>Please input your work email to get started:</label>
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
                            </form>
                        </>}
                    <div className='overflow-y-auto h-44 mb-4'>
                        {messages.map((msg, index) => (
                            <div key={index} className={`my-2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                <span
                                    style={{wordWrap: "break-word"}}
                                    className='inline-flex max-w-64 text-left items-center rounded-md bg-blue-50 px-2 py-1 font-thin text-xl  ring-1 ring-inset ring-blue-700/10'
                                >
                                    {msg}
                                </span>
                            </div>
                        ))}
                        {loading && <div className='text-left'>Thinking...</div>}
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
                            className={`hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${email === "" ? 'opacity-50 cursor-not-allowed' : ''}`}
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
