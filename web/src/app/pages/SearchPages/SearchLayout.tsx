import mystyle from "./styles.module.css"
import SearchArea from "@/features/search/components/SearchArea"
import { Outlet } from "react-router-dom"

function SearchLayout() {


  return (
    <div className={mystyle.layout}>
      <aside className={mystyle.sidebar}>
        <SearchArea />
      </aside>
      <div className={mystyle.mainWrapper}>
        <Outlet />
      </div>
    </div>
  )
}

export default SearchLayout
