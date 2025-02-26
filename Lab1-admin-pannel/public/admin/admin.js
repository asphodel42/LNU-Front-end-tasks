// Function to create a user card
function createUserCard(user) {
  const userCard = document.createElement('div');
  userCard.classList.add('user-card');
  userCard.dataset.userId = user.id;

  userCard.innerHTML = `
    <div class="user-info">
      <div class="user-info-image">
        <img src="${user.photo}" alt="">
      </div>
      <div class="user-info-data">
        <div class="user-name"><p>${user.name} ${user.surname}</p></div>
        <div class="user-email"><p>Email: ${user.email}</p></div>
        <div class="user-phone"><p>Phone: ${user.phone}</p></div>
        <div class="user-dob"><p>Birthday: ${user.dob}</p></div>
        <div class="user-gener"><p>Gender: ${user.gender}</p></div>
        <div class="user-country"><p>Country: ${user.country}</p></div>
        <div class="user-agree"><p>Agreement: ${user.agreement ? 'Yes' : 'No'}</p></div>
      </div>
    </div>
    <div class="card-btns">
      <div class="card-btn btn-edit"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.7619 0.137932C17.2237 0.137932 16.6872 0.348759 16.2773 0.758609L15.9263 1.10943L18.8956 4.07788C18.8939 4.07957 19.2465 3.72706 19.2465 3.72706C20.0681 2.90568 20.0664 1.57831 19.2465 0.758609C18.8349 0.348759 18.3001 0.137932 17.7619 0.137932ZM15.265 1.87853C15.1672 1.89202 15.0761 1.94093 15.0086 2.01345L0.999159 16.0327C0.943485 16.0833 0.901309 16.149 0.877689 16.2216L0.01391 19.4599C-0.0248927 19.6083 0.0189714 19.7651 0.126944 19.8731C0.234916 19.981 0.391814 20.0249 0.540276 19.9861L3.77945 19.1225C3.85199 19.0989 3.91779 19.0568 3.9684 19.0011L17.9913 4.9954C18.1634 4.82843 18.1651 4.55351 17.9981 4.38147C17.831 4.20944 17.5561 4.20775 17.384 4.37472L3.44203 18.313L1.68748 16.5589L15.6294 2.62064C15.7593 2.49583 15.7981 2.30187 15.7256 2.13658C15.653 1.97129 15.486 1.86841 15.3055 1.87853C15.292 1.87853 15.2785 1.87853 15.265 1.87853Z" fill="currentColor"/></div>
      <div class="card-btn btn-del"><svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.16981 0C6.8566 0 6.60377 0.255238 6.60377 0.571429C6.60377 0.887619 6.8566 1.14286 7.16981 1.14286H12.8302C13.1434 1.14286 13.3962 0.887619 13.3962 0.571429C13.3962 0.255238 13.1434 0 12.8302 0H7.16981ZM2.45283 2.66667C1.1 2.66667 0 3.77714 0 5.14286C0 6.50857 1.1 7.61905 2.45283 7.61905H16.9811V19.619C16.9811 21.4038 15.5415 22.8571 13.7736 22.8571H6.22642C4.45849 22.8571 3.01887 21.4038 3.01887 19.619V9.71429C3.01887 9.3981 2.76604 9.14286 2.45283 9.14286C2.13962 9.14286 1.88679 9.3981 1.88679 9.71429V19.619C1.88679 22.0343 3.83396 24 6.22642 24H13.7736C16.166 24 18.1132 22.0343 18.1132 19.619V7.5506C19.1925 7.29155 20 6.31238 20 5.14286C20 3.77714 18.9 2.66667 17.5472 2.66667H2.45283ZM2.45283 3.80952H17.5472C18.2755 3.80952 18.8679 4.40762 18.8679 5.14286C18.8679 5.8781 18.2755 6.47619 17.5472 6.47619H2.45283C1.72453 6.47619 1.13208 5.8781 1.13208 5.14286C1.13208 4.40762 1.72453 3.80952 2.45283 3.80952ZM7.35849 10.2857C7.04528 10.2857 6.79245 10.541 6.79245 10.8571V19.619C6.79245 19.9352 7.04528 20.1905 7.35849 20.1905C7.6717 20.1905 7.92453 19.9352 7.92453 19.619V10.8571C7.92453 10.541 7.6717 10.2857 7.35849 10.2857ZM12.6415 10.2857C12.3283 10.2857 12.0755 10.541 12.0755 10.8571V19.619C12.0755 19.9352 12.3283 20.1905 12.6415 20.1905C12.9547 20.1905 13.2075 19.9352 13.2075 19.619V10.8571C13.2075 10.541 12.9547 10.2857 12.6415 10.2857Z" fill="currentColor"/></svg></div>
    </div>
    <div class="card-btn btn-more"><svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10.975L18.225 12.75L10 4.525L1.775 12.75L2.11667e-08 10.975L10 0.975L20 10.975Z" fill="currentColor"/></svg></div>
  `;

  return userCard;
}

// Function to set up event listeners for buttons
function moreInfoBtn(container) {
  const cardMoreBtns = container.querySelectorAll('.btn-more');
  cardMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      btn.parentElement.classList.toggle('active');
    });
  });
}

function deleteUserBtn(container) {
  const cardDelBtns = container.querySelectorAll('.btn-del');
  cardDelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.user-card');
      const userId = card.dataset.userId;
      if (confirm('Are you sure you want to delete this user?')) {
        // Send a request to the server to delete the user
        fetch(`/delete-user/${userId}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (!response.ok) {throw new Error('Failed to delete user');}
            else{
              card.remove();
              return response.json();
            }
          })
          .then(data => {console.log('User deleted successfully:', data);})
          .catch(error => {console.error('Error deleting user:', error);});
      }
    });
  });
}

// Fetch data and render user cards
fetch('/src/data/clients.json')
  .then(response => response.json())
  .then(users => {
    const container = document.querySelector('.users-container');

    users.forEach(user => {
      const userCard = createUserCard(user);
      container.appendChild(userCard);
    });

    moreInfoBtn(container);
    deleteUserBtn(container);
  })
  .catch(error => console.error('Error loading JSON:', error));