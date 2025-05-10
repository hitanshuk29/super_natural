frappe.ui.form.on("Sales Order", {
    refresh: function(frm) {
        if (frm.doc.docstatus === 1) {
            frm.add_custom_button(__('Maintenance Schedule'), function() {
                let dialog = new frappe.ui.Dialog({
                    title: 'Enter Maintenance Details',
                    fields: [
                        {
                            label: 'Posting Date',
                            fieldname: 'posting_date',
                            fieldtype: 'Date',
                            reqd: 1
                        },
                        {
                            label: 'Installment Date',
                            fieldname: 'installment_date',
                            fieldtype: 'Date',
                            reqd: 1
                        },
                        {
                            label: 'Maintenance Type',
                            fieldname: 'maintenance_type',
                            fieldtype: 'Select',
                            options: ['Installment', 'Planned Maintenance', 'Unplanned Maintenance'], // Replace with your actual options
                            reqd: 1
                        }
                    ],
                    primary_action_label: 'Create Schedule',
                    primary_action(values) {
                        dialog.hide();
                        frappe.call({
                            method: "erpnext.selling.doctype.sales_order.sales_order.make_maintenance_schedule",
                            args: {
                                source_name: frm.doc.name
                            },
                            callback: function(r) {
                                if (r.message) {
                                    let doc = frappe.model.sync(r.message)[0];
                                    frappe.set_route("Form", "Maintenance Schedule", doc.name);

                                    // Wait a bit for form to load, then set custom values
                                    frappe.after_ajax(() => {
                                        frappe.ui.form.on("Maintenance Schedule", {
                                            onload: function(ms_frm) {
                                                ms_frm.set_value("customer", frm.doc.customer);
                                                ms_frm.set_value("posting_date", values.posting_date);
                                                ms_frm.set_value("installment_date", values.installment_date);
                                                ms_frm.set_value("maintenance_type", values.maintenance_type);
                                            }
                                        });
                                    });
                                } else {
                                    frappe.msgprint("Failed to create Maintenance Schedule.");
                                }
                            }
                        });
                    }
                });
                dialog.show();
            }, __("Create"));
        }
    }
});
