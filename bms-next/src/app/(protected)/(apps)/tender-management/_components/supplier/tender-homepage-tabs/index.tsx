import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import SupplierHomeComponent from "../supplier-home-component";
import SupplierHomeMyBids from "../home-my-bids";

interface Props {
  publishedDraftData : any;
  currentAccountBids : any;
}

const TenderHomePageWithTabs = ({
  publishedDraftData,
  currentAccountBids,
} : Props) => {
    return (
      <Tabs defaultValue="allTenders" className="w-full">
        <TabsList>
          <TabsTrigger value="allTenders">All Tenders</TabsTrigger>
          <TabsTrigger value="myTenders">My Bids</TabsTrigger>
        </TabsList>
        <TabsContent value="allTenders">
          <SupplierHomeComponent data={publishedDraftData} />
        </TabsContent>
        <TabsContent value="myTenders">
            <SupplierHomeMyBids data = {currentAccountBids} />
        </TabsContent>
      </Tabs>
    );
};

export default TenderHomePageWithTabs