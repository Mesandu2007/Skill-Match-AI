export const Footer = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-4">
      <div className="text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} SkillMatch AI. All rights reserved.
      </div>
    </footer>
  );
};