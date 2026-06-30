export default function LegalPage({eyebrow, title, intro, updatedAt, sections}) {
  return (
    <main className="starter-page">
      <section className="cms-page-hero cms-page-hero--compact">
        <div className="container-max">
          <p className="cms-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </section>

      <section className="container-max cms-section">
        <article className="legal-card">
          <p className="cms-card-meta">Last updated: {updatedAt}</p>
          <div className="legal-sections">
            {sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  )
}
