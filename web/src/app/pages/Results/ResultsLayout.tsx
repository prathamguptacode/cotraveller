import mystyle from "./Results.module.css"
import ResultsMainContent from "./ResultsMainContent"
import ResultsSidebar from "./ResultsSidebar"

function ResultsLayout() {
  return (
    <div className={mystyle.resultsLayout}>
      <div className={mystyle.resultsSidebar}>
        <ResultsSidebar />
      </div>
      <div className={mystyle.resultsMainContent}>
        <ResultsMainContent />
      </div>
    </div>
  )
}

export default ResultsLayout
