"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CreatePostProps {
  userId: string;
  onPostCreated?: () => void;
}

export default function CreatePost({ userId, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Escribe algo antes de publicar");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();

    const { error: postError } = await supabase.from("posts").insert({
      user_id: userId,
      content: content.trim(),
    });

    if (postError) {
      setError("Error al publicar. Inténtalo de nuevo.");
      setIsSubmitting(false);
      return;
    }

    setContent("");
    setIsSubmitting(false);

    if (onPostCreated) {
      onPostCreated();
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
          className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
          rows={3}
          disabled={isSubmitting}
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 hover:bg-surface rounded-lg transition-colors"
              title="Añadir imagen (próximamente)"
            >
              <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}
