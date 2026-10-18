import { useParams, } from "react-router-dom";
import SearchBox from "@/features/search/components/SearchBox";
import SearchResultPlace from "@/features/search/components/SearchResultPlace";


function ResultsSidebar() {
  const { placeId } = useParams() as { placeId: string }

  return (
    <div>
      <SearchBox />
      <SearchResultPlace placeId={placeId} />
    </div>
  )
}

export default ResultsSidebar

