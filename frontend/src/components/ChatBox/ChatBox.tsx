import React from "react";
import axios from "axios";

import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Language, Message, Options } from "../../types";
import MessageRow from "../MessageRow";
import WelcomeModal from "../WelcomeModal";
import OptionsModal from "../OptionsModal";

const googleCloudApiKey: string | undefined = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
const openAiApiKey: string | undefined = process.env.REACT_APP_OPENAI_API_KEY;
// move this to the backend and remove dangerouslyAllowBrowser
const openai = new OpenAI({ apiKey: openAiApiKey, dangerouslyAllowBrowser: true });

const languageNames: { [key: string]: string } = {};
Object.keys(Language).forEach((key) => {
    const value = Language[key as keyof typeof Language];
    languageNames[value] = key;
});

const ChatBox: React.FC = () => {
    const [showWelcomeModal, setShowWelcomeModal] = React.useState<boolean>(true);
    const [userName, setUserName] = React.useState<string>("Guest");
    const [botName, setBotName] = React.useState<string>("Niki");
    const [showOptionsModal, setShowOptionsModal] = React.useState<boolean>(false);
    const [options, setOptions] = React.useState<Options>({
        autoplayResponseAudio: true,
        hideUserMessageText: false,
        hideUserMessageTranslation: false,
        hideResponseText: false,
        hideResponseTranslation: false,
    });
    const focused = !showOptionsModal && !showWelcomeModal;
    
    const [practiceLanguage, setPracticeLanguage] = React.useState<string>("es-ES");
    const [preferredLanguage, setPreferredLanguage] = React.useState<string>("en-US");

    const [input, setInput] = React.useState<string>("");
    const [awaitingReply, setAwaitingReply] = React.useState<boolean>(false);
    const [messages, setMessages] = React.useState<Message[]>([]);

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
        if (showOptionsModal || showOptionsModal) return;
        SpeechRecognition.startListening({
            continuous: true,
            language: practiceLanguage,
        });
    };

    React.useEffect(listenContinuously, [showWelcomeModal, showOptionsModal, practiceLanguage]);
    React.useEffect(() => {if (transcript && listening && !awaitingReply && focused) setInput(transcript)}, [transcript, listening, awaitingReply, focused]);
    React.useEffect(() => {
        if (!focused) resetTranscript();
        if (awaitingReply || !focused) return;
        if (finalTranscript) {
            addMessage(finalTranscript);
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
                    content: `You are the user ${userName}'s friend ${botName}, who is helping them practice their ${practiceLanguage}. 
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
                max_tokens: 100,
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
    
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
            setAwaitingReply(false);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
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

    const undoLastMessages = () => {
        if (messages.length <= 1 || awaitingReply) return;
        setMessages(messages.slice(0, -2));
    };

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) return <h1>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</h1>;
    return (
        <div>
            <WelcomeModal 
                showWelcomeModal={showWelcomeModal}
                setShowWelcomeModal={setShowWelcomeModal}
                userName={userName}
                setUserName={setUserName}
                botName={botName}
                setBotName={setBotName}
                practiceLanguage={practiceLanguage}
                setPracticeLanguage={setPracticeLanguage}
                preferredLanguage={preferredLanguage}
                setPreferredLanguage={setPreferredLanguage}
            />
            <OptionsModal
                showOptionsModal={showOptionsModal}
                setShowOptionsModal={setShowOptionsModal}
                practiceLanguage={practiceLanguage}
                setPracticeLanguage={setPracticeLanguage}
                preferredLanguage={preferredLanguage}
                setPreferredLanguage={setPreferredLanguage}
                options={options}
                setOptions={setOptions}
            />

            <h1>Chat Ni Ichi</h1>
            <form onSubmit={sendMessage}>
                {messages.length > 1 &&
                <button onClick={undoLastMessages}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-400"
                >
                    {`<- Undo Message`}
                </button>}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => !listening && setInput(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-400"
                >
                    {listening ? '<- This is what I\'ve heard!' : '-> Send your typed message!'}
                </button>
            </form>

            <span>{listening ? 'Listening... message will auto submit' : 'Please type your message above and click to submit'}</span>
            <br/>
            <button onClick={handleToggleMode}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-400"
            >
                {listening ? 'Pause Listening and enable Typing Input' : 'Switch back to Speaking Input'}
                </button>
            <br/>
            <button
                onClick={() => setShowOptionsModal(!showOptionsModal)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-400"
            >
                Show Options
            </button>
            <br/>

            <table>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>Text ({languageNames[practiceLanguage].replace('_', " ")})</th>
                        <th>Translation ({languageNames[preferredLanguage].replace('_', " ")})</th>
                        <th>Audio</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((message, i) => <MessageRow
                        message={message} i={i}
                        userName={userName}
                        botName={botName}
                        options={options} 
                        key={i}/>
                    )}
                </tbody>
            </table>


        </div>
    );
};

export default ChatBox;
