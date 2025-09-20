/**
 * ===================================================================
 * Initial Setup - CRITICAL FOR ANIMATIONS
 * Removes the .noScript class to hide elements before they animate.
 * ===================================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.remove('noScript');
});

/**
 * ===================================================================
 * Navigation and Drawer Menu Logic
 * ===================================================================
 */
(function() {
    const navWrapper = document.getElementById('4ix631xuen');
    if (!navWrapper) return;

    const header = document.querySelector('.umso-header');
    const drawer = document.getElementById('4ix631xuen-drawer');

    if (header && drawer) {
        header.appendChild(drawer);
    }

    const drawerTrigger = document.getElementById('4ix631xuen-drawerTrigger');
    const drawerInstance = document.getElementById('4ix631xuen-drawer');

    document.addEventListener('click', (e) => {
        if (drawerInstance && !drawerInstance.contains(e.target) && e.target !== drawerTrigger) {
            drawerInstance.classList.add('um-hidden');
        }
    });

    if (drawerInstance) {
        const drawerClose = drawerInstance.querySelector('.um-nav-drawerClose');
        const drawerLinksWithSubmenus = drawerInstance.querySelectorAll('.um-drawer-links > li > button');

        if (drawerTrigger) {
            drawerTrigger.addEventListener('click', () => drawerInstance.classList.remove('um-hidden'));
        }
        if (drawerClose) {
            drawerClose.addEventListener('click', () => drawerInstance.classList.add('um-hidden'));
        }

        drawerLinksWithSubmenus.forEach(button => {
            button.addEventListener('click', function() {
                this.parentNode.classList.toggle('um-open');
            });
        });
    }

    const navChildren = navWrapper.querySelector('.um-nav-children');
    const navLinks = navWrapper.querySelector('.um-nav-links');
    const navButtons = navWrapper.querySelector('.um-nav-buttons');

    let totalWidth = 0;
    let isCompact = true;

    function calculateWidths() {
        if (!isCompact) {
            totalWidth = (navChildren?.offsetWidth || 0) + (navLinks?.offsetWidth || 0) + (navButtons?.offsetWidth || 0) + 10;
        }
        toggleNavDisplay();
    }

    function toggleNavDisplay() {
        if (navWrapper.offsetWidth - 10 < totalWidth) {
            isCompact = true;
            navWrapper.classList.add('um-hidden');
            if (drawerTrigger) drawerTrigger.classList.remove('um-hidden');
        } else {
            isCompact = false;
            navWrapper.classList.remove('um-hidden');
            if (drawerTrigger) drawerTrigger.classList.add('um-hidden');
            if (drawerInstance) drawerInstance.classList.add('um-hidden');
        }
    }

    // Use ResizeObserver for responsive navigation
    const resizeObserver = new ResizeObserver(toggleNavDisplay);
    resizeObserver.observe(document.body);

    if (navChildren) new ResizeObserver(calculateWidths).observe(navChildren);
    if (navButtons) new ResizeObserver(calculateWidths).observe(navButtons);
    if (navLinks) new ResizeObserver(calculateWidths).observe(navLinks);

    calculateWidths();
    toggleNavDisplay();
})();

/**
 * ===================================================================
 * Intersection Observer for On-Scroll Animations
 * ===================================================================
 */
(function() {
    const animatedElements = document.querySelectorAll('.umso-animated');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('umso-animating');
                observerInstance.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Start animation when 10% of the element is visible
    });

    animatedElements.forEach(el => observer.observe(el));
})();


/**
 * ===================================================================
 * Modal Logic
 * ===================================================================
 */
window.OpenModal = function(modalId) {
    const modalWrapper = document.querySelector('#' + modalId + '.umsoModalWrapper');
    if (!modalWrapper) return console.error('Modal not found:', modalId);
    const overlay = modalWrapper.querySelector('.umsoModalOverlay');
    if (modalWrapper && overlay) {
        modalWrapper.style.display = 'block';
        overlay.addEventListener('click', () => window.CloseModal(modalId), {
            once: true
        });
    }
};

window.CloseModal = function(modalId) {
    const modalWrapper = document.querySelector('#' + modalId + '.umsoModalWrapper');
    if (modalWrapper) {
        modalWrapper.style.display = 'none';
    } else {
        console.error('Modal not found:', modalId);
    }
};

/**
 * ===================================================================
 * Marquee (Scrolling Logos) Logic
 * ===================================================================
 */
document.querySelectorAll('.umso-marquee').forEach(marquee => {
    new ResizeObserver(entries => {
        for (let entry of entries) {
            const speed = parseFloat(marquee.style.getPropertyValue('--speed')) || 1;
            const baseSpeed = 100;
            const duration = entry.contentRect.width / (baseSpeed * speed);
            marquee.style.setProperty('--width', entry.contentRect.width + 'px');
            if (marquee.firstChild && marquee.firstChild.style) {
                marquee.firstChild.style.animationDuration = duration + 's';
            }
        }
    }).observe(marquee.firstChild);
});

