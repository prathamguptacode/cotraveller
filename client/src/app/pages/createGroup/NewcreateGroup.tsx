import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import mystyle from './newCreateGroup.module.css';
import Statusbar from '@/features/newCreateGroup/component/Statusbar';

function NewcreateGroup() {
  const [currentStep, setCurrentStep] = React.useState(0);

  console.log(currentStep);

  function handleNext() {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  return (
    <div>
      <Navbar>
        <Navbar.Title />
        <Navbar.ThemeButton />
      </Navbar>
      <div className={mystyle.container}>
        <Statusbar currentStep={currentStep} />
        <div className={mystyle.wrapper}>
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
                <div className={mystyle.groupName}>Group Name</div>
                <input
                  type="text"
                  placeholder="eg., My first Manali Trip"
                  className={mystyle.groupNameInput}
                />
                <div className={mystyle.groupDescription}>Description</div>
                <textarea
                  className={mystyle.descriptionInput}
                  placeholder="Tell others about your trip - where you are going, what you are planning to do, etc."
                ></textarea>
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
                    />
                  </div>
                  <div className={mystyle.datebox}>
                    <div className={mystyle.endDate}>Travel Time</div>
                    <input
                      type="time"
                      id="endDate"
                      className={mystyle.dateInput}
                    />
                  </div>
                </div>

                <div className={mystyle.transportSection}>
                  <div className={mystyle.transport}>
                    Primary Transport Method
                  </div>
                  <select className={mystyle.transportSelect}>
                    <option value="" disabled selected>
                      Select an option
                    </option>
                    <option value="car">Taxi</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train</option>
                    <option value="flight">Flight</option>
                  </select>
                </div>

                <div className={mystyle.locationSelection}>
                  <div className={mystyle.location}>Inital Location</div>
                  <select className={mystyle.locationSelect}>
                    <option value="" disabled selected>
                      Select your location
                    </option>
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="kolkata">Kolkata</option>
                    <option value="chennai">Chennai</option>
                  </select>
                </div>

                <div className={mystyle.peopleSelection}>
                  <div className={mystyle.people}>Number of People</div>
                  <select className={mystyle.peopleSelect}>
                    <option value="" disabled selected>
                      Select an option
                    </option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6+</option>
                  </select>
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
                    <span className={mystyle.reviewValue}>My Trip Group</span>
                  </div>
                  <div className={mystyle.reviewItem}>
                    <span className={mystyle.reviewLabel}>Description:</span>
                    <span className={mystyle.reviewValue}>A group for my upcoming trip to Delhi.</span>
                  </div>
                  <div className={mystyle.reviewItem}>
                    <span className={mystyle.reviewLabel}>Travel Date:</span>
                    <span className={mystyle.reviewValue}>2024-05-15</span>
                  </div>
                  <div className={mystyle.reviewItem}>
                    <span className={mystyle.reviewLabel}>Travel Time:</span>
                    <span className={mystyle.reviewValue}>10:00 AM</span>
                  </div>
                  <div className={mystyle.reviewItem}>
                    <span className={mystyle.reviewLabel}>Transport Method:</span>
                    <span className={mystyle.reviewValue}>Taxi</span>
                  </div>
                  <div className={mystyle.reviewItem}>
                    <span className={mystyle.reviewLabel}>Initial Location:</span>
                    <span className={mystyle.reviewValue}>Delhi</span>
                  </div>
                  <div className={mystyle.reviewItem}>
                    <span className={mystyle.reviewLabel}>Number of People:</span>
                    <span className={mystyle.reviewValue}>4</span>
                  </div>

                </div>

              </div>

            </div>

          )}

          <div className={mystyle.btnbox}>
            <button className={mystyle.backBtn} onClick={handleBack}>
              Back
            </button>

            <button className={mystyle.nextBtn} onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewcreateGroup;
