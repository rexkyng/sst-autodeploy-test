// Simple toast utility - can be enhanced with a proper toast library later
export interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
}

class ToastManager {
  private toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }> = [];

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', options?: ToastOptions) {
    const id = Math.random().toString(36).substring(7);

    this.toasts.push({ id, message, type });

    // For now, just log to console. TODO: Replace with proper toast UI
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Auto remove after duration
    const duration = options?.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  success(message: string, options?: ToastOptions) {
    return this.show(message, 'success', options);
  }

  error(message: string, options?: ToastOptions) {
    return this.show(message, 'error', options);
  }

  warning(message: string, options?: ToastOptions) {
    return this.show(message, 'warning', options);
  }

  info(message: string, options?: ToastOptions) {
    return this.show(message, 'info', options);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  clear() {
    this.toasts = [];
  }

  getToasts() {
    return [...this.toasts];
  }
}

export const toast = new ToastManager();
