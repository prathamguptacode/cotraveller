import { useEffect } from 'react'
import mystyle from '../groupForm.module.css'
import { useGroupForm } from '../hooks/useGroupForm'

type GroupFormReviewProps = {
  startOver: () => void
}

const GroupFormReview = ({ startOver }: GroupFormReviewProps) => {

  const { watch } = useGroupForm()

  const date = watch('travelDate') + 'T' + watch('travelTime')
  const Acdate = new Date(date);
  const time = Acdate.toLocaleTimeString('en-IN', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit'
  })
  const Trvdate = Acdate.toLocaleString('en-IN',{
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (
    <div className={mystyle.reviewCard}>
      <div className={mystyle.rowBetween}>
        <div>
          <div className={mystyle.label}>Group Name</div>
          <div className={mystyle.value}>{watch('title')}</div>
        </div>
      </div>

      <div className={mystyle.divider} />

      <div>
        <div className={mystyle.label}>Description</div>
        <div className={mystyle.value}>{watch('content')}</div>
      </div>

      <div className={mystyle.divider} />

      <div className={mystyle.grid}>
        <div>
          <div className={mystyle.label}>Travel Date</div>
          <div className={mystyle.value}>{Trvdate}</div>
        </div>

        <div>
          <div className={mystyle.label}>Travel Time</div>
          <div className={mystyle.value}>{time}</div>
        </div>

        <div>
          <div className={mystyle.label}>Intial Location</div>
          <div className={mystyle.value}>
            {watch('intialLocation')}
          </div>
        </div>

        <div>
          <div className={mystyle.label}>Transport</div>
          <div className={mystyle.value}>
            {watch('mode')}
          </div>
        </div>
      </div>

      <div className={mystyle.divider} />

      <div className={mystyle.rowBetween}>
        <div>
          <div className={mystyle.label}>Max Group Size</div>
          <div className={mystyle.value}>
            {watch('memberNumber')}
          </div>
        </div>
      </div>

      <div className={mystyle.note}>
        Once created, your group will be visible to other travelers.
        They can join and chat with you to coordinate the trip!
        <div className={mystyle.startOver}>
          Something not right?{' '}
          <button
            className={mystyle.startOverBtn}
            onClick={startOver}
            aria-label="Start over"
          >
            Start over.
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroupFormReview
