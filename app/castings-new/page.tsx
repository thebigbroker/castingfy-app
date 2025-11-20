"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import JobFilters, { FilterValues } from "@/components/castings/JobFilters";
import ProductionCard, { Production } from "@/components/castings/ProductionCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Mock data - replace with real data from your API
const MOCK_PRODUCTIONS: Production[] = [
  {
    id: "1",
    title: "TikTok Promotional Video, GRWM Style UGC",
    category: "UGC / Content Creation",
    mainRole: "Main Talent",
    roleType: "Lead (Other UGC)",
    pay: "US$3,500",
    estimatedHours: "10 hours of work",
    location: "Worldwide",
    postedDate: "Tuesday",
    ageRange: "18-35",
    union: "No sindicado",
    featured: true,
    description: "We're looking for authentic content creators to produce GRWM-style TikTok videos promoting our beauty brand. Must be comfortable on camera and have experience with TikTok trends.",
    datesLocations: "Shoots remotely. Note: Must have availability to film, edit, and deliver assets next 7–10 days (Nov. 18–21).",
    badges: ["Other UGC"],
    roles: [
      {
        id: "1-1",
        name: "Main Talent",
        category: "Content Creators",
        gender: "All Genders",
        ageRange: "18-35",
      },
    ],
  },
  {
    id: "2",
    title: "'Fragments' - Independent Feature Film",
    category: "Film / Independent",
    mainRole: "Lead Role",
    roleType: "Sarah (Female Lead)",
    pay: "US$12,000",
    estimatedHours: "60 days of work",
    location: "New York, NY",
    postedDate: "Monday",
    ageRange: "25-35",
    union: "SAG-AFTRA",
    description: "Seeking a talented actress for the lead role in our indie drama 'Fragments'. Character is a complex, layered performance requiring emotional depth.",
    roles: [
      {
        id: "2-1",
        name: "Sarah",
        category: "Actors",
        gender: "Female",
        ageRange: "25-35",
      },
      {
        id: "2-2",
        name: "Supporting Role - Mike",
        category: "Actors",
        gender: "Male",
        ageRange: "30-40",
      },
    ],
  },
  {
    id: "3",
    title: "'Hollywoodland' - Period Drama Series",
    category: "TV / Streaming",
    mainRole: "Recurring Guest Star",
    roleType: "Various Roles",
    pay: "US$8,500",
    estimatedHours: "20 days of work",
    location: "Los Angeles, CA",
    postedDate: "Wednesday",
    ageRange: "All ages",
    union: "SAG-AFTRA",
    description: "Netflix period drama set in 1950s Hollywood. Seeking diverse talent for recurring guest star roles across multiple episodes.",
    roles: [
      {
        id: "3-1",
        name: "Studio Executive",
        category: "Actors",
        gender: "Male",
        ageRange: "40-55",
      },
      {
        id: "3-2",
        name: "Aspiring Actress",
        category: "Actors",
        gender: "Female",
        ageRange: "20-30",
      },
      {
        id: "3-3",
        name: "Reporter",
        category: "Actors",
        gender: "All Genders",
        ageRange: "25-40",
      },
    ],
  },
  {
    id: "4",
    title: "National Brand Commercial - Lifestyle",
    category: "Commercial / National",
    mainRole: "Featured Talent",
    roleType: "Family Members",
    pay: "US$5,000",
    estimatedHours: "2 days of work",
    location: "Chicago, IL",
    postedDate: "Today",
    ageRange: "All ages",
    union: "SAG-AFTRA",
    roles: [
      {
        id: "4-1",
        name: "Mom",
        category: "Actors",
        gender: "Female",
        ageRange: "30-45",
      },
      {
        id: "4-2",
        name: "Dad",
        category: "Actors",
        gender: "Male",
        ageRange: "30-45",
      },
      {
        id: "4-3",
        name: "Teen Daughter",
        category: "Actors",
        gender: "Female",
        ageRange: "13-17",
      },
    ],
  },
  {
    id: "5",
    title: "Spanish Language Voiceover - Animation",
    category: "Voiceover / Animation",
    mainRole: "Voice Actor",
    roleType: "Main Character",
    pay: "US$4,200",
    estimatedHours: "15 hours of work",
    location: "Remote / Madrid",
    postedDate: "Yesterday",
    ageRange: "25-40",
    union: "No sindicado",
    roles: [
      {
        id: "5-1",
        name: "Protagonist Voice",
        category: "Voiceover Artists",
        gender: "Male",
        ageRange: "25-40",
      },
    ],
  },
];

const STAFF_PICKS: Production[] = [
  {
    id: "sp-1",
    title: "'The Last Dance' - Musical Theater",
    category: "Theater / Musical",
    mainRole: "Ensemble",
    roleType: "Singers & Dancers",
    pay: "US$2,800",
    estimatedHours: "3 weeks + performances",
    location: "London, UK",
    postedDate: "2 days ago",
    ageRange: "20-35",
    union: "Equity",
    description: "Broadway-bound musical seeking exceptional singers and dancers for ensemble roles.",
    roles: [],
  },
  {
    id: "sp-2",
    title: "Tech Startup Product Demo Videos",
    category: "UGC / Corporate",
    mainRole: "Spokesperson",
    roleType: "On-Camera Talent",
    pay: "US$1,500",
    estimatedHours: "3 hours of work",
    location: "San Francisco, CA",
    postedDate: "Today",
    ageRange: "25-40",
    union: "No sindicado",
    description: "Seeking professional on-camera talent for product demonstration videos. Must be tech-savvy and articulate.",
    roles: [],
  },
];

