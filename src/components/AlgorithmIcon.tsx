import { motion } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  List,
  Type,
  FunctionSquare,
  ArrowDownUp,
  Search,
  Cpu,
  Network,
} from 'lucide-react';
import styles from './AlgorithmIcon.module.css';

const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  terminal: Terminal,
  branch: GitBranch,
  list: List,
  text: Type,
  function: FunctionSquare,
  sort: ArrowDownUp,
  search: Search,
  dp: Cpu,
  graph: Network,
};

interface AlgorithmIconProps {
  name: string;
  locked?: boolean;
  size?: number;
}

export function AlgorithmIcon({ name, locked, size = 28 }: AlgorithmIconProps) {
  const Icon = icons[name] ?? Terminal;

  return (
    <motion.span
      className={`${styles.wrap} ${locked ? styles.locked : ''}`}
      whileHover={!locked ? { scale: 1.05 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Icon size={size} className={styles.icon} />
    </motion.span>
  );
}
