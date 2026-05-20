import fs from 'fs'
import path from 'path'
import { Difficulty } from '@/scene/Game/type'
import { MAIN_DIR } from './file'
import type { GameStats } from './type'

const statsFilename = 'stats.json'

const DEFAULT_STATS: GameStats = {
  overall: {
    win: 0,
    total: 0,
    totalDuration: 0,
    totalSafeCell: 0,
    totalSafeCellOpened: 0,
  },
  detail: {
    [Difficulty.Easy]: {
      win: 0,
      total: 0,
      totalDuration: 0,
      totalSafeCell: 0,
      totalSafeCellOpened: 0,
    },
    [Difficulty.Medium]: {
      win: 0,
      total: 0,
      totalDuration: 0,
      totalSafeCell: 0,
      totalSafeCellOpened: 0,
    },
    [Difficulty.Hard]: {
      win: 0,
      total: 0,
      totalDuration: 0,
      totalSafeCell: 0,
      totalSafeCellOpened: 0,
    },
  },
}

export const getStats = () => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const filePath = path.join(MAIN_DIR, statsFilename)

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(DEFAULT_STATS), 'utf-8')
    return DEFAULT_STATS
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const stats = JSON.parse(content) as GameStats

  if (!stats?.overall?.total) return DEFAULT_STATS

  return stats
}

export const saveStats = (cb: (oldContent: GameStats) => GameStats) => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const oldContent = getStats()

  const filePath = path.join(MAIN_DIR, statsFilename)
  const content = JSON.stringify({ ...cb?.(oldContent) })

  fs.writeFileSync(filePath, content, 'utf8')
}