export default function CastingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"productions" | "roles">("productions");
  const [filters, setFilters] = useState<FilterValues>({
    location: "any",
    jobType: "any",
    gender: "any",
    age: "any",
  });

  const [productions, setProductions] = useState<Production[]>([]);
  const [filteredProductions, setFilteredProductions] = useState<Production[]>([]);
  const [staffPicks, setStaffPicks] = useState<Production[]>([]);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    checkAuth();
    loadCastings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, productions]);

  const loadCastings = async () => {
    try {
      const response = await fetch("/api/public/castings-active");
      const data = await response.json();

      if (data.castings && data.castings.length > 0) {
        // Transform API data to Production format
        const transformedProductions = data.castings.map((casting: any) => {
          const firstRole = casting.roles && casting.roles.length > 0 ? casting.roles[0] : null;

          return {
            id: casting.id,
            title: casting.title,
            category: casting.project_type || "Proyecto",
            mainRole: firstRole ? firstRole.name : "Varios roles",
            roleType: firstRole ? `${firstRole.gender}, ${firstRole.ageRange}` : "Ver detalles",
            pay: casting.compensation?.amount || casting.compensation?.details || "A negociar",
            estimatedHours: "Ver detalles",
            location: casting.location || "No especificado",
            postedDate: getRelativeDate(casting.created_at),
            ageRange: firstRole?.ageRange || "Todas las edades",
            union: "No sindicado",
            description: casting.description,
            roles: (casting.roles || []).map((role: any) => ({
              id: role.id || Math.random().toString(),
              name: role.name,
              category: role.category || "Actores",
              gender: role.gender || "All Genders",
              ageRange: role.ageRange || "18-65",
            })),
            featured: false,
          };
        });

        setProductions(transformedProductions);
        setIsMockData(data.isMockData);

        // Set staff picks (last 2 castings)
        if (transformedProductions.length > 2) {
          setStaffPicks(transformedProductions.slice(-2));
        }
      }
    } catch (error) {
      console.error("Error loading castings:", error);
      setIsMockData(true);
    }
  };

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const checkAuth = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role === "productor") {
      // Productores can't access castings page
      router.push("/explorar");
      return;
    }

    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...productions];

    if (filters.location !== "any") {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType !== "any") {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase().includes(filters.jobType.toLowerCase())
      );
    }

    // Age and gender filtering would need to check roles
    setFilteredProductions(filtered);
  };

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleSaveSearch = () => {
    alert("Search saved! (Feature coming soon)");
  };

  const handleViewDetails = (id: string) => {
    router.push(`/castings/${id}`);
  };

  const handleApply = (productionId: string, roleId?: string) => {
    alert(`Applying to ${roleId ? `role ${roleId} in` : ''} production ${productionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando castings...</p>
        </div>
      </div>
    );
  }

  const totalJobs = filteredProductions.reduce((sum, p) => sum + p.roles.length, 0);
  const totalProductions = filteredProductions.length;

  return (
    <>
      <Header variant="light" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Encuentra tu próximo casting</h1>
          {isMockData && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mostrando ejemplos - Los productores pueden publicar castings reales desde su dashboard
            </div>
          )}
        </div>

        {/* Filters */}
        <JobFilters onFilterChange={handleFilterChange} onSaveSearch={handleSaveSearch} />

        {/* Results Info & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <p className="text-gray-700">
              Showing <span className="font-semibold">{totalJobs.toLocaleString()} jobs</span> with{" "}
              <span className="font-semibold">{totalProductions.toLocaleString()} productions</span> near{" "}
              <span className="font-semibold">
                {filters.location === "any" ? "All Locations" : filters.location}
              </span>
            </p>
          </div>

          {/* Productions / Roles Toggle */}
          <div className="inline-flex bg-white border border-gray-300 rounded-full p-1">
            <button
              onClick={() => setViewMode("productions")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                viewMode === "productions"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Productions
            </button>
            <button
              onClick={() => setViewMode("roles")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                viewMode === "roles"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Roles
            </button>
          </div>
        </div>

        {/* Productions/Roles List */}
        <div className="space-y-6 mb-12">
          {filteredProductions.map((production) => (
            <ProductionCard
              key={production.id}
              production={production}
              showRolesPanel={viewMode === "productions"}
              onViewDetails={handleViewDetails}
              onApply={handleApply}
            />
          ))}
        </div>

        {/* Staff Picks Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended | Staff Picks</h2>
            <span className="text-sm text-gray-600">Curated for you</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffPicks.map((pick) => (
              <div key={pick.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{pick.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{pick.category}</p>
                  <p className="text-sm font-semibold text-blue-600 mb-1">{pick.pay}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {pick.location} • {pick.postedDate}
                  </p>
                </div>

                {pick.description && (
                  <p className="text-sm text-gray-700 mb-4">
                    {pick.description.slice(0, 120)}...{" "}
                    <button className="text-blue-600 hover:underline">view more</button>
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewDetails(pick.id)}
                    className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApply(pick.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
