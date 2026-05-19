import fs from 'fs'
import path from 'path'
import { MAIN_DIR } from './file'
import type { GameSave } from './type'

const gameSaveFilename = 'game.json'

export const getGameSave = () => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const filePath = path.join(MAIN_DIR, gameSaveFilename)

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8')
    return undefined
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const gameSave = JSON.parse(content || '{}') as GameSave

  return gameSave
}

export const saveGame = (game: GameSave) => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const filePath = path.join(MAIN_DIR, gameSaveFilename)
  const content = JSON.stringify(game)

  fs.writeFileSync(filePath, content, 'utf8')
}

export const clearSaveGame = () => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const filePath = path.join(MAIN_DIR, gameSaveFilename)
  const content = JSON.stringify({})

  fs.writeFileSync(filePath, content, 'utf8')
}
