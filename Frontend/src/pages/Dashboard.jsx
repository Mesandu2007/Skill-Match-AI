import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getDashboardAnalytics } from "../services/api";

export const Dashboard = () => {
  const [analytics, setAnalytics] =
    useState({
      totalProjects: 0,
      totalCandidates: 0,
      totalAnalyses: 0,
      averageScore: 0,
      topScore: 0,
      strongMatches: 0,
      weakMatches: 0,
      recentActivity: [],
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        const res =
          await getDashboardAnalytics();

        setAnalytics(res.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  const cards = [
    {
      title: "Projects",
      value:
        analytics.totalProjects,
      color: "text-blue-400",
    },
    {
      title: "Candidates",
      value:
        analytics.totalCandidates,
      color: "text-green-400",
    },
    {
      title: "Analyses",
      value:
        analytics.totalAnalyses,
      color: "text-purple-400",
    },
    {
      title: "Average Score",
      value:
        analytics.averageScore,
      color: "text-yellow-400",
    },
    {
      title: "Top Score",
      value: analytics.topScore,
      color: "text-cyan-400",
    },
    {
      title: "Strong Matches",
      value:
        analytics.strongMatches,
      color: "text-emerald-400",
    },
    {
      title: "Weak Matches",
      value:
        analytics.weakMatches,
      color: "text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
      
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            System analytics and
            recent activity.
          </p>
        </div>

        
        {loading && (
          <div className="text-center text-gray-400">
            Loading dashboard...
          </div>
        )}

        {!loading && (
          <>
        
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                >
                  <h3 className="text-gray-400 text-sm">
                    {card.title}
                  </h3>

                  <p
                    className={`text-4xl font-bold mt-4 ${card.color}`}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

          
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Recent Activity
              </h2>

              {analytics
                .recentActivity
                ?.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No recent activity.
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.recentActivity?.map(
                    (
                      activity,
                      index
                    ) => (
                      <div key={index} className="bg-gray-800 rounded-xl p-4">
                        <p className="text-white">
                          {
                            activity.message
                          }
                        </p>

                        <p className="text-gray-400 text-sm mt-1">
                          {
                            activity.date
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};