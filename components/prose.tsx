import clsx from 'clsx';

const Prose = ({ html, className }: { html: string; className?: string }) => {
  // Ensure html is a string and not undefined/null
  if (!html || typeof html !== 'string') {
    return null;
  }

  return (
    <div
      className={clsx(
        'prose',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Prose;
