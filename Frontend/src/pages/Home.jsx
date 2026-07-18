import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";

export const Home = () => {
  const features = [
    {
      icon: "🤖",
      title: "AI Candidate Ranking",
      description:
        "Automatically evaluate and rank GitHub candidates using AI.",
    },
    {
      icon: "🐙",
      title: "GitHub Analysis",
      description:
        "Analyze repositories, languages, commits and developer activity.",
    },
    {
      icon: "📁",
      title: "Project Management",
      description:
        "Create projects and organize candidates efficiently.",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description:
        "Track candidate scores and recruitment insights in real time.",
    },
  ];

  const steps = [
    "Create Project",
    "Add Candidates",
    "Run AI Analysis",
    "Hire the Best Match",
  ];

  const technologies = [
    "React",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "JWT",
    "GitHub API",
    "Groq AI",
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Section */}

      <section className="min-h-screen flex items-center">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <div>

            <span className="inline-block bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold">
              AI Powered Recruitment Platform
            </span>

            <h1 className="text-6xl font-bold leading-tight mt-8">
              Hire Better Developers
              <br />
              with
              <span className="text-blue-500"> SkillMatch AI</span>
            </h1>

            <p className="text-gray-400 text-lg mt-8 leading-8 max-w-xl">
              SkillMatch AI analyzes GitHub profiles,
              evaluates developer skills, and ranks
              candidates based on your project
              requirements using Artificial
              Intelligence.
            </p>

            <div className="flex gap-5 mt-10">

              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border border-gray-700 hover:border-blue-500 hover:text-blue-400 px-8 py-4 rounded-xl transition"
              >
                Login
              </Link>

            </div>

          </div>

          {/* Right */}

          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-8">
              Platform Overview
            </h2>

            <div className="grid grid-cols-2 gap-6">

              <div className="bg-gray-800 rounded-2xl p-6">
                <p className="text-gray-400">
                  AI Analysis
                </p>

                <h3 className="text-5xl font-bold text-blue-400 mt-4">
                  ✓
                </h3>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6">
                <p className="text-gray-400">
                  GitHub Profiles
                </p>

                <h3 className="text-5xl font-bold text-green-400 mt-4">
                  ∞
                </h3>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6">
                <p className="text-gray-400">
                  Projects
                </p>

                <h3 className="text-5xl font-bold text-purple-400 mt-4">
                  📁
                </h3>
              </div>

              <div className="bg-gray-800 rounded-2xl p-6">
                <p className="text-gray-400">
                  Analytics
                </p>

                <h3 className="text-5xl font-bold text-yellow-400 mt-4">
                  📊
                </h3>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-500 transition"
              >

                <div className="text-5xl">
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-semibold mt-6">
                  {feature.title}
                </h3>

                <p className="text-gray-400 mt-4 leading-7">
                  {feature.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Workflow */}

      <section className="bg-gray-900 py-24">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            {steps.map((step, index) => (

              <div
                key={step}
                className="text-center"
              >

                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto text-2xl font-bold">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold mt-6">
                  {step}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      

      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-14">
            Built With
          </h2>

          <div className="flex flex-wrap justify-center gap-5">

            {technologies.map((tech) => (

              <span
                key={tech}
                className="bg-gray-900 border border-gray-800 rounded-full px-6 py-3 hover:border-blue-500 transition"
              >
                {tech}
              </span>

            ))}

          </div>

        </div>

      </section>

      

      <section className="py-24 bg-gradient-to-r from-blue-700 to-indigo-700">

        <div className="max-w-4xl mx-auto text-center px-6">

          <h2 className="text-5xl font-bold">
            Ready to Find Your Next Developer?
          </h2>

          <p className="text-xl text-gray-200 mt-8">
            Start building recruitment projects,
            analyze GitHub profiles, and hire
            smarter with AI.
          </p>

          <div className="flex justify-center gap-6 mt-10">

            <Link
              to="/register"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="border border-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition"
            >
              Login
            </Link>

          </div>

        </div>

      </section>

      {/* Footer */}

      <Footer />
    </div>
  );
};