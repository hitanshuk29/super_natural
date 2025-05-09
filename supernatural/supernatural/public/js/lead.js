frappe.ui.form.on('Lead', {
    before_save: function(frm) {
        if (frm.doc.lead_name) {
            frm.set_value('custom_name', frm.doc.lead_name);
        }
    },
    custom_referral_number: function(frm) {
        if (frm.doc.custom_referral_number) {
            frm.set_value('custom_referral_', frm.doc.custom_referral_number);
        }
    },
    custom_referred_by_customer: function(frm) {
        if (frm.doc.custom_referred_by_customer) {
            frm.set_value('custom_referred_customer', frm.doc.custom_referred_by_customer);
        }
    },
    mobile_no: function(frm) {
        if (frm.doc.mobile_no) {
            frm.set_value('custom_mobileno', frm.doc.mobile_no);
        }
    },
    refresh: function(frm) {
        update_final_result(frm);
    },
    custom_lead_result_on_update: function(frm) {
        update_final_result(frm);
    }
});

function update_final_result(frm) {
    if (frm.doc.custom_lead_result && frm.doc.custom_lead_result.length > 0) {
        let last_result = frm.doc.custom_lead_result[frm.doc.custom_lead_result.length - 1].result;
        frm.set_value('custom_final_lead_result', last_result);
    } else {
        frm.set_value('custom_final_lead_result', '');
    }
}
console.log("✅ Lead JS loaded");
