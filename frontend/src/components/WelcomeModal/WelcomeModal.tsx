import Modal from "react-modal"

const WelcomeModal = ({
    showWelcomeModal,
    setShowWelcomeModal,
    userName, setUserName,
    botName, setBotName,
}: {
    showWelcomeModal: boolean,
    setShowWelcomeModal: (showWelcomeModal: boolean) => void,
    userName: string,
    setUserName: (userName: string) => void,
    botName: string,
    setBotName: (botName: string) => void,
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
        <button onClick={() => setShowWelcomeModal(false)}>Chat!</button>
    </Modal>
}

export default WelcomeModal;
