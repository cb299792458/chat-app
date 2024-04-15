import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface ChatBoxProps {
    name: string
}

const ChatBox: React.FC<ChatBoxProps> = ({name}) => {
    
    const [messages, setMessages] = React.useState<string[]>([]);
    const [input, setInput] = React.useState<string>("");

    const [targetLanguage, setTargetLanguage] = React.useState<string>("es-ES");
    const handleTargetLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetLanguage(e.target.value);
        SpeechRecognition.stopListening();
        setTimeout(listenContinuously, 200);
        // listenContinuously();
    };
    const [defaultLanguage, setDefaultLanguage] = React.useState<string>("en-GB");
    const handleDefaultLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setDefaultLanguage(e.target.value) };

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

    // const commands = {};
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition();
    
    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: targetLanguage,
        });
    };
    
    useEffect(() => {
        if (finalTranscript) {
            setMessages([...messages, finalTranscript]);
            resetTranscript();
            setInput("");
        }
    }, [interimTranscript, finalTranscript]);
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);
        
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
        return <p>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</p>
    }
    
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

            I want to speak: 
            <select onChange={handleTargetLanguageChange} value={targetLanguage}>
                <option value="en-GB">English</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="zh-CN">Mandarin</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
            </select>
            Translate into: 
            <select onChange={handleDefaultLanguageChange} value={defaultLanguage}>
                <option value="en-GB">English</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="zh-CN">Mandarin</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
            </select>

            <ul>
                {messages.map((message, i) => (
                    <li key={i}>{`${name}: ${message}`}</li>
                ))}
            </ul>
            {/* <button onClick={resetTranscript}>Reset</button> */}
            <button onClick={listenContinuously}>Listen</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            {/* <p>Transcript: {transcript}</p>
            <p>Interim Transcript: {interimTranscript}</p>
            <p>Final Transcript: {finalTranscript}</p> */}
            <p>Listening: {listening ? 'Yes' : 'No'}</p>
        </div>
    );
};

export default ChatBox;
