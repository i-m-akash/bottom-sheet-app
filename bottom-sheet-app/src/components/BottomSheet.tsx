
import React, { useRef, useState, useEffect, KeyboardEvent } from 'react';
import '../styles.css';

const snapPoints = [0, 50, 100]; // Percent of screen height

const BottomSheet: React.FC = () => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0); // Current snap % (0/50/100)
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const animateTo = (target: number) => {
    if (!sheetRef.current) return;
    sheetRef.current.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    sheetRef.current.style.transform = `translateY(${100 - target}%)`;
    setPosition(target);
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(y);
    setDragging(true);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging || dragStartY === null || !sheetRef.current) return;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = y - dragStartY;
    const newPosition = position - (deltaY / window.innerHeight) * 100;

    if (newPosition >= 0 && newPosition <= 100) {
      sheetRef.current.style.transition = 'none';
      sheetRef.current.style.transform = `translateY(${100 - newPosition}%)`;
    }
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging || dragStartY === null || !sheetRef.current) return;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    const deltaY = y - dragStartY;
    const newPosition = position - (deltaY / window.innerHeight) * 100;

    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - newPosition) < Math.abs(prev - newPosition) ? curr : prev
    );

    animateTo(closest);
    setDragStartY(null);
    setDragging(false);
  };

  // Keyboard interaction: up/down arrow keys
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = snapPoints.indexOf(position);
    if (e.key === 'ArrowUp' && index < snapPoints.length - 1) {
      animateTo(snapPoints[index + 1]);
    } else if (e.key === 'ArrowDown' && index > 0) {
      animateTo(snapPoints[index - 1]);
    }
  };

  useEffect(() => {
    animateTo(position); // On mount
  }, []);

  return (
    <>
      <div className="sheet-buttons">
        <button onClick={() => animateTo(0)}>Close</button>
        <button onClick={() => animateTo(50)}>Half</button>
        <button onClick={() => animateTo(100)}>Full</button>
      </div>

      <div
        ref={sheetRef}
        className="bottom-sheet"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="handle" />
        <div className="content">
          <h2>Bottom Sheet</h2>
          <p>Drag, press buttons, or use arrow keys to control me!</p>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;