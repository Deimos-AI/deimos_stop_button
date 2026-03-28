import { createStore } from "/js/AlpineStore.js";

export const store = createStore("stopButton", {
    init() {
        console.log("Stop button store initialized");
    },

    async stopAgent() {
        try {
            const context = globalThis.getContext?.();
            if (globalThis.toast) {
                globalThis.toast("Stopping agent...", "info");
            }
            const result = await globalThis.sendJsonData(
                "/api/plugins/deimos_stop_agent/stop",
                { context }
            );
            // Reset pause state on the chatInput store
            try {
                const chatInput = Alpine.store("chatInput");
                if (chatInput) chatInput.paused = false;
            } catch (_) { /* chatInput store may not exist */ }
            if (globalThis.toast) {
                globalThis.toast(result.message || "Agent stopped", "success");
            }
            return result;
        } catch (e) {
            if (globalThis.toastFetchError) {
                globalThis.toastFetchError("Error stopping agent", e);
            }
            throw e;
        }
    },

    cleanup() {
        // No persistent resources to clean up
    }
});
