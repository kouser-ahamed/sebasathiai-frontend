"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { LuPencil, LuTrash2, LuUserRound } from "react-icons/lu";

import MessageModal from "./MessageModal";
import RatingStars from "./RatingStars";
import {
  createDoctorReview,
  deleteDoctorReview,
  updateDoctorReview,
} from "./public-api";

import type { CurrentUser, DoctorReview } from "./types";

interface ReviewSectionProps {
  doctorId: string;
  initialReviews: DoctorReview[];
  currentUser: CurrentUser | null;
}

const ReviewSection = ({
  doctorId,
  initialReviews,
  currentUser,
}: ReviewSectionProps) => {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "" });

  const userId = currentUser?.id || currentUser?._id || "";
  const ownReview = useMemo(
    () => reviews.find((item) => item.userId === userId) || null,
    [reviews, userId],
  );

  const notify = (title: string, message: string) => setModal({ open: true, title, message });

  const submitReview = async (event: FormEvent) => {
    event.preventDefault();

    if (!currentUser?.id) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/doctors/${doctorId}`)}`);
      return;
    }

    if (currentUser.status === "blocked") {
      notify("Review restricted", "You are restricted by the administrator and cannot submit or change a review.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = editingId
        ? await updateDoctorReview(doctorId, editingId, rating, reviewText)
        : await createDoctorReview(doctorId, rating, reviewText);

      if (response.review) {
        setReviews((current) => {
          const exists = current.some((item) => item.id === response.review?.id);
          return exists
            ? current.map((item) => item.id === response.review?.id ? response.review! : item)
            : [response.review!, ...current];
        });
      }

      setEditingId(null);
      setRating(5);
      setReviewText("");
      notify("Success", response.message);
      router.refresh();
    } catch (error: unknown) {
      notify("Review could not be saved", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (review: DoctorReview) => {
    setEditingId(review.id);
    setRating(review.rating);
    setReviewText(review.review);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const removeReview = async (review: DoctorReview) => {
    if (!window.confirm("Delete your rating and review?")) return;

    try {
      const response = await deleteDoctorReview(doctorId, review.id);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      notify("Review deleted", response.message);
      router.refresh();
    } catch (error: unknown) {
      notify("Review could not be deleted", error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Ratings & Reviews</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-[#A997AE]">Logged-in active users can submit one rating and review, then edit or delete their own review.</p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#C5B3D3] p-8 text-center text-sm text-slate-500 dark:border-[#5D4C69] dark:text-[#A997AE]">No reviews yet. Be the first to review this doctor.</div>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-[#F5CBCB] bg-white p-5 dark:border-[#41354A] dark:bg-[#2A2233]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-[#FBEFEF] text-[#745D83] dark:bg-[#352B3D] dark:text-[#F5CBCB]">
                    {review.userImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={review.userImage} alt={review.userName} className="h-full w-full object-cover" />
                    ) : (
                      <LuUserRound className="size-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white">{review.userName || "Anonymous user"}</p>
                    <RatingStars value={review.rating} sizeClassName="size-4" />
                  </div>
                </div>

                {review.userId === userId && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEditing(review)} className="flex size-9 items-center justify-center rounded-xl border border-[#E4D5E7] text-[#745D83] dark:border-[#5D4C69] dark:text-[#F5CBCB]" aria-label="Edit review"><LuPencil className="size-4" /></button>
                    <button type="button" onClick={() => void removeReview(review)} className="flex size-9 items-center justify-center rounded-xl border border-red-200 text-red-600 dark:border-red-900/60 dark:text-red-400" aria-label="Delete review"><LuTrash2 className="size-4" /></button>
                  </div>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-[#CDBFD0]">{review.review || "Rating submitted without a written review."}</p>
            </article>
          ))
        )}
      </div>

      <form onSubmit={submitReview} className="rounded-3xl border border-[#F5CBCB] bg-[#FBEFEF]/55 p-5 dark:border-[#41354A] dark:bg-[#352B3D]/55">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          {editingId ? "Edit your review" : ownReview ? "You already reviewed this doctor" : "Rate this doctor"}
        </h3>

        {ownReview && !editingId ? (
          <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-[#CDBFD0]">Use the edit icon on your review to change your rating or comment.</p>
        ) : (
          <>
            <div className="mt-4"><RatingStars value={rating} onChange={setRating} sizeClassName="size-7" /></div>
            <textarea
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Share your experience with this doctor..."
              className="mt-4 w-full rounded-2xl border border-[#E4D5E7] bg-white p-4 text-sm text-slate-800 outline-none focus:border-[#745D83] dark:border-[#41354A] dark:bg-[#2A2233] dark:text-white"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-[#745D83] px-5 text-sm font-black text-white disabled:opacity-50 dark:bg-[#C5B3D3] dark:text-[#211B27]">{isSubmitting ? "Saving..." : editingId ? "Update Review" : "Submit Review"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setRating(5); setReviewText(""); }} className="h-11 rounded-xl border border-[#E4D5E7] bg-white px-5 text-sm font-bold dark:border-[#5D4C69] dark:bg-[#2A2233] dark:text-white">Cancel</button>}
            </div>
          </>
        )}
      </form>

      <MessageModal isOpen={modal.open} title={modal.title} message={modal.message} onClose={() => setModal((current) => ({ ...current, open: false }))} />
    </section>
  );
};

export default ReviewSection;