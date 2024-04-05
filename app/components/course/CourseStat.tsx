import React from 'react';
import CourseStatItem from "@/app/components/course/CourseStatItem";

interface CourseStatProps {
    studentsCount: number;
    studentsCompleteCount: number;
    totalPoints: number;
    highestPointsScored: number;
    lowestPointsScored: number;
    averagePointsScored: number;
}
const CourseStat = ({
                        studentsCount,
                        studentsCompleteCount,
                        totalPoints,
                        highestPointsScored,
                        lowestPointsScored,
                        averagePointsScored
}:CourseStatProps) => {
    const percentageCompleted = Math.round((studentsCompleteCount/studentsCount)*100)
    const percentageHighestScore = Math.round((highestPointsScored/totalPoints)*100)
    const percentageLowestScore = Math.round((lowestPointsScored/totalPoints)*100)
    const percentageAverageScore = Math.round((averagePointsScored/totalPoints)*100)

    console.log(totalPoints,highestPointsScored)

    return (
        <div className={'flex flex-wrap gap-4'}>
            <CourseStatItem number={studentsCount} subtitle={'учасників на курсі'}/>
            <CourseStatItem number={studentsCompleteCount} subtitle={'учасників завершило курс'}/>
            <CourseStatItem number={`${percentageCompleted}%`} subtitle={'учасників завершило курс'}/>
            <CourseStatItem number={`${percentageHighestScore}%`} subtitle={'найкращий показник набраних балів курс'}/>
            <CourseStatItem number={`${percentageLowestScore}%`} subtitle={'найгірший показник набраних балів курс'}/>
            <CourseStatItem number={`${percentageAverageScore}%`} subtitle={'середній показник набраних балів курс'}/>
        </div>
    );
};

export default CourseStat;