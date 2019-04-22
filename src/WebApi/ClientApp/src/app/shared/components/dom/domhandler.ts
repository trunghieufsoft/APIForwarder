import { Injectable } from '@angular/core';

@Injectable()
export class DomHandler {
  // tslint:disable-next-line:typedef
  public static zindex = 9000;

  private calculatedScrollbarWidth: number = undefined;

  private browser: any;

  public addClass(element: any, className: string): void {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  }

  public addMultipleClasses(element: any, className: string): void {
    if (element.classList) {
      const styles: string[] = className.split(' ');
      for (let i = 0; i < styles.length; i++) {
        element.classList.add(styles[i]);
      }
    } else {
      const styles: string[] = className.split(' ');
      for (let i = 0; i < styles.length; i++) {
        element.className += ' ' + styles[i];
      }
    }
  }

  public removeClass(element: any, className: string): void {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(
        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
        ' '
      );
    }
  }

  public hasClass(element: any, className: string): boolean {
    if (element.classList) {
      return element.classList.contains(className);
    }

    return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
  }

  public siblings(element: any): any {
    return Array.prototype.filter.call(element.parentNode.children, function(child: any): any {
      return child !== element;
    });
  }

  public find(element: any, selector: string): any[] {
    return element.querySelectorAll(selector);
  }

  public findSingle(element: any, selector: string): any {
    return element.querySelector(selector);
  }

  public index(element: any): number {
    const children = element.parentNode.childNodes;
    let num = 0;
    for (let i = 0; i < children.length; i++) {
      if (children[i] === element) {
        return num;
      }
      if (children[i].nodeType === 1) {
        num++;
      }
    }

    return -1;
  }

  public relativePosition(element: any, target: any): void {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const targetHeight = target.offsetHeight;
    const targetWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = this.getWindowScrollTop();
    const viewport = this.getViewport();
    let top, left;

    if (targetOffset.top + targetHeight + elementDimensions.height > viewport.height) {
      top = -1 * elementDimensions.height;
      if (targetOffset.top + top < 0) {
        top = 0;
      }
    } else {
      top = targetHeight;
    }

    if (targetOffset.left + elementDimensions.width > viewport.width) {
      left = targetWidth - elementDimensions.width;
    } else {
      left = 0;
    }

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  public absolutePosition(element: any, target: any): void {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const elementOuterHeight = elementDimensions.height;
    const elementOuterWidth = elementDimensions.width;
    const targetOuterHeight = target.offsetHeight;
    const targetOuterWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = this.getWindowScrollTop();
    const windowScrollLeft = this.getWindowScrollLeft();
    const viewport = this.getViewport();
    let top, left;

    if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
      top = targetOffset.top + windowScrollTop - elementOuterHeight;
      if (top < 0) {
        top = 0 + windowScrollTop;
      }
    } else {
      top = targetOuterHeight + targetOffset.top + windowScrollTop;
    }

    if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width) {
      left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
    } else {
      left = targetOffset.left + windowScrollLeft;
    }

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  public getHiddenElementOuterHeight(element: any): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementHeight;
  }

  public getHiddenElementOuterWidth(element: any): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementWidth;
  }

  public getHiddenElementDimensions(element: any): any {
    const dimensions: any = {};
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    dimensions.width = element.offsetWidth;
    dimensions.height = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return dimensions;
  }

  public scrollInView(container: any, item: any): void {
    const borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
    const borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
    const paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
    const paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset =
      itemRect.top + document.body.scrollTop - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    const scroll = container.scrollTop;
    const elementHeight = container.clientHeight;
    const itemHeight = this.getOuterHeight(item);

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }

  public fadeIn(element: any, duration: number): void {
    element.style.opacity = 0;

    let last = +new Date();
    let opacity = 0;
    const tick = function(): void {
      opacity = +element.style.opacity.replace(',', '.') + (new Date().getTime() - last) / duration;
      element.style.opacity = opacity;
      last = +new Date();

      if (+opacity < 1) {
        // tslint:disable-next-line:no-unused-expression
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
      }
    };

    tick();
  }

  public fadeOut(element: any, ms: any): void {
    let opacity = 1;
    const interval = 50,
      duration = ms,
      gap = interval / duration;

    const fading = setInterval(() => {
      opacity = opacity - gap;

      if (opacity <= 0) {
        opacity = 0;
        clearInterval(fading);
      }

      element.style.opacity = opacity;
    }, interval);
  }

  public getWindowScrollTop(): number {
    const doc = document.documentElement;

    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  public getWindowScrollLeft(): number {
    const doc = document.documentElement;

    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  // tslint:disable:no-string-literal
  public matches(element: any, selector: string): boolean {
    const p = Element.prototype;
    const f =
      p['matches'] ||
      p.webkitMatchesSelector ||
      p['mozMatchesSelector'] ||
      p['msMatchesSelector'] ||
      function(s: any): any {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
      };

    return f.call(element, selector);
  }

  public getOuterWidth(el: any, margin?: any): any {
    let width = el.offsetWidth;

    if (margin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
  }

  public getHorizontalPadding(el: any): any {
    const style = getComputedStyle(el);

    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  public getHorizontalMargin(el: any): any {
    const style = getComputedStyle(el);

    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  public innerWidth(el: any): any {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

    return width;
  }

  public width(el: any): any {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

    return width;
  }

  public getInnerHeight(el: any): any {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

    return height;
  }

  public getOuterHeight(el: any, margin?: any): any {
    let height = el.offsetHeight;

    if (margin) {
      const style = getComputedStyle(el);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }

    return height;
  }

  public getHeight(el: any): number {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height -=
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth);

    return height;
  }

  public getWidth(el: any): number {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -=
      parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight) +
      parseFloat(style.borderLeftWidth) +
      parseFloat(style.borderRightWidth);

    return width;
  }

  public getViewport(): any {
    const win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  public getOffset(el: any): any {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  }

  public getUserAgent(): string {
    return navigator.userAgent;
  }

  public isIE(): any {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return true;
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');

      return true;
    }

    const edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return true;
    }

    // other browser
    return false;
  }

  public appendChild(element: any, target: any): void {
    if (this.isElement(target)) {
      target.appendChild(element);
    } else if (target.el && target.el.nativeElement) {
      target.el.nativeElement.appendChild(element);
    } else {
      throw new Error('Cannot append ' + target + ' to ' + element);
    }
  }

  public removeChild(element: any, target: any): void {
    if (this.isElement(target)) {
      target.removeChild(element);
    } else if (target.el && target.el.nativeElement) {
      target.el.nativeElement.removeChild(element);
    } else {
      throw new Error('Cannot remove ' + element + ' from ' + target);
    }
  }

  public isElement(obj: any): any {
    return typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string';
  }

  public calculateScrollbarWidth(): number {
    if (this.calculatedScrollbarWidth !== null) {
      return this.calculatedScrollbarWidth;
    }

    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'ui-scrollbar-measure';
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollbarWidth = scrollbarWidth;

    return scrollbarWidth;
  }

  public invokeElementMethod(element: any, methodName: string, args?: any[]): void {
    (element as any)[methodName].apply(element, args);
  }

  public clearSelection(): void {
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (
        window.getSelection().removeAllRanges &&
        window.getSelection().rangeCount > 0 &&
        window
          .getSelection()
          .getRangeAt(0)
          .getClientRects().length > 0
      ) {
        window.getSelection().removeAllRanges();
      }
    } else if (document['selection'] && document['selection'].empty) {
      try {
        document['selection'].empty();
      } catch (error) {
        // ignore IE bug
      }
    }
  }

  public getBrowser(): any {
    if (!this.browser) {
      const matched = this.resolveUserAgent();
      this.browser = {};

      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser['version'] = matched.version;
      }

      if (this.browser['chrome']) {
        this.browser['webkit'] = true;
      } else if (this.browser['webkit']) {
        this.browser['safari'] = true;
      }
    }

    return this.browser;
  }

  public resolveUserAgent(): any {
    const ua = navigator.userAgent.toLowerCase();
    const match =
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];

    return {
      browser: match[1] || '',
      version: match[2] || '0'
    };
  }
  // tslint:disable-next-line:max-file-line-count
}
