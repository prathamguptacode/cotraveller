import { Controller } from 'react-hook-form';
import mystyle from '../groupForm.module.css'
import { useGroupForm } from '../hooks/useGroupForm'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { LuChevronDown, LuMinus, LuPlus } from 'react-icons/lu';
import { Car, Footprints, Motorbike, Plane } from 'lucide-react';
import { IoMdTrain } from "react-icons/io";
import { FaTaxi } from "react-icons/fa6";
import { useLoadScript, type Libraries } from '@react-google-maps/api'
import Location from './search/Location';

const lib: Libraries = ["places"]
const GroupFormStep2 = () => {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
        region: 'in',
        libraries: lib
    })

    const { formState: { errors }, control } = useGroupForm()

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const myDateHtml = `${year}-${month}-${day}`;
    const hour = date.getHours().toString().padStart(2, '0');
    const time = date.getMinutes().toString().padStart(2, '0');
    const myTimeHtml = `${hour}:${time}`

    return (
        <div className={mystyle.groupForm2}>
            <div>
                <div className={mystyle.groupFormTitle}>Travel Details</div>
                <div className={mystyle.stepIndicator}>
                    Step 2: When and how will you travel?
                </div>
            </div>

            <div className={mystyle.groupForm2Content}>
                <div className={mystyle.dateSection}>
                    <div className={mystyle.datebox}>
                        <div className={mystyle.startDate}>Travel Date</div>
                        {/* <input type="date" id="startDate" className={mystyle.dateInput} defaultValue={myDateHtml} {...register('travelDate')} /> */}
                        <Controller
                            control={control}
                            name="travelDate"
                            defaultValue={myDateHtml}
                            render={({ field: { onChange } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']} sx={{ p: '0.4rem 0', overflow: 'visible', width: 1 }}>
                                        <div className={mystyle.dateInputMui}>
                                            <DatePicker disablePast format='DD/MM/YYYY' defaultValue={dayjs(myDateHtml)} sx={{ width: 1 }} onChange={(e) => {
                                                if (e) {
                                                    onChange(`${e.year()}-${(e.month() + 1).toString().padStart(2, "0")}-${e.date().toString().padStart(2, "0")}`)
                                                }
                                            }} />
                                        </div>
                                    </DemoContainer>
                                </LocalizationProvider>
                            )}
                        />
                        <div className={mystyle.error}>
                            {errors.travelDate?.message}
                        </div>
                    </div>
                    <div className={mystyle.datebox}>
                        <div className={mystyle.endDate}>Travel Time</div>
                        {/* <input type="time" id="endDate" className={mystyle.dateInput} defaultValue={myTimeHtml} {...register('travelTime')} /> */}
                        <Controller control={control}
                            name="travelTime"
                            defaultValue={myTimeHtml}
                            render={({ field: { onChange } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']} sx={{ p: '0.4rem 0', overflow: 'visible', width: 1 }}>
                                        <div className={mystyle.dateInputMui}>
                                            <TimePicker defaultValue={dayjs(date)} sx={{ width: 1 }} onChange={(e) => {
                                                if (e) {
                                                    onChange(`${e.hour().toString().padStart(2, "0")}:${e.minute().toString().padStart(2, "0")}`)
                                                }
                                            }} />
                                        </div>
                                    </DemoContainer>
                                </LocalizationProvider>
                            )}
                        />
                        <div className={mystyle.error}>
                            {errors.travelTime?.message}
                        </div>
                    </div>
                </div>



                <div className={mystyle.locationSelection}>
                    <div className={mystyle.location}>Inital Location</div>
                    {/* <select className={mystyle.locationSelect} {...register('intialLocation')} defaultValue={'Delhi'}>
                        <option value="" disabled>
                            Select your location
                        </option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                    </select> */}
                    <Controller control={control} name='intialLocation'
                        render={({ field: { onChange, value } }) => (
                            <div>
                                {
                                    isLoaded ? <div><Location location={value} setLocation={onChange} /></div> : (<div className={mystyle.loadingLocation}>
                                        {/* <MapPin /> */}
                                        Loading...
                                    </div>)
                                }
                            </div>
                        )} />
                    <div className={mystyle.error}>
                        {errors.intialLocation?.message}
                    </div>
                </div>


                <div className={mystyle.transportSection}>
                    <div className={mystyle.transport}>
                        Primary Transport Method
                    </div>
                    <Controller control={control}
                        name="mode"
                        defaultValue={"Flight"}
                        render={({ field: { onChange, value } }) => (
                            <div>
                                <button type='button' className={mystyle.modeBox} popoverTarget="modeList">
                                    {value}
                                    <div className={mystyle.modeIcon}>
                                        <LuChevronDown />
                                    </div>
                                </button>
                                <div className={mystyle.modeDrop} popover='auto' id="modeList">
                                    <button type='button' className={mystyle.options} onClick={(e) => onChange(e.currentTarget.innerText)} popoverTarget="modeList"><IoMdTrain size={22} /> Train</button>
                                    <button type='button' className={mystyle.options} onClick={(e) => onChange(e.currentTarget.innerText)} popoverTarget="modeList"><Plane /> Flight
                                    </button>
                                    <button type='button' className={mystyle.options} onClick={(e) => onChange(e.currentTarget.innerText)} popoverTarget="modeList"><FaTaxi /> Taxi</button>
                                    <button type='button' className={mystyle.options} onClick={(e) => onChange(e.currentTarget.innerText)} popoverTarget="modeList"><Car />Car</button>
                                    <button type='button' className={mystyle.options} onClick={(e) => onChange(e.currentTarget.innerText)} popoverTarget="modeList"><Motorbike />Bike</button>
                                    <button type='button' className={mystyle.options} onClick={(e) => onChange(e.currentTarget.innerText)} popoverTarget="modeList"><Footprints />Others</button>
                                </div>
                            </div>
                        )} />
                    <div className={mystyle.error}>
                        {errors.mode?.message}
                    </div>
                </div>

                <div className={mystyle.peopleSelection}>
                    <div className={mystyle.people}>Number of People</div>
                    <div>
                        <Controller control={control} name='memberNumber' defaultValue={4}
                            render={({ field: { value, onChange } }) => (
                                <div className={mystyle.memberbox}>
                                    <button type='button' className={mystyle.memberMinus} onClick={() => { onChange(value > 2 ? (value == 32) ? 5 : (value - 1) : value) }}><LuMinus /></button>
                                    <div>
                                        {
                                            value == 32 ? '6+' : value
                                        }
                                    </div>
                                    <button type='button' className={mystyle.memberPlus} onClick={() => {
                                        onChange(value < 5 ? (value + 1) : 32)
                                    }} ><LuPlus /></button>
                                </div>)
                            }
                        />
                    </div>

                    <div className={mystyle.error}>
                        {errors.memberNumber?.message}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupFormStep2