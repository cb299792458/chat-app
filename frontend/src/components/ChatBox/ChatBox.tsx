import React from "react";
import axios from "axios";
import _ from "lodash";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface ChatBoxProps {
    name: string
}
enum Language {
    American_English = 'en-US',
    Spanish = 'es-ES',
    French = 'fr-FR',
    German = 'de-DE',
    Mandarin_Chinese = 'zh-CN',
    Cantonese_Chinese = 'yue',
    Traditional_Chinese = 'zh-tw',
    Japanese = 'ja-JP',
    Korean = 'ko-KR',
    Thai = 'th-TH',
    Vietnamese = 'vi-VN',
    Russian = 'ru-RU',
    Greek = 'el-GR',
}
const languageNames: { [key: string]: string } = {};
Object.keys(Language).forEach((key) => {
    const value = Language[key as keyof typeof Language];
    languageNames[value] = key;
});
interface Message {
    fromUser: boolean;
    source: Language;
    target: Language;
    text: string;
    translation: string;
}

const apiKey: string | undefined = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;

const ChatBox: React.FC<ChatBoxProps> = ({name}) => {
    
    const [messages, setMessages] = React.useState<Message[]>([{
        fromUser: false,
        source: Language.American_English,
        target: Language.American_English,
        text: "Hi! I'm Nina. You can talk to me to practice your language skills!",
        translation: "Hi! I'm Nina. You can talk to me to practice your language skills!",
    }]);
    const [input, setInput] = React.useState<string>("");

    const [practiceLanguage, setPracticeLanguage] = React.useState<string>("es-ES");
    const [preferredLanguage, setPreferredLanguage] = React.useState<string>("en-US");
    const handlePracticeLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPracticeLanguage(e.target.value);
    const handlePreferredLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPreferredLanguage(e.target.value);

    const addMessage = async (text: string) => {
        const body = {
            q: text,
            source: practiceLanguage,
            target: preferredLanguage,
        };

        const res = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, body);
        const translation = res.data.data.translations[0].translatedText;

        const newMessage: Message = {
            fromUser: true,
            source: practiceLanguage as Language,
            target: preferredLanguage as Language,
            text,
            translation,
        };
        setMessages([...messages, newMessage]);
    }

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (listening) return;
        await addMessage(input);
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
            language: practiceLanguage,
        });
    };

    React.useEffect(listenContinuously, [practiceLanguage]);
    React.useEffect(() => {
        if (transcript && listening) {
            setInput(transcript);
        }
    }, [transcript, listening]);
    React.useEffect(() => {
        if (finalTranscript) {
            addMessage(finalTranscript);
            resetTranscript();
            setInput("");
        }
    // eslint-disable-next-line
    }, [interimTranscript, finalTranscript, messages]);

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
    
    return (
        <div>
            <h1>ChatBox</h1>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => !listening && setInput(e.target.value)}
                />
                <button type="submit">{listening ? '<- This is what I\'ve heard!' : '-> Send your typed message!'}</button>
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
            <select onChange={handlePracticeLanguageChange} value={practiceLanguage}>
                {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
            </select>

            <br/>
            Translate for me into:{" "} 
            <select onChange={handlePreferredLanguageChange} value={preferredLanguage}>
                {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
            </select>

            <table>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>Text</th>
                        <th>Translation</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((message, i) => (
                        <tr key={i}>
                            <td>{message.fromUser ? name : "Nina"}</td>
                            <td>{_.unescape(message.text)}</td>
                            <td>{_.unescape(message.translation)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default ChatBox;
