function cardTemplate(r){
  return `
    <div class="card">
      <img src="${r.image || '/img/placeholder.jpg'}" alt="${r.name}">
      <h3>${r.name}</h3>
      <p>${r.category} · ${r.price || ''}</p>
      <p>★ ${r.rating || 'N/A'}</p>
      <p>${r.address}</p>
    </div>
  `;
}
