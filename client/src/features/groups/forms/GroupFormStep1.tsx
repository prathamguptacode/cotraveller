import mystyle from '../groupForm.module.css';
import { useGroupForm } from '../hooks/useGroupForm';

const GroupFormStep1 = () => {
    const { register, formState: { errors } } = useGroupForm()

    return (
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
    )
}

export default GroupFormStep1
