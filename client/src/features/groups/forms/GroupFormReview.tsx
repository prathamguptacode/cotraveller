import Stack from '@mui/material/Stack'
import mystyle from '../groupForm.module.css'
import { useGroupForm } from '../hooks/useGroupForm'
import Chip from '@mui/material/Chip'
import { HandCoins, PawPrint, Venus, WineOff } from 'lucide-react'
import { Controller } from 'react-hook-form'

type GroupFormReviewProps = {
  startOver: () => void
}

const GroupFormReview = ({ startOver }: GroupFormReviewProps) => {

  const { watch, control, formState:{errors} } = useGroupForm()

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
          <Controller control={control} name='tags' defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              (value) ? (<Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>

                <Chip
                  onClick={() =>
                    value.includes("no alcohol")
                      ? onChange(value.filter(v => v !== "no alcohol"))
                      : onChange([...value, "no alcohol"])
                  }
                  sx={{ cursor: "pointer", padding: "8px" }}
                  label="No Alcohol"
                  variant={value.includes("no alcohol") ? "filled" : "outlined"}
                  color="primary"
                  icon={<WineOff />}
                />

                <Chip
                  onClick={() =>
                    value.includes("girls only")
                      ? onChange(value.filter(v => v !== "girls only"))
                      : onChange([...value, "girls only"])
                  }
                  sx={{ cursor: "pointer", padding: "8px" }}
                  label="Girls Only"
                  variant={value.includes("girls only") ? "filled" : "outlined"}
                  color="primary"
                  icon={<Venus />}
                />

                <Chip
                  onClick={() =>
                    value.includes("budget friendly")
                      ? onChange(value.filter(v => v !== "budget friendly"))
                      : onChange([...value, "budget friendly"])
                  }
                  sx={{ cursor: "pointer", padding: "8px" }}
                  label="Budget Friendly"
                  variant={value.includes("budget friendly") ? "filled" : "outlined"}
                  color="primary"
                  icon={<HandCoins />}
                />

                <Chip
                  onClick={() =>
                    value.includes("pet friendly")
                      ? onChange(value.filter(v => v !== "pet friendly"))
                      : onChange([...value, "pet friendly"])
                  }
                  sx={{ cursor: "pointer", padding: "8px" }}
                  label="Pet Friendly"
                  variant={value.includes("pet friendly") ? "filled" : "outlined"}
                  color="primary"
                  icon={<PawPrint />}
                />

              </Stack>) : <div></div>
            )} />
          <div className={mystyle.error}>
            {errors.title?.message}
          </div>
        </div>
      </div>

      <div className={mystyle.note}>
        <div className={mystyle.upperNote}>
          Once created, your group will be visible to other travelers.
          They can join and chat with you to coordinate the trip!
        </div>
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
