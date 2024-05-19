import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLeft } from '@fortawesome/free-solid-svg-icons'
import { Language, languageNames } from "../../types";
import axios from "axios";
import { buttonClass, h2Class, inputClass, modalStyle } from "../../styles";

Modal.setAppElement("#root");

const DictionaryModal = ({
    showDictionaryModal,
    setShowDictionaryModal,
    translatedLanguage,
    originalLanguage,
}: {
    showDictionaryModal: boolean,
    setShowDictionaryModal: (showDictionaryModal: boolean) => void,
    translatedLanguage: Language,
    originalLanguage: Language,
}) => {
    const [switched, setSwitched] = React.useState(false);
    const [original, setOriginal] = React.useState("");
    const [translated, setTranslated] = React.useState("");

    const originalLanguageName = languageNames[originalLanguage].replace('_', " ");
    const translatedLanguageName = languageNames[translatedLanguage].replace('_', " ");

    const googleCloudApiKey: string | undefined = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
    const translate = async () => {
        const body = {
            q: original,
            source: switched ? translatedLanguage : originalLanguage,
            target: switched ? originalLanguage : translatedLanguage,
        };

        const res = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${googleCloudApiKey}`, 
            body
        );
        setTranslated(res.data.data.translations[0].translatedText);
    }

    const swap = () => {
        setOriginal(translated);
        setTranslated('');
        setSwitched(!switched);
    }

    return <Modal
        isOpen={showDictionaryModal}
        onRequestClose={() => setShowDictionaryModal(false)}
        contentLabel="Dictionary Modal"
        style={modalStyle}
    >
        <h2 className={h2Class}>Dictionary</h2>

        <div className="flex flex-col items-center">

            <div className="flex flex-row my-2">
                <span>{switched ? translatedLanguageName : originalLanguageName}</span>
                <FontAwesomeIcon icon={faRightLeft} onClick={swap} />
                <span>{switched ? originalLanguageName : translatedLanguageName}</span>
            </div>

            <div className="flex flex-row items-center">
                <input type="text" value={original} onChange={(e) => setOriginal(e.target.value)} className={"w-full max-w-sm " + inputClass}/>
                <input type="text" value={translated} className={"w-full max-w-sm " + inputClass}/>
            </div>

            <button onClick={translate} className={buttonClass}>Translate</button>
        </div>
    </Modal>
}

export default DictionaryModal;
