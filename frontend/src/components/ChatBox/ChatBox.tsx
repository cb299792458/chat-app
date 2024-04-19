import React from "react";
import axios from "axios";
import _ from "lodash";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";


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

const googleCloudApiKey: string | undefined = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
const openAiApiKey: string | undefined = process.env.REACT_APP_OPENAI_API_KEY;
// move this to the backend and remove dangerouslyAllowBrowser
const openai = new OpenAI({ apiKey: openAiApiKey, dangerouslyAllowBrowser: true });

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

    const [awaitingReply, setAwaitingReply] = React.useState<boolean>(false);

    const getTranslation = async (text: string) => {
        if (practiceLanguage === preferredLanguage) return text;

        const body = {
            q: text,
            source: practiceLanguage,
            target: preferredLanguage,
        };

        const res = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${googleCloudApiKey}`, body);
        return res.data.data.translations[0].translatedText;
    }

    const addMessage = async (text: string) => {
        const translation = await getTranslation(text);

        const newMessage: Message = {
            fromUser: true,
            source: practiceLanguage as Language,
            target: preferredLanguage as Language,
            text,
            translation,
        };
        setMessages([...messages, newMessage]);
        setAwaitingReply(true);
    };

    

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
            // setTimeout(addReply, 1000);
            resetTranscript();
            setInput("");
        }
    // eslint-disable-next-line
    }, [interimTranscript, finalTranscript, messages]);
    React.useEffect(() => {
        if (!awaitingReply) return;

        const addReply = async () => {
            const systemMessage: ChatCompletionMessageParam[] = [
                {
                    role: "system",
                    content: `You are the user's older sister Nina, who is helping them practice their ${practiceLanguage}. 
                    You can talk to them in ${practiceLanguage}, but their preferred language is ${preferredLanguage}.`,
                }
            ]
            const pastMessages: ChatCompletionMessageParam[] = messages.map((message) => ({
                role: message.fromUser ? "user" : "assistant",
                content: message.text,
            }));
            const completion = await openai.chat.completions.create({
                messages: systemMessage.concat(pastMessages),
                model: "gpt-3.5-turbo",
            });
    
            if (completion.choices && completion.choices.length) {
                const response: string = completion.choices[0].message.content || '';
                const translation = await getTranslation(response);
                
                const newMessage: Message = {
                    fromUser: false,
                    source: preferredLanguage as Language,
                    target: practiceLanguage as Language,
                    text: response,
                    translation,
                };
    
                setMessages([...messages, newMessage]);
            }
            setAwaitingReply(false);
        };
        addReply();
    // eslint-disable-next-line
    }, [awaitingReply]);

    const handleToggleMode = () => {
        setInput("");
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            listenContinuously();
        }
    };
        
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
        return <h1>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</h1>
    };
    
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

            {/* <button onClick={addReply}>Add System Reply</button> */}

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
