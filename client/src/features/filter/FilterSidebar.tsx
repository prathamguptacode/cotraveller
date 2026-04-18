import React, { useEffect, useState } from 'react'
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



function FilterSidebar() {

  const [member, setMember] = useState(1);
  const [travelMode, setTravelMode] = useState('Any mode');
  const [time, setTime] = useState<PickerValue | null>(null)
  const [noalcohol, setNoalcohol] = useState<string | null>(null);
  const [girlsonly, setGirlsonly] = useState<string | null>(null);
  const [budgetfriendly, setBudgetfriendly] = useState<string | null>(null);
  const [petfriendly, setPetfriendly] = useState<string | null>(null);

  function handlePlus() {
    if (member < 5) {
      return setMember(prev => prev + 1)
    }
    if (member >= 5) {
      return setMember(32)
    }
  }
  function handleMinus() {
    if (member == 32) {
      return setMember(5)
    }
    if (member > 1) {
      setMember(prev => prev - 1)
    }
  }

  
  const [query, setQuery] = useSearchParams();
  useEffect(() => {
    const q = query.get('q');
    const date = query.get('date')
    const travelMode = query.get('travelMode')
    const time = query.get('time')
    // const tags = query.get('tags')
    if (member == 1) {
      return setQuery(`q=${q}&date=${date}&travelMode=${travelMode}&time=${time}&members=null&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
    }
    setQuery(`q=${q}&date=${date}&travelMode=${travelMode}&time=${time}&members=${member}&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
  }, [member])
  useEffect(() => {
    const q = query.get('q');
    const date = query.get('date')
    const time = query.get('time')
    const members = query.get('members')
    if (travelMode != 'Any mode') {
      return setQuery(`q=${q}&date=${date}&time=${time}&members=${members}&travelMode=${travelMode}&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
    }
    setQuery(`q=${q}&date=${date}&time=${time}&members=${members}&travelMode=null&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
  }, [travelMode])
  useEffect(() => {
    const q = query.get('q');
    const date = query.get('date')
    const members = query.get('members')
    const travelMode = query.get('travelMode')
    if (time?.isValid()) {
      const hour = time.hour().toString().padStart(2, "0")
      const min = time.minute().toString().padStart(2, "0")
      return setQuery(`q=${q}&date=${date}&travelMode=${travelMode}&members=${members}&time=${hour}T${min}&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
    }
    return setQuery(`q=${q}&date=${date}&travelMode=${travelMode}&members=${members}&time=null&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
  }, [time])
  useEffect(() => {
    const q = query.get('q');
    const date = query.get('date')
    const time = query.get('time')
    const members = query.get('members')
    const travelMode = query.get('travelMode')
    setQuery(`q=${q}&date=${date}&time=${time}&members=${members}&travelMode=${travelMode}&tags=${noalcohol}&tags=${girlsonly}&tags=${budgetfriendly}&tags=${petfriendly}`)
  }, [noalcohol, girlsonly, budgetfriendly, petfriendly])




  return (
    <div className={mystyle.wrapper}>
      <div className={mystyle.member}>
        <div className={mystyle.memberHeading}>Members</div>
        <div className={mystyle.memberbox}>
          <button className={mystyle.memberMinus} onClick={handleMinus}><LuMinus /></button>
          <div>
            {
              member == 1 ? <div>Any</div> : member == 32 ? <div>6+</div> : <div>{member}</div>
            }
          </div>
          <button className={mystyle.memberPlus} onClick={handlePlus}><LuPlus /></button>
        </div>
      </div>

      <div className={mystyle.travelMode}>
        <div className={mystyle.modeHeading}>Travel mode</div>
        <button className={mystyle.modeBox} popoverTarget="modeList">
          {travelMode}
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
              <TimePicker onAccept={(e) => setTime(e)} className={mystyle.timePicker} label="Departure Time" slotProps={{ field: { clearable: true }, textField: { sx: { borderRadius: '8px', fieldset: { borderRadius: '8px' }, } } }} />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </div>

      <div className={mystyle.tags}>
        <div className={mystyle.tagHeading}>Group Tags</div>
        <div className={mystyle.tagBox}>
          <Stack direction="row" spacing={1.2} useFlexGap sx={{ flexWrap: 'wrap' }}>

            <Chip onClick={() => noalcohol ? setNoalcohol(null) : setNoalcohol("no alcohol")} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="No Alcohol" variant={noalcohol ? "filled" : "outlined"} color="primary" icon={<WineOff />} />

            <Chip onClick={() => girlsonly ? setGirlsonly(null) : setGirlsonly("girls only")} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Girls Only" variant={girlsonly ? "filled" : "outlined"} color="primary" icon={<Venus />} />

            <Chip onClick={() => budgetfriendly ? setBudgetfriendly(null) : setBudgetfriendly("budget friendly")} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Budget Friendly" variant={budgetfriendly ? "filled" : "outlined"} color="primary" icon={<HandCoins />} />

            <Chip onClick={() => petfriendly ? setPetfriendly(null) : setPetfriendly("pet friendly")} sx={{ "&:hover": { cursor: "pointer", }, padding: "8px" }} label="Pet Friendly" variant={petfriendly ? "filled" : "outlined"} color="primary" icon={<PawPrint />} />

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
