import mystyle from './creategroup.module.css'

function TitleTile({title="Your Group Information", con="Find your next bestie, flight mate, or chaos buddy."}) {


  return (
    <div className={mystyle.titleTile}>
        <div className={mystyle.strip}></div>
      <div className={mystyle.title}>{title}</div>
      <div className={mystyle.con}>{con}</div>
    </div>
  )
}

export default TitleTile
