frappe.ui.form.on('Maintenance Schedule Item', {
    start_date: function(frm, cdt, cdn) {
        calculate_no_of_visits(frm, cdt, cdn);
    },
    end_date: function(frm, cdt, cdn) {
        calculate_no_of_visits(frm, cdt, cdn);
    },
    periodicity: function(frm, cdt, cdn) {
        calculate_no_of_visits(frm, cdt, cdn);
    }
});

function calculate_no_of_visits(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    if (!row.start_date || !row.end_date || !row.periodicity) {
        return;
    }

    let start_date = frappe.datetime.str_to_obj(row.start_date);
    let end_date = frappe.datetime.str_to_obj(row.end_date);
    let days_between = frappe.datetime.get_diff(end_date, start_date);

    let visit_frequency = {
        "Weekly": 7,
        "Monthly": 30,
        "Quarterly": 90,
        "Half Yearly": 180,
        "Yearly": 365
    };

    if (row.periodicity in visit_frequency) {
        row.no_of_visits = Math.floor(days_between / visit_frequency[row.periodicity]);
    } else {
        row.no_of_visits = 0; // For "Random", the user must enter manually
    }

    frm.refresh_field("items"); // Refresh the child table
}




frappe.ui.form.on('Maintenance Schedule', {
    refresh: function(frm) {
        update_next_scheduled_dates(frm);
    },
    validate: function(frm) {
        update_next_scheduled_dates(frm);
    }
});

function update_next_scheduled_dates(frm) {
    let schedules = frm.doc.schedules || [];
    console.log("Hello")

    for (let i = 0; i < schedules.length - 1; i++) {
        let current_row = schedules[i];
        let next_row = schedules[i + 1];

        if (current_row.actual_date && !next_row.actual_date) {  
            let old_scheduled_date = frappe.datetime.str_to_obj(current_row.scheduled_date);
            let new_actual_date = frappe.datetime.str_to_obj(current_row.actual_date);
            
            let delay_days = frappe.datetime.get_diff(new_actual_date, old_scheduled_date);
            
            if (delay_days > 0) {
                for (let j = i + 1; j < schedules.length; j++) {
                    schedules[j].scheduled_date = frappe.datetime.add_days(schedules[j].scheduled_date, delay_days);
                }
            }
            break; // Only adjust once per new actual_date
        }
    }

    frm.refresh_field("schedules");
}
