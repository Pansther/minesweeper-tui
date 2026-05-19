import type { GameContextValue } from '@/scene/Game/context/type'
import type { Difficulty } from '@/scene/Game/type'
import type { AvailableTheme } from '@/store/type'

export interface Config {
  theme: AvailableTheme
  difficulty: Difficulty
  isShowKey: boolean
}

export type GameSave = Pick<
  GameContextValue,
  'mines' | 'hintAmount' | 'playRows'
> & {
  initTime: number
}
