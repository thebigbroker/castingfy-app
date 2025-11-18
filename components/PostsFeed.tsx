"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Post {
  id: string;
  content: string;
  created_at: string;
}

interface PostsFeedProps {
  userId: string;
  refreshTrigger?: number;
}

export default function PostsFeed({ userId, refreshTrigger }: PostsFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [userId, refreshTrigger]);

  const loadPosts = async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-surface rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-surface rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg p-12 text-center">
        <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <h3 className="text-lg font-semibold text-text-muted mb-2">
          No hay publicaciones aún
        </h3>
        <p className="text-sm text-text-muted">
          Comparte tu primer post para empezar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white border border-border rounded-lg p-6">
          <p className="text-sm text-text-muted mb-3">{formatDate(post.created_at)}</p>
          <p className="text-base whitespace-pre-wrap">{post.content}</p>

          <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
            <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">Me gusta</span>
            </button>

            <button className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">Comentar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
