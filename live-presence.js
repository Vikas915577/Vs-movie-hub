/* VS Movie Hub · Phase 5 live audience counter
   Counts active browser sessions using Supabase Realtime Presence.
   It deliberately does not collect names, emails, or location data.
*/
(async function startVsLivePresence() {
  "use strict";

  const header = document.querySelector(".topbar");
  if (!header || document.getElementById("vsLivePresenceBadge")) return;

  const badge = document.createElement("div");
  badge.id = "vsLivePresenceBadge";
  badge.className = "live-presence-badge";
  badge.dataset.state = "connecting";
  badge.setAttribute("role", "status");
  badge.setAttribute("aria-live", "polite");
  badge.innerHTML = [
    '<span class="live-presence-dot" aria-hidden="true"></span>',
    '<span class="live-presence-label">LIVE</span>',
    '<strong class="live-presence-count">—</strong>',
    '<span class="live-presence-caption">viewing now</span>'
  ].join("");

  const menuButton = header.querySelector(".menu-toggle");
  if (menuButton) header.insertBefore(badge, menuButton);
  else header.appendChild(badge);

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = new URL("./live-presence.css", import.meta.url).href;
  document.head.appendChild(css);

  const countNode = badge.querySelector(".live-presence-count");
  const captionNode = badge.querySelector(".live-presence-caption");

  function setState(state, count, caption, title) {
    badge.dataset.state = state;
    countNode.textContent = String(count);
    captionNode.textContent = caption;
    badge.title = title;
  }

  async function loadConfig() {
    if (window.VS_LIVE_CONFIG) return window.VS_LIVE_CONFIG;
    await new Promise(resolve => {
      const script = document.createElement("script");
      script.src = new URL("./live-config.js", import.meta.url).href;
      script.onload = resolve;
      script.onerror = resolve;
      document.head.appendChild(script);
    });
    return window.VS_LIVE_CONFIG || {};
  }

  const config = await loadConfig();
  const projectUrl = String(config.supabaseUrl || "").trim();
  const publishableKey = String(config.publishableKey || "").trim();

  if (!projectUrl || !publishableKey) {
    setState(
      "setup",
      "—",
      "setup needed",
      "Live count is not active yet. Add the Supabase Project URL and Publishable key in live-config.js."
    );
    return;
  }

  if (/service_role|sb_secret_/i.test(publishableKey)) {
    setState("error", "—", "key error", "Do not use a service_role or secret key in a public website.");
    return;
  }

  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/+esm");
    const supabase = createClient(projectUrl, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

    const channel = supabase.channel("vs-movie-hub-live-audience");
    let subscribed = false;

    function renderCount() {
      const state = channel.presenceState() || {};
      const activeSessions = Object.keys(state).length;
      setState(
        "online",
        activeSessions,
        "viewing now",
        "Active browser sessions connected to VS Movie Hub. Multiple tabs or devices can count separately."
      );
    }

    channel
      .on("presence", { event: "sync" }, renderCount)
      .on("presence", { event: "join" }, renderCount)
      .on("presence", { event: "leave" }, renderCount)
      .subscribe(async status => {
        if (status === "SUBSCRIBED") {
          subscribed = true;
          try {
            if (!document.hidden) await channel.track({ online: true });
            renderCount();
          } catch (error) {
            console.warn("VS Movie Hub live presence could not track this session.", error);
            setState("offline", "—", "unavailable", "Live count is temporarily unavailable.");
          }
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          subscribed = false;
          setState("offline", "—", "offline", "Live count connection is unavailable. It will recover when the connection returns.");
        }
      });

    document.addEventListener("visibilitychange", async () => {
      if (!subscribed) return;
      try {
        if (document.hidden) {
          await channel.untrack();
        } else {
          await channel.track({ online: true });
        }
        renderCount();
      } catch (error) {
        console.warn("VS Movie Hub live presence visibility update failed.", error);
      }
    });

    window.addEventListener("pagehide", () => {
      try {
        void channel.untrack();
        void supabase.removeChannel(channel);
      } catch (error) {
        console.warn("VS Movie Hub live presence cleanup failed.", error);
      }
    }, { once: true });
  } catch (error) {
    console.warn("VS Movie Hub live presence did not start.", error);
    setState("offline", "—", "unavailable", "Live count could not connect. Check the Supabase URL, Publishable key, and Realtime settings.");
  }
})();
