import mystyle from "./Search.module.css"
import SearchSidebar from "@/app/pages/Search/SearchSidebar"
import SearchMainContent from "./SearchMainContent"

function SearchLayout() {


  return (
    <div className={mystyle.searchLayout}>
      <div className={mystyle.searchSidebar}>
        <SearchSidebar />
      </div>
      <div className={mystyle.searchMainContent}>
        <SearchMainContent />
      </div>
    </div>
  )
}

export default SearchLayout
