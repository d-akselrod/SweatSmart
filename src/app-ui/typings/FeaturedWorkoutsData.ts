import { IFeaturedWorkout } from './types'
export const featuredWorkouts : IFeaturedWorkout[] = [
    {
        name: "Body Building",
        duration: 30,
        numOfExercies: 5,
        image: require('../assets/images/fullbody.jpg')
    },
    {
        name: "Cardio",
        duration: 60,
        numOfExercies: 8,
        image: require('../assets/images/cardio.jpg')
    }
    
]