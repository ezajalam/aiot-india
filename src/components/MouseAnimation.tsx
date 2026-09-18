import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, Sparkles, Zap, Scissors, Calculator, FileText, ImageIcon } from 'lucide-react';

export const MouseAnimation: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [hoveredToolType, setHoveredToolType] = useState<'default' | 'ai' | 'calc' | 'pdf' | 'img'>('default');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    // Only enable custom mouse animations on desktop fine pointers (not touchscreens)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest(
          'button, a, input, select, textarea, [role="button"], label, .cursor-pointer'
        );
        const isInteractive = Boolean(interactiveEl);
        setIsHoveringClickable(isInteractive);

        if (isInteractive && interactiveEl) {
          const text = interactiveEl.textContent?.toLowerCase() || '';
          if (text.includes('ai') || text.includes('gemini')) {
            setHoveredToolType('ai');
          } else if (text.includes('calc') || text.includes('gst') || text.includes('emi') || text.includes('tax')) {
            setHoveredToolType('calc');
          } else if (text.includes('pdf')) {
            setHoveredToolType('pdf');
          } else if (text.includes('image') || text.includes('photo')) {
            setHoveredToolType('img');
          } else {
            setHoveredToolType('default');
          }
        } else {
          setHoveredToolType('default');
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev.slice(-4), newRipple]);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Site Brand Ambient Emerald Spotlight Torch (from allinonetool.ezaj.store #137659 / #62c39a) */}
      <div
        className="absolute w-[460px] h-[460px] rounded-full blur-3xl opacity-25 dark:opacity-20 transition-opacity duration-300"
        style={{
          transform: `translate3d(${mousePosition.x - 230}px, ${mousePosition.y - 230}px, 0)`,
          background:
            'radial-gradient(circle, rgba(19, 118, 89, 0.25) 0%, rgba(98, 195, 154, 0.08) 45%, transparent 75%)',
          willChange: 'transform',
        }}
      />

      {/* Trailing Fluid Tool Ring & Badge with Tool Icon */}
      <motion.div
        className={`fixed rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-xs shadow-sm ${
          isHoveringClickable
            ? 'bg-[#137659] dark:bg-[#62c39a] text-white dark:text-[#14221f] border-2 border-white dark:border-[#14221f] shadow-[0_0_20px_rgba(19,118,89,0.45)]'
            : isMouseDown
            ? 'bg-[#0f5c45] dark:bg-[#258263] text-white border border-[#bad5c8] dark:border-[#355c41]'
            : 'bg-[#e9f5ee]/90 dark:bg-[#254334]/90 text-[#137659] dark:text-[#62c39a] border border-[#bad5c8] dark:border-[#355c41]'
        }`}
        animate={{
          x: mousePosition.x - (isHoveringClickable ? 20 : 16),
          y: mousePosition.y - (isHoveringClickable ? 20 : 16),
          width: isHoveringClickable ? 40 : 32,
          height: isHoveringClickable ? 40 : 32,
          scale: isMouseDown ? 0.85 : 1,
          rotate: isMouseDown ? -25 : isHoveringClickable ? 18 : 0,
        }}
        transition={{
          type: 'spring',
          damping: 22,
          stiffness: 300,
          mass: 0.4,
        }}
      >
        {/* Render Dynamic Tool Icon */}
        {hoveredToolType === 'ai' ? (
          <Sparkles className={isHoveringClickable ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        ) : hoveredToolType === 'calc' ? (
          <Calculator className={isHoveringClickable ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        ) : hoveredToolType === 'pdf' ? (
          <FileText className={isHoveringClickable ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        ) : hoveredToolType === 'img' ? (
          <ImageIcon className={isHoveringClickable ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        ) : (
          <Wrench className={isHoveringClickable ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        )}
      </motion.div>

      {/* Tiny Precision Pinpoint Target Dot */}
      <div
        className={`fixed w-1.5 h-1.5 rounded-full bg-[#137659] dark:bg-[#62c39a] transition-transform duration-100 ${
          isMouseDown ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${mousePosition.x - 3}px, ${mousePosition.y - 3}px, 0)`,
          willChange: 'transform',
        }}
      />

      {/* Tactile Click Ripple Waves in Site Emerald */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ opacity: 0.7, scale: 0.2 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="fixed w-9 h-9 -ml-4.5 -mt-4.5 rounded-full border-2 border-[#137659] dark:border-[#62c39a]"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </div>
  );
};
