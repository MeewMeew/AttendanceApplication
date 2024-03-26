import * as icons from 'lucide-vue-next'
import type { FunctionalComponent, SVGAttributes } from 'vue'

/* Menu */
export type Menu = {
  name: string
  menuItems: MenuItem[]
}

export type Menus = Menu[]

export type MenuItem = {
  icon?: keyof typeof icons
  label: string
  children?: Omit<MenuItem[], 'children'>
  route?: string,
  requires?: {
    role: 'admin' | 'user'
  }
}

/* Icons */
interface SVGProps extends Partial<SVGAttributes> {
  size?: 24 | number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}
export type Icon = FunctionalComponent<SVGProps>;

export type ILucideIcon = keyof typeof icons
