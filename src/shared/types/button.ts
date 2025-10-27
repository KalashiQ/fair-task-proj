export interface AnimatedButtonProps {
  text?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontWeight?: number;
  borderRadius?: number;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  outlineColor?: string;
  fontFamily?: string;
  lineHeight?: string;
  transitionDuration?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}
