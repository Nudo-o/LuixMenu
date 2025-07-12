import Settings from "./modules/Settings.js"
import FastMenu from "./ui/FastMenu.js"
import Hud from "./ui/hud/Hud.js"
import Menu from "./ui/menu/Menu.js"

export const settings = new Settings()
export const keys = new Map()
export const menu = new Menu()
export const hud = new Hud()
export const fastMenu = new FastMenu()