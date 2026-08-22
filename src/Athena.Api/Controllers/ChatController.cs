using Athena.Application.Chat;
using Microsoft.AspNetCore.Mvc;

namespace Athena.Api.Controllers;

[ApiController]
[Route("api/chat")]
public sealed class ChatController : ControllerBase
{
    [HttpPost]
    public ActionResult<ChatMessageResponse> Chat(ChatMessageRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new { error = "Message is required." });

        return Ok(new ChatMessageResponse(
            "Athena is connected. LLM integration is the next implementation phase.",
            request.ConversationId,
            Array.Empty<ChatCitation>()));
    }
}
