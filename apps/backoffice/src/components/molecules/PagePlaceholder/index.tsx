interface PagePlaceholderProps {
  title: string;
}

// Route skeleton filler for screens that arrive in later phases.
export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <h1 className="font-display text-headline-md text-on-background">
        {title}
      </h1>
      <p className="text-body-md text-on-surface-variant">
        Em construção — chega numa próxima fase.
      </p>
    </div>
  );
}
