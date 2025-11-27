import { useRef } from "react";
import { ACCOUNT_TABLE_CLICK_DELAY } from "../lib/constants";

export function useTableInteraction() {
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const clickPrevent = useRef(false);
  
  const handleSingleClick = (callback: () => void) => {
    clickTimer.current = setTimeout(() => {
      if (!clickPrevent.current) {
        callback();
      }
      clickPrevent.current = false;
    }, ACCOUNT_TABLE_CLICK_DELAY);
  };
  
  const handleDoubleClick = (callback: () => void, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }
    clickPrevent.current = true;
    callback();
  };
  
  return { handleSingleClick, handleDoubleClick };
}

