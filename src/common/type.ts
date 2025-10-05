export type PlayMode = 'repeat-one' | 'repeat' | 'shuffle';

export interface trackInterface {
  name: string,
  url: string,
  source?: string,
  authors?: string[],
}