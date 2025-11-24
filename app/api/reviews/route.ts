import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - Fetch reviews for a talent
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const talentUserId = searchParams.get("talentUserId");

    if (!talentUserId) {
      return NextResponse.json(
        { error: "talentUserId parameter is required" },
        { status: 400 }
      );
    }

    // Fetch reviews with reviewer information
    const { data: reviews, error } = await supabase
      .from("talent_reviews")
      .select(`
        *,
        reviewer:users!reviewer_user_id (
          id,
          email
        ),
        reviewer_profile:producer_profiles!reviewer_user_id (
          company_name
        )
      `)
      .eq("talent_user_id", talentUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to include reviewer name
    const transformedReviews = (reviews || []).map((review) => ({
      ...review,
      reviewer_name:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (review.reviewer_profile as any)?.company_name ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (review.reviewer as any)?.email?.split("@")[0] ||
        "Anónimo",
    }));

    return NextResponse.json({ reviews: transformedReviews });
  } catch (error) {
    console.error("Error in reviews GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a producer
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "productor") {
      return NextResponse.json(
        { error: "Only producers can create reviews" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { talentUserId, rating, reviewText, projectName } = body;

    if (!talentUserId || !rating || !reviewText) {
      return NextResponse.json(
        { error: "talentUserId, rating, and reviewText are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (talentUserId === user.id) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      );
    }

    const { data: newReview, error } = await supabase
      .from("talent_reviews")
      .insert([
        {
          talent_user_id: talentUserId,
          reviewer_user_id: user.id,
          rating,
          review_text: reviewText,
          project_name: projectName || null,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { error: "You have already reviewed this talent" },
          { status: 409 }
        );
      }
      console.error("Error creating review:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ review: newReview });
  } catch (error) {
    console.error("Error in reviews POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { error: "reviewId parameter is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("talent_reviews")
      .delete()
      .eq("id", reviewId)
      .eq("reviewer_user_id", user.id);

    if (error) {
      console.error("Error deleting review:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in reviews DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
