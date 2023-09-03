// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const telegram: WebApp = window.Telegram.WebApp;

type EventType = "themeChanged" | "viewportChanged" | "mainButtonClicked";

export type WebApp = {
    initData: string;
    initDataUnsafe: WebAppInitData;
    colorScheme: "light" | "dark";
    themeParams: ThemeParams;
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    MainButton: MainButton;
    onEvent(eventType: EventType, eventHandler: ()=>void): void;
    offEvent(eventType: EventType, eventHandler: ()=>void): void;
    sendData(data: string): void;
    ready(): void;
    expand(): void;
    close(): void;
    showPopup(params: {title?: string, message: string, buttons?: PopupButton[]}, callback: (id: string) => void): void;
    showAlert(message: string, callback?: () => void): void;
    showConfirm(message: string, callback?: (confirm: boolean) => void): void;
}

export type PopupButton = {
    id: string;
    type: "default" | "ok" | "close" | "cancel" | "destructive";
    text: string;
}

export type ThemeParams = {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
}

export type WebAppInitData = {
    query_id?: string;
    user?: WebAppUser;
    receiver?: WebAppUser;
    start_param?: string;
    auth_date?: number;
    hash?: string;
}

export type WebAppUser = {
    id?: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    photo_url?: string;
}

export type MainButton = {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): MainButton;
    onClick(callback: () => void): MainButton;
    show(): MainButton;
    hide(): MainButton;
    enable(): MainButton;
    disable(): MainButton;
    showProgress(leaveActive: boolean): MainButton;
    hideProgress(): MainButton;
    setParams(params: MainButtonParams): MainButton;
}

export type MainButtonParams = {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
}

export function useTelegram() {
    return {telegram}
}