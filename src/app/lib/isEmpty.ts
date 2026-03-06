export const isEmpty = (messages: any[]) => {
    const lastMessage = messages[messages.length - 1] ?? null;
    const message = lastMessage.parts.map((p: any) => p.type === "text" ? p.text : "").join("") ?? "";
    if (!message.trim() || lastMessage.role !== "user") {
        return { success: false, error: "Mensaje inválido.", status: 400 };
    }
    return {success: true, message};
}