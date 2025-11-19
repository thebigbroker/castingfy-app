import Link from "next/link";

export default function Header() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e5e0',
        padding: '1.5rem',
        width: '100%'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Link
          href="/"
          className="castingfy-logo"
          style={{
            fontSize: '1.5rem',
            textDecoration: 'none'
          }}
        >
          Castingfy
        </Link>
      </div>
    </div>
  );
}
