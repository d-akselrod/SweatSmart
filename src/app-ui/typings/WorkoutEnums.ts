export enum MuscleGroup {
  Chest = 'Chest',
  Back = 'Back',
  Biceps = 'Biceps',
  Triceps = 'Triceps',
  Shoulders = 'Shoulders',
  Legs = 'Legs',
  Core = 'Core',
}

const selectionItems = {
  fitnessExperience: [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ],
  fitnessGoal: [
    { label: 'Strength', value: 'Strength' },
    { label: 'Endourance', value: 'Endourance' },
    { label: 'General Health', value: 'General Health' },
  ],
  workoutFrequency: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
  ],
  equipmentAvailable: [
    { label: 'None', value: 'None' },
    { label: 'Dumbells', value: 'Dumbells' },
    { label: 'Full', value: 'Full' },
  ],
};

export enum FitnessExperience {
  Beginner,
  Intermediate,
  Advanced,
}

export enum FitnessGoal {
  Strength = 'Strength',
  Endourance = 'Endourance',
  GeneralHealth = 'General Health',
}

export enum WorkoutFrequency {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
}

export enum EquipmentAvailable {
  None,
  Dumbells,
  Full,
}
