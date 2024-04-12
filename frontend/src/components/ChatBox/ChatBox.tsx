import React from "react";

interface ChatBoxProps {
    name: string
}

const ChatBox: React.FC<ChatBoxProps> = ({name}) => {
    const [messages, setMessages] = React.useState<string[]>([]);
    const [input, setInput] = React.useState<string>("");

    const [talking, setTalking] = React.useState<boolean>(false);

    React.useEffect(() => {
        const handleSpaceDown = (e: KeyboardEvent) => {
            if (e.key === " ") setTalking(true);
        };
        const handleSpaceUp = (e: KeyboardEvent) => {
            if (e.key === " ") setTalking(false);
        };

        document.addEventListener("keydown", handleSpaceDown);
        document.addEventListener("keyup", handleSpaceUp);

        return (() => {
            document.removeEventListener("keydown", handleSpaceDown);
            document.removeEventListener("keyup", handleSpaceUp);
        })

    }, []);
    
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessages([...messages, input]);
        setInput("");
    };

    return (
        <div>
            <h1>ChatBox</h1>
            <h2>{talking ? 'please speak now' : 'press space to talk'}</h2>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
            <ul>
                {messages.map((message, i) => (
                    <li key={i}>{`${name}: ${message}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatBox;
