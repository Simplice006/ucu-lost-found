// Dark banner shown at the top of every inner page, matching the home hero.
export default function PageHeader({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {Icon && <span className="page-hero-icon"><Icon size={26} /></span>}
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="page-hero-sub">{subtitle}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
