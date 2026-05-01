import { useState } from 'react';
import mystyle from '../groupForm.module.css';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { groupForm1Schema, groupForm2Schema, groupFormSchema } from '../schemas';
import Statusbar from './Statusbar';
import GroupFormProvider from '../providers/GroupFormProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import type { GroupFormSchema } from '../types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import GroupFormStep1 from './GroupFormStep1';
import GroupFormStep2 from './GroupFormStep2';
import GroupFormReview from './GroupFormReview';
import {z} from 'zod';

type GroupFormProps = {
    onSubmit: SubmitHandler<GroupFormSchema>,
    isPending: boolean,
    group?: GroupFormSchema
}

const GroupForm = ({ onSubmit, isPending, group }: GroupFormProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    
    type SchemaInput = z.input<typeof groupFormSchema>
    const form = useForm<SchemaInput, unknown, GroupFormSchema>({
        resolver: zodResolver(groupFormSchema), mode: 'onChange', defaultValues: group,
    });
    const { handleSubmit, formState: { errors }, trigger, clearErrors, reset } = form


    async function handleNext() {
        if (currentStep == 0) {
            const formFields = groupForm1Schema.keyof().options
            const isValid = await trigger(formFields)
            if (isValid) return setCurrentStep(prev => prev + 1)
        }
        else if (currentStep == 1) {
            const formFields = groupForm2Schema.keyof().options
            const isValid = await trigger(formFields);
            if (isValid) return setCurrentStep(prev => prev + 1)
        }
    }

    function handleBack(backToStep?: number) {
        clearErrors()
        if (currentStep > 0) setCurrentStep((prev) => backToStep != undefined ? backToStep : prev - 1);
    }

    function startOver() {
        reset();
        setCurrentStep(0);
    }



    return (
        <GroupFormProvider value={form}>
            <div className={mystyle.container}>

                <Statusbar currentStep={currentStep} handleBack={handleBack} handleNext={handleNext} />

                <div className={mystyle.wrapper}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {currentStep == 0 && <GroupFormStep1 />}
                        {currentStep == 1 && <GroupFormStep2 />}
                        {currentStep == 2 && <GroupFormReview startOver={startOver} />}

                        <div className={mystyle.btnbox}>
                            <button className={clsx(mystyle.backBtn)} onClick={() => {
                                if (currentStep == 0) return navigate(-1)
                                handleBack()
                            }} type="button" key={'back'} aria-label="back">
                                Back
                            </button>

                            {currentStep === 2 ?
                                (
                                    <button className={mystyle.nextBtn} key={'submit'} disabled={isPending} aria-label="submit" >
                                        Submit
                                    </button>
                                ) :
                                (
                                    <button type="button" aria-label="next" className={clsx(mystyle.nextBtn, Object.keys(errors).length > 0 && mystyle.disabledNextBtn)} onClick={handleNext} key={'next'} disabled={Object.keys(errors).length > 0} >
                                        Next
                                    </button>
                                )}
                        </div>
                    </form>
                </div>
            </div>
        </GroupFormProvider>
    )
}

export default GroupForm


