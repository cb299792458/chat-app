import Modal from "react-modal"
import { Language } from "../../types";
import { blueButtonClass, h2Class, inputClass, modalStyle } from "../../styles";
import posthog from 'posthog-js'

Modal.setAppElement('#root');
posthog.init('phc_Kz2UulgJvjU0LU32hr7LzOyRn8entzJ77AmwAiMtMan',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

const WelcomeModal = ({
    showWelcomeModal,
    setShowWelcomeModal,
    userName, setUserName,
    botName, setBotName,
    practiceLanguage, setPracticeLanguage,
    preferredLanguage, setPreferredLanguage,
}: {
    showWelcomeModal: boolean,
    setShowWelcomeModal: (showWelcomeModal: boolean) => void,
    userName: string,
    setUserName: (userName: string) => void,
    botName: string,
    setBotName: (botName: string) => void,
    practiceLanguage: string,
    setPracticeLanguage: (practiceLanguage: string) => void,
    preferredLanguage: string,
    setPreferredLanguage: (preferredLanguage: string) => void,
}) => {
    const handleClick = () => {
        posthog.capture('conversation_started', {
            user_name: userName,
            bot_name: botName,
            practice_language: practiceLanguage,
            preferred_language: preferredLanguage,
        });
        setShowWelcomeModal(false);
    }
    return <Modal
        isOpen={showWelcomeModal}
        contentLabel="Welcome Modal"
        style={modalStyle}
    >
        <h2 className={h2Class}>Welcome!</h2>
        <p className="max-w-lg">
        Welcome to Chat Ni Ichi! From late beginner/intermediate language learners
        to fluent speakers, our advanced language-learning platform is tailored to
        suit your needs. Harness the power of speech recognition, translation, and
        machine learning to enhance your reading, listening, and speaking skills.
        Take your language skills to the next level today!
        <br/><br/>
        Just speak in your chosen foreign language into your microphone, and when you
        pause, the chat bot will respond in the same language. The transcriptions and
        translations will be displayed on the screen. You can also type your message 
        into the input box by clicking the input mode button. Enjoy!
        </p>
        <br/>

        Your Name:{" "}
        <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={inputClass}
        /><br/>
        Chat Bot's Name:{" "}
        <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className={inputClass}
        /><br/>
        
        I want to practice my:{" "}
        <select onChange={(e) => setPracticeLanguage(e.target.value)} value={practiceLanguage} className={inputClass}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        Translate for me into:{" "} 
        <select onChange={(e) => setPreferredLanguage(e.target.value)} value={preferredLanguage} className={inputClass}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        <button onClick={handleClick} className={blueButtonClass}>
            Let's Chat!
        </button>
    </Modal>
}

export default WelcomeModal;
