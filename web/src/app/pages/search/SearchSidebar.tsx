import { useEffect, useRef, useState, } from "react"
import mystyle from "./Search.module.css"
import { MagnifyingGlassIcon, MapPinIcon } from "@phosphor-icons/react"

const placeHolderText = ["Search for Tokyo", "Search for Monoco", "Search for California", "Search for Germany"]


function SearchSidebar() {

  const searchInRef = useRef<HTMLInputElement>(null)
  let i = 0;
  const speed = 100;
  const [pos, setPos] = useState(0)

  async function dynamicPlaceholder(pos: number) {
    if (!searchInRef.current) return
    if (i === placeHolderText[pos].length) {
      i = 0;
      await new Promise((resolve) => setTimeout(resolve, 800));
      searchInRef.current.placeholder = ""
      if (pos === placeHolderText.length - 1) {
        setPos(0)
      } else {
        setPos(pos + 1)
      }
      return
    }
    searchInRef.current.placeholder += placeHolderText[pos].charAt(i)
    i++;
    setTimeout(() => dynamicPlaceholder(pos), speed)
  }

  useEffect(() => {
    dynamicPlaceholder(pos)
  }, [pos])


  return (
    <div>
      <div className={mystyle.searchBox}>
        <MagnifyingGlassIcon size={22} />
        <input ref={searchInRef} />
      </div>
      <LocationOption />
      <div className={mystyle.historyBox}>
        <CityBox url="https://s3.eu-west-1.amazonaws.com/ryo-prod-public-398019065442/public_endroits_manga_tokyo_fans_poster_en_1ae210be15.jpg" city="Tokyo" country="Japan" />
        <CityBox url="https://s3.eu-west-1.amazonaws.com/ryo-prod-public-398019065442/public_endroits_manga_tokyo_fans_poster_en_1ae210be15.jpg" city="Tokyo" country="Japan" />
        <CityBox url="https://s3.eu-west-1.amazonaws.com/ryo-prod-public-398019065442/public_endroits_manga_tokyo_fans_poster_en_1ae210be15.jpg" city="Tokyo" country="Japan" />
        <CityBox url="https://s3.eu-west-1.amazonaws.com/ryo-prod-public-398019065442/public_endroits_manga_tokyo_fans_poster_en_1ae210be15.jpg" city="Tokyo" country="Japan" />
      </div>
    </div >
  )
}

export default SearchSidebar


function CityBox({ url, city, country }: { url: string, city: string, country: string }) {

  return <div className={mystyle.cityBox}>
    <img src={url} alt="city image" width="100%" />
    <div className={mystyle.content}>
      <div>{city}</div>
      <div>{country}</div>
    </div>
  </div>
}

function LocationOption() {

  return <div className={mystyle.optionBox}>

    <div className={mystyle.option}>
      <div className={mystyle.iconWrapper}>
        <MapPinIcon weight="fill" size={20} />
      </div>
      <div>Lucknow, Uttar Pradesh</div>
    </div>

    <div className={mystyle.option}>
      <div className={mystyle.iconWrapper}>
        <MapPinIcon weight="fill" size={20} />
      </div>
      <div>Lucknow, Uttar Pradesh</div>
    </div>


    <div className={mystyle.option}>
      <div className={mystyle.iconWrapper}>
        <MapPinIcon weight="fill" size={20} />
      </div>
      <div>Lucknow, Uttar Pradesh</div>
    </div>


    <div className={mystyle.option}>
      <div className={mystyle.iconWrapper}>
        <MapPinIcon weight="fill" size={20} />
      </div>
      <div>Lucknow, Uttar Pradesh</div>
    </div>

  </div>
}
