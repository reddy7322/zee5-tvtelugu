document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const searchBar = document.getElementById('search-bar');
    const languageFilter = document.getElementById('language-filter');
    const categoryFilter = document.getElementById('category-filter');
    const modal = document.getElementById('modal');
    const modalIframe = document.getElementById('modal-iframe');
    const span = document.getElementsByClassName('close')[0];

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateFilters(data);
            displayChannels(data);
            searchBar.addEventListener('input', () => filterChannels(data));
            languageFilter.addEventListener('change', () => filterChannels(data));
            categoryFilter.addEventListener('change', () => filterChannels(data));
        })
        .catch(error => console.error('Error fetching data:', error));

    function populateFilters(data) {
        const languages = [...new Set(data.map(item => item.language))];
        const categories = [...new Set(data.map(item => item.category))];

        languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageFilter.appendChild(option);
        });

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function displayChannels(channels) {
        gridContainer.innerHTML = '';
        channels.forEach(channel => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.innerHTML = `
                <img src="${channel.logo}" alt="${channel.channel_name}">
                <div class="channel-name">${channel.channel_name}</div>
            `;
            gridItem.addEventListener('click', () => {
                openModal(channel);
            });
            gridContainer.appendChild(gridItem);
        });
    }

    function filterChannels(channels) {
        const searchQuery = searchBar.value.toLowerCase();
        const selectedLanguage = languageFilter.value;
        const selectedCategory = categoryFilter.value;

        const filteredChannels = channels.filter(channel => {
            return (
                channel.channel_name.toLowerCase().includes(searchQuery) &&
                (selectedLanguage === '' || channel.language === selectedLanguage) &&
                (selectedCategory === '' || channel.category === selectedCategory)
            );
        });

        displayChannels(filteredChannels);
    }

    function openModal(channel) {
        modal.style.display = 'block';
        modalIframe.src = `api/play.php?c=${encodeURIComponent(channel.channel_name)}`;
    }

    span.onclick = function() {
        modal.style.display = 'none';
        modalIframe.src = '';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            modalIframe.src = '';
        }
    }
});
