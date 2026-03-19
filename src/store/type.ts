export enum Scene {
  Menu,
  Game,
  Setting,
  Quit,
}

export interface ThemeGameConfig {
  close: string
  selected: string
  mine: string
  flag: string
  open: string
  dangers: string[]
  adjacent: string
}

export interface ThemeFontConfig {
  backgroundColor: string
  foregroundColor: string
  accentColor: string
  secondaryColor: string
  errorColor: string
  textColor: string
  borderColor: string
}

export enum AvailableTheme {
  Catppuccin = 1,
  Everforest,
  Gruvbox,
  Rosepine,
  Tokyonight,
  Nord,
  Monokai,
  Dracula,
}

export type Themes = Record<AvailableTheme, ThemeFontConfig>
