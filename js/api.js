async function fetchRestaurants(){
  const res = await fetch('/data/restaurants.json');
  return res.json();
}
