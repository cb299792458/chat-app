import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLeft } from '@fortawesome/free-solid-svg-icons'
import { Language, languageNames } from "../../types";
import axios from "axios";
import { blueButtonClass, h2Class, inputClass, modalStyle } from "../../styles";

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

    React.useEffect(() => {
        if (!original) setTranslated("");
    }, [original]);

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
    };

    const swap = () => {
        setOriginal(translated);
        setTranslated('');
        setSwitched(!switched);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            translate();
        }
    };

    const copyTranslation = () => {
        navigator.clipboard.writeText(translated);
    };

    return <Modal
        isOpen={showDictionaryModal}
        onRequestClose={() => setShowDictionaryModal(false)}
        contentLabel="Dictionary Modal"
        style={modalStyle}
    >
        <h2 className={h2Class}>Dictionary</h2>

        <div className="flex flex-col items-center">


            <div className="flex flex-row">
                <div className="flex flex-col items-center m-2">
                    <span className="pointer-events-none">{switched ? translatedLanguageName : originalLanguageName}</span>
                    <textarea value={original} rows={4} onChange={(e) => setOriginal(e.target.value)} className={"w-full max-w-sm " + inputClass} onKeyDown={handleKeyDown}/>
                    <div className="flex flex-row">
                        <button onClick={translate} className={blueButtonClass}>Translate Text</button>
                        <button onClick={() => setOriginal('')} className={blueButtonClass} title="clear">🗑️</button>
                    </div>
                </div>

                <div className="m-2">
                    <FontAwesomeIcon icon={faRightLeft} onClick={swap} />
                </div>

                <div className="flex flex-col items-center m-2">
                    <span className="pointer-events-none">{switched ? originalLanguageName : translatedLanguageName}</span>
                    <textarea readOnly={true} rows={4} value={translated} className={"w-full max-w-sm " + inputClass}/>
                    <button className={blueButtonClass} onClick={copyTranslation}>Copy Translation</button>
                </div>
            </div>

        </div>
    </Modal>
}

export default DictionaryModal;
