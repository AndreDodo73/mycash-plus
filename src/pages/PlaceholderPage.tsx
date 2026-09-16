export function PlaceholderPage({ title }: { title: string }) {
  return (
    <section className="flex w-full flex-col gap-space-8">
      <h1 className="text-heading-small font-bold text-neutral-1100 md:text-heading-medium">
        {title}
      </h1>
      <p className="text-paragraph-small text-neutral-600">
        Conteúdo desta seção entra nos próximos prompts.
      </p>
    </section>
  );
}
