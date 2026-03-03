"use client";

import { useChat } from "@ai-sdk/react";
import { Fragment, useState } from "react";

export default function ChatPage() {
  const [pdfOrCopyError, setPdfOrCopyError] = useState("");
  const [alert, setAlert] = useState("");
  const [input, setInput] = useState("");
  const { status, messages, sendMessage, error } = useChat();
  const isLoading = status === "streaming" || status === "submitted";

  const copy = async (messageId: string) => {
    setPdfOrCopyError("");
    setAlert("");
    try {
      const message = messages.find(m => m.id == messageId);
      if (!message) {
        setPdfOrCopyError("No se puede copiar en el portapapeles.");
        return;
      }
      const text = message?.parts.map(p => p.type === "text" ? p.text : "").join("\n");
      await navigator.clipboard.writeText(text as string);
      setTimeout(() => setAlert("Copiado en el portapapeles."), 2000);
    } catch (err: any) {
      setPdfOrCopyError("No se puede copiar en el portapapeles.");
    }
  }
  const downloadPdf = async (messageId: string) => {
    setPdfOrCopyError("");
    setAlert("");
    const message = messages.find(m => m.id == messageId);
    if (!message) {
      setPdfOrCopyError("No se puede generar pdf.");
      return;
    }
    const text = message?.parts.map(p => p.type === "text" ? p.text : "").join("\n");
    console.log(text);
    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });
      if (!response.ok) {
        setPdfOrCopyError("No se pudo generar pdf.");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clima.pdf";
      a.click();
      setAlert("Iniciando descarga.");
    } catch (err: any) {
      setPdfOrCopyError("No se pudo generar pdf.");
    }
  }
  return (
    <main className="max-w-xl mx-auto p-4">

      <div className="space-y-3">
        {messages.map(m => (
          <div key={m.id}>
            <b>{m.role === "user" ? "Vos" : "AI"}:</b>
            {m.parts.map((p, i) =>
              p.type === "text" ? (
                <Fragment key={i}>
                  <div>{p.text}</div>
                  {m.role !== "user" &&
                    <>
                      <div><button onClick={() => copy(m.id)}>Copiar</button></div>
                      <div><button onClick={() => downloadPdf(m.id)}>Generar pdf</button></div>
                    </>
                  }
                </Fragment>
              ) : null
            )}
          </div>
        ))}
      </div>

      {isLoading && (
        <p role="alert" aria-live="polite">Pensando...</p>
      )}
      {pdfOrCopyError &&
        <p role="alert" className="text-red-500">{pdfOrCopyError}</p>
      }
      {alert &&
        <p role="alert">{alert}</p>
      }
      {error && (
        <p role="alert" className="text-red-500">
          Error: {error.message}
        </p>
      )}

      <form
        className="mt-4 flex gap-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
          setAlert("");
          setPdfOrCopyError("");
        }}
      >
        <input
          autoFocus
          className="border p-2 flex-1"
          placeholder="Ej: ¿Puedo salir a correr en Buenos Aires?"
          value={input}
          onChange={e => setInput(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-3 rounded">
          Enviar
        </button>
      </form>
    </main>
  );
}