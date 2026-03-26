import fs from 'fs'
import os from 'os'
import path from 'path'
import type { Config } from './type'

export const MAIN_DIR = path.join(os.homedir(), '.minesweeper')

export const getConfig = () => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const filePath = path.join(MAIN_DIR, 'config.json')

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}), 'utf-8')
    return {}
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const config = JSON.parse(content || '{}') as Config

  return config
}

export const saveConfig = (config: Partial<Config>) => {
  if (!fs.existsSync(MAIN_DIR)) fs.mkdirSync(MAIN_DIR)

  const oldConfig = getConfig()

  const filename = 'config.json'
  const filePath = path.join(MAIN_DIR, filename)
  const content = JSON.stringify({ ...oldConfig, ...config })

  fs.writeFileSync(filePath, content, 'utf8')
}