/**
 * ===================================================================
 * Accordion (FAQ) Logic
 * ===================================================================
 */
(function() {
    function toggleAccordion(event) {
        const trigger = event.target.closest('.accordion-trigger');
        if (!trigger) return;
        const item = trigger.parentElement;
        if (item) {
            item.classList.toggle('open');
        }
    }
    document.querySelectorAll('.umso-accordion').forEach(accordion => {
        accordion.addEventListener('click', toggleAccordion);
    });
})();


/**
 * ===================================================================
 * Analytics and Event Tracking
 * ===================================================================
 */
(function() {
    const isPriorBlockingEnabled = false;
    window.SendEvent = function(eventData) {
        if (!eventData) return console.error('error when sending event');
        const payload = JSON.stringify({
            siteId: 'x40t9uf2030pmzw6',
            category: eventData.category,
            name: eventData.name,
            data: eventData.data,
            isPriorBlockingEnabled: isPriorBlockingEnabled
        });
        if (eventData.asBeacon && navigator.sendBeacon) {
            return void navigator.sendBeacon('/api/event', payload);
        }
        let xhr = new XMLHttpRequest;
        xhr.open('POST', '/api/event', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(payload);
    };

    const searchParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    window.PageView = function() {
        const payload = {
            referrer: document.referrer,
            path: window.location.pathname,
            isPriorBlockingEnabled: isPriorBlockingEnabled
        };
        utmParams.forEach(param => {
            const value = searchParams.get(param);
            if (value) payload[param] = value;
        });
        let xhr = new XMLHttpRequest;
        xhr.open('POST', '/api/view', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.send(JSON.stringify(payload));
    };
    window.PageView();

    const links = document.querySelectorAll('a');
    Array.prototype.forEach.call(links, (link) => {
        link.addEventListener('click', () => {
            const eventData = {
                url: link.href,
                btn_id: link.id
            };
            utmParams.forEach(param => {
                const value = searchParams.get(param);
                if (value) eventData[param] = value;
            });
            window.SendEvent({
                category: 'button',
                name: link.innerText,
                data: eventData,
                asBeacon: true
            });
        });
    });
})();

/**
 * ===================================================================
 * Smooth Scroll Library v14.2.1
 * ===================================================================
 */
(function(e, t) {
    'function' == typeof define && define.amd ? define([], (function() {
        return t(e)
    })) : 'object' == typeof exports ? module.exports = t(e) : e.SmoothScroll = t(e)
})('undefined' != typeof global ? global : 'undefined' != typeof window ? window : this, (function(e) {
    'use strict';
    var t = {
            ignore: '[data-scroll-ignore]',
            header: null,
            topOnEmptyHash: !0,
            speed: 500,
            clip: !0,
            offset: 0,
            easing: 'easeInOutCubic',
            customEasing: null,
            updateURL: !0,
            popstate: !0,
            emitEvents: !0
        },
        n = function() {
            for (var e = {}, t = 0; t < arguments.length; t++) ! function(t) {
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
            }(arguments[t]);
            return e
        },
        o = function(t) {
            return parseInt(e.getComputedStyle(t).height, 10)
        },
        r = function(e) {
            var t;
            try {
                t = decodeURIComponent(e)
            } catch (n) {
                t = e
            }
            return t
        },
        a = function(e) {
            '#' === e.charAt(0) && (e = e.substr(1));
            for (var t, n = String(e), o = n.length, r = -1, a = '', i = n.charCodeAt(0); ++r < o;) {
                if (0 === (t = n.charCodeAt(r))) throw new InvalidCharacterError('Invalid character: the input contains U+0000.');
                a += t >= 1 && t <= 31 || 127 == t || 0 === r && t >= 48 && t <= 57 || 1 === r && t >= 48 && t <= 57 && 45 === i ? '\\' + t.toString(16) + ' ' : t >= 128 || 45 === t || 95 === t || t >= 48 && t <= 57 || t >= 65 && t <= 90 || t >= 97 && t <= 122 ? n.charAt(r) : '\\' + n.charAt(r)
            }
            var c;
            try {
                c = decodeURIComponent('#' + a)
            } catch (e) {
                c = '#' + a
            }
            return c
        },
        i = function() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
        },
        c = function(e) {
            return e ? o(e) + e.offsetTop : 0
        },
        u = function(t, n, o, r) {
            if (n.emitEvents && 'function' == typeof e.CustomEvent) {
                var a = new CustomEvent(t, {
                    bubbles: !0,
                    detail: {
                        anchor: o,
                        toggle: r
                    }
                });
                document.dispatchEvent(a)
            }
        };
    return function(o, s) {
        var l, d, f, m, h, p, g = {
            cancelScroll: function(e) {
                cancelAnimationFrame(p), p = null, e || u('scrollCancel', l)
            }
        };
        g.animateScroll = function(o, r, a) {
            var s = n(l || t, a || {}),
                d = '[object Number]' === Object.prototype.toString.call(o),
                h = d || !o.tagName ? null : o;
            if (d || h) {
                var v = e.pageYOffset;
                s.header && !f && (f = document.querySelector(s.header)), m || (m = c(f));
                var y, S, E, b = d ? o : function(t, n, o, r) {
                        var a = 0;
                        if (t.offsetParent)
                            do {
                                a += t.offsetTop, t = t.offsetParent
                            } while (t);
                        return a = Math.max(a - n - o, 0), r && (a = Math.min(a, i() - e.innerHeight)), a
                    }(h, m, parseInt('function' == typeof s.offset ? s.offset(o, r) : s.offset, 10), s.clip),
                    O = b - v,
                    I = i(),
                    w = 0,
                    C = function(t, n) {
                        var a = e.pageYOffset;
                        if (t == n || a == n || (v < n && e.innerHeight + a) >= I) return g.cancelScroll(!0),
                            function(t, n, o) {
                                0 === t && document.body.focus(), o || (t.focus(), document.activeElement !== t && (t.setAttribute('tabindex', '-1'), t.focus(), t.style.outline = 'none'), e.scrollTo(0, n))
                            }(o, n, d), u('scrollStop', s, o, r), y = null, p = null, !0
                    },
                    L = function(t) {
                        y || (y = t), S = (w += t - y) / parseInt(s.speed, 10), E = v + O * function(e, t) {
                            var n;
                            return 'easeInQuad' === e.easing && (n = t * t), 'easeOutQuad' === e.easing && (n = t * (2 - t)), 'easeInOutQuad' === e.easing && (n = t < .5 ? 2 * t * t : (4 - 2 * t) * t - 1), 'easeInCubic' === e.easing && (n = t * t * t), 'easeOutCubic' === e.easing && (n = --t * t * t + 1), 'easeInOutCubic' === e.easing && (n = t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1), 'easeInQuart' === e.easing && (n = t * t * t * t), 'easeOutQuart' === e.easing && (n = 1 - --t * t * t * t), 'easeInOutQuart' === e.easing && (n = t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t), 'easeInQuint' === e.easing && (n = t * t * t * t * t), 'easeOutQuint' === e.easing && (n = 1 + --t * t * t * t * t), 'easeInOutQuint' === e.easing && (n = t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t), e.customEasing && (n = e.customEasing(t)), n || t
                        }(s, S = S > 1 ? 1 : S), e.scrollTo(0, Math.floor(E)), C(E, b) || (p = e.requestAnimationFrame(L), y = t)
                    };
                0 === e.pageYOffset && e.scrollTo(0, 0),
                    function(e, t, n) {
                        t || history.pushState && n.updateURL && history.pushState({
                            smoothScroll: JSON.stringify(n),
                            anchor: e.id
                        }, document.title, e === document.documentElement ? '#top' : '#' + e.id)
                    }(o, d, s), u('scrollStart', s, o, r), g.cancelScroll(!0), e.requestAnimationFrame(L)
            }
        };
        var v = function(t) {
                if (!('matchMedia' in e && e.matchMedia('(prefers-reduced-motion)').matches) && 0 === t.button && !t.metaKey && !t.ctrlKey && 'closest' in t.target && (d = t.target.closest(o)) && 'a' === d.tagName.toLowerCase() && !t.target.closest(l.ignore) && d.hostname === e.location.hostname && d.pathname === e.location.pathname && /#/.test(d.href)) {
                    var n = a(r(d.hash)),
                        i = l.topOnEmptyHash && '#' === n ? document.documentElement : document.querySelector(n);
                    (i = i || '#top' !== n ? i : document.documentElement) && (t.preventDefault(), g.animateScroll(i, d))
                }
            },
            y = function(e) {
                if (null !== history.state && history.state.smoothScroll && history.state.smoothScroll === JSON.stringify(l) && history.state.anchor) {
                    var t = document.querySelector(a(r(history.state.anchor)));
                    t && g.animateScroll(t, null, {
                        updateURL: !1
                    })
                }
            },
            S = function(e) {
                h || (h = setTimeout((function() {
                    h = null, m = c(f)
                }), 66))
            };
        return g.destroy = function() {
            l && (document.removeEventListener('click', v, !1), e.removeEventListener('resize', S, !1), e.removeEventListener('popstate', y, !1), g.cancelScroll(), l = null, d = null, f = null, m = null, h = null, p = null)
        }, g.init = function(o) {
            if (!('querySelector' in document && 'addEventListener' in e && 'requestAnimationFrame' in e && 'closest' in e.Element.prototype)) throw 'Smooth Scroll: This browser does not support the required JavaScript methods and browser APIs.';
            g.destroy(), l = n(t, o || {}), f = l.header ? document.querySelector(l.header) : null, m = c(f), document.addEventListener('click', v, !1), f && e.addEventListener('resize', S, !1), l.updateURL && l.popstate && e.addEventListener('popstate', y, !1)
        }, g.init(s), g
    }
}));
new window.SmoothScroll('a[href*="#"]', {
    offset: 0
});