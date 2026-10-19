import { GlobeIcon, IslandIcon } from "@phosphor-icons/react"
import mystyle from "./styles.module.css"

function SearchIndexPage() {
  return (
    <div data-mobile-visible={false} className={mystyle.mainBox}>
      <div>
        <IslandIcon size={80} />
      </div>
      <div>Cotraveller</div>
      <div>"Travel far enough, you meet yourself." - David Mitchell</div>
      <div className={mystyle.featureBox}>
        <GlobeIcon size={14} />
        Organise, invite and discover trips
      </div>
    </div>
  )
}

export default SearchIndexPage
