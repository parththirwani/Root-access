import Link from 'next/link';

export function BreadcrumbNav({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav className="site-breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          <span aria-hidden="true">/</span>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
