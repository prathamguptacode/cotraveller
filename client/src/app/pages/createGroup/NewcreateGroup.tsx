import React, { useRef, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import mystyle from './newCreateGroup.module.css';
import Statusbar from '@/features/newCreateGroup/component/Statusbar';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { api } from '@/api/axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar';

const groupSchema = z.object({
  groupName: z.string().min(5, 'minimum 5 characters required*'),
  description: z.string().min(8, 'minimum 8 characters are required*'),
  travelDate: z.string().min(1, 'Travel date is required'),
  travelTime: z.string().min(1, 'Travel time is required'),
  transportMethod: z.string().min(1, 'Transport is required'),
  initialLocation: z.string().min(1, 'Initial location is required'),
  numberOfPeople: z.string().min(1, 'Number of people is required'),
});

type Group = z.infer<typeof groupSchema>;

function NewcreateGroup() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const loadingBarRef = useRef<LoadingBarRef>(null);

  // arialbtn

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Group>({
    resolver: zodResolver(groupSchema),
    mode: 'onChange',
  });

  async function handleNext() {
    if (currentStep === 1) {
      // trigger validation for step 2 fields
      const isValid = await trigger([
        'travelDate',
        'travelTime',
        'transportMethod',
        'initialLocation',
        'numberOfPeople',
      ]);
      isValid ? setCurrentStep((prev) => prev + 1) : null;
      return;
    }
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  function startOver() {
    reset();
    setCurrentStep(0);
  }

  const { refetch } = useQuery({
    queryKey: ['create_group'],
    queryFn: async () => {
      const indTime = `${watch().travelDate}T${watch().travelTime}`;
      const timeIn = new Date(indTime);
      const time = timeIn.toISOString();
      const body = {
        title: watch().groupName,
        content: watch().description,
        mode: watch().transportMethod,
        intialLocation: watch().initialLocation,
        memberNumber: watch().numberOfPeople,
        travelDate: time,
      };
      try {
        const res = await api.post('/groups/addgroup', body);
        if (res.status == 201) {
          return navigate('/groups/success', { state: { click: true } });
        } else {
          return toast.error('Something went wrong');
        }
      } catch {
        return toast.error('Something went wrong');
      }
    },
    enabled: false,
  });

  const submit: SubmitHandler<Group> = async () => {
    loadingBarRef.current?.continuousStart();
    await refetch();
  };

  return (
    <div>
      <Navbar>
        <Navbar.Title />
        <Navbar.ThemeButton />
      </Navbar>
      <LoadingBar color="#8AB4F8" shadow={true} ref={loadingBarRef} />
      <div className={mystyle.container}>
        <Statusbar currentStep={currentStep} />

        <div className={mystyle.wrapper}>
          <form onSubmit={handleSubmit(submit)}>
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
                      {...register('groupName')}
                    />
                    <div className={mystyle.error}>
                      {errors.groupName?.message}
                    </div>
                  </div>
                  <div className={mystyle.groupDescriptionBox}>
                    <div className={mystyle.groupDescription}>Description</div>
                    <textarea
                      className={mystyle.descriptionInput}
                      placeholder="Tell others about your trip - where you are going, what you are planning to do, etc."
                      {...register('description')}
                    ></textarea>
                    <div className={mystyle.error}>
                      {errors.description?.message}
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
                    <select
                      className={mystyle.transportSelect}
                      {...register('transportMethod')}
                    >
                      <option value="" disabled selected>
                        Select an option
                      </option>
                      <option value="car">Taxi</option>
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="flight">Flight</option>
                    </select>
                    <div className={mystyle.error}>
                      {errors.transportMethod?.message}
                    </div>
                  </div>

                  <div className={mystyle.locationSelection}>
                    <div className={mystyle.location}>Inital Location</div>
                    <select
                      className={mystyle.locationSelect}
                      {...register('initialLocation')}
                    >
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
                    <select
                      className={mystyle.peopleSelect}
                      {...register('numberOfPeople')}
                    >
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
                      {errors.numberOfPeople?.message}
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
                    <div className={mystyle.value}>{watch('groupName')}</div>
                  </div>
                </div>

                <div className={mystyle.divider} />

                <div>
                  <div className={mystyle.label}>Description</div>
                  <div className={mystyle.value}>{watch('description')}</div>
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
                      {watch('transportMethod')}
                    </div>
                  </div>
                </div>

                <div className={mystyle.divider} />

                <div className={mystyle.rowBetween}>
                  <div>
                    <div className={mystyle.label}>Max Group Size</div>
                    <div className={mystyle.value}>
                      {watch('numberOfPeople')}
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
                    >
                      Start over.
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className={mystyle.btnbox}>
              <button
                className={mystyle.backBtn}
                onClick={handleBack}
                type="button"
                key={'back'}
              >
                Back
              </button>

              {currentStep === 2 ? (
                <button className={mystyle.nextBtn} key={'submit'} disabled={isSubmitting}>
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  className={clsx(
                    mystyle.nextBtn,
                    currentStep === 0 &&
                      (errors.groupName || errors.description
                        ? mystyle.disabledNextBtn
                        : ''),
                    currentStep === 1 &&
                      (errors.travelDate ||
                      errors.travelTime ||
                      errors.transportMethod ||
                      errors.initialLocation ||
                      errors.numberOfPeople
                        ? mystyle.disabledNextBtn
                        : ''),
                  )}
                  onClick={handleNext}
                  key={'next'}
                  disabled={
                    currentStep === 0
                      ? !!errors.groupName || !!errors.description
                      : !!errors.travelDate ||
                        !!errors.travelTime ||
                        !!errors.transportMethod ||
                        !!errors.initialLocation ||
                        !!errors.numberOfPeople
                  }
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewcreateGroup;
