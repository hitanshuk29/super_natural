frappe.ui.form.on('Sales Invoice', {
    refresh: function (frm) {
        // Check if a Journal Entry with this doc name already exists in user_remark
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Journal Entry',
                filters: {
                    user_remark: frm.doc.name
                },
                fields: ['name']
            },
            callback: function (response) {
                if (response.message && response.message.length > 0) {
                    return; // If a Journal Entry exists, do not add the button
                }

                // Show the button only if the sales_team table has data
                if (frm.doc.sales_team && frm.doc.sales_team.length > 0) {
                    frm.add_custom_button(__('Make Commission'), function () {
                        // Loop through the sales_team table
                        frm.doc.sales_team.forEach(row => {
                            if (!row.sales_person || !row.incentives) {
                                frappe.msgprint(__('Missing Sales Person or Incentives for one of the rows.'));
                                return;
                            }

                            // Fetch custom_sales_person_commission_ac from Sales Person
                            frappe.db.get_value('Sales Person', row.sales_person, 'custom_sales_person_commission_ac', (data) => {
                                if (!data || !data.custom_sales_person_commission_ac) {
                                    frappe.msgprint(__('Commission account not set for Sales Person: ' + row.sales_person));
                                    return;
                                }

                                // Create and submit a Journal Entry
                                frappe.call({
                                    method: 'frappe.client.insert',
                                    args: {
                                        doc: {
                                            doctype: 'Journal Entry',
                                            posting_date: frappe.datetime.now_date(),
                                            user_remark: frm.doc.name,
                                            accounts: [
                                                {
                                                    account: 'Commission On Sales - SNK',
                                                    debit_in_account_currency: row.incentives
                                                },
                                                {
                                                    account: data.custom_sales_person_commission_ac,
                                                    credit_in_account_currency: row.incentives
                                                }
                                            ]
                                        }
                                    },
                                    callback: function (r) {
                                        if (r.message) {
                                            const jv_doc = r.message;

                                            // Submit the Journal Entry
                                            frappe.call({
                                                method: 'frappe.client.submit',
                                                args: {
                                                    doc: jv_doc
                                                },
                                                callback: function (submit_res) {
                                                    if (submit_res.message) {
                                                        frappe.msgprint(__('Journal Entry submitted successfully: ' + submit_res.message.name));
                                                        frm.reload_doc(); // Reload the form to hide the button
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        });
                    });
                }
            }
        });
    }
});
