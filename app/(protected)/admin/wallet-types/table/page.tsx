import WalletTypesTable from "../_components/wallet-type-table";

const WalletTypePage = ({ searchParams }: { searchParams: { page: string } }) => {
    return <WalletTypesTable searchParams={searchParams} />;
  };
  
  export default WalletTypePage;
  