import {registerContext, showContext} from "@overextended/ox_lib/client";

export type IconAnimation = 'spin' | 'spinPulse' | 'spinReverse' | 'pulse' | 'beat' | 'fade' | 'beatFade' | 'bounce' | 'shake';
export interface ContextMenuItem {
  menu?: string;
  title?: string;
  description?: string;
  arrow?: boolean;
  image?: string;
  icon?: string;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  progress?: number;
  colorScheme?: string;
  onSelect?: (args: any) => void;
  readOnly?: boolean;
  metadata?: string[] | {
    [key: string]: any;
  } | {
    label: string;
    value: any;
    progress?: number;
    colorScheme?: string;
  }[];
  disabled?: boolean;
  event?: string;
  serverEvent?: string;
  args?: any;
}
export interface ContextMenuArrayItem extends ContextMenuItem {
  title: string;
}
export interface ContextMenuProps {
  id: string;
  title: string;
  menu?: string;
  onExit?: () => void;
  onBack?: () => void;
  canClose?: boolean;
  options: {
    [key: string]: ContextMenuItem;
  } | ContextMenuArrayItem[];
}

export class ContextMenu {

  constructor(readonly context: ContextMenuProps | ContextMenuProps[]) {}

  registerContext() {
    registerContext(this.context)
  }

  showContext() {
    if (Array.isArray(this.context)) return;
    showContext((this.context as ContextMenuProps).id)
  }
}
