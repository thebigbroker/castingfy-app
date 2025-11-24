"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  talent_user_id: string;
  reviewer_user_id: string;
  rating: number;
  review_text: string;
  project_name: string | null;
  created_at: string;
  reviewer_name: string;
}

interface TalentReviewsProps {
  talentUserId: string;
  currentUserId?: string;
  currentUserRole?: string;
  averageRating?: number;
  totalReviews?: number;
}

export default function TalentReviews({
  talentUserId,
  currentUserId,
  currentUserRole,
  averageRating = 0,
  totalReviews = 0,
}: TalentReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: "",
    projectName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canWriteReview =
    currentUserId &&
    currentUserRole === "productor" &&
    currentUserId !== talentUserId;

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talentUserId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews?talentUserId=${talentUserId}`);
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.reviewText.trim()) {
      alert("Por favor escribe una reseña");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talentUserId,
          rating: newReview.rating,
          reviewText: newReview.reviewText,
          projectName: newReview.projectName || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al enviar la reseña");
        return;
      }

      // Reset form and reload
      setNewReview({ rating: 5, reviewText: "", projectName: "" });
      setShowWriteModal(false);
      loadReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error al enviar la reseña");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const starSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSize} ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header with average rating */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-black mb-2">
            Reseñas y Testimonios
          </h3>
          {totalReviews > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(averageRating), "lg")}
                <span className="text-2xl font-bold text-black">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                ({totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"})
              </span>
            </div>
          )}
        </div>

        {canWriteReview && (
          <button
            onClick={() => setShowWriteModal(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Escribir Reseña
          </button>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <p className="font-medium">No hay reseñas aún</p>
          {canWriteReview && (
            <p className="text-sm mt-2">Sé el primero en dejar una reseña</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-black">{review.reviewer_name}</p>
                    {renderStars(review.rating)}
                  </div>
                  {review.project_name && (
                    <p className="text-sm text-gray-600">
                      Proyecto: <span className="font-medium">{review.project_name}</span>
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{review.review_text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write Review Modal */}
      {showWriteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowWriteModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-black mb-4">Escribir Reseña</h3>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto (opcional)
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={newReview.projectName}
                  onChange={(e) => setNewReview({ ...newReview, projectName: e.target.value })}
                  placeholder="Ej: Cortometraje 'El Inicio'"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Review Text */}
              <div>
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Reseña *
                </label>
                <textarea
                  id="reviewText"
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia trabajando con este talento..."
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Publicar Reseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
