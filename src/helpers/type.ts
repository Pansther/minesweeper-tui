import type { Difficulty } from '@/scene/Game/type'
import type { AvailableTheme } from '@/store/type'

export interface Config {
  theme: AvailableTheme
  difficulty: Difficulty
  isShowKey: boolean
}
