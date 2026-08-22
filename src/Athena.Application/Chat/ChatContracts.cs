namespace Athena.Application.Chat;

public sealed record ChatMessageRequest(string Message, string? ConversationId = null);

public sealed record ChatMessageResponse(
    string Message,
    string? ConversationId,
    IReadOnlyCollection<ChatCitation> Citations);

public sealed record ChatCitation(string Title, string Url);
