import SearchHistory from "@/features/search/components/SearchArea/SearchHistory"
import SearchBox from "@/features/search/components/SearchArea/SearchBox"
import SearchResultPlace from "@/features/search/components/SearchArea/SearchResultPlace"
import { useParams } from "react-router-dom"

import styles from './styles.module.css'


function SearchArea() {
  const { placeId } = useParams() as { placeId?: string }

  return (
    <div className={styles.searchArea}>
      <SearchBox />
      {placeId ?
        <SearchResultPlace placeId={placeId} /> :
        <SearchHistory />
      }
    </div >
  )
}

export default SearchArea
