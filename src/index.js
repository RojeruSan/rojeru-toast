/**
 * rojeru-toast - Librería moderna de mensajes toast
 * @version 2.6.1
 * @license MIT
 * @author Rogelio Urieta Camacho (RojeruSan)
 */
/**
 * MIT License
 *
 * Copyright (c) 2025 Rogelio Urieta Camacho (RojeruSan)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
class RojeruToast {
    constructor() {
        this.defaultOptions = {
            duration: 3000,
            position: 'top-right',
            type: 'info',
            dismissible: true,
            pauseOnHover: true,
            theme: 'light',
            animation: 'slide',
            closeOnClick: false
        };

        this.container = null;
        this.toastInstances = new Map();
        this.stylesInjected = false;
        this.init();
    }

    init() {
        this.createContainer();
        this.injectStyles();
    }

    injectStyles() {
        if (this.stylesInjected || document.querySelector('#rojeru-toast-styles')) {
            this.stylesInjected = true;
            return;
        }

        const link = document.createElement('link');
        link.id = 'rojeru-toast-styles';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/rojeru-toast@latest/dist/rojeru-toast.min.css';
        link.onerror = () => {
            console.warn('No se pudieron cargar los estilos CSS desde CDN. Los estilos se inyectarán inline.');
            this.injectInlineStyles();
        };
        document.head.appendChild(link);
        this.stylesInjected = true;
    }

    injectInlineStyles() {
        if (document.querySelector('#rojeru-toast-inline-styles')) return;

        const style = document.createElement('style');
        style.id = 'rojeru-toast-inline-styles';
        style.textContent = `
            .rojeru-toast-container {
                position: fixed;
                z-index: 10000;
                pointer-events: none;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 420px;
                padding: 20px;
            }
            .rojeru-toast-container.top-right { top: 0; right: 0; align-items: flex-end; }
            .rojeru-toast-container.top-left { top: 0; left: 0; align-items: flex-start; }
            .rojeru-toast-container.top-center { top: 0; left: 50%; transform: translateX(-50%); align-items: center; }
            .rojeru-toast-container.bottom-right { bottom: 0; right: 0; align-items: flex-end; }
            .rojeru-toast-container.bottom-left { bottom: 0; left: 0; align-items: flex-start; }
            .rojeru-toast-container.bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); align-items: center; }
            .rojeru-toast {
                pointer-events: all;
                padding: 16px 20px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
                line-height: 1.5;
                max-width: 380px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
                border: 1px solid;
            }
            .rojeru-toast.rojeru-toast-clickable { cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            .rojeru-toast.rojeru-toast-clickable:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
            .rojeru-toast.rojeru-toast-clickable:active { transform: translateY(0); }
            .rojeru-toast::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, currentColor, transparent); opacity: 0.3; }
            .rojeru-toast.hiding { transform: scale(0.9) translateX(100px); opacity: 0; pointer-events: none; }
            .rojeru-toast.light { background: rgba(255,255,255,0.95); color: #1a1a1a; border-color: rgba(0,0,0,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8); }
            .rojeru-toast.light.info { color: #0066CC; } .rojeru-toast.light.success { color: #00A86B; } .rojeru-toast.light.warning { color: #FF6B00; } .rojeru-toast.light.error { color: #FF3B30; } .rojeru-toast.light.loading { color: #666666; }
            .rojeru-toast.dark { background: rgba(28,28,30,0.95); color: #ffffff; border-color: rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1); }
            .rojeru-toast.dark.info { color: #5AC8FA; } .rojeru-toast.dark.success { color: #30D158; } .rojeru-toast.dark.warning { color: #FF9F0A; } .rojeru-toast.dark.error { color: #FF453A; } .rojeru-toast.dark.loading { color: #8E8E93; }
            .rojeru-toast.colored { color: white; border: none; box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15); text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
            .rojeru-toast.colored.info { background: linear-gradient(135deg, #0055AA, #0077CC); }
            .rojeru-toast.colored.success { background: linear-gradient(135deg, #008755, #00AA66); }
            .rojeru-toast.colored.warning { background: linear-gradient(135deg, #CC5500, #EE7700); }
            .rojeru-toast.colored.error { background: linear-gradient(135deg, #CC2200, #EE4422); }
            .rojeru-toast-colored::before { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); }
            .rojeru-toast-colored .rojeru-toast-close { background: rgba(255,255,255,0.25); color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
            .rojeru-toast-colored .rojeru-toast-close:hover { background: rgba(255,255,255,0.35); }
            .rojeru-toast-colored .rojeru-toast-progress { background: rgba(255,255,255,0.6); box-shadow: 0 0 8px rgba(255,255,255,0.3); }
            .rojeru-toast-loading-icon { animation: rojeru-toast-spin 1s linear infinite; }
            @keyframes rojeru-toast-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .rojeru-toast-icon { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; }
            .rojeru-toast-icon svg { width: 100%; height: 100%; display: block; }
            .rojeru-toast-content { flex: 1; padding-right: 8px; display: flex; flex-direction: column; gap: 2px; }
            .rojeru-toast-title { font-weight: 600; font-size: 15px; display: block; }
            .rojeru-toast-message { opacity: 0.95; font-weight: 400; line-height: 1.4; }
            .rojeru-toast.colored .rojeru-toast-title { opacity: 0.95; font-weight: 700; }
            .rojeru-toast.colored .rojeru-toast-message { opacity: 0.9; }
            .rojeru-toast:not(:has(.rojeru-toast-title)) .rojeru-toast-content { gap: 0; }
            .rojeru-toast:not(:has(.rojeru-toast-title)) .rojeru-toast-message { margin-top: 1px; }
            .rojeru-toast-close { background: rgba(0,0,0,0.1); border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; opacity: 0.7; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; flex-shrink: 0; margin-top: -2px; font-size: 16px; font-weight: bold; }
            .rojeru-toast-close:hover { opacity: 1; background: rgba(0,0,0,0.15); transform: scale(1.1); }
            .rojeru-toast.dark .rojeru-toast-close { background: rgba(255,255,255,0.15); color: #ffffff; }
            .rojeru-toast.dark .rojeru-toast-close:hover { background: rgba(255,255,255,0.25); }
            .rojeru-toast-progress { position: absolute; bottom: 0; left: 0; height: 3px; background: currentColor; opacity: 0.3; width: 100%; transform-origin: left; transform: scaleX(1); }
            .rojeru-toast.slide { animation: rojeru-toast-slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
            .rojeru-toast.fade { animation: rojeru-toast-fade-in 0.4s ease-out; }
            .rojeru-toast.scale { animation: rojeru-toast-scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes rojeru-toast-slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes rojeru-toast-slide-in-left { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes rojeru-toast-fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes rojeru-toast-scale-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
            @keyframes rojeru-toast-update { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
            @keyframes rojeru-toast-type-change { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.95); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
            @media (max-width: 768px) {
                .rojeru-toast-container { max-width: 100vw; padding: 10px; }
                .rojeru-toast { max-width: calc(100vw - 20px); font-size: 15px; padding: 14px 16px; }
                .rojeru-toast-container.top-center, .rojeru-toast-container.bottom-center { width: 100%; }
                .rojeru-toast-icon { width: 18px; height: 18px; }
            }
        `;
        document.head.appendChild(style);
    }

    createContainer() {
        const existingContainer = document.querySelector('.rojeru-toast-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        this.container = document.createElement('div');
        this.container.className = 'rojeru-toast-container';
        document.body.appendChild(this.container);
    }

    getIcon(type) {
        const icons = {
            info: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>',
            success: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 17H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10.29 3.86L1.82 18C1.645 18.302 1.553 18.649 1.553 19C1.553 19.351 1.645 19.698 1.82 20C2.08 20.47 2.591 20.79 3.17 20.79H20.83C21.409 20.79 21.92 20.47 22.18 20C22.355 19.698 22.447 19.351 22.447 19C22.447 18.649 22.355 18.302 22.18 18L13.71 3.86C13.45 3.39 12.939 3.07 12.36 3.07C11.781 3.07 11.27 3.39 11.01 3.86V3.86Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            loading: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="rojeru-toast-loading-icon"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.4 31.4" opacity="0.3"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="15.7 31.4"/></svg>'
        };
        return icons[type] || icons.info;
    }

    show(title, message, options = {}) {
        const config = { ...this.defaultOptions, ...options };

        const isSimpleToast = message === undefined && typeof title === 'string';

        if (isSimpleToast) {
            message = title;
            title = null;
        }

        this.updateContainerPosition(config.position);

        const toast = document.createElement('div');

        if (config.type === 'loading') {
            const baseType = config.loadingType || 'info';
            toast.className = `rojeru-toast ${config.theme} loading ${baseType} ${config.animation}`;
        } else {
            toast.className = `rojeru-toast ${config.theme} ${config.type} ${config.animation}`;
        }

        const iconType = config.type === 'loading' ? 'loading' : config.type;
        const icon = this.getIcon(iconType);
        const hasTitle = title && title !== '';

        toast.innerHTML = `
            <div class="rojeru-toast-icon">${icon}</div>
            <div class="rojeru-toast-content">
                ${hasTitle ? `<span class="rojeru-toast-title">${title}</span>` : ''}
                <span class="rojeru-toast-message">${message}</span>
            </div>
            ${config.dismissible && config.type !== 'loading' ? '<button class="rojeru-toast-close" aria-label="Cerrar">&times;</button>' : ''}
            ${config.duration > 0 && config.type !== 'loading' ? '<div class="rojeru-toast-progress"></div>' : ''}
        `;

        if (config.type === 'loading') {
            config.dismissible = false;
            config.closeOnClick = false;
        }

        if (!config.dismissible && config.duration === 0 && config.closeOnClick) {
            toast.classList.add('rojeru-toast-clickable');
        }

        this.addSlideAnimation(toast, config.position);
        this.container.appendChild(toast);

        const toastId = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        toast.setAttribute('data-toast-id', toastId);

        let timeoutId = null;

        if (config.duration > 0 && config.type !== 'loading') {
            const progressBar = toast.querySelector('.rojeru-toast-progress');
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.transition = `transform ${config.duration}ms linear`;
                    progressBar.style.transform = 'scaleX(0)';
                }, 50);
            }

            timeoutId = setTimeout(() => {
                this.hide(toast);
            }, config.duration);
        }

        if (config.dismissible && config.type !== 'loading') {
            const closeBtn = toast.querySelector('.rojeru-toast-close');
            closeBtn.addEventListener('click', () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                this.hide(toast);
            });
        }

        if (config.closeOnClick && config.type !== 'loading') {
            toast.style.cursor = 'pointer';
            toast.addEventListener('click', (e) => {
                if (!e.target.closest('.rojeru-toast-close')) {
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    this.hide(toast);
                }
            });
        }

        if (config.pauseOnHover && config.duration > 0 && config.type !== 'loading') {
            let remainingTime = config.duration;
            let startTime = Date.now();

            toast.addEventListener('mouseenter', () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;

                    const elapsed = Date.now() - startTime;
                    remainingTime = config.duration - elapsed;

                    const progressBar = toast.querySelector('.rojeru-toast-progress');
                    if (progressBar) {
                        const computedStyle = window.getComputedStyle(progressBar);
                        const currentScale = new DOMMatrixReadOnly(computedStyle.transform).m11;
                        progressBar.style.transition = 'none';
                        progressBar.style.transform = `scaleX(${currentScale})`;
                    }
                }
            });

            toast.addEventListener('mouseleave', () => {
                if (!timeoutId && remainingTime > 0) {
                    startTime = Date.now();

                    const progressBar = toast.querySelector('.rojeru-toast-progress');
                    if (progressBar) {
                        const computedStyle = window.getComputedStyle(progressBar);
                        const currentScale = new DOMMatrixReadOnly(computedStyle.transform).m11;
                        const remainingDuration = remainingTime;

                        progressBar.style.transition = `transform ${remainingDuration}ms linear`;
                        progressBar.style.transform = 'scaleX(0)';
                    }

                    timeoutId = setTimeout(() => {
                        this.hide(toast);
                    }, remainingTime);
                }
            });
        }

        const toastInstance = {
            hide: () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                this.hide(toast);
            },
            update: (newTitle, newMessage, newOptions = {}) => {
                return this.updateToast(toast, newTitle, newMessage, newOptions);
            },
            changeType: (newType, newMessage = null, newTitle = null) => {
                return this.changeToastType(toast, newType, newMessage, newTitle);
            },
            complete: (successMessage = null, options = {}) => {
                if (toast.classList.contains('loading')) {
                    const message = successMessage || 'Proceso completado';
                    const type = options.type || 'success';
                    return this.changeToastType(toast, type, message);
                }
                return this;
            },
            getId: () => toastId,
            element: toast
        };

        this.toastInstances.set(toastId, toastInstance);

        return toastInstance;
    }

    updateToast(toast, newTitle, newMessage, newOptions = {}) {
        const isSimpleUpdate = newMessage === undefined && typeof newTitle === 'string';

        if (isSimpleUpdate) {
            newMessage = newTitle;
            newTitle = null;
        }

        if (newOptions.type) {
            this.changeToastType(toast, newOptions.type, newMessage, newTitle);
            return;
        }

        const titleEl = toast.querySelector('.rojeru-toast-title');
        const messageEl = toast.querySelector('.rojeru-toast-message');

        if (titleEl) {
            if (newTitle) {
                titleEl.textContent = newTitle;
                titleEl.style.display = 'block';
            } else {
                titleEl.style.display = 'none';
            }
        }

        if (messageEl && newMessage !== null) {
            messageEl.innerHTML = newMessage;
        }

        if (newOptions.theme) {
            toast.classList.remove('light', 'dark', 'colored');
            toast.classList.add(newOptions.theme);
        }

        toast.style.animation = 'none';
        setTimeout(() => {
            toast.style.animation = 'rojeru-toast-update 0.3s ease-out';
        }, 10);

        return this.toastInstances.get(toast.getAttribute('data-toast-id'));
    }

    changeToastType(toast, newType, newMessage = null, newTitle = null) {
        toast.classList.remove('info', 'success', 'warning', 'error', 'loading');

        if (newType === 'loading') {
            const baseType = 'info';
            toast.classList.add('loading', baseType);
        } else {
            toast.classList.add(newType);
        }

        const iconEl = toast.querySelector('.rojeru-toast-icon');
        if (iconEl) {
            const iconType = newType === 'loading' ? 'loading' : newType;
            iconEl.innerHTML = this.getIcon(iconType);
        }

        if (newType !== 'loading') {
            const hasCloseBtn = toast.querySelector('.rojeru-toast-close');
            if (!hasCloseBtn && this.defaultOptions.dismissible) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'rojeru-toast-close';
                closeBtn.setAttribute('aria-label', 'Cerrar');
                closeBtn.innerHTML = '&times;';
                closeBtn.addEventListener('click', () => {
                    this.hide(toast);
                });
                toast.appendChild(closeBtn);
            }

            const existingProgress = toast.querySelector('.rojeru-toast-progress');
            if (existingProgress) {
                existingProgress.remove();
            }
        } else {
            const closeBtn = toast.querySelector('.rojeru-toast-close');
            if (closeBtn) {
                closeBtn.remove();
            }
            const progressBar = toast.querySelector('.rojeru-toast-progress');
            if (progressBar) {
                progressBar.remove();
            }
        }

        if (newMessage !== null) {
            const messageEl = toast.querySelector('.rojeru-toast-message');
            if (messageEl) {
                messageEl.innerHTML = newMessage;
            }
        }

        if (newTitle !== null) {
            const titleEl = toast.querySelector('.rojeru-toast-title');
            if (titleEl) {
                if (newTitle) {
                    titleEl.textContent = newTitle;
                    titleEl.style.display = 'block';
                } else {
                    titleEl.style.display = 'none';
                }
            }
        }

        toast.style.animation = 'none';
        setTimeout(() => {
            toast.style.animation = 'rojeru-toast-type-change 0.4s ease-out';
        }, 10);

        return this.toastInstances.get(toast.getAttribute('data-toast-id'));
    }

    addSlideAnimation(toast, position) {
        const isLeft = position.includes('left');
        const isTop = position.includes('top');
        const isCenter = position.includes('center');

        if (isCenter) {
            toast.style.animation = isTop ?
                'rojeru-toast-fade-in 0.4s ease-out' :
                'rojeru-toast-fade-in 0.4s ease-out';
        } else if (isLeft) {
            toast.style.animation = 'rojeru-toast-slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        }
    }

    updateContainerPosition(position) {
        this.container.className = `rojeru-toast-container ${position}`;
    }

    hide(toast) {
        if (toast && toast.parentNode) {
            const toastId = toast.getAttribute('data-toast-id');
            this.toastInstances.delete(toastId);

            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 400);
        }
    }

    hideById(toastId) {
        const toastInstance = this.toastInstances.get(toastId);
        if (toastInstance) {
            toastInstance.hide();
        }
    }

    hideLast() {
        const toasts = Array.from(this.container.querySelectorAll('.rojeru-toast'));
        if (toasts.length > 0) {
            this.hide(toasts[toasts.length - 1]);
        }
    }

    hideByType(type) {
        const toasts = this.container.querySelectorAll(`.rojeru-toast.${type}`);
        toasts.forEach(toast => {
            this.hide(toast);
        });
    }

    info(message, options = {}) {
        return this.show(null, message, { ...options, type: 'info' });
    }

    success(message, options = {}) {
        return this.show(null, message, { ...options, type: 'success' });
    }

    warning(message, options = {}) {
        return this.show(null, message, { ...options, type: 'warning' });
    }

    error(message, options = {}) {
        return this.show(null, message, { ...options, type: 'error' });
    }

    loading(message, options = {}) {
        const baseType = options.loadingType || 'info';

        return this.show(null, message, {
            ...options,
            type: 'loading',
            loadingType: baseType,
            dismissible: false,
            duration: 0
        });
    }

    withTitle(title, message, options = {}) {
        return this.show(title, message, options);
    }

    clear() {
        const toasts = this.container.querySelectorAll('.rojeru-toast');
        toasts.forEach(toast => {
            this.hide(toast);
        });
        this.toastInstances.clear();
    }
}

// Exportaciones para diferentes entornos
export default RojeruToast;

// Para uso global en navegador
if (typeof window !== 'undefined') {
    window.RojeruToast = RojeruToast;
    window.rojeruToast = new RojeruToast();
}

// Para CommonJS/Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RojeruToast;
    module.exports.default = RojeruToast;
}