document.addEventListener("DOMContentLoaded", () => {
    const table = document.querySelector(".orders-table");

    if (!table) return;

    const headers = table.querySelectorAll("th");
    const tbody = table.querySelector("tbody");
    let rows = Array.from(tbody.querySelectorAll("tr"));

    // ===== SORT =====
    headers.forEach((header, index) => {
        header.addEventListener("click", () => {

            const isAsc = header.classList.contains("asc");

            rows.sort((a, b) => {
                let aText = a.children[index].innerText.trim();
                let bText = b.children[index].innerText.trim();

                let aNum = parseFloat(aText);
                let bNum = parseFloat(bText);

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return isAsc ? bNum - aNum : aNum - bNum;
                }

                return isAsc
                    ? bText.localeCompare(aText)
                    : aText.localeCompare(bText);
            });

            rows.forEach(r => tbody.appendChild(r));

            headers.forEach(h => h.classList.remove("asc", "desc"));
            header.classList.add(isAsc ? "desc" : "asc");
        });
    });

    // ===== MOBILE LABELS =====
    const labels = Array.from(headers).map(h => h.innerText);

    rows.forEach(row => {
        row.querySelectorAll("td").forEach((td, i) => {
            td.setAttribute("data-label", labels[i]);
        });
    });

    // ===== SEARCH =====
    const search = document.createElement("input");
    search.className = "order-search";
    search.placeholder = "Search orders...";
    search.style = `
        width:100%;
        padding:10px;
        margin:10px 0;
        border:1px solid #ddd;
        border-radius:8px;
    `;

    document.querySelector(".table-wrapper").prepend(search);

    search.addEventListener("input", () => {
        const q = search.value.toLowerCase();

        rows.forEach(row => {
            row.style.display =
                row.innerText.toLowerCase().includes(q) ? "" : "none";
        });
    });
});