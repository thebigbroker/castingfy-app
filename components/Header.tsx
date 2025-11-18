import Link from "next/link";

export default function Header() {
  return (
    <header
      className="p-6 border-b border-border"
      style={{
        backgroundColor: '#ffffff',
        borderBottomColor: '#e5e5e0'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-bold"
          style={{ color: '#000000' }}
        >
          Castingfy
        </Link>
      </div>
    </header>
  );
}
