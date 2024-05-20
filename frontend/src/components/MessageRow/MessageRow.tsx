import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faLanguage, faEarListen, faEye } from '@fortawesome/free-solid-svg-icons'

import { MessageRowProps } from "../../types";

const MessageRow: React.FC<MessageRowProps> = ({ message, userName, botName, options, speaking, setSpeaking }) => {
    return (
        <tr>
            <td className="border">{message.fromUser
                ? <span className="text-red-500 font-bold text-lg">{userName}: </span> 
                : <span className="text-blue-500 font-bold text-lg">{botName}: </span>}
            </td>
            <MessageText text={message.text}
                initiallyVisible={(message.fromUser && !options.hideUserMessageText) || (!message.fromUser && !options.hideResponseText)}
            />
            <MessageTranslation translation={message.translation}
                initiallyVisible={(message.fromUser && !options.hideUserMessageTranslation) || (!message.fromUser && !options.hideResponseTranslation)}
            />
            <MessageAudio
                text={message.text}
                autoplay={!message.fromUser && options.autoplayResponseAudio}
                language={message.fromUser ? message.source : message.target}
                speaking={speaking}
                setSpeaking={setSpeaking}
            />
        </tr>
    );
};

const MessageText = ({ text, initiallyVisible }: { text: string, initiallyVisible: boolean }) => {
    const [visible, setVisible] = React.useState<boolean>(initiallyVisible);
    return (
        <td className="text-left border">
            <p className="mx-1">
                {visible ? ` ${_.unescape(text)} ` : ''}
                <FontAwesomeIcon
                    icon={visible ? faEye : faPen}
                    title={visible ? "Hide This" : "Write it down for me!"}
                    onClick={() => setVisible(!visible)}
                />
            </p>
        </td>
    );
};

const MessageTranslation = ({ translation, initiallyVisible }: { translation: string, initiallyVisible: boolean }) => {
    const [visible, setVisible] = React.useState<boolean>(initiallyVisible);
    return (
        <td className="text-left border">
            <p className="mx-1">
                {visible ? ` ${_.unescape(translation)} ` : ''}
                <FontAwesomeIcon
                    icon={visible ? faEye : faLanguage}
                    title={visible ? "Hide This" : "Translate this please!"}
                    onClick={() => setVisible(!visible)}
                />
            </p>
        </td>
    );
};

const MessageAudio = React.memo(({ text, autoplay, language, speaking, setSpeaking }: { text: string, autoplay: boolean, language: string, speaking: boolean, setSpeaking: (speaking: boolean) => void }) => {
    // preload voices
    window.speechSynthesis.getVoices();
    
    const readMessage = async () => {
        if (speaking) return;
        if ('speechSynthesis' in window) {
            setSpeaking(true);
            const msg = new SpeechSynthesisUtterance(text);

            const allVoices = await window.speechSynthesis.getVoices();
            const voice = allVoices.find((voice) => voice.lang !== 'en-US' && voice.lang === language);
            const defaultVoice = allVoices.find((voice) => voice.name === "Microsoft Zira - English (United States)");
            if (voice) {
                msg.voice = voice;
            } else {
                console.warn("No voice found for language", language);
                if (defaultVoice) msg.voice = defaultVoice;
            }

            msg.onend = () => setSpeaking(false);
            window.speechSynthesis.speak(msg);
        } else {
            alert("Sorry, your browser doesn't support text to speech!");
        }
    };

    React.useEffect(() => {
        if (autoplay) {
            readMessage();
            // eslint-disable-next-line
            autoplay = false;
        }
    }, []);

    return (
        <td className="border">
            <FontAwesomeIcon icon={faEarListen} title={autoplay ? "Say it again?" : "Could you pronounce that?"} onClick={readMessage}/>
        </td>
    );
})

export default MessageRow;
