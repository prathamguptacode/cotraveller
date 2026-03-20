import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import mystyle from './CreateGroup.module.css';
import Statusbar from '@/features/groups/components/Statusbar';
import { useMutation } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { api } from '@/api/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { loaderEvent } from '@/api/mitt';
import { normalizeError } from '@/utils/normalizeError';
import { GroupFormSchema } from '../groups/schemas';
import type { GroupForm } from '../groups/types';
import GroupFormProvider from '../groups/providers/GroupFormProvider';




function CreateGroup() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();


  const form = useForm<GroupForm>({
    resolver: zodResolver(GroupFormSchema),
    mode: 'onChange',
  });

  const { register, handleSubmit, watch, trigger, reset, formState: { errors, isSubmitting },
  } = form

  async function handleNext() {
    if (currentStep === 1) {
      // trigger validation for step 2 fields
      const isValid = await trigger(['travelDate', 'travelTime', 'mode', 'initialLocation', 'memberNumber']);
      if (isValid) return setCurrentStep(prev => prev + 1)

    }
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }

  function startOver() {
    reset();
    setCurrentStep(0);
  }


  const { mutate: createGroup } = useMutation({
    mutationFn: (body: Group) => api.post('/groups', body),
    onSuccess: () => navigate('/groups/success'),
    onError: (error) => {
      const err = normalizeError(error)
      if (err.status >= 500) return
      toast.error(error.message)
    },
    onSettled: () => loaderEvent.emit('stopLoading')
  })


  const onSubmit: SubmitHandler<GroupForm> = async (data) => {
    loaderEvent.emit('startLoading')

    const indTime = `${watch().travelDate}T${watch().travelTime}`;
    const timeIn = new Date(indTime);
    const time = timeIn.toISOString();
    const body = { ...data, travelDate: time }

    createGroup(body)
  };

  return (
    <div>
      <Navbar>
        <Navbar.Title />
        <Navbar.ThemeButton />
      </Navbar>
      {/* ### fix the colors */}
      <GroupFormProvider value={form}>
        <div className={mystyle.container}>
          <Statusbar currentStep={currentStep} />

          <div className={mystyle.wrapper}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 0 && (
                <div className={mystyle.groupForm1}>
                  <div>
                    <div className={mystyle.groupFormTitle}>
                      Create a Travel Group
                    </div>
                    <div className={mystyle.stepIndicator}>
                      Step 1: Tell us about your group
                    </div>
                  </div>

                  <div className={mystyle.groupForm1Content}>
                    <div className={mystyle.groupNameBox}>
                      <div className={mystyle.groupName}>Group Name</div>
                      <input
                        type="text"
                        placeholder="eg., My first Manali Trip"
                        className={mystyle.groupNameInput}
                        {...register('title')}
                      />
                      <div className={mystyle.error}>
                        {errors.title?.message}
                      </div>
                    </div>
                    <div className={mystyle.groupDescriptionBox}>
                      <div className={mystyle.groupDescription}>Description</div>
                      <textarea
                        className={mystyle.descriptionInput}
                        placeholder="Tell others about your trip - where you are going, what you are planning to do, etc."
                        {...register('content')}
                      ></textarea>
                      <div className={mystyle.error}>
                        {errors.content?.message}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
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
                        <input
                          type="date"
                          id="startDate"
                          className={mystyle.dateInput}
                          {...register('travelDate')}
                        />
                        <div className={mystyle.error}>
                          {errors.travelDate?.message}
                        </div>
                      </div>
                      <div className={mystyle.datebox}>
                        <div className={mystyle.endDate}>Travel Time</div>
                        <input
                          type="time"
                          id="endDate"
                          className={mystyle.dateInput}
                          {...register('travelTime')}
                        />
                        <div className={mystyle.error}>
                          {errors.travelTime?.message}
                        </div>
                      </div>
                    </div>

                    <div className={mystyle.transportSection}>
                      <div className={mystyle.transport}>
                        Primary Transport Method
                      </div>
                      <select className={mystyle.transportSelect}  {...register('mode')}>
                        <option value="" disabled>
                          Select an option
                        </option>
                        <option value="car">Taxi</option>
                        <option value="bus">Bus</option>
                        <option value="train">Train</option>
                        <option value="flight">Flight</option>
                      </select>
                      <div className={mystyle.error}>
                        {errors.mode?.message}
                      </div>
                    </div>

                    <div className={mystyle.locationSelection}>
                      <div className={mystyle.location}>Inital Location</div>
                      <select className={mystyle.locationSelect} {...register('initialLocation')}>
                        <option value="" disabled selected>
                          Select your location
                        </option>
                        <option value="delhi">Delhi</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="kolkata">Kolkata</option>
                        <option value="chennai">Chennai</option>
                      </select>
                      <div className={mystyle.error}>
                        {errors.initialLocation?.message}
                      </div>
                    </div>

                    <div className={mystyle.peopleSelection}>
                      <div className={mystyle.people}>Number of People</div>
                      <select className={mystyle.peopleSelect} {...register('memberNumber')}>
                        <option value="" disabled selected>
                          Select an option
                        </option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6+</option>
                      </select>

                      <div className={mystyle.error}>
                        {errors.memberNumber?.message}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
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
                      <div className={mystyle.value}>{watch('travelDate')}</div>
                    </div>

                    <div>
                      <div className={mystyle.label}>Travel Time</div>
                      <div className={mystyle.value}>{watch('travelTime')}</div>
                    </div>

                    <div>
                      <div className={mystyle.label}>Intial Location</div>
                      <div className={mystyle.value}>
                        {watch('initialLocation')}
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
              )}

              <div className={mystyle.btnbox}>

                <button className={mystyle.backBtn} onClick={handleBack} type="button" key={'back'} aria-label="back">
                  Back
                </button>

                {currentStep === 2 ? (
                  <button className={mystyle.nextBtn} key={'submit'} disabled={isSubmitting} aria-label="submit" >
                    Submit
                  </button>
                ) : (
                  <button type="button" aria-label="next" className={clsx(mystyle.nextBtn, currentStep === 0 && (errors.title || errors.content ? mystyle.disabledNextBtn : ''), currentStep === 1 && (errors.travelDate || errors.travelTime || errors.mode || errors.initialLocation || errors.memberNumber ? mystyle.disabledNextBtn : ''))} onClick={handleNext} key={'next'} disabled={currentStep === 0 ? !!errors.title || !!errors.content : !!errors.travelDate || !!errors.travelTime || !!errors.mode || !!errors.initialLocation || !!errors.memberNumber} >
                    Next
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </GroupFormProvider>

    </div>
  );
}

export default CreateGroup;
