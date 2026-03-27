from helpers.api import ApiHandler, Request, Response


class Stop(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        ctxid = input.get("context", "")
        context = self.use_context(ctxid)
        was_running = context.is_running()
        context.kill_process()
        context.paused = False
        return {
            "message": "Agent stopped successfully.",
            "was_running": was_running,
            "stopped": True,
        }
