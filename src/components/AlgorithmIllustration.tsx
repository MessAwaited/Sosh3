import { motion } from 'framer-motion';
import styles from './AlgorithmIllustration.module.css';

interface AlgorithmIllustrationProps {
  type: 'binary-search' | 'sort' | 'graph' | 'dp';
  className?: string;
}

export function AlgorithmIllustration({ type, className = '' }: AlgorithmIllustrationProps) {
  return (
    <motion.div
      className={`${styles.wrap} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {type === 'binary-search' && <BinarySearchIllustration />}
      {type === 'sort' && <SortIllustration />}
      {type === 'graph' && <GraphIllustration />}
      {type === 'dp' && <DPIllustration />}
    </motion.div>
  );
}

function BinarySearchIllustration() {
  const arr = [2, 5, 8, 12, 16, 23, 38, 45];
  const mid = 3; // index of 12

  return (
    <svg viewBox="0 0 320 100" className={styles.svg}>
      <defs>
        <linearGradient id="bs-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {arr.map((val, i) => (
        <g key={i}>
          <motion.rect
            x={12 + i * 38}
            y={25}
            width={34}
            height={40}
            rx={6}
            fill={i === mid ? 'url(#bs-highlight)' : 'var(--bg-secondary)'}
            stroke={i === mid ? 'var(--accent)' : 'var(--border)'}
            strokeWidth={i === mid ? 2 : 1}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
          <text
            x={29 + i * 38}
            y={52}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="14"
            fontFamily="var(--font-mono)"
          >
            {val}
          </text>
          {i === mid && (
            <text x={29 + i * 38} y={88} textAnchor="middle" fill="var(--accent)" fontSize="10">
              mid
            </text>
          )}
        </g>
      ))}
      <motion.path
        d="M 0 95 Q 160 75 320 95"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </svg>
  );
}

function SortIllustration() {
  const steps = [
    [5, 2, 8, 1, 9],
    [2, 5, 1, 8, 9],
    [2, 1, 5, 8, 9],
    [1, 2, 5, 8, 9],
  ];

  return (
    <svg viewBox="0 0 280 90" className={styles.svg}>
      {steps.map((row, rowIdx) =>
        row.map((val, colIdx) => (
          <g key={`${rowIdx}-${colIdx}`}>
            <motion.rect
              x={20 + colIdx * 52}
              y={8 + rowIdx * 20}
              width={44}
              height={16}
              rx={4}
              fill="var(--bg-secondary)"
              stroke="var(--border)"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIdx * 0.1 + colIdx * 0.03 }}
            />
            <text
              x={42 + colIdx * 52}
              y={18 + rowIdx * 20}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {val}
            </text>
          </g>
        ))
      )}
      <text x={140} y={82} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
        Пузырьковая сортировка
      </text>
    </svg>
  );
}

function GraphIllustration() {
  const nodes = [
    { id: 0, x: 80, y: 40 },
    { id: 1, x: 160, y: 25 },
    { id: 2, x: 160, y: 55 },
    { id: 3, x: 240, y: 40 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
  ];

  return (
    <svg viewBox="0 0 320 80" className={styles.svg}>
      {edges.map(([a, b], i) => {
        const n1 = nodes[a];
        const n2 = nodes[b];
        return (
          <motion.line
            key={i}
            x1={n1.x}
            y1={n1.y}
            x2={n2.x}
            y2={n2.y}
            stroke="var(--border)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g key={n.id}>
          <motion.circle
            cx={n.x}
            cy={n.y}
            r={14}
            fill="var(--bg-card)"
            stroke="var(--accent)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 200 }}
          />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {n.id}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function DPIllustration() {
  return (
    <svg viewBox="0 0 260 70" className={styles.svg}>
      <motion.rect
        x={20}
        y={15}
        width={50}
        height={40}
        rx={8}
        fill="var(--bg-secondary)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      />
      <text x={45} y={42} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)">
        F(0)
      </text>
      <motion.rect
        x={90}
        y={15}
        width={50}
        height={40}
        rx={8}
        fill="var(--bg-secondary)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      <text x={115} y={42} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)">
        F(1)
      </text>
      <motion.path
        d="M 70 35 L 85 35"
        stroke="var(--accent)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.25 }}
      />
      <motion.path
        d="M 140 35 L 155 35"
        stroke="var(--accent)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.35 }}
      />
      <motion.rect
        x={160}
        y={15}
        width={50}
        height={40}
        rx={8}
        fill="rgba(34, 197, 94, 0.15)"
        stroke="var(--accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
      <text x={185} y={42} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontFamily="var(--font-mono)">
        F(n)
      </text>
      <text x={130} y={68} textAnchor="middle" fill="var(--text-muted)" fontSize="9">
        Рекуррентность
      </text>
    </svg>
  );
}
