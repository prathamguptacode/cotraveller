import mystyle from '../groupForm.module.css'
import { useGroupForm } from '../hooks/useGroupForm'

const GroupFormStep2 = () => {

    const { register, formState: { errors } } = useGroupForm()

    const date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
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
                        <input type="date" id="startDate" className={mystyle.dateInput} defaultValue={myDateHtml} {...register('travelDate')} />
                        <div className={mystyle.error}>
                            {errors.travelDate?.message}
                        </div>
                    </div>
                    <div className={mystyle.datebox}>
                        <div className={mystyle.endDate}>Travel Time</div>
                        <input type="time" id="endDate" className={mystyle.dateInput} defaultValue={myTimeHtml} {...register('travelTime')} />
                        <div className={mystyle.error}>
                            {errors.travelTime?.message}
                        </div>
                    </div>
                </div>

                <div className={mystyle.transportSection}>
                    <div className={mystyle.transport}>
                        Primary Transport Method
                    </div>
                    <select className={mystyle.transportSelect} {...register('mode')} defaultValue={'Taxi'}>
                        <option value="" disabled>
                            Select an option
                        </option>
                        <option value="Flight">Flight</option>
                        <option value="Train">Train</option>
                        <option value="Taxi">Taxi</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Bus">Bus</option>
                        <option value="Others">Others</option>
                    </select>
                    <div className={mystyle.error}>
                        {errors.mode?.message}
                    </div>
                </div>

                <div className={mystyle.locationSelection}>
                    <div className={mystyle.location}>Inital Location</div>
                    <select className={mystyle.locationSelect} {...register('intialLocation')} defaultValue={'Delhi'}>
                        <option value="" disabled>
                            Select your location
                        </option>
                        <option value="Delhi">Delhi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Kolkata">Kolkata</option>
                        <option value="Chennai">Chennai</option>
                    </select>
                    <div className={mystyle.error}>
                        {errors.intialLocation?.message}
                    </div>
                </div>

                <div className={mystyle.peopleSelection}>
                    <div className={mystyle.people}>Number of People</div>
                    <select className={mystyle.peopleSelect} {...register('memberNumber')} defaultValue={2}>
                        <option value="" disabled>
                            Select an option
                        </option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={32}>6+</option>
                    </select>

                    <div className={mystyle.error}>
                        {errors.memberNumber?.message}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupFormStep2