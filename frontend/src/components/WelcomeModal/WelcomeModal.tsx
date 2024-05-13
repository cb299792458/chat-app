import Modal from "react-modal"
import { Language } from "../../types";

Modal.setAppElement('#root');

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
    return <Modal
        isOpen={showWelcomeModal}
        contentLabel="Welcome Modal"
    >
        <h1>Welcome!</h1>
        <p>
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

        Your Name:{" "}
        <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
        /><br/>
        Chat Bot's Name:{" "}
        <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
        /><br/>
        
        I want to practice my:{" "}
        <select onChange={(e) => setPracticeLanguage(e.target.value)} value={practiceLanguage}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        Translate for me into:{" "} 
        <select onChange={(e) => setPreferredLanguage(e.target.value)} value={preferredLanguage}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        <button onClick={() => setShowWelcomeModal(false)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring focus:ring-blue-400">Let's Chat!</button>
    </Modal>
}

export default WelcomeModal;
