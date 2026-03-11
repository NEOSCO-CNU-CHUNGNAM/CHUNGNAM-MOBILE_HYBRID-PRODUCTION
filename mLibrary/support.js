/**
 * Neosco Support — Mobile Live Session Script  (devsupport.wiseneoscoindia.com)
 * Include in <head>. Establishes a live support connection only (no recording).
 *
 * UUID resolution order:
 *   1. window.deviceUUID   (set by your app before this script)
 *   2. localStorage "deviceUUID"  (persists across sessions on same device)
 *   3. Generated UUID, saved to localStorage
 *
 * Once your app has a meaningful user/session label, call:
 *   window.updateNeoscoTitle("screen-or-user-name");
 */
(function () {
  var HOST = "devsupport.wiseneoscoindia.com";

  // ─── Resolve device UUID ───────────────────────────────────────────────────

  function generateUUID() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older mobile browsers
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  var uuid = window.deviceUUID;
  if (!uuid) {
    try {
      uuid = localStorage.getItem("deviceUUID");
      if (!uuid) {
        uuid = generateUUID();
        localStorage.setItem("deviceUUID", uuid);
      }
    } catch (e) {
      // localStorage unavailable (private mode etc.) — generate ephemeral UUID
      uuid = generateUUID();
    }
  }

  // ─── Update title after login / navigation ─────────────────────────────────

  window.updateNeoscoTitle = function (title) {
    if (!title || !window.$support) return;
    var currentTitle = window.$support.$pageSpyConfig && window.$support.$pageSpyConfig.title;
    if (currentTitle === title) return;
    window.$support.updateRoomInfo({ title: title });
    console.info("[Neosco] Title updated:", title);
  };

  // ─── Load SDK and connect ──────────────────────────────────────────────────

  function loadScript(src, onload) {
    var s = document.createElement("script");
    s.src = src; s.crossOrigin = "anonymous"; s.onload = onload;
    s.onerror = function () { console.warn("[Neosco] Failed to load: " + src); };
    document.head.appendChild(s);
  }

  function initSupport() {
    var p = window?.platformType || 'W';
    window.$support = new PageSpy({
      project:    "CNU-" + p + "-" + uuid,
      title:      "pending", // update via window.updateNeoscoTitle()
      autoRender: false,
    });
    // console.info("[Neosco] Live session started — project: CNU-" + p + "-" + uuid);
  }

  loadScript("//" + HOST + "/page-spy/index.min.js", initSupport);
})();
