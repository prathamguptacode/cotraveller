import Stack from '@mui/material/Stack'
import mystyle from '../groupForm.module.css'
import { useGroupForm } from '../hooks/useGroupForm'
import Chip from '@mui/material/Chip'
import { HandCoins, PawPrint, Venus, WineOff } from 'lucide-react'
import { useState } from 'react'

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
  const Trvdate = Acdate.toLocaleString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  const [tags, setTags] = useState({
    noalcohol: false,
    girlsonly: false,
    budgetfriendly: false,
    petfriendly: true
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

      <div className={mystyle.divider} />

      <div>
        <div className={mystyle.value}>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>

            <Chip onClick={() => tags.noalcohol ? setTags({ ...tags, noalcohol: false }) : setTags({ ...tags, noalcohol: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="No Alcohol" variant={tags.noalcohol ? "filled" : "outlined"} color="primary" icon={<WineOff />} />

            <Chip onClick={() => tags.girlsonly ? setTags({ ...tags, girlsonly: false }) : setTags({ ...tags, girlsonly: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Girls Only" variant={tags.girlsonly ? "filled" : "outlined"} color="primary" icon={<Venus />} />

            <Chip onClick={() => tags.budgetfriendly ? setTags({ ...tags, budgetfriendly: false }) : setTags({ ...tags, budgetfriendly: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Budget Friendly" variant={tags.budgetfriendly ? "filled" : "outlined"} color="primary" icon={<HandCoins />} />

            <Chip onClick={() => tags.petfriendly ? setTags({ ...tags, petfriendly: false }) : setTags({ ...tags, petfriendly: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Pet Friendly" variant={tags.petfriendly ? "filled" : "outlined"} color="primary" icon={<PawPrint />} />

          </Stack>


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
