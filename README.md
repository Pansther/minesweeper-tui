# Minesweeper TUI

[![npm version](https://img.shields.io/npm/v/minesweeper-tui.svg)](https://www.npmjs.com/package/minesweeper-tui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![Releases](https://img.shields.io/github/v/release/Pansther/note-tui)](https://github.com/Pansther/note-tui/releases)

A **Vim-friendly** Minesweeper game playable directly in your terminal. Built with React Ink.

![cover](https://raw.githubusercontent.com/Pansther/minesweeper-tui/main/demo/cover.png)

## About

This is my second TUI-based project built with React and Ink.

It is a terminal port of my original [Minesweeper Svelte](https://github.com/Pansther/minesweeper-svelte). While I reused most of the core helper functions and logic from the original version, the entire UI has been completely rewritten for the terminal using React and Ink.

I hope you have fun playing it!

## Gameplay

![gameplay](https://raw.githubusercontent.com/Pansther/minesweeper-tui/main/demo/gameplay.gif)

- `open` on an unrevealed square: To open the square. If it's a mine, the game is over! If it's not a mine, it will reveal a number indicating how many mines are adjacent to it (in the 8 surrounding squares).

- `flag` on an unrevealed square: To place a flag on the square. This marks it as a suspected mine. `flag` again to remove the flag.

- `open` on revealed square: If the number of flags matches the number on the cell, this opens all remaining unflagged adjacent squares.

![open-adjacent](https://raw.githubusercontent.com/Pansther/minesweeper-tui/main/demo/open-adjacent.gif)

- `flag` on revealed square: Automatically flags all remaining unrevealed adjacent squares if they must contain mines.

![flag-adjacent](https://raw.githubusercontent.com/Pansther/minesweeper-tui/main/demo/flag-adjacent.gif)

## Installation

Download pre-built binaries for your platform from the [Releases](https://github.com/Pansther/minesweeper-tui/releases) page.

### Homebrew (MacOS and Linux)

```bash
brew tap Pansther/minesweeper
brew install minesweeper
```

### Node

```bash
npm i -g minesweeper-tui
```

```bash
npx minesweeper-tui
```

```bash
yarn global add minesweeper-tui
```

```bash
bun install -g minesweeper-tui
```

### From Source

To start the `minesweeper-tui` application directly from the source code, make sure you have Bun (version 1.x or higher) installed.

1. Install dependencies:

   ```bash
   bun install
   ```

2. Run the application:

   ```bash
   bun start
   ```

## Keybindings

`minesweeper-tui` supports common Vim-like keybindings for efficient navigation and interaction within the application. This includes familiar keys like `j`, `k` for vertical movement, `h`, `l` for horizontal focus changes, and `g`, `G` for quick jumps to the top or bottom.

- **Navigation:**
  - `←/h`: Move left
  - `↓/j`: Move down
  - `↑/k`: Move up
  - `→/l`: Move right
  - `0`: Go to start of row
  - `$`: Go to end of row
  - `g`: Go to top
  - `G`: Go to bottom
  - `M`: Go to center
- **Gameplay:**
  - `space`: Open cell
  - `f`: Flag cell
  - `backspace`: Hint
- **Game Management:**

  - `</>`: Cycle theme
  - `r`: Restart game
  - `?`: Toggle visibility of key instructions
  - `Q`: Exit game

## Configuration

`minesweeper-tui` stores your notes in `~/.minesweeper`.

## Troubleshooting

### Color Issues

If the colors in `minesweeper-tui` appear dull or incorrect, your terminal might not be identifying itself as a True Color terminal. You can fix this by adding the following to your shell configuration (`.zshrc` or `.bashrc`):

```bash
export COLORTERM=truecolor
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
