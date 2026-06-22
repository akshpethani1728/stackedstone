export function Cta() {
  return (
    <section id="create" className="bg-ink text-background py-32 md:py-48">
      <div className="container-edit text-center">
        <p className="eyebrow text-background/60">Your Volume</p>
        <h2 className="display mt-8 text-[12vw] md:text-[7rem] leading-[0.95]">
          Begin the<br /><span className="italic">first page.</span>
        </h2>
        <p className="mt-10 max-w-md mx-auto text-background/75 leading-relaxed">
          Upload your photographs today. Hold your book by autumn.
        </p>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
          <a href="#" className="btn-primary !bg-background !text-ink !border-background hover:!bg-transparent hover:!text-background">
            Create your book
          </a>
          <a href="#collections" className="btn-ghost text-background/85">
            Or browse editions
          </a>
        </div>
      </div>
    </section>
  );
}
