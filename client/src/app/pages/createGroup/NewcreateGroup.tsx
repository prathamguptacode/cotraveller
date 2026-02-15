import React, { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import mystyle from './newCreateGroup.module.css';
import Statusbar from '@/features/newCreateGroup/component/Statusbar';
import { useQuery } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { is } from 'zod/v4/locales';

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

  const {
    register,
    handleSubmit,
    watch,
    trigger,
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

  // const query = useQuery({
  //   queryKey: ['createGroup'],
  //   queryFn: async () => {},
  // });


  const submit: SubmitHandler<Group> = (data) => {
    console.log('submited yy');
    console.log(data);
  };

  return (
    <div>
      <Navbar>
        <Navbar.Title />
        <Navbar.ThemeButton />
      </Navbar>
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

            {/* written by copilot */}
            {currentStep === 2 && (
              <div className={mystyle.groupForm3}>
                <div>
                  <div className={mystyle.groupFormTitle}>Review</div>
                  <div className={mystyle.stepIndicator}>
                    Step 3: Review your group details
                  </div>
                </div>

                <div className={mystyle.groupForm3Content}>
                  <div className={mystyle.reviewSection}>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>Group Name:</span>
                      <span className={mystyle.reviewValue}>
                        {watch('groupName')}
                      </span>
                    </div>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>Description:</span>
                      <span className={mystyle.reviewValue}>
                        {watch('description')}
                      </span>
                    </div>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>Travel Date:</span>
                      <span className={mystyle.reviewValue}>
                        {watch('travelDate')}
                      </span>
                    </div>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>Travel Time:</span>
                      <span className={mystyle.reviewValue}>
                        {watch('travelTime')}
                      </span>
                    </div>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>
                        Transport Method:
                      </span>
                      <span className={mystyle.reviewValue}>
                        {watch('transportMethod')}
                      </span>
                    </div>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>
                        Initial Location:
                      </span>
                      <span className={mystyle.reviewValue}>
                        {watch('initialLocation')}
                      </span>
                    </div>
                    <div className={mystyle.reviewItem}>
                      <span className={mystyle.reviewLabel}>
                        Number of People:
                      </span>
                      <span className={mystyle.reviewValue}>
                        {watch('numberOfPeople')}
                      </span>
                    </div>
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
                <button className={mystyle.nextBtn} key={'submit'}>
                  SUBMIT
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
