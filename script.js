$(document).ready(function () {
  $.fn.dataTable.moment('DD-MM-YYYY');

  $.getJSON("data.json", function (data) {
    let processedData = data.map((item, index) => {
      if (!item.id) {
        item.id = index;
      }
      const dobParts = item.dob.split('-');
      const dobDate = new Date(dobParts[2], dobParts[1] - 1, dobParts[0]);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      item.age = age;
      item.phoneLink = '<a href="tel:' + item.phone + '">' + item.phone + '</a>';
      item.whatsappLink = '<a href="https://wa.me/' + item.whatsapp + '" target="_blank">' + item.whatsapp + '</a>';
      item.emailLink = '<a href="mailto:' + item.email + '">' + item.email + '</a>';
      return item;
    });

    const savedOrder = localStorage.getItem('tkmHbstOrder');
    if (savedOrder) {
      const orderedIds = JSON.parse(savedOrder);
      const dataMap = new Map(processedData.map(item => [item.id, item]));
      processedData = orderedIds.map(id => dataMap.get(id)).filter(item => item !== undefined);
    }

    // Function to update member counts on the page
    function updateMemberCounts(currentData) {
      let count0to21 = 0;
      let count0to25 = 0;
      currentData.forEach(item => {
        if (item.age >= 0 && item.age <= 21) count0to21++;
        if (item.age >= 0 && item.age <= 25) count0to25++;
      });
      $("#member-counts").html(
        "<p>Total Members (0-21 years): <strong>" + count0to21 + "</strong></p>" +
        "<p>Total Members (0-25 years): <strong>" + count0to25 + "</strong></p>"
      );
    }

    // Initial count display
    updateMemberCounts(processedData);

    var table = $("#directory").DataTable({
      data: processedData,
      columns: [
        { data: "Date", type: "date-eu" }, { data: "name" }, { data: "gotra" },
        { data: "phoneLink" }, { data: "whatsappLink" }, { data: "native" },
        { data: "dob", type: "date-eu" }, { data: "emailLink" }, { data: "blood" },
        { data: "qualification" },
        { data: null, render: (data, type, row) => `${row.father_fname} ${row.father_lname}` },
        { data: null, render: (data, type, row) => `${row.mother_fname} ${row.mother_lname}` },
        { data: "h_address" }, { data: "city" }, { data: "state" }, { data: "pincode" },
        { data: "kishoremandal" },
        {
          data: null,
          orderable: false,
          searchable: false,
          responsivePriority: 1, // Keeps button visible on smaller screens
          render: (data, type, row) => `<button class="btn-delete" title="Delete ${row.name}">Delete</button>`
        }
      ],
      rowReorder: { dataSrc: 'id' },
      responsive: true,
      createdRow: function (row, data, dataIndex) {
        if (data.age >= 25) $(row).addClass('age-25-plus');
        else if (data.age >= 21) $(row).addClass('age-21-plus');
      }
    });

    table.on('row-reorder', function (e, diff, edit) {
      const newOrderIds = table.rows().data().map(item => item.id).toArray();
      localStorage.setItem('tkmHbstOrder', JSON.stringify(newOrderIds));
    });

    // --- DELETION LOGIC ---
    let rowToDelete = null;
    const modal = $('#deleteModal');

    // Show modal on delete button click
    $('#directory tbody').on('click', '.btn-delete', function () {
      rowToDelete = table.row($(this).parents('tr'));
      modal.show();
    });

    // Handle the final confirmation
    $('#confirmDelete').on('click', function () {
      if (rowToDelete) {
        const memberId = rowToDelete.data().id;
        
        // 1. Remove from the data source array
        processedData = processedData.filter(item => item.id !== memberId);
        
        // 2. Remove from DataTable
        rowToDelete.remove().draw();
        
        // 3. Update localStorage order
        const currentOrder = JSON.parse(localStorage.getItem('tkmHbstOrder') || '[]');
        const newOrder = currentOrder.filter(id => id !== memberId);
        localStorage.setItem('tkmHbstOrder', JSON.stringify(newOrder));
        
        // 4. Recalculate and update counts
        updateMemberCounts(processedData);
        
        // 5. Hide modal and reset
        modal.hide();
        rowToDelete = null;
      }
    });

    // Handle cancellation
    $('#cancelDelete, .close-button').on('click', function () {
      modal.hide();
      rowToDelete = null;
    });

    // Hide modal if user clicks outside of it
    $(window).on('click', function (event) {
      if ($(event.target).is(modal)) {
        modal.hide();
        rowToDelete = null;
      }
    });
  });
});