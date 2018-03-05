module.exports = () => {
  console.log(123);
  return [1, 2, 3, 4].map(item => {
    item++;
  });
};
