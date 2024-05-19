import React from "react"
import Modal from "react-modal"
import { Language, Options } from "../../types";
import { h2Class, inputClass, modalStyle } from "../../styles";

Modal.setAppElement('#root');

const OptionsModal = ({
    showOptionsModal,
    setShowOptionsModal,
    practiceLanguage,
    setPracticeLanguage,
    preferredLanguage,
    setPreferredLanguage,
    options,
    setOptions,
}: {
    showOptionsModal: boolean,
    setShowOptionsModal: (showOptionsModal: boolean) => void,
    practiceLanguage: string,
    setPracticeLanguage: (practiceLanguage: string) => void,
    preferredLanguage: string,
    setPreferredLanguage: (preferredLanguage: string) => void,
    options: Options,
    setOptions: (options: Options) => void,
}) => {
    const handlePracticeLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPracticeLanguage(e.target.value);
    const handlePreferredLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPreferredLanguage(e.target.value);

    return <Modal
        isOpen={showOptionsModal}
        onRequestClose={() => setShowOptionsModal(false)}
        style={modalStyle}
    >
        <h2 className={h2Class}>Options</h2>

        I want to practice my:{" "}
        <select onChange={handlePracticeLanguageChange} value={practiceLanguage} className={inputClass}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        Translate for me into:{" "} 
        <select onChange={handlePreferredLanguageChange} value={preferredLanguage} className={inputClass}>
            {Object.entries(Language).map(([name, code]) => <option value={code} key={code}>{name.replace('_', " ")}</option>)}
        </select><br/>

        <label>
            <input type="checkbox" checked={options.autoplayResponseAudio} onChange={(e) => setOptions({...options, autoplayResponseAudio: e.target.checked})}/>
            Autoplay Response Audio
        </label><br/>
        <label>
            <input type="checkbox" checked={options.hideUserMessageText} onChange={(e) => setOptions({...options, hideUserMessageText: e.target.checked})}/>
            Hide User Message Text
        </label><br/>
        <label>
            <input type="checkbox" checked={options.hideUserMessageTranslation} onChange={(e) => setOptions({...options, hideUserMessageTranslation: e.target.checked})}/>
            Hide User Message Translation
        </label><br/>
        <label>
            <input type="checkbox" checked={options.hideResponseText} onChange={(e) => setOptions({...options, hideResponseText: e.target.checked})}/>
            Hide Response Text
        </label><br/>
        <label>
            <input type="checkbox" checked={options.hideResponseTranslation} onChange={(e) => setOptions({...options, hideResponseTranslation: e.target.checked})}/>
            Hide Response Translation
        </label><br/>

    </Modal>
}

export default OptionsModal;
