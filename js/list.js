async function initList(){
  const data = await fetchRestaurants();
  const list = document.getElementById('list');
  const stats = document.getElementById('stats');
  const qInput = document.getElementById('q');
  const sortBy = document.getElementById('sortBy');
  const form = document.getElementById('searchForm');

  function renderRows(rows){
    stats.textContent = `${rows.length}곳`;
    list.innerHTML = rows.map(r => cardTemplate(r)).join('');
  }

  let rows = data.filter(r => r.district === "Gangnam");
  renderRows(rows);

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const q = qInput.value.toLowerCase();
    const sort = sortBy.value;
    let filtered = rows.filter(r=> (r.name + r.category + r.address).toLowerCase().includes(q));
    if(sort === 'name') filtered.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
    else filtered.sort((a,b)=>(b.rating||0)-(a.rating||0));
    renderRows(filtered);
  });
}
