import React from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface ChatBoxProps {
    name: string
}

const ChatBox: React.FC<ChatBoxProps> = ({name}) => {
    
    const [messages, setMessages] = React.useState<string[]>([]);
    const [input, setInput] = React.useState<string>("");

    const [targetLanguage, setTargetLanguage] = React.useState<string>("es-ES");
    const [defaultLanguage, setDefaultLanguage] = React.useState<string>("en-US");
    const handleTargetLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setTargetLanguage(e.target.value);
    const handleDefaultLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setDefaultLanguage(e.target.value);
       
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (listening) return;
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

    React.useEffect(listenContinuously, [targetLanguage]);
    React.useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);
    React.useEffect(() => {
        if (finalTranscript) {
            setMessages([...messages, finalTranscript]);
            resetTranscript();
            setInput("");
        }
    }, [interimTranscript, finalTranscript, messages, resetTranscript]);

    const handleToggleMode = () => {
        setInput("");
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            listenContinuously();
        }
    }
        
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
        return <h1>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</h1>
    }

    const languages: { [key: string]: string }  = {
        'en-US': 'American English',
        'en-GB': 'British English',
        'es-ES': 'Spanish (Spain)',
        'fr-FR': 'French',
        'de-DE': 'German',
        'zh-CN': 'Mandarin Chinese',
        'yue': 'Cantonese Chinese',
        'zh-tw': 'Traditional Chinese',
        'ja-JP': 'Japanese',
        'ko-KR': 'Korean',
        'th-TH': 'Thai',
        'vi-VN': 'Vietnamese',
        'ru-RU': 'Russian',
    }
    
    return (
        <div>
            <h1>ChatBox</h1>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">{listening ? 'This is what I\'ve heard!' : 'Send your Written Message!'}</button>
            </form>

            <span>
                {listening ? 'Listening... pause to submit your message' : 'Please type your message above'}
            </span>
            <br/>
            <button onClick={handleToggleMode}>
                {listening ? 'Switch to Typing Input' : 'Switch to Speaking Input'}
            </button>
            <br/>

            <br/>
            I want to practice my:{" "}
            <select onChange={handleTargetLanguageChange} value={targetLanguage}>
                {Object.entries(languages).map(([code, lang]) => <option value={code} key={code}>{lang}</option>)}
            </select>

            <br/>
            Translate for me into:{" "} 
            <select onChange={handleDefaultLanguageChange} value={defaultLanguage}>
                {Object.entries(languages).map(([code, lang]) => <option value={code} key={code}>{lang}</option>)}
            </select>

            <ul>
                {messages.map((message, i) => (
                    <li key={i}>{`${name}: ${message}`}</li>
                ))}
            </ul>
        </div>
    );
};

export default ChatBox;
