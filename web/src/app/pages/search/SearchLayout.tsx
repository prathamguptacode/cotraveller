import { Outlet } from "react-router-dom"
import SearchSidebar from "./SearchSidebar"
import mystyle from "./Search.module.css"

function SearchLayout() {
  return (
    <div className={mystyle.searchLayout}>
      <div className={mystyle.searchSidebar}>
        <SearchSidebar />
      </div>
      <div className={mystyle.searchMainContent}>
        <Outlet />
      </div>
    </div>
  )
}

export default SearchLayout
