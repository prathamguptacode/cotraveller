import mystyle from "./styles.module.css"
import SearchArea from "@/features/search/components/SearchArea"
import { Outlet } from "react-router-dom"

function SearchLayout() {


  return (
    <div className={mystyle.searchLayout}>
      <div className={mystyle.searchSidebar}>
        <SearchArea />
      </div>
      <div className={mystyle.searchMainContent}>
        <Outlet />
      </div>
    </div>
  )
}

export default SearchLayout
