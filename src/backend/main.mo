import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";

actor {
  type Exercise = {
    name : Text;
    description : Text;
    duration : Nat;
    category : Text;
  };

  module Exercise {
    public func compare(exercise1 : Exercise, exercise2 : Exercise) : Order.Order {
      Text.compare(exercise1.name, exercise2.name);
    };
  };

  let exercises = List.empty<Exercise>();

  public shared ({ caller }) func addExercise(name : Text, description : Text, duration : Nat, category : Text) : async () {
    let newExercise : Exercise = {
      name;
      description;
      duration;
      category;
    };
    exercises.add(newExercise);
  };

  public shared ({ caller }) func removeExercise(name : Text) : async () {
    let filteredExercises = exercises.filter(func(exercise) { exercise.name != name });
    if (filteredExercises.size() == exercises.size()) {
      Runtime.trap("Exercise not found");
    };
    exercises.clear();
    exercises.addAll(filteredExercises.values());
  };

  public query ({ caller }) func getAllExercises() : async [Exercise] {
    exercises.toArray().sort();
  };
};
