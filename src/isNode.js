// eslint-disable-next-line import/no-mutable-exports
let wIsNode = true;
try {
  wIsNode = window === undefined;
} catch (e) {
  console.log('trouble getting window');
}

export default wIsNode;
