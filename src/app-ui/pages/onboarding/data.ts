interface IOnboardingSections {
    id: number,
    title: string,
    description: string,
}

const data : IOnboardingSections[] = [
    {
        id: 1,
        title: "SweatSmart",
        description: "Get fit the smart, easy way "
    },

    {
        id: 2,
        title: "Introducing our AI-Enhanced Workout Creator",
        description: "Let our AI create customized workouts tailored to your fitness level, goals, and preferences. Say goodbye to generic routines and experience workouts designed just for you."
    },

    {
        id: 3,
        title: "Track your progress with ease",
        description: "Keep tabs on your fitness journey with our workout and history tracking feature. Monitor your performance, see your improvements, and stay motivated."
    },

    {
        id: 4,
        title: "Meet Fitbot",
        description: "Say hello to your virtual fitness coach! Get guidance, motivation, and expert tips to ensure you stay on track with your fitness goals. Your coach is just a click away."
    }
]

export default data;