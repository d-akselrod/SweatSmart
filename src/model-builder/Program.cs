using ML_NET_Example;

var input = new Model.ModelInput
{
    Age = 25,
    Weight__lbs_ = 150,
    Feet_ = 5,
    Inches_ = 11,
    Gender = "Male",
    On_average__how_many_days_do_you_workout_per_week_ = 4,
    Fitness_level = "Advanced",
    Bench_Press__How_many_reps_do_you_do_for_the_weight_given_above_ = 8
};

// Make a prediction
var result = Model.Predict(input);

// Output the prediction result
Console.WriteLine($"Predicted Score: {result.Score}");
