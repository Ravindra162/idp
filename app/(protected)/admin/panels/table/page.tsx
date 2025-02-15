import AdminDomainsTable from "../_components/domain-table";

const DomainPage = ({ searchParams }: { searchParams: { page: string } }) => {
    return <AdminDomainsTable searchParams={searchParams} />;
  };
  
  export default DomainPage;
  