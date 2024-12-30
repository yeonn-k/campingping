import Nav from '@/components/Nav/Nav';

function ListLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Nav />
    </div>
  );
}

export default ListLayout;
