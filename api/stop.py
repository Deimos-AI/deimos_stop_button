from helpers.api import ApiHandler, Request, Response


class Stop(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        ctxid = input.get("context", "")
        context = self.use_context(ctxid)
        was_running = context.is_running()
        context.kill_process()
        context.paused = False
        # Write a visible entry to the chat log so the stop action is auditable
        context.log.log(type="warning", heading="Agent stopped by user", content="")
        return {
            "message": "Agent stopped successfully.",
            "was_running": was_running,
            "stopped": True,
        }
