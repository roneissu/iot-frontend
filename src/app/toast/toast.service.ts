import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: any[] = [];

    showSuccess(textOrTpl: string | TemplateRef<any>, delayOverride?: number) {
        this.show(textOrTpl, { classname: 'bg-success text-light', delay: delayOverride })
    }

    showError(textOrTpl: string | TemplateRef<any>, delayOverride?: number) {
        this.show(textOrTpl, { classname: 'bg-danger text-light', delay: delayOverride })
    }

    show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
        this.toasts.push({ textOrTpl, ...options });
    }

    remove(toast: any) {
        this.toasts = this.toasts.filter((t) => t !== toast);
    }

    clear() {
        this.toasts.splice(0, this.toasts.length);
    }
}