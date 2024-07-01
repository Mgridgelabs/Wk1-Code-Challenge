const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function studentGradeGenerator() {
  console.log("Welcome! Student");

  rl.question("What was your mark? ", (mark) => {
    mark = Number(mark);

    if (isNaN(mark) || mark < 0 || mark > 100) {
      console.log("Invalid input. Please enter a number between 0 and 100.");
      studentGradeGenerator(); // Restart the function to ask for input again
    } else {
      // Calculate grade based on mark
      if (mark >= 80) {
        console.log("A");
      } else if (mark >= 60) {
        console.log("B");
      } else if (mark >= 50) {
        console.log("C");
      } else if (mark >= 40) {
        console.log("D");
      } else {
        console.log("E");
      }
      rl.close();
    }
  });
}

studentGradeGenerator();
