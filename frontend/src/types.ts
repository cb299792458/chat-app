export interface Options {
    autoplayResponseAudio: boolean;
    hideUserMessageText: boolean;
    hideUserMessageTranslation: boolean;
    hideResponseText: boolean;
    hideResponseTranslation: boolean;
}

export interface MessageRowProps {
    message: Message;
    userName: string;
    botName: string;
    options: Options;
    speaking: boolean;
    setSpeaking: (speaking: boolean) => void;
}

export enum Language {
    American_English = 'en-US',
    Spanish = 'es-ES',
    French = 'fr-FR',
    Italian = 'it-IT',
    Portuguese = 'pt-PT',
    German = 'de-DE',
    Greek = 'el-GR',
    Russian = 'ru-RU',
    Filipino = 'fil',
    Hebrew = 'he-IL',
    Arabic = 'ar-AR',
    Hindi = 'hi-IN',
    Bengali = 'bn-IN',
    Urdu = 'ur-IN',
    Mandarin_Chinese = 'zh-CN',
    Cantonese_Chinese = 'yue',
    Traditional_Chinese = 'zh-TW',
    Fuzhou_Chinese = 'fzho',
    Japanese = 'ja-JP',
    Korean = 'ko-KR',
    Thai = 'th-TH',
    Vietnamese = 'vi-VN',
}

export const languageNames: { [key: string]: string } = {};
Object.keys(Language).forEach((key) => {
    const value = Language[key as keyof typeof Language];
    languageNames[value] = key;
});

export interface Message {
    fromUser: boolean;
    source: Language;
    target: Language;
    text: string;
    translation: string;
}
