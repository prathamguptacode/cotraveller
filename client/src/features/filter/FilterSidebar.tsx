import { useEffect, useState } from 'react'
import mystyle from './FilterSidebar.module.css'
import { LuPlus } from "react-icons/lu";
import { LuMinus } from "react-icons/lu";
import { LuChevronDown } from "react-icons/lu";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { HandCoins, PawPrint, Venus, WineOff } from 'lucide-react';
import type { PickerValue } from '@mui/x-date-pickers/internals';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod'
import dayjs from 'dayjs';

const querySchema = z.object({
  location: z.string(),
  date: z.string(),
  members: z.coerce.number().refine(val => (val >= 2 && val <= 5) || val == 32).nullable(),
  mode: z.enum(["Train", "Flight", "Taxi", "Car", "Bike"]).nullable(),
  tags: z.array(z.enum(["no alcohol", "girls only", "budget friendly", "pet friendly"])),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).nullable()
})

function FilterSidebar() {
  const [query, setQuery] = useSearchParams();
  const membersQ = query.get('members')
  const locationQ = query.get("q");
  const dateQ = query.get("date");
  const modeQ = query.get("mode");
  const tagsQ = query.getAll("tags");
  const timeQ = query.get("time")

  // automatically captures error
  const validateQuery = querySchema.parse({ location: locationQ, date: dateQ, members: membersQ, mode: modeQ, tags: tagsQ, time: timeQ })
  const { members, mode, time } = validateQuery

  const [tags, setTags] = useState({
    noalcohol: validateQuery.tags.includes("no alcohol"),
    girlsonly: validateQuery.tags.includes("girls only"),
    budgetfriendly: validateQuery.tags.includes("budget friendly"),
    petfriendly: validateQuery.tags.includes("pet friendly")
  })
  useEffect(() => {
    const value = [tags.noalcohol ? "no alcohol" : null, tags.girlsonly ? "girls only" : null, tags.budgetfriendly ? "budget friendly" : null, tags.petfriendly ? "pet friendly" : null];
    query.delete("tags")
    value.forEach((e) => {
      if (e) {
        query.append("tags", e)
      }
    })
    return setQuery(query)
  }, [tags])

  function handlePlus() {
    if (!members) {
      query.set("members", "2")
      return setQuery(query)
    }
    if (members < 5) {
      query.set("members", `${members + 1}`)
      return setQuery(query)
    }
    if (members == 5) {
      query.set("members", "32")
      return setQuery(query)
    }
  }
  function handleMinus() {
    if (!members) {
      return
    }
    if (members == 32) {
      query.set("members", "5")
      return setQuery(query)
    }
    if (members > 2) {
      query.set("members", `${members - 1}`)
      return setQuery(query)
    }
    if (members == 2) {
      query.delete("members")
      return setQuery(query)
    }
  }
  function setTravelMode(e: string) {
    if (e != "Any mode") {
      query.set("mode", e)
      return setQuery(query)
    }
    query.delete("mode")
    return setQuery(query)
  }
  function setTime(e: PickerValue) {
    if (e) {
      query.set("time", `${e.hour().toString().padStart(2, "0")}:${e.minute().toString().padStart(2, "0")}`)
      return setQuery(query)
    }
    query.delete("time")
    return setQuery(query)
  }
  let queryTime: dayjs.Dayjs | null = null;
  if (time) {
    const dfTime = time.split(':')
    queryTime = dayjs().hour(Number(dfTime[0])).minute(Number(dfTime[1]))
  }

  return (
    <div className={mystyle.wrapper}>
      <div className={mystyle.member}>
        <div className={mystyle.memberHeading}>Members</div>
        <div className={mystyle.memberbox}>
          <button className={mystyle.memberMinus} onClick={handleMinus} ><LuMinus /></button>
          <div>
            {
              members ? members >= 6 ? '6+' : members : 'Any'
            }
          </div>
          <button className={mystyle.memberPlus} onClick={handlePlus} ><LuPlus /></button>
        </div>
      </div>

      <div className={mystyle.travelMode}>
        <div className={mystyle.modeHeading}>Travel mode</div>
        <button className={mystyle.modeBox} popoverTarget="modeList">
          {mode ? mode : 'Any mode'}
          <div className={mystyle.modeIcon}>
            <LuChevronDown />
          </div>
        </button>
        <div className={mystyle.modeDrop} popover='auto' id="modeList">
          <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Train</button>
          <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Flight</button>
          <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Taxi</button>
          <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Car</button>
          <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Bike</button>
          <button className={mystyle.options} onClick={(e) => setTravelMode(e.currentTarget.innerText)} popoverTarget="modeList">Any mode</button>
        </div>
      </div>



      <div className={mystyle.time}>
        <div className={mystyle.timeHeading}>Time</div>
        <div className={mystyle.timebox}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
              <TimePicker defaultValue={queryTime} onAccept={(e) => setTime(e)} className={mystyle.timePicker} label="Departure Time" slotProps={{ field: { clearable: true }, textField: { sx: { borderRadius: '8px', fieldset: { borderRadius: '8px' }, } } }} />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>

      <div className={mystyle.tags}>
        <div className={mystyle.tagHeading}>Group Tags</div>
        <div className={mystyle.tagBox}>
          <Stack direction="row" spacing={1.2} useFlexGap sx={{ flexWrap: 'wrap' }}>

            <Chip onClick={() => tags.noalcohol ? setTags({ ...tags, noalcohol: false }) : setTags({ ...tags, noalcohol: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="No Alcohol" variant={tags.noalcohol ? "filled" : "outlined"} color="primary" icon={<WineOff />} />

            <Chip onClick={() => tags.girlsonly ? setTags({ ...tags, girlsonly: false }) : setTags({ ...tags, girlsonly: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Girls Only" variant={tags.girlsonly ? "filled" : "outlined"} color="primary" icon={<Venus />} />

            <Chip onClick={() => tags.budgetfriendly ? setTags({ ...tags, budgetfriendly: false }) : setTags({ ...tags, budgetfriendly: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Budget Friendly" variant={tags.budgetfriendly ? "filled" : "outlined"} color="primary" icon={<HandCoins />} />

            <Chip onClick={() => tags.petfriendly ? setTags({ ...tags, petfriendly: false }) : setTags({ ...tags, petfriendly: true })} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Pet Friendly" variant={tags.petfriendly ? "filled" : "outlined"} color="primary" icon={<PawPrint />} />

          </Stack>
        </div>
      </div>


      {/* <div className={mystyle.btnBox}>
        <button className={mystyle.filterBtn}>Apply Filter</button>
      </div> */}


    </div>
  )
}

export default FilterSidebar
