
// Task #1
// function func() {
//     const userAge = prompt("Введите ваш возраст");
//     if (+userAge < 18) {
//       alert(`Вы несовершеннолетний!`);
//       func();
//     } else {
//       alert('Круто!');
//     }
//   };
//   func();


// Task #2

// Функции ничего не выводят на экран и не читают глобальные переменные

// function add(a,b) {
//     return a+b;
// }
// add(1,2);

// function  subtract(a,b) {
//     return a-b;
// }
// subtract(1,2);

// function divide(a,b) {
//     return a/b;
// }
// divide(5,1);

// function multiply(a,b) {
//     return a*b;
// }
// multiply(1,4);


// Task #3
// function addCreator(a) {
//     return function(b) {
//         return a+b;
//     }
// }

// const add = addCreator(5);

// console.log(add(5)); // 10

// console.log(addCreator(1)(3)); // 4


// Task#4
// function counterCreater(step=2) {
//     let index = 0;
//     return function () {
//         return index += step;
//     }
// }

// let myCounter1 = counterCreater(-1);
// console.log(myCounter1()); // -1
// console.log(myCounter1()); // -2

// let myCounter2 = counterCreater(4);
// console.log(myCounter2()); // 4
// console.log(myCounter2()); // 8

// let myCounter3 = counterCreater();
// console.log(myCounter3()); // 2
// console.log(myCounter3()); // 4
