export type PlayMode = 'repeat-one' | 'repeat' | 'shuffle';
export type Language = "EN" | "JP" | "ID" | "ZH_CN" | "ZH_TW";
export type PlaylistType = 'lofi' | 'synthwave' | 'fantasy' | 'acoustic' | 'custom';

export interface trackInterface {
  name: string,
  url: string,
  source?: string,
  authors?: string[],
}

export interface chatMessage {
  role: string;
  content: string;
  sender: string;
  isAuto?: boolean;
}