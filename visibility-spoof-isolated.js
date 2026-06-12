(() => {
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

  port.dataset.hidden = String(document.hidden);
  port.dataset.enabled = "true";
  port.dataset.blur = "true";
  port.dataset.focus = "true";
  port.dataset.redirect = "true";
  port.dataset.mouseleave = "true";
  port.dataset.mouseout = "true";
  port.dataset.visibility = "true";
  port.dataset.pointercapture = "true";

  port.addEventListener("state", () => {
    port.dataset.hidden = String(document.hidden);
  });
})();
