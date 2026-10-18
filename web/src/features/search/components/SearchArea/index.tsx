import SearchHistory from "@/features/search/components/SearchArea/SearchHistory"
import SearchBox from "@/features/search/components/SearchArea/SearchBox"
import SearchResultPlace from "@/features/search/components/SearchArea/SearchResultPlace"
import { useParams } from "react-router-dom"


function SearchArea() {
  const { placeId } = useParams() as { placeId?: string }

  return (
    <div>
      <SearchBox />
      {placeId ?
        <SearchResultPlace placeId={placeId} /> :
        <SearchHistory />
      }
    </div >
  )
}

export default SearchArea
