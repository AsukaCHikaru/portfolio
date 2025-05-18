export const Link = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new Event('popstate'));
  };
  
  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
};