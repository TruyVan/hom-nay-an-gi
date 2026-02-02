import { motion } from 'framer-motion';
import type { ReactNode } from 'react'; // <--- Thêm chữ 'type' vào đây nha anh yêu

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Button = ({ onClick, children, className = '', disabled }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-[25px] font-bold text-white shadow-lg
        bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300 border-none outline-none
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};