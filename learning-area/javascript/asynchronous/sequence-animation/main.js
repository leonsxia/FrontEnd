const aliceTumbling = [
  { transform: 'rotate(0) scale(1)' },
  { transform: 'rotate(360deg) scale(0)' }
];

const aliceTiming = {
  duration: 2000,
  iterations: 1,
  fill: 'forwards'
}

const alice1 = document.querySelector("#alice1");
const alice2 = document.querySelector("#alice2");
const alice3 = document.querySelector("#alice3");

// Promise.then().catch()
// alice1.animate(aliceTumbling, aliceTiming).finished
// .then(() => { return alice2.animate(aliceTumbling, aliceTiming).finished})
// .then(() => { return alice3.animate(aliceTumbling, aliceTiming).finished})
// .catch(error => console.error(`Error animating Alices: ${error}`));

// callback
const alice1Promise = alice1.animate(aliceTumbling, aliceTiming).finished;
alice1Promise.then(() => {
  const alice2Promise = alice2.animate(aliceTumbling, aliceTiming).finished;
  return alice2Promise.then(() => {
    return alice3.animate(aliceTumbling, aliceTiming).finished; // () => alice3.animate(aliceTumbling, aliceTiming).finished
  });
}).catch(error => console.error(`Error animating Alices: ${error}`));

// async ... await
// async function animateAlice() {
//   try {
//     await alice1.animate(aliceTumbling, aliceTiming).finished;
//     await alice2.animate(aliceTumbling, aliceTiming).finished;
//     await alice3.animate(aliceTumbling, aliceTiming).finished;
//   }
//   catch (error) {
//     console.error(`Error animating Alices: ${error}`)
//   }
// }

// animateAlice();
