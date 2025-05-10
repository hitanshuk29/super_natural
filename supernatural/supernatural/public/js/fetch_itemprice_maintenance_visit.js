frappe.ui.form.on('Maintenance Visit', {
    refresh: function(frm) {
        // Ensure the script runs when the form is loaded
        calculate_total_amount(frm);
    }
});

frappe.ui.form.on('Maintenance Visit Table', {
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (row.item_code) {
            frappe.call({
                method: "frappe.client.get_value",
                args: {
                    doctype: "Item Price",
                    filters: {
                        item_code: row.item_code,
                        selling: 1 // Fetch selling price only
                    },
                    fieldname: "price_list_rate"
                },
                callback: function(r) {
                    if (r.message) {
                        let rate = r.message.price_list_rate || 0;
                        let amount = rate * (row.qty || 0);

                        frappe.model.set_value(cdt, cdn, "rate", rate);
                        frappe.model.set_value(cdt, cdn, "amount", amount);

                        // Recalculate total amount
                        calculate_total_amount(frm);
                    }
                }
            });
        }
    },
    
    qty: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        let rate = row.rate || 0;
        let qty = row.qty || 0;
        let amount = rate * qty;

        frappe.model.set_value(cdt, cdn, "amount", amount);

        // Recalculate total amount
        calculate_total_amount(frm);
    },

    amount: function(frm, cdt, cdn) {
        // Ensure total recalculates whenever an amount changes
        calculate_total_amount(frm);
    },

    custom_replace_item_remove: function(frm, cdt, cdn) {
        // Recalculate total when a row is removed
        calculate_total_amount(frm);
    }
});

// Function to calculate the total amount
function calculate_total_amount(frm) {
    let total = 0;
    $.each(frm.doc.custom_replace_item || [], function(_, row) {
        total += row.amount || 0;
    });

    frm.set_value("custom_total_", total);
    frm.refresh_field("custom_total_");
}
