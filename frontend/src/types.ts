export interface ChatBoxProps {
    name: string
}

export interface MessageRowProps {
    message: Message;
    i: number;
    userName: string;
    botName: string;
}

export enum Language {
    American_English = 'en-US',
    Spanish = 'es-ES',
    French = 'fr-FR',
    German = 'de-DE',
    Filipino = 'fil',
    Mandarin_Chinese = 'zh-CN',
    Cantonese_Chinese = 'yue',
    Traditional_Chinese = 'zh-tw',
    Fuzhou_Chinese = 'fzho',
    Japanese = 'ja-JP',
    Korean = 'ko-KR',
    Thai = 'th-TH',
    Vietnamese = 'vi-VN',
    Russian = 'ru-RU',
    Greek = 'el-GR',
}

export interface Message {
    fromUser: boolean;
    source: Language;
    target: Language;
    text: string;
    translation: string;
}
