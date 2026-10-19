import SearchResults from "@/features/search/components/SearchResults"
import styles from './styles.module.css'


const SearchResultsPage = () => {
  return (
    <div className={styles.searchResultsWrapper} data-mobile-visible={true}>
      <SearchResults />
    </div>

  )
}

export default SearchResultsPage
