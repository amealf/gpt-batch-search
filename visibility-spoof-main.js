(() => {
  const INSTALL_VERSION = 2;
  if (Number(window.__gptBatchAlwaysVisibleVersion || 0) >= INSTALL_VERSION) return;
  try {
    Object.defineProperty(window, "__gptBatchAlwaysVisibleVersion", {
      value: INSTALL_VERSION,
      configurable: true,
      enumerable: false,
      writable: false
    });
  } catch (_) {
    try {
      window.__gptBatchAlwaysVisibleVersion = INSTALL_VERSION;
    } catch (_) {}
  }
  try {
    if (!window.__gptBatchAlwaysVisibleInstalled) {
      Object.defineProperty(window, "__gptBatchAlwaysVisibleInstalled", {
        value: true,
        configurable: false,
        enumerable: false,
        writable: false
      });
    }
  } catch (_) {}

  const PORT_ID = "gpt-batch-ctv-port";
  let port;
  try {
    port = document.getElementById(PORT_ID);
    port.remove();
  } catch (_) {
    port = document.createElement("span");
    port.id = PORT_ID;
    document.documentElement.append(port);
  }
  const realVisibilityDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "visibilityState");
  const initialVisibility = (() => {
    try {
      return realVisibilityDescriptor?.get?.call(document) || "visible";
    } catch (_) {
      return "visible";
    }
  })();
  const initialHidden = initialVisibility === "hidden";
  const portDefaults = {
    hidden: String(initialHidden),
    enabled: "true",
    blur: "true",
    focus: "true",
    redirect: "true",
    mouseleave: "true",
    mouseout: "true",
    visibility: "true",
    pointercapture: "true"
  };
  for (const [name, value] of Object.entries(portDefaults)) {
    if (!port.dataset[name]) {
      port.dataset[name] = value;
    }
  }

  const block = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  const isEnabled = (name) => port.dataset.enabled === "true" && port.dataset[name] !== "false";
  const allowOnce = {
    focus: true,
    visibilitychange: initialVisibility === "hidden",
    webkitvisibilitychange: initialVisibility === "hidden"
  };

  const defineAccessor = (target, name, getter) => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(target, name);
      if (descriptor && descriptor.configurable === false) return false;
      Object.defineProperty(target, name, {
        get: getter,
        configurable: true
      });
      return true;
    } catch (_) {
      return false;
    }
  };

  const defineDocumentAccessor = (name, getter) => {
    if (defineAccessor(document, name, getter)) return true;
    if (typeof Document !== "undefined" && Document.prototype) {
      return defineAccessor(Document.prototype, name, getter);
    }
    return false;
  };

  const getVisibilityState = () => {
    if (port.dataset.enabled === "false") {
      return port.dataset.hidden === "true" ? "hidden" : "visible";
    }
    return "visible";
  };

  const getHiddenState = () => {
    if (port.dataset.enabled === "false") {
      return port.dataset.hidden === "true";
    }
    return false;
  };

  defineDocumentAccessor("visibilityState", getVisibilityState);
  defineDocumentAccessor("webkitVisibilityState", getVisibilityState);
  defineDocumentAccessor("hidden", getHiddenState);
  defineDocumentAccessor("webkitHidden", getHiddenState);

  if (window.top === window && typeof navigation !== "undefined") {
    const redirect = (event) => {
      if (!redirect.href) return;
      event.preventDefault();
      event.returnValue = "no";
    };
    navigation.addEventListener("navigate", (event) => {
      if (event.navigationType === "reload") {
        redirect.href = event.destination.url;
      }
    });
    document.addEventListener("visibilitychange", () => {
      delete redirect.href;
      removeEventListener("beforeunload", redirect);
      try {
        const realState = realVisibilityDescriptor?.get?.call(document);
        if (realState === "hidden" && isEnabled("redirect")) {
          addEventListener("beforeunload", redirect);
        }
      } catch (_) {}
    });
  }

  document.addEventListener("visibilitychange", (event) => {
    port.dispatchEvent(new Event("state"));
    if (isEnabled("visibility")) {
      if (allowOnce.visibilitychange) {
        allowOnce.visibilitychange = false;
        return;
      }
      block(event);
    }
  }, true);

  document.addEventListener("webkitvisibilitychange", (event) => {
    if (isEnabled("visibility")) {
      if (allowOnce.webkitvisibilitychange) {
        allowOnce.webkitvisibilitychange = false;
        return;
      }
      block(event);
    }
  }, true);

  window.addEventListener("pagehide", (event) => {
    if (isEnabled("visibility")) block(event);
  }, true);

  window.addEventListener("lostpointercapture", (event) => {
    if (isEnabled("pointercapture")) block(event);
  }, true);

  try {
    Document.prototype.hasFocus = new Proxy(Document.prototype.hasFocus, {
      apply(target, self, args) {
        if (isEnabled("focus")) return true;
        return Reflect.apply(target, self, args);
      }
    });
  } catch (_) {}

  const onFocus = (event) => {
    if (!isEnabled("focus")) return;
    if (event.target === document || event.target === window) {
      if (allowOnce.focus) {
        allowOnce.focus = false;
        return;
      }
      block(event);
    }
  };
  document.addEventListener("focus", onFocus, true);
  window.addEventListener("focus", onFocus, true);

  const onBlur = (event) => {
    if (!isEnabled("blur")) return;
    if (event.target === document || event.target === window) block(event);
  };
  document.addEventListener("blur", onBlur, true);
  window.addEventListener("blur", onBlur, true);

  window.addEventListener("mouseleave", (event) => {
    if (!isEnabled("mouseleave")) return;
    if (event.target === document || event.target === window) block(event);
  }, true);

  window.addEventListener("mouseout", (event) => {
    if (!isEnabled("mouseout")) return;
    if (event.target === document.documentElement || event.target === document.body) block(event);
  }, true);

  let lastFrameTime = 0;
  try {
    window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
      apply(target, self, args) {
        if (port.dataset.enabled === "true" && port.dataset.hidden === "true") {
          const currentTime = Date.now();
          const delay = Math.max(0, 16 - (currentTime - lastFrameTime));
          const id = setTimeout(() => {
            args[0](performance.now());
          }, delay);
          lastFrameTime = currentTime + delay;
          return id;
        }
        return Reflect.apply(target, self, args);
      }
    });
  } catch (_) {}

  try {
    window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
      apply(target, self, args) {
        if (port.dataset.enabled === "true" && port.dataset.hidden === "true") {
          clearTimeout(args[0]);
        }
        return Reflect.apply(target, self, args);
      }
    });
  } catch (_) {}
})();
